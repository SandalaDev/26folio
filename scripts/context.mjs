#!/usr/bin/env node
// Build a bounded, intent-first session briefing.
import fs from "node:fs";
import { execSync } from "node:child_process";

const STATE = "project-state/state.json";
const CHARTER = "project-spine/01-charter.md";
const DECISIONS = "project-state/decisions.md";
const LEDGER = "project-state/ledger.jsonl";
const HARD_CAP = 3000; // ~3 KB ceiling on the whole briefing

const sh = (cmd) => { try { return execSync(cmd, { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] }).trim(); } catch { return ""; } };

// ── 1. North star: first real section of the charter ─────────────────────────
if (!fs.existsSync(CHARTER)) {
  console.error("[context] no charter at project-spine/01-charter.md — hydrate the lean context first.");
  console.error("           Run: bash scripts/os.sh interview start discovery; capture and confirm the conversation.");
  console.error("           See OPERATING_MANUAL.md → Interview operations.");
  process.exit(1);
}

function northStar() {
  const src = fs.readFileSync(CHARTER, "utf8").replace(/\r$/, "");
  // Drop frontmatter. The charter typically opens with an H1 title, then ## sections.
  const body = src.replace(/^---[\s\S]*?---\s*/, "");
  // Find the first ## section and capture its body up to the next ## heading.
  // 'm' flag so ^ matches line starts (the H1 title precedes the first ## section).
  // Lookahead is a line starting with ##, reached after the section's blank line(s).
  const m = body.match(/^##\s+[^\n]*\n([\s\S]*?)(?=^##\s)/m);
  let star = m ? m[1].trim() : "";
  // Fallback: if only one section (no terminator), take everything after the first ##.
  if (!star) {
    const idx = body.search(/^##\s/m);
    if (idx >= 0) star = body.slice(idx).replace(/^##\s+[^\n]*\n/, "").trim();
  }
  return star || "(charter's first section is empty — fill ## 1 in 01-charter.md)";
}

// ── 2-5. State facts ─────────────────────────────────────────────────────────
function stateFacts() {
  if (!fs.existsSync(STATE)) return "(no state.json)";
  let s; try { s = JSON.parse(fs.readFileSync(STATE, "utf8")); } catch { return "(state.json unreadable)"; }
  const c = s.current || {};
  const lines = [];
  lines.push("**Current:**");
  lines.push(`  task:   ${c.task || "(none claimed — run: os claim <TASK>)"}`);
  lines.push(`  branch: ${c.branch || "(none)"}`);
  lines.push(`  agent:  ${c.agent || "(none)"}`);

  // Top pending handoff.
  const q = (s.handoff_queue || []).filter(h => h && (h.status === "pending" || !h.status));
  if (q.length) {
    const h = q[0];
    lines.push(`  handoff: ${h.file || h.id || "(top of queue)"} [consume before starting]`);
  }

  // Last ledger row.
  if (fs.existsSync(LEDGER)) {
    const rows = fs.readFileSync(LEDGER, "utf8").trim().split("\n").filter(Boolean);
    if (rows.length) {
      try {
        const last = JSON.parse(rows[rows.length - 1]);
        lines.push(`  last:   ${last.status} (${last.task || "none"}, check ${last.gate || "?"}, ${last.duration_min ?? "?"} min)`);
      } catch { /* malformed row — skip */ }
    }
  }
  return lines.join("\n");
}

// ── 5. Caution note (advisory — nothing is enforced; reviews are manual, post-PR) ──
function dependencyFacts() {
  const dir = "planning/dependencies";
  if (!fs.existsSync(dir)) return "";
  let currentTask = "";
  try { currentTask = JSON.parse(fs.readFileSync(STATE, "utf8")).current?.task || ""; } catch { /* absent */ }
  const referenced = [];
  if (currentTask) {
    for (const taskDir of ["backlog/tasks", "backlog/done"]) {
      const task = `${taskDir}/${currentTask}.md`;
      if (!fs.existsSync(task)) continue;
      const body = fs.readFileSync(task, "utf8");
      referenced.push(...(body.match(/planning\/dependencies\/[A-Za-z0-9._-]+\.md/g) || []));
    }
  }
  const latest = fs.readdirSync(dir).filter(file => file.endsWith(".md"))
    .map(file => `${dir}/${file}`)
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  const selected = [...new Set([...referenced, ...latest])]
    .filter(file => fs.existsSync(file)).slice(0, 2);
  if (!selected.length) return "";
  const lines = ["**Dependency evidence (read before package or architecture changes):**"];
  for (const file of selected) {
    const source = fs.readFileSync(file, "utf8");
    const status = source.match(/^status:\s*["']?([^"'\r\n]+)/m)?.[1] || "unknown";
    const purpose = source.match(/^purpose:\s*["']?([^"'\r\n]+)/m)?.[1] || "dependency research";
    lines.push(`  ${file} [${status}] — ${purpose}`);
  }
  lines.push("  use opensrc-research; refresh source with: os deps path <exact-spec>");
  return lines.join("\n");
}

const DEPENDENCY = dependencyFacts();

const STOP = [
  "**Caution (advisory — flag these loudly in the PR description):**",
  "  schema · auth · billing · secrets · infrastructure · compliance copy",
  "  → the human reviews every PR manually; make risky changes easy to spot",
].join("\n");

// ── Assemble + cap ───────────────────────────────────────────────────────────
const out = [
  "# Session context",
  "",
  "## North star (the one job)",
  northStar(),
  "",
  stateFacts(),
  "",
  DEPENDENCY,
  DEPENDENCY ? "" : "",
  STOP,
  "",
  `Full reference: OPERATING_MANUAL.md · AGENTS.md · live state: project-state/state.json`,
  "",
].join("\n");

if (out.length <= HARD_CAP) {
  process.stdout.write(out);
} else {
  // Over cap: truncate the north star to fit, keep the facts.
  const overhead = out.length - HARD_CAP + 80; // 80 for the truncation notice
  const truncated = out.replace(northStar(), northStar().slice(0, Math.max(200, northStar().length - overhead)) + "\n…(truncated — see project-spine/01-charter.md for the full north star)");
  process.stdout.write(truncated.length <= HARD_CAP + 200 ? truncated : out.slice(0, HARD_CAP) + "\n…(hard-truncated)\n");
}
