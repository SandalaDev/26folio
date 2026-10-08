import { test } from "node:test";
import assert from "node:assert/strict";
import {
  PROJECT_TYPES,
  parseSubmission,
  validateInquiry,
} from "../../src/lib/contact/validate.ts";

const valid = { name: "Ann", email: "ann@example.com", message: "Hello" };

test("accepts a minimal valid inquiry and trims fields", () => {
  const result = validateInquiry({ name: "  Ann  ", email: " ann@example.com ", message: " Hi " });
  assert.deepEqual(result, {
    ok: true,
    value: { name: "Ann", email: "ann@example.com", message: "Hi" },
  });
});

test("requires name, email and message", () => {
  for (const field of ["name", "email", "message"] as const) {
    for (const bad of [undefined, "", "   "]) {
      const result = validateInquiry({ ...valid, [field]: bad });
      assert.equal(result.ok, false, `${field}=${JSON.stringify(bad)}`);
      if (!result.ok) assert.ok(result.errors[field], `${field} has a message`);
    }
  }
});

test("rejects values that are not strings", () => {
  for (const bad of [42, true, null, {}, ["x"]]) {
    for (const field of ["name", "email", "message"] as const) {
      const result = validateInquiry({ ...valid, [field]: bad });
      assert.equal(result.ok, false, `${field}=${JSON.stringify(bad)}`);
    }
  }
});

test("email shapes", () => {
  const good = ["a@b.co", "first.last+tag@sub.example.org", "x@y.io"];
  const bad = [
    "plain",
    "@b.co",
    "a@b",
    "a b@c.co",
    "a@b.co, c@d.co",
    "a@b.co;c@d.co",
    "<a@b.co>",
    '"a"@b.co',
    "a@b.co\r\nBcc: x@y.z",
  ];
  for (const email of good) {
    assert.equal(validateInquiry({ ...valid, email }).ok, true, email);
  }
  for (const email of bad) {
    assert.equal(validateInquiry({ ...valid, email }).ok, false, JSON.stringify(email));
  }
});

test("length caps: at the limit passes, one over fails", () => {
  // Literal numbers on purpose: changing a cap in the source must break a test.
  const local = "a".repeat(254 - "@b.co".length);
  const cases: Array<[string, string, number]> = [
    ["name", "n", 100],
    ["message", "m", 5000],
  ];
  for (const [field, ch, max] of cases) {
    assert.equal(validateInquiry({ ...valid, [field]: ch.repeat(max) }).ok, true, `${field} at cap`);
    assert.equal(validateInquiry({ ...valid, [field]: ch.repeat(max + 1) }).ok, false, `${field} over cap`);
  }
  assert.equal(validateInquiry({ ...valid, email: `${local}@b.co` }).ok, true, "email at cap");
  assert.equal(validateInquiry({ ...valid, email: `a${local}@b.co` }).ok, false, "email over cap");
});

test("project type: known values pass, empty is omitted, unknown is an error", () => {
  for (const projectType of PROJECT_TYPES) {
    const result = validateInquiry({ ...valid, projectType });
    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.value.projectType, projectType);
  }
  for (const empty of [undefined, null, ""]) {
    const result = validateInquiry({ ...valid, projectType: empty });
    assert.equal(result.ok, true);
    if (result.ok) assert.equal("projectType" in result.value, false);
  }
  for (const unknown of ["Crypto", 7, ["Web development"], "web development"]) {
    const result = validateInquiry({ ...valid, projectType: unknown });
    assert.equal(result.ok, false, JSON.stringify(unknown));
    if (!result.ok) assert.ok(result.errors.projectType);
  }
});

test("unicode input is accepted", () => {
  const result = validateInquiry({ ...valid, name: "Zoë Ñandú 日本語", message: "héllo 🙂" });
  assert.equal(result.ok, true);
});

test("honeypot: empty and whitespace pass, any text flags", () => {
  const body = { ...valid, turnstileToken: "t" };
  assert.equal(parseSubmission({ ...body })?.honeypotFilled, false);
  assert.equal(parseSubmission({ ...body, website: "" })?.honeypotFilled, false);
  assert.equal(parseSubmission({ ...body, website: "   " })?.honeypotFilled, false);
  assert.equal(parseSubmission({ ...body, website: "http://spam" })?.honeypotFilled, true);
  assert.equal(parseSubmission({ ...body, website: "x" })?.honeypotFilled, true);
});

test("parseSubmission rejects non-objects and reads the token", () => {
  for (const bad of [null, undefined, "str", 5, [], [valid]]) {
    assert.equal(parseSubmission(bad), null, JSON.stringify(bad));
  }
  assert.equal(parseSubmission({ ...valid, turnstileToken: "abc" })?.turnstileToken, "abc");
  assert.equal(parseSubmission({ ...valid, turnstileToken: 5 })?.turnstileToken, "");
  assert.equal(parseSubmission(valid)?.turnstileToken, "");
});
