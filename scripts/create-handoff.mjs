#!/usr/bin/env node
// create-handoff.mjs — materialise the handoff artifact(s) a task declares and
// register them in STATE.json.handoff_queue[]. Idempotent: re-running updates the
// existing file/queue entry rather than duplicating. Invoked by os.sh end when
// handoff_required is true; the ds-handoff skill then enriches the prose blocks.
//
// Usage: node scripts/create-handoff.mjs <task-file> [--type review|session|task]
// Exit:  0 created/updated or nothing required · 1 on error · 2 on bad usage.
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

const STATE = "project-state/STATE.json";

const taskFile = process.argv[2];
const typeFlagIdx = process.argv.indexOf("--type");
const typeOverride = typeFlagIdx > -1 ? process.argv[typeFlagIdx + 1] : null;

if (!taskFile || !fs.existsSync(taskFile)) {
  console.error("Usage: node scripts/create-handoff.mjs <task-file> [--type review|session|task]");
  process.exit(2);
}

function frontmatter(file) {
  // CRLF-tolerant anchor (Windows autocrlf yields ---\r\n).
  const m = fs.readFileSync(file, "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  try { return YAML.parse(m[1]) ?? {}; } catch { return {}; }
}

const fm = frontmatter(taskFile);
const taskId = fm.id || path.basename(taskFile, ".md");

if (fm.handoff_required !== true) {
  console.log(`[handoff] ${taskId}: handoff_required not true — nothing to create.`);
  process.exit(0);
}

// Determine the type(s). handoff_type may be a string or list; default to review.
let types = typeOverride
  ? [typeOverride]
  : (Array.isArray(fm.handoff_type) ? fm.handoff_type : (fm.handoff_type ? [fm.handoff_type] : ["review"]));
types = types.filter(Boolean);

const now = new Date().toISOString();
const createdBy = process.env.HARNESS_NAME || process.env.AGENT_NAME || "unknown";

const verificationBlock = () => {
  const keys = ["lint", "typecheck", "unit", "integration", "e2e", "accessibility"];
  const lines = keys
    .filter((k) => fm[k] === true || fm[k] === false)
    .map((k) => `  ${k}: ${fm[k] === true ? "declared" : "skipped"}`);
  return lines.length ? lines.join("\n") : "  (none declared)";
};

// A task may pin the path via `handoff_file:` (single type) or `handoff_files:`
// (a map keyed by type). Honour the declared path so it matches what
// verify-task.sh looks up; otherwise fall back to the canonical location.
function declaredPath(type) {
  if (fm.handoff_files && typeof fm.handoff_files === "object" && fm.handoff_files[type]) {
    return fm.handoff_files[type];
  }
  if (fm.handoff_file && types.length === 1) return fm.handoff_file;
  return null;
}

function targetFor(type) {
  let file, id;
  switch (type) {
    case "review":
      file = declaredPath(type) || `handoffs/review/HANDOFF-REVIEW-${taskId}.md`;
      id = `HANDOFF-REVIEW-${taskId}`;
      break;
    case "session": {
      const day = now.slice(0, 10);
      file = declaredPath(type) || `handoffs/session/HANDOFF-SESSION-${day}.md`;
      id = `HANDOFF-SESSION-${day}`;
      break;
    }
    case "task":
      file = declaredPath(type) || `handoffs/task/HANDOFF-TASK-${taskId}.md`;
      id = `HANDOFF-TASK-${taskId}`;
      break;
    default:
      return null;
  }
  return { dir: path.dirname(file), id, file };
}

function reviewBody(t) {
  return `---
handoff_type: review
id: ${t.id}
created: ${now}
created_by: ${createdBy}
task_ref: ${taskFile}
slice_ref: ${fm.slice ? `planning/slices/${fm.slice}.md` : "—"}
epic_ref: ${fm.epic ? `backlog/epics/${fm.epic}-*.md` : "—"}
implementation_status: complete
verification:
${verificationBlock()}
review_focus:
  - architecture conformance to the slice plan and 07-architecture-principles.md
  - correctness of risk-bearing behaviour
  - scope: every changed file is inside files_allowed
review_notes_path: .agents/reviews/REVIEW-${taskId}.md
---
# Handoff: Review ${taskId}

## Purpose
Cross-model review of ${taskId} ("${fm.title ?? taskId}") before human merge.
Reviewer family must differ from \`${fm.preferred_executor ?? "executor"}\`.

## Current State
Implementation complete; gate proofs as recorded above. Diff scoped to
\`files_allowed\` in ${taskFile}.

## Completed
- See ${taskFile} acceptance criteria.

## Remaining (for reviewer)
- Architecture / slice conformance
- Correctness + edge-case audit on risk-bearing logic
- Scope check against files_allowed

## Risks
- (fill in: anything the reviewer should scrutinise first)

## Suggested Skills
- ds-reviewer
`;
}

function genericBody(t, type) {
  return `---
handoff_type: ${type}
id: ${t.id}
created: ${now}
created_by: ${createdBy}
task_ref: ${taskFile}
---
# Handoff: ${type} ${taskId}

## Purpose
(fill in)

## Current State
(fill in — reference artifact paths, do not copy content)

## Remaining
(fill in)

## Risks
(fill in)
`;
}

// Load STATE.json once.
let state;
try { state = JSON.parse(fs.readFileSync(STATE, "utf8")); }
catch (e) { console.error(`[handoff] cannot read ${STATE}: ${e.message}`); process.exit(1); }
state.handoff_queue = Array.isArray(state.handoff_queue) ? state.handoff_queue : [];

let createdCount = 0;
for (const type of types) {
  const t = targetFor(type);
  if (!t) { console.error(`[handoff] unknown type '${type}' — skipping.`); continue; }
  fs.mkdirSync(t.dir, { recursive: true });

  // Do not clobber a handoff that already has hand-written prose.
  if (!fs.existsSync(t.file)) {
    const body = type === "review" ? reviewBody(t) : genericBody(t, type);
    fs.writeFileSync(t.file, body);
    console.log(`[handoff] wrote ${t.file}`);
    createdCount++;
  } else {
    console.log(`[handoff] exists, left intact: ${t.file}`);
  }

  // Upsert the queue entry (keyed by id).
  const existing = state.handoff_queue.find((h) => h.id === t.id);
  if (existing) {
    existing.type = type;
    existing.task_ref = taskFile;
    existing.file = t.file;
    if (!existing.status) existing.status = "pending";
  } else {
    state.handoff_queue.push({ id: t.id, type, task_ref: taskFile, file: t.file, status: "pending" });
  }
}

fs.writeFileSync(STATE, JSON.stringify(state, null, 2) + "\n");
console.log(`[handoff] STATE.json.handoff_queue updated (${createdCount} new file(s)). Run render-state to refresh views.`);
process.exit(0);
