#!/usr/bin/env node
// validate-task.mjs — real-YAML task validation (v6.1 replaces the regex parser).
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
const taskPath = process.argv[2];
if (!taskPath || !fs.existsSync(taskPath)) {
  console.error("Usage: node scripts/validate-task.mjs backlog/tasks/TASK-XXX.md");
  process.exit(2);
}
// CRLF-tolerant anchor (Windows autocrlf yields ---\r\n).
const m = fs.readFileSync(taskPath, "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/);
let fm = {};
try { fm = m ? (YAML.parse(m[1]) ?? {}) : {}; }
catch (e) { console.error("Frontmatter is not valid YAML:", e.message); process.exit(1); }

const errors = [];
const warns = [];

const required = ["id", "title", "status", "priority", "risk_level", "preferred_executor"];
const missing = required.filter(f => fm[f] === undefined || fm[f] === null || fm[f] === "");
if (missing.length) errors.push(`missing required fields: ${missing.join(", ")}`);

// handoff_required true must point at a file.
if (fm.handoff_required === true && !fm.handoff_file && !fm.handoff_files) {
  errors.push("handoff_required is true but no handoff_file/handoff_files set.");
}

// Risk -> review obligation. The dev-os risk matrix requires cross-model review
// at medium and above; that review is delivered via a HANDOFF-REVIEW. Enforce the
// mapping the matrix only documented, so a medium task cannot ship review-free.
// Escape hatch: an explicit `review_waiver:` reason string (audited, not a silent
// boolean) — use only when a human has consciously accepted the risk.
const REVIEWABLE = new Set(["medium", "high", "critical"]);
if (REVIEWABLE.has(String(fm.risk_level))) {
  const waiver = typeof fm.review_waiver === "string" && fm.review_waiver.trim();
  if (fm.handoff_required !== true && !waiver) {
    errors.push(
      `risk_level '${fm.risk_level}' requires cross-model review: set handoff_required: true ` +
      `with handoff_type: [review] (or add 'review_waiver: <reason>' if a human accepts the risk).`
    );
  } else if (waiver) {
    warns.push(`review waived for ${fm.risk_level}-risk task: "${waiver}"`);
  } else {
    // handoff_required true — ensure review is among the declared types.
    const types = Array.isArray(fm.handoff_type) ? fm.handoff_type
      : (fm.handoff_type ? [fm.handoff_type] : []);
    if (types.length && !types.includes("review")) {
      warns.push(`risk_level '${fm.risk_level}' usually wants handoff_type: [review]; got [${types.join(", ")}].`);
    }
  }
}

// skill_refs must resolve on disk. A phantom reference (folder absent) is a typo or
// a skill that was never created — fail. A present-but-empty stub is a warning.
if (Array.isArray(fm.skill_refs)) {
  for (const ref of fm.skill_refs) {
    const skillFile = path.join(".agents/skills", String(ref), "SKILL.md");
    if (!fs.existsSync(skillFile)) {
      errors.push(`skill_ref '${ref}' does not exist (.agents/skills/${ref}/SKILL.md missing).`);
    } else if (fs.statSync(skillFile).size === 0) {
      warns.push(`skill_ref '${ref}' is an empty stub — author it or drop the reference.`);
    }
  }
}

if (!Array.isArray(fm.files_allowed) || fm.files_allowed.length === 0) {
  warns.push("files_allowed is empty — scope cannot be enforced for this task.");
}

warns.forEach(w => console.warn("Warning:", w));
if (errors.length) { errors.forEach(e => console.error("Error:", e)); process.exit(1); }
console.log("Task validation passed.");
