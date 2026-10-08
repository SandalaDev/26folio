import { test } from "node:test";
import assert from "node:assert/strict";
import {
  SITEVERIFY_URL,
  TURNSTILE_ACTION,
  isTestSecret,
  verifyTurnstile,
} from "../../src/lib/contact/turnstile.ts";

const SECRET = "prod-secret-do-not-leak";
const HOST = "sandala.dev";
const NOW = Date.parse("2026-10-08T12:00:00Z");

type Handler = (url: string, init: RequestInit) => Response | Promise<Response>;

function stub(handler: Handler) {
  const calls: Array<{ url: string; init: RequestInit }> = [];
  const fetchImpl = (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init: init ?? {} });
    return handler(String(url), init ?? {});
  }) as typeof fetch;
  return { fetchImpl, calls };
}

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

const goodBody = {
  success: true,
  action: TURNSTILE_ACTION,
  hostname: HOST,
  challenge_ts: new Date(NOW - 10_000).toISOString(),
};

function run(handler: Handler, overrides: Partial<Parameters<typeof verifyTurnstile>[0]> = {}) {
  const s = stub(handler);
  const result = verifyTurnstile({
    token: "tok",
    secret: SECRET,
    expectedHostname: HOST,
    fetchImpl: s.fetchImpl,
    now: () => NOW,
    ...overrides,
  });
  return result.then((value) => ({ value, calls: s.calls }));
}

test("a clean pass sends the documented request", async () => {
  const { value, calls } = await run(() => json(goodBody), { remoteIp: "1.2.3.4", idempotencyKey: "k1" });
  assert.deepEqual(value, { ok: true });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, SITEVERIFY_URL);
  assert.equal(calls[0].init.method, "POST");
  const body = calls[0].init.body as URLSearchParams;
  assert.equal(body.get("secret"), SECRET);
  assert.equal(body.get("response"), "tok");
  assert.equal(body.get("remoteip"), "1.2.3.4");
  assert.equal(body.get("idempotency_key"), "k1");
});

test("a missing token fails without calling Cloudflare", async () => {
  const { value, calls } = await run(() => json(goodBody), { token: "" });
  assert.equal(value.ok, false);
  assert.equal(calls.length, 0);
});

test("Cloudflare rejections are invalid, not unavailable", async () => {
  for (const code of ["timeout-or-duplicate", "invalid-input-response", "missing-input-response"]) {
    const { value } = await run(() => json({ success: false, "error-codes": [code] }));
    assert.deepEqual(value, { ok: false, reason: "invalid", code });
  }
});

test("a malformed answer without success is invalid", async () => {
  const { value } = await run(() => json({}));
  assert.equal(value.ok, false);
  if (!value.ok) assert.equal(value.reason, "invalid");
});

test("hostname, action and age mismatches are invalid", async () => {
  const cases: Array<[string, Record<string, unknown>]> = [
    ["hostname-mismatch", { hostname: "evil.example" }],
    ["action-mismatch", { action: "other" }],
    ["action-mismatch", { action: undefined }],
    ["token-stale", { challenge_ts: new Date(NOW - 5 * 60 * 1000).toISOString() }],
    ["token-stale", { challenge_ts: undefined }],
    ["token-stale", { challenge_ts: "not a date" }],
  ];
  for (const [code, patch] of cases) {
    const { value } = await run(() => json({ ...goodBody, ...patch }));
    assert.deepEqual(value, { ok: false, reason: "invalid", code }, JSON.stringify(patch));
  }
});

test("test secrets skip the hostname, action and age checks", async () => {
  const testSecret = "1x0000000000000000000000000000000AA";
  assert.equal(isTestSecret(testSecret), true);
  assert.equal(isTestSecret(SECRET), false);
  const { value } = await run(() => json({ success: true, hostname: "example.com" }), { secret: testSecret });
  assert.deepEqual(value, { ok: true });
});

test("network errors and timeouts fail closed after one retry with the same key", async () => {
  for (const make of [
    () => new TypeError("fetch failed"),
    () => new DOMException("timed out", "TimeoutError"),
  ]) {
    const { value, calls } = await run(() => {
      throw make();
    });
    assert.deepEqual(value, { ok: false, reason: "unavailable", code: "unreachable" });
    assert.equal(calls.length, 2);
    const keys = calls.map((c) => (c.init.body as URLSearchParams).get("idempotency_key"));
    assert.equal(keys[0], keys[1]);
  }
});

test("a 5xx or unparseable body is unavailable, and recovery on retry passes", async () => {
  const { value: down } = await run(() => new Response("oops", { status: 503 }));
  assert.equal(down.ok, false);
  if (!down.ok) assert.equal(down.reason, "unavailable");

  const { value: garbled } = await run(() => new Response("<html>", { status: 200 }));
  assert.equal(garbled.ok, false);
  if (!garbled.ok) assert.equal(garbled.reason, "unavailable");

  let n = 0;
  const { value: recovered, calls } = await run(() =>
    ++n === 1 ? new Response("oops", { status: 500 }) : json(goodBody),
  );
  assert.deepEqual(recovered, { ok: true });
  assert.equal(calls.length, 2);
});

test("internal-error retries once, then fails closed; secret errors are ours", async () => {
  const { value, calls } = await run(() => json({ success: false, "error-codes": ["internal-error"] }));
  assert.deepEqual(value, { ok: false, reason: "unavailable", code: "internal-error" });
  assert.equal(calls.length, 2);

  const { value: bad } = await run(() => json({ success: false, "error-codes": ["invalid-input-secret"] }));
  assert.deepEqual(bad, { ok: false, reason: "unavailable", code: "invalid-input-secret" });
});

test("the secret never appears in any returned value", async () => {
  const outcomes = [
    await run(() => json(goodBody)),
    await run(() => json({ success: false, "error-codes": ["invalid-input-response"] })),
    await run(() => {
      throw new Error(`boom ${SECRET}`);
    }),
  ];
  for (const { value } of outcomes) {
    assert.equal(JSON.stringify(value).includes(SECRET), false);
  }
});
