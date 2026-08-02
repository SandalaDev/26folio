#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";

const dashboard = fs.readFileSync("dashboard.html", "utf8");
const guide = fs.readFileSync("guide.html", "utf8");

assert.match(dashboard, /Estimated delivery toward intent/);
assert.match(dashboard, /Effort & estimation/);
assert.match(dashboard, /Estimation baseline needs|Baseline: ~[0-9]+ min per weight/);
assert.match(dashboard, /Task completion estimates delivery toward intent/);
assert.match(dashboard, /href="guide\.html"/);
assert.match(dashboard, /Business-goal progress/);
assert.match(dashboard, /Roadmap progress/);
assert.match(dashboard, /Dependency evidence and approvals/);
assert.match(dashboard, /OpenSrc supplies version-matched source and documentation/);

assert.match(guide, /complete usage guide/i);
for (const role of ["human", "agent", "system", "check"]) {
  assert.match(guide, new RegExp(`class="callout ${role}"`));
}
assert.doesNotMatch(guide, /:::(human|agent|system|check)/);
assert.match(guide, /Progress: tasks traced to roadmap and business intent/);
assert.match(guide, /Writing: voice, clarity, anti-slop, and approval/);
assert.match(guide, /Dependencies: OpenSrc before installation/);
assert.match(guide, /deps plan initial/);

const ids = [...guide.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, "guide IDs must be unique");
console.log("[rendered-artifacts-test] pass");
