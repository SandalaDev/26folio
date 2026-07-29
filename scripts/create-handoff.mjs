#!/usr/bin/env node
// create-handoff.mjs — materialise the handoff artifact file(s) a task declares.
// Idempotent: re-running leaves existing files intact. Invoked by os.sh end
// when handoff_required is true; the agent then enriches the prose blocks.
//
// This writes ONLY artifact files under handoffs/. state.json.handoff_queue[]
// is derived from those files by render-state.mjs (Phase 3a), so this script no
// longer mutates state.json.
//
// Handoffs are CONTINUITY artifacts (resume a session, chain task A into task
// B) — not review vehicles. Reviews happen manually after the PR, outside the
// system.
//
// Usage: node scripts/create-handoff.mjs <task-file> [--type session|task]
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

const taskFile = process.argv[2];
const typeFlagIdx = process.argv.indexOf("--type");
const typeOverride = typeFlagIdx > -1 ? process.argv[typeFlagIdx + 1] : null;

if (!taskFile || !fs.existsSync(taskFile)) {
  console.error("Usage: node scripts/create-handoff.mjs <task-file> [--type session|task]");
  process.exit(2);
}

function frontmatter(file) {
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

let types = typeOverride
  ? [typeOverride]
  : (Array.isArray(fm.handoff_type) ? fm.handoff_type : (fm.handoff_type ? [fm.handoff_type] : ["session"]));
types = types.filter(Boolean);

const now = new Date().toISOString();
const createdBy = process.env.HARNESS_NAME || process.env.AGENT_NAME || "unknown";

function declaredPath(type) {
  if (fm.handoff_files && typeof fm.handoff_files === "object" && fm.handoff_files[type]) return fm.handoff_files[type];
  if (fm.handoff_file && types.length === 1) return fm.handoff_file;
  return null;
}

function targetFor(type) {
  let file, id;
  switch (type) {
    case "session": {
      const day = now.slice(0, 10);
      file = declaredPath(type) || `handoffs/session/HANDOFF-SESSION-${day}.md`;
      id = `HANDOFF-SESSION-${day}`; break;
    }
    case "task":
      file = declaredPath(type) || `handoffs/task/HANDOFF-TASK-${taskId}.md`;
      id = `HANDOFF-TASK-${taskId}`; break;
    default: return null;
  }
  return { dir: path.dirname(file), id, file };
}

// A placeholder-rich body. Fill the (fill in) blocks with real prose — the next
// agent resumes from this file; a stub transfers nothing (discipline, not a gate).
function body(t, type) {
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

// Materialise each declared handoff artifact. We write ONLY the files here —
// state.json.handoff_queue[] is now derived from handoffs/ by render-state.mjs,
// so there is no state to mutate. The queue entry appears on the next render.
let createdCount = 0;
for (const type of types) {
  const t = targetFor(type);
  if (!t) { console.error(`[handoff] unknown type '${type}' — skipping.`); continue; }
  fs.mkdirSync(t.dir, { recursive: true });
  if (!fs.existsSync(t.file)) {
    fs.writeFileSync(t.file, body(t, type));
    console.log(`[handoff] wrote ${t.file}`);
    createdCount++;
  } else {
    console.log(`[handoff] exists, left intact: ${t.file}`);
  }
}

console.log(`[handoff] ${createdCount} artifact(s) written. state.handoff_queue is derived — run \`os render\`.`);
