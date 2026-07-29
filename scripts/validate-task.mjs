#!/usr/bin/env node
// validate-task.mjs — task frontmatter sanity. Real YAML parse, CRLF-tolerant.
//
// ADVISORY, minimal: it confirms the file will not corrupt state derivation
// (parsable frontmatter, an id/title/status the views can render). It does NOT
// enforce process — no review obligations, no verification matrices, no scope
// declarations. Tests are planned work and reviews happen after the PR,
// outside the system.
//
// Exit: 0 ok · 1 malformed (state views would break) · 2 usage.
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

const TASK = process.argv[2];
if (!TASK || !fs.existsSync(TASK)) {
  console.error("Usage: node scripts/validate-task.mjs <task-file>");
  process.exit(2);
}

function frontmatter(file) {
  const src = fs.readFileSync(file, "utf8");
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);   // CRLF-tolerant
  if (!m) return null;
  try { return YAML.parse(m[1]) ?? {}; } catch { return null; }
}

const fm = frontmatter(TASK);
const errs = [];
const warns = [];

if (fm === null) {
  errs.push("frontmatter missing or unparsable — state derivation would skip this task");
} else {
  // Minimal fields the views/derivation depend on.
  for (const k of ["id", "title", "status"]) {
    if (fm[k] == null || fm[k] === "") errs.push(`missing required field: ${k}`);
  }
  const st = String(fm.status || "").toLowerCase();
  if (st && !["ready", "in-progress", "done", "blocked"].includes(st)) {
    warns.push(`status '${st}' is non-standard (expected ready|in-progress|done|blocked)`);
  }
  // Referenced skill should exist on disk (warn only).
  for (const ref of fm.skill_refs || []) {
    if (!fs.existsSync(path.join(".agents/skills", ref, "SKILL.md")) &&
        !fs.existsSync(path.join("pack-frontend/skills", ref, "SKILL.md"))) {
      warns.push(`skill_ref '${ref}' has no SKILL.md on disk`);
    }
  }
}

for (const w of warns) console.error(`  ⚠ ${w}`);
if (errs.length) {
  for (const e of errs) console.error(`  ✗ ${e}`);
  console.error(`[validate-task] ${(fm && fm.id) || TASK} MALFORMED`);
  process.exit(1);
}
console.log(`[validate-task] ${fm.id} valid (risk=${fm.risk_level || "—"})`);
