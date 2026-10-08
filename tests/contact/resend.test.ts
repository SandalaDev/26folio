import { test } from "node:test";
import assert from "node:assert/strict";
import { RESEND_URL, sendEmail, type EmailMessage } from "../../src/lib/contact/resend.ts";

const message: EmailMessage = {
  from: "Abe <contact@send.example.test>",
  to: "owner@example.com",
  subject: "Subject",
  text: "Body",
  replyTo: "ann@example.com",
};

type Reply = Response | Error;

function stub(replies: Reply[]) {
  const calls: Array<{ url: string; init: RequestInit }> = [];
  const fetchImpl = (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init: init ?? {} });
    const next = replies[Math.min(calls.length - 1, replies.length - 1)];
    if (next instanceof Error) throw next;
    return next.clone();
  }) as typeof fetch;
  return { fetchImpl, calls };
}

const json = (body: unknown, status: number) => new Response(JSON.stringify(body), { status });
const opts = { apiKey: "re_secret", message, retryDelayMs: 1 };

test("sends the documented request and returns the id", async () => {
  const s = stub([json({ id: "abc" }, 200)]);
  const result = await sendEmail({ ...opts, fetchImpl: s.fetchImpl, idempotencyKey: "key-1" });
  assert.deepEqual(result, { ok: true, id: "abc" });
  assert.equal(s.calls.length, 1);
  assert.equal(s.calls[0].url, RESEND_URL);
  const headers = s.calls[0].init.headers as Record<string, string>;
  assert.equal(headers.Authorization, "Bearer re_secret");
  assert.equal(headers["Idempotency-Key"], "key-1");
  assert.deepEqual(JSON.parse(String(s.calls[0].init.body)), {
    from: message.from,
    to: [message.to],
    subject: message.subject,
    text: message.text,
    reply_to: message.replyTo,
  });
});

test("omits reply_to when none is given", async () => {
  const s = stub([json({ id: "abc" }, 200)]);
  await sendEmail({ ...opts, message: { ...message, replyTo: undefined }, fetchImpl: s.fetchImpl });
  assert.equal("reply_to" in JSON.parse(String(s.calls[0].init.body)), false);
});

test("retries once on transient faults and reuses the idempotency key", async () => {
  const transient: Reply[] = [
    json({ name: "service_unavailable" }, 503),
    json({ name: "application_error" }, 500),
    json({ name: "rate_limit_exceeded" }, 429),
    json({ name: "concurrent_idempotent_requests" }, 409),
    new TypeError("fetch failed"),
  ];
  for (const first of transient) {
    const s = stub([first, json({ id: "ok" }, 200)]);
    const result = await sendEmail({ ...opts, fetchImpl: s.fetchImpl });
    assert.deepEqual(result, { ok: true, id: "ok" });
    assert.equal(s.calls.length, 2);
    const keys = s.calls.map((c) => (c.init.headers as Record<string, string>)["Idempotency-Key"]);
    assert.equal(keys[0], keys[1]);
    assert.ok(keys[0]);
  }
});

test("gives up after one retry", async () => {
  const s = stub([json({ name: "service_unavailable" }, 503)]);
  const result = await sendEmail({ ...opts, fetchImpl: s.fetchImpl });
  assert.deepEqual(result, { ok: false, code: "service_unavailable" });
  assert.equal(s.calls.length, 2);
});

test("does not retry caller or quota errors", async () => {
  const final: Array<[Reply, string]> = [
    [json({ name: "validation_error" }, 422), "validation_error"],
    [json({ name: "missing_api_key" }, 401), "missing_api_key"],
    [json({ name: "restricted_api_key" }, 403), "restricted_api_key"],
    [json({ name: "daily_quota_exceeded" }, 429), "daily_quota_exceeded"],
    [json({ name: "monthly_quota_exceeded" }, 429), "monthly_quota_exceeded"],
  ];
  for (const [reply, code] of final) {
    const s = stub([reply]);
    const result = await sendEmail({ ...opts, fetchImpl: s.fetchImpl });
    assert.deepEqual(result, { ok: false, code });
    assert.equal(s.calls.length, 1, code);
  }
});

test("an unparseable error body still returns a coarse code and never the key", async () => {
  const s = stub([new Response("<html>", { status: 422 })]);
  const result = await sendEmail({ ...opts, fetchImpl: s.fetchImpl });
  assert.deepEqual(result, { ok: false, code: "http-422" });
  assert.equal(JSON.stringify(result).includes("re_secret"), false);
});
