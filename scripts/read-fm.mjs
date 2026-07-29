#!/usr/bin/env node
// read-fm.mjs — the single canonical frontmatter reader.
// Every script that touches task/handoff frontmatter MUST go through this. A
// hand-rolled reader drifts from the canonical one: it can't strip inline
// `# comments` or unquote values, so `status: done  # note` reads as not-done.
// One reader, real YAML parse, CRLF-tolerant.
//
// Usage: node scripts/read-fm.mjs <file> <field> [--list]
//   scalar field        -> prints the value as-is
//   array field         -> comma-joined (default) or newline-joined with --list
//   missing/null field  -> prints nothing, exits 0
import fs from "node:fs";
import YAML from "yaml";

const [file, field, ...rest] = process.argv.slice(2);
const listMode = rest.includes("--list");

if (!file || !field) {
  console.error("Usage: node scripts/read-fm.mjs <file> <field> [--list]");
  process.exit(2);
}

export function frontmatter(file) {
  if (!fs.existsSync(file)) return {};
  const src = fs.readFileSync(file, "utf8");
  // CRLF-tolerant anchor (Windows autocrlf yields ---\r\n).
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  try { return YAML.parse(m[1]) ?? {}; } catch { return {}; }
}

const value = frontmatter(file)[field];
if (value == null) process.exit(0);

if (Array.isArray(value)) {
  process.stdout.write(listMode ? value.join("\n") : value.join(","));
} else {
  process.stdout.write(String(value));
}
