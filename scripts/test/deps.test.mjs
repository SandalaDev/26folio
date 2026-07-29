#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync("scripts/deps.mjs", "utf8");
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const lock = JSON.parse(fs.readFileSync("package-lock.json", "utf8"));
const baseline = fs.readFileSync("docs/dependencies/os-runtime.md", "utf8");

assert.equal(packageJson.dependencies.yaml, "2.9.0");
assert.equal(lock.packages[""].dependencies.yaml, "2.9.0");
assert.equal(lock.packages["node_modules/yaml"].version, "2.9.0");
assert.match(baseline, /yaml@2\.9\.0/);
assert.match(baseline, /opensrc@0\.7\.2/);
assert.match(source, /OPENSRC_VERSION = "0\.7\.2"/);
assert.match(source, /TODO\\\(REQUIRED\\\)/);
assert.match(source, /--package-lock-only/);
assert.match(source, /--ignore-scripts/);
assert.match(source, /--dry-run/);
assert.match(source, /--save-exact/);
assert.match(source, /human_approval/);
assert.match(source, /\["review-ready", "approved", "installed"\]/);
assert.match(source, /requireApproval: true/);
assert.match(source, /pre-install resolver/);
console.log("[deps-test] pass");
