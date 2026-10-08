import { env } from "@/lib/env";
import { clientIp } from "@/lib/contact/client-ip";
import { buildInquiryEmail } from "@/lib/contact/message";
import {
  CONTACT_RATE_LIMIT,
  createMemoryRateLimiter,
} from "@/lib/contact/rate-limit";
import { sendEmail } from "@/lib/contact/resend";
import { verifyTurnstile } from "@/lib/contact/turnstile";
import { MAX_BODY_BYTES, parseSubmission } from "@/lib/contact/validate";

// Public endpoint that sends email. Delivery goes through Resend over fetch,
// abuse protection is Turnstile + honeypot + validation + a rate limit.
// Nothing is stored; logs carry an outcome and a coarse code only.
export const dynamic = "force-dynamic";

// Best effort only. A Worker isolate's memory is not a shared counter; the
// authoritative limit is the Cloudflare rule set up in TASK-129.
const limiter = createMemoryRateLimiter(CONTACT_RATE_LIMIT);

function respond(status: number, body: Record<string, unknown>, headers?: HeadersInit) {
  return Response.json(body, { status, headers });
}

function log(outcome: string, code?: string) {
  console.info(`contact outcome=${outcome}${code ? ` code=${code}` : ""}`);
}

function hostnameOf(request: Request): string {
  const host = request.headers.get("host");
  if (host) return host.replace(/:\d+$/, "");
  return new URL(request.url).hostname;
}

export async function POST(request: Request): Promise<Response> {
  const ip = clientIp(request.headers);

  const rate = limiter.check(ip);
  if (!rate.allowed) {
    log("rate-limited");
    return respond(429, { ok: false }, { "Retry-After": String(rate.retryAfterSeconds) });
  }

  const configured =
    env.RESEND_API_KEY &&
    env.RESEND_FROM_EMAIL &&
    env.CONTACT_TO_EMAIL &&
    env.TURNSTILE_SECRET_KEY;
  if (!configured) {
    log("not-configured");
    return respond(503, { ok: false });
  }

  if (!(request.headers.get("content-type") ?? "").includes("application/json")) {
    log("rejected", "content-type");
    return respond(415, { ok: false });
  }
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) {
    log("rejected", "too-large");
    return respond(413, { ok: false });
  }
  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    log("rejected", "too-large");
    return respond(413, { ok: false });
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    log("rejected", "bad-json");
    return respond(400, { ok: false });
  }
  const submission = parseSubmission(json);
  if (!submission) {
    log("rejected", "bad-shape");
    return respond(400, { ok: false });
  }

  // A bot gets the same answer as a visitor and nothing is sent.
  if (submission.honeypotFilled) {
    log("honeypot");
    return respond(200, { ok: true });
  }

  if (!submission.result.ok) {
    log("invalid");
    return respond(400, { ok: false, errors: submission.result.errors });
  }

  const human = await verifyTurnstile({
    token: submission.turnstileToken,
    secret: env.TURNSTILE_SECRET_KEY,
    remoteIp: ip === "unknown" ? undefined : ip,
    expectedHostname: hostnameOf(request),
  });
  if (!human.ok) {
    log("turnstile", human.code);
    return human.reason === "invalid"
      ? respond(400, { ok: false, code: "turnstile" })
      : respond(502, { ok: false });
  }

  const inquiry = submission.result.value;
  const { subject, text } = buildInquiryEmail(inquiry);
  const sent = await sendEmail({
    apiKey: env.RESEND_API_KEY,
    message: {
      from: env.RESEND_FROM_EMAIL,
      to: env.CONTACT_TO_EMAIL,
      subject,
      text,
      replyTo: inquiry.email,
    },
  });
  if (!sent.ok) {
    log("delivery-failed", sent.code);
    return respond(502, { ok: false });
  }

  log("sent");
  return respond(200, { ok: true });
}
