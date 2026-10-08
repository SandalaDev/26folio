import { test } from "node:test";
import assert from "node:assert/strict";
import { UNKNOWN_CLIENT, clientIp } from "../../src/lib/contact/client-ip.ts";

const h = (init: Record<string, string>) => new Headers(init);

test("cf-connecting-ip wins over x-forwarded-for", () => {
  assert.equal(
    clientIp(h({ "cf-connecting-ip": "1.1.1.1", "x-forwarded-for": "2.2.2.2, 3.3.3.3" })),
    "1.1.1.1",
  );
});

test("falls back to the first forwarded hop", () => {
  assert.equal(clientIp(h({ "x-forwarded-for": "2.2.2.2, 3.3.3.3" })), "2.2.2.2");
  assert.equal(clientIp(h({ "x-forwarded-for": "  2.2.2.2  " })), "2.2.2.2");
});

test("missing, empty and blank headers share one fallback key without throwing", () => {
  const cases: Array<Record<string, string>> = [
    {},
    { "cf-connecting-ip": "" },
    { "cf-connecting-ip": "  " },
    { "x-forwarded-for": "" },
    { "x-forwarded-for": " , " },
  ];
  for (const init of cases) {
    assert.equal(clientIp(h(init)), UNKNOWN_CLIENT, JSON.stringify(init));
  }
});

test("an empty cf header does not block the forwarded fallback", () => {
  assert.equal(clientIp(h({ "cf-connecting-ip": "", "x-forwarded-for": "4.4.4.4" })), "4.4.4.4");
});
