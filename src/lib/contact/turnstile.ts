// Cloudflare Turnstile server-side verification. Fails closed: anything other
// than a clean pass means no mail is sent. Uses only web-standard APIs and an
// injected fetch so it runs on Workers and under `node --test`.

export const TURNSTILE_ACTION = "contact";
export const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const MAX_TOKEN_AGE_MS = 4 * 60 * 1000;
const TIMEOUT_MS = 5000;

export type TurnstileResult =
  | { ok: true }
  /** The token is missing, spent, expired or from the wrong place. */
  | { ok: false; reason: "invalid"; code: string }
  /** Cloudflare could not be reached or answered with a server fault. */
  | { ok: false; reason: "unavailable"; code: string };

type SiteverifyResponse = {
  success?: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
};

type Options = {
  token: string;
  secret: string;
  remoteIp?: string;
  /** Host the visitor reached this site on, without a port. */
  expectedHostname: string;
  fetchImpl?: typeof fetch;
  now?: () => number;
  idempotencyKey?: string;
};

/** Cloudflare's published test secrets begin with 1x, 2x or 3x then zeros. */
export function isTestSecret(secret: string): boolean {
  return /^[123]x0{10,}/.test(secret);
}

async function callSiteverify(
  options: Options,
  idempotencyKey: string,
): Promise<SiteverifyResponse> {
  const doFetch = options.fetchImpl ?? fetch;
  const body = new URLSearchParams({
    secret: options.secret,
    response: options.token,
    idempotency_key: idempotencyKey,
  });
  if (options.remoteIp) body.set("remoteip", options.remoteIp);
  const res = await doFetch(SITEVERIFY_URL, {
    method: "POST",
    body,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (res.status >= 500) throw new Error(`siteverify-${res.status}`);
  return (await res.json()) as SiteverifyResponse;
}

export async function verifyTurnstile(options: Options): Promise<TurnstileResult> {
  if (!options.token) return { ok: false, reason: "invalid", code: "missing-token" };

  const key = options.idempotencyKey ?? crypto.randomUUID();
  let data: SiteverifyResponse | null = null;
  for (let attempt = 0; attempt < 2 && !data; attempt++) {
    try {
      const response = await callSiteverify(options, key);
      const codes = response["error-codes"] ?? [];
      // Retry once on a Cloudflare-side fault; the idempotency key makes it safe.
      if (!response.success && codes.includes("internal-error") && attempt === 0) {
        continue;
      }
      data = response;
    } catch {
      // Network error, timeout or 5xx: try once more, then fail closed.
    }
  }
  if (!data) return { ok: false, reason: "unavailable", code: "unreachable" };

  if (!data.success) {
    const codes = data["error-codes"] ?? [];
    // Secret problems and Cloudflare faults are ours, not the visitor's.
    const ours = ["internal-error", "missing-input-secret", "invalid-input-secret"];
    const code = codes[0] ?? "failed";
    if (codes.some((c) => ours.includes(c))) {
      return { ok: false, reason: "unavailable", code };
    }
    return { ok: false, reason: "invalid", code };
  }

  // Test secrets do not return the real hostname or action.
  if (!isTestSecret(options.secret)) {
    if (data.action !== TURNSTILE_ACTION) {
      return { ok: false, reason: "invalid", code: "action-mismatch" };
    }
    if (data.hostname !== options.expectedHostname) {
      return { ok: false, reason: "invalid", code: "hostname-mismatch" };
    }
    const issued = data.challenge_ts ? Date.parse(data.challenge_ts) : Number.NaN;
    const now = (options.now ?? Date.now)();
    if (Number.isNaN(issued) || now - issued > MAX_TOKEN_AGE_MS) {
      return { ok: false, reason: "invalid", code: "token-stale" };
    }
  }
  return { ok: true };
}
