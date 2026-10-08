import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CONTACT_RATE_LIMIT,
  createMemoryRateLimiter,
  type RateLimiter,
} from "../../src/lib/contact/rate-limit.ts";

// The contract cases run against the interface, so a Cloudflare-backed limiter
// can reuse them by supplying a different factory and clock.
function contract(make: (now: () => number) => RateLimiter, limit: number, windowMs: number) {
  test(`allows ${limit}, blocks the next`, () => {
    const t = { now: 0 };
    const limiter = make(() => t.now);
    for (let i = 0; i < limit; i++) assert.equal(limiter.check("a").allowed, true, `hit ${i + 1}`);
    const blocked = limiter.check("a");
    assert.equal(blocked.allowed, false);
    if (!blocked.allowed) {
      assert.ok(blocked.retryAfterSeconds >= 1);
      assert.ok(blocked.retryAfterSeconds <= Math.ceil(windowMs / 1000));
    }
  });

  test("window expiry resets the count", () => {
    const t = { now: 0 };
    const limiter = make(() => t.now);
    for (let i = 0; i < limit; i++) limiter.check("a");
    assert.equal(limiter.check("a").allowed, false);
    t.now = windowMs - 1;
    assert.equal(limiter.check("a").allowed, false, "still inside the window");
    t.now = windowMs + 1;
    assert.equal(limiter.check("a").allowed, true, "after the window");
  });

  test("separate keys are independent", () => {
    const t = { now: 0 };
    const limiter = make(() => t.now);
    for (let i = 0; i < limit; i++) limiter.check("a");
    assert.equal(limiter.check("a").allowed, false);
    assert.equal(limiter.check("b").allowed, true);
  });

  test("blocked attempts do not extend the window", () => {
    const t = { now: 0 };
    const limiter = make(() => t.now);
    for (let i = 0; i < limit; i++) limiter.check("a");
    t.now = windowMs / 2;
    for (let i = 0; i < 10; i++) limiter.check("a");
    t.now = windowMs + 1;
    assert.equal(limiter.check("a").allowed, true);
  });
}

contract(
  (now) => createMemoryRateLimiter({ ...CONTACT_RATE_LIMIT, now }),
  CONTACT_RATE_LIMIT.limit,
  CONTACT_RATE_LIMIT.windowMs,
);

test("default limit is 5 per 10 minutes", () => {
  assert.equal(CONTACT_RATE_LIMIT.limit, 5);
  assert.equal(CONTACT_RATE_LIMIT.windowMs, 10 * 60 * 1000);
});

test("cleanup under key pressure keeps live entries and drops expired ones", () => {
  const t = { now: 0 };
  const limiter = createMemoryRateLimiter({ limit: 2, windowMs: 1000, maxKeys: 3, now: () => t.now });
  limiter.check("old1");
  limiter.check("old2");
  t.now = 900;
  limiter.check("live");
  limiter.check("live");
  assert.equal(limiter.check("live").allowed, false);
  t.now = 1200; // old1 and old2 expired; live is still inside its window
  limiter.check("new1"); // the map is at its cap, so this triggers a prune
  assert.equal(limiter.check("live").allowed, false, "live entry survived the prune");
  assert.equal(limiter.check("old1").allowed, true, "expired entry was dropped");
});
