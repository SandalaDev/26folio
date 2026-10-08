// Minimal Resend client over fetch (TASK-122 decision: no SDK). Web-standard
// APIs only. One retry on transient faults, reusing the idempotency key so a
// retry cannot deliver twice.

export const RESEND_URL = "https://api.resend.com/emails";

const TIMEOUT_MS = 8000;
const RETRY_DELAY_MS = 400;
const RETRYABLE_STATUS = new Set([409, 429, 500, 503]);
// 429 quota errors are not worth retrying inside a request.
const NON_RETRYABLE_NAMES = new Set(["daily_quota_exceeded", "monthly_quota_exceeded"]);

export type EmailMessage = {
  from: string;
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
};

export type SendResult =
  | { ok: true; id: string }
  | { ok: false; code: string };

type Options = {
  apiKey: string;
  message: EmailMessage;
  fetchImpl?: typeof fetch;
  idempotencyKey?: string;
  retryDelayMs?: number;
};

async function attempt(
  options: Options,
  idempotencyKey: string,
): Promise<{ result: SendResult; retry: boolean }> {
  const doFetch = options.fetchImpl ?? fetch;
  const { message } = options;
  try {
    const res = await doFetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({
        from: message.from,
        to: [message.to],
        subject: message.subject,
        text: message.text,
        ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const body = (await res.json().catch(() => null)) as
      | { id?: string; name?: string }
      | null;
    if (res.ok && body?.id) return { result: { ok: true, id: body.id }, retry: false };
    const name = body?.name ?? `http-${res.status}`;
    return {
      result: { ok: false, code: name },
      retry: RETRYABLE_STATUS.has(res.status) && !NON_RETRYABLE_NAMES.has(name),
    };
  } catch {
    return { result: { ok: false, code: "network" }, retry: true };
  }
}

export async function sendEmail(options: Options): Promise<SendResult> {
  const key = options.idempotencyKey ?? crypto.randomUUID();
  const first = await attempt(options, key);
  if (first.result.ok || !first.retry) return first.result;
  await new Promise((resolve) => setTimeout(resolve, options.retryDelayMs ?? RETRY_DELAY_MS));
  return (await attempt(options, key)).result;
}
