#!/usr/bin/env node
// Assemble the incoming agent packet from intent, task, handoffs and workflow.
import fs from "node:fs";
import path from "node:path";
import { execFileSync, execSync } from "node:child_process";
import { nextAction } from "./workflow.mjs";

const STATE = "project-state/state.json";
const exists = (p) => fs.existsSync(p);
const sh = (cmd) => { try { return execSync(cmd, { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] }).trim(); } catch { return ""; } };
const readJson = (p) => { try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return null; } };
const MAX_AC_LINES = 30;

// 1. Context briefing. context.mjs exits 1 with a useful hint when the spine
// isn't hydrated — print whatever it says, either way.
function briefing() {
  try {
    return execFileSync(process.execPath, ["scripts/context.mjs"], { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
  } catch (e) {
    return ((e.stderr || e.stdout || "").toString().trim()) || "(context unavailable)";
  }
}

// 2. Active task + acceptance criteria (bounded).
function taskSection(state) {
  const id = state?.current?.task;
  if (!id) return "  (no task claimed — claim one with: os claim <TASK-XXX>)";
  for (const dir of ["backlog/tasks", "backlog/done"]) {
    const file = `${dir}/${id}.md`;
    if (!exists(file)) continue;
    const body = fs.readFileSync(file, "utf8").replace(/^---[\s\S]*?---\s*/, "");
    let ac = body.match(/^##\s+Acceptance Criteria[^\n]*\n([\s\S]*?)(?=^##\s)/m)?.[1];
    if (!ac) ac = body.match(/^##\s+Acceptance Criteria[^\n]*\n([\s\S]*)$/m)?.[1];
    const lines = (ac || "").trim().split("\n").slice(0, MAX_AC_LINES);
    return [
      `  task: ${id} — ${file}`,
      lines.length && lines[0] ? "  acceptance criteria:" : "  (no Acceptance Criteria section)",
      ...lines.map(l => `  ${l}`),
    ].join("\n");
  }
  return `  task: ${id} — (no file in backlog/tasks or backlog/done)`;
}

// 3. Pending handoffs (the archive is the consumed path — excluded).
function handoffSection() {
  const root = "handoffs";
  if (!exists(root)) return "  none";
  const files = [];
  for (const dir of fs.readdirSync(root)) {
    if (dir === "archive") continue;
    const sub = path.join(root, dir);
    if (!fs.statSync(sub).isDirectory()) continue;
    for (const f of fs.readdirSync(sub).filter(x => x.endsWith(".md")))
      files.push(path.join(sub, f).replace(/\\/g, "/"));
  }
  if (!files.length) return "  none";
  return [
    ...files.sort().map(f => `  ${f}`),
    "  → read each in full; move to handoffs/archive/ once consumed",
  ].join("\n");
}

// 4. Git sync state: what tree is the new agent inheriting?
function gitSection() {
  const branch = sh("git symbolic-ref --short -q HEAD") || "(detached)";
  const porcelain = sh("git status --porcelain");
  const dirty = porcelain ? porcelain.split("\n").length : 0;
  const dirtyPreview = porcelain.split("\n").filter(Boolean).slice(0, 8).map(l => `    ${l}`).join("\n");
  const unpushed = sh("git rev-list --count @{u}..HEAD");
  const unpushedText = unpushed === "" ? "no upstream" : `${unpushed} commit(s)`;
  const lines = [`  branch: ${branch} · uncommitted: ${dirty} file(s) · unpushed: ${unpushedText}`];
  if (dirtyPreview) lines.push(dirtyPreview, dirty > 8 ? `    …and ${dirty - 8} more` : "");
  return lines.filter(Boolean).join("\n");
}

// 5. Next action — the same decision ladder the dashboard's next-step card uses.
function nextSection(state) {
  try {
    const next = nextAction(process.cwd(), state || {});
    return [`  [${next.owner}] ${next.command}`, `  ${next.why}`].join("\n");
  } catch {
    return "  (next step unavailable — see dashboard.html)";
  }
}

const state = readJson(STATE);
console.log([
  "",
  "═══ Onboarding packet ═══",
  "",
  "── 1. Briefing (os context) " + "─".repeat(32),
  briefing(),
  "",
  "── 2. Active task " + "─".repeat(41),
  taskSection(state),
  "",
  "── 3. Pending handoffs " + "─".repeat(36),
  handoffSection(),
  "",
  "── 4. Git sync state " + "─".repeat(38),
  gitSection(),
  "",
  "── 5. Next action " + "─".repeat(41),
  nextSection(state),
  "",
  "Reference: AGENTS.md (law) · decisions.md (why) · OPERATING_MANUAL.md (deep reference).",
  "Do NOT read: dashboard.html / guide.html (generated views) · ledger.jsonl (forensics only).",
  "",
].join("\n"));
