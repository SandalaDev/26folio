import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildAutoReply,
  buildInquiryEmail,
  singleLine,
} from "../../src/lib/contact/message.ts";

const LINE_BREAKS = ["\r\n", "\n", "\r", " ", " ", "\u0000", "\t", "\u007f"];
const BREAK_RE = new RegExp("[\\r\\n\\u2028\\u2029\\u0000\\u007f\\t]");

test("singleLine removes every line break and control character", () => {
  for (const sep of LINE_BREAKS) {
    const out = singleLine(`a${sep}Bcc: x@y.z${sep}b`, 200);
    assert.doesNotMatch(out, BREAK_RE, JSON.stringify(sep));
    assert.equal(out, "a Bcc: x@y.z b");
  }
});

test("singleLine caps length and keeps unicode", () => {
  assert.equal(singleLine("x".repeat(500), 80).length, 80);
  assert.equal(singleLine("abc", 80), "abc");
  assert.equal(singleLine("Zoë 日本語 🙂", 80), "Zoë 日本語 🙂");
  assert.equal(singleLine("  spaced   out  ", 80), "spaced out");
});

test("inquiry subject and header-bound lines cannot carry a line break", () => {
  for (const sep of LINE_BREAKS) {
    const { subject, text } = buildInquiryEmail({
      name: `Eve${sep}Bcc: x@y.z`,
      email: "eve@example.com",
      message: "Body",
      projectType: `Web${sep}development`,
    });
    assert.doesNotMatch(subject, BREAK_RE, JSON.stringify(sep));
    const [nameLine, emailLine, typeLine] = text.split("\n");
    assert.match(nameLine, /^Name: /);
    assert.match(emailLine, /^Email: /);
    assert.match(typeLine, /^Project type: /);
  }
});

test("a very long name is bounded in the subject", () => {
  const { subject } = buildInquiryEmail({ name: "n".repeat(10_000), email: "a@b.co", message: "m" });
  assert.ok(subject.length < 120);
});

test("the body keeps the visitor's message as written", () => {
  const { text } = buildInquiryEmail({ name: "A", email: "a@b.co", message: "line1\nline2" });
  assert.ok(text.includes("line1\nline2"));
});

test("auto-reply greets with the flattened name and never repeats the message", () => {
  const { subject, text } = buildAutoReply({ name: "Ann\r\nBcc: x@y.z" });
  assert.doesNotMatch(subject, BREAK_RE);
  assert.ok(text.startsWith("Hi Ann Bcc: x@y.z,"));
  const reply = buildAutoReply({ name: "Ann" });
  assert.equal(reply.text.includes("SECRETBODY"), false);
});
