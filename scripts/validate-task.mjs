#!/usr/bin/env node
// validate-task.mjs — real-YAML task validation (v6.1 replaces the regex parser).
import fs from "node:fs";
import YAML from "yaml";
const taskPath = process.argv[2];
if (!taskPath || !fs.existsSync(taskPath)) {
  console.error("Usage: node scripts/validate-task.mjs backlog/tasks/TASK-XXX.md");
  process.exit(2);
}
const m = fs.readFileSync(taskPath, "utf8").match(/^---\n([\s\S]*?)\n---/);
let fm = {};
try { fm = m ? (YAML.parse(m[1]) ?? {}) : {}; }
catch (e) { console.error("Frontmatter is not valid YAML:", e.message); process.exit(1); }

const required = ["id", "title", "status", "priority", "risk_level", "preferred_executor"];
const missing = required.filter(f => fm[f] === undefined || fm[f] === null || fm[f] === "");
if (missing.length) { console.error(`Task missing required fields: ${missing.join(", ")}`); process.exit(1); }

if (fm.handoff_required === true && !fm.handoff_file && !fm.handoff_files) {
  console.error("handoff_required is true but no handoff_file/handoff_files set."); process.exit(1);
}
if (!Array.isArray(fm.files_allowed) || fm.files_allowed.length === 0) {
  console.warn("Warning: files_allowed is empty — scope cannot be enforced for this task.");
}
console.log("Task validation passed.");
