#!/usr/bin/env node
// read-fm.mjs — print one frontmatter field from a Markdown file, using real YAML.
// Usage: node scripts/read-fm.mjs <file> <field> [--list]
import fs from "node:fs";
import YAML from "yaml";
const [file, field, flag] = process.argv.slice(2);
if (!file || !field) { console.error("Usage: read-fm.mjs <file> <field> [--list]"); process.exit(2); }
// CRLF-tolerant: Windows checkouts (core.autocrlf=true) yield ---\r\n, which an
// LF-only anchor would miss, silently emptying every field the gate reads.
const m = fs.readFileSync(file, "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/);
const fm = m ? (YAML.parse(m[1]) ?? {}) : {};
const v = fm[field];
if (v == null) process.exit(0);
if (flag === "--list" && Array.isArray(v)) { console.log(v.join("\n")); }
else if (Array.isArray(v)) { console.log(v.join(",")); }
else { console.log(String(v)); }
