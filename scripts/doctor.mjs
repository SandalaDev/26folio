#!/usr/bin/env node
// doctor.mjs — system health check for `os doctor`.
//
// Catches the two classes of decay this OS suffers from:
//   1. ENVIRONMENT drift — node/yaml missing, hooks not wired, identity unset,
//      broken hooks. These silently degrade the OS's memory guarantees.
//   2. SELF-drift — the docs advertise commands that don't exist (the
//      'rotate-log' bug), reference files nothing writes (the 'decisions.md'
//      bug), or scripts referenced in the header aren't in the case dispatch.
// The OS is its own first user; this applies its doctrine to itself.
//
// Exits 0 if healthy, 1 if any check fails. Each failure names the one fix.
import fs from "node:fs";
import { execSync } from "node:child_process";

// Load yaml once via dynamic import (this is an ESM .mjs file; require() is not
// available). Stored module-scope so every section that needs to parse
// frontmatter shares one load. `null` if the dependency is missing.
let yaml = null;
try { const m = await import("yaml"); yaml = m.default ?? m; }
catch { /* reported in the dependencies section below */ }

let fail = 0;
const ok = (msg) => console.log(`  ✓ ${msg}`);
const bad = (msg, fix) => { console.log(`  ✗ ${msg}`); if (fix) console.log(`      fix: ${fix}`); fail = 1; };
const section = (t) => console.log(`\n── ${t}`);

// ── 1. Dependencies ─────────────────────────────────────────────────────────
section("dependencies");
try {
  if (execSync("node -v", { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] }).trim()) ok("node present");
} catch { bad("node not on PATH", "install Node.js"); }
if (yaml) ok("yaml dependency installed");
else bad("yaml dependency missing", "run: npm install yaml");
try {
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  const lock = JSON.parse(fs.readFileSync("package-lock.json", "utf8"));
  if (pkg.dependencies?.yaml === "2.9.0"
      && lock.packages?.[""]?.dependencies?.yaml === "2.9.0"
      && lock.packages?.["node_modules/yaml"]?.version === "2.9.0") {
    ok("reviewed OS dependency yaml@2.9.0 is pinned in manifest + lockfile");
  } else {
    bad("OS yaml dependency is not pinned to reviewed 2.9.0", "run the OpenSrc dependency evidence workflow before changing it");
  }
} catch {
  bad("cannot inspect package manifest/lockfile", "restore package.json and package-lock.json");
}
if (fs.existsSync("scripts/deps.mjs")
    && fs.existsSync("docs/dependencies/os-runtime.md")
    && fs.existsSync(".agents/skills/opensrc-research/SKILL.md")) {
  ok("OpenSrc dependency evidence machinery present");
} else {
  bad("OpenSrc dependency evidence machinery incomplete", "restore deps.mjs, the baseline, and opensrc-research skill");
}

// ── 2. Identity env (informational — auto-derived at os start when unset) ────
section("identity");
const h = process.env.HARNESS_NAME, mdl = process.env.MODEL_NAME, r = process.env.AGENT_ROLE;
if (h && mdl) ok(`identity set: ${h}/${mdl} (${r || "executor"})`);
else console.log("  identity env unset — os start auto-derives the harness (optional to set)");

// ── 3. Hooks wired ──────────────────────────────────────────────────────────
section("hooks");
try {
  const hp = execSync("git config core.hooksPath", { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] }).trim();
  if (hp && fs.existsSync(`${hp}/pre-push`)) ok(`hooksPath = ${hp}, pre-push present`);
  else bad("core.hooksPath not set or pre-push missing", "run: git config core.hooksPath .githooks");
} catch { bad("not a git repo (can't check hooks)", "run from the repo root"); }

// ── 4. Sanity-check machinery present; pre-push is trunk-guard-only ─────────
section("sanity checks");
if (fs.existsSync("scripts/verify.sh") && fs.existsSync("scripts/validate-task.mjs")) {
  ok("verify.sh + validate-task.mjs present (advisory sanity checks)");
} else {
  bad("sanity-check machinery incomplete (verify.sh or validate-task.mjs missing)", "run update-from-template.sh");
}
// The OS is non-blocking by design: pre-push must ONLY guard the trunk, never
// run quality checks. A verify.sh call in the hook is drift back to gating.
try {
  const pp = fs.readFileSync(".githooks/pre-push", "utf8");
  if (/verify\.sh/.test(pp)) bad("pre-push calls verify.sh — the OS is non-blocking by design", "reduce pre-push to the trunk guard only");
  else ok("pre-push is trunk-guard only (non-blocking)");
} catch { /* pre-push missing already reported above */ }

// ── 5. Spine hydration status (informational, not a failure) ────────────────
section("spine");
const fm = (f) => { if (!fs.existsSync(f)) return null; const m = fs.readFileSync(f, "utf8").match(/^---[\s\S]*?status:\s*(\S+)/); return m ? m[1] : "unknown"; };
const bs = fm("project-spine/00-brief.md"), is = fm("project-spine/00-interview.md");
const ch = fs.existsSync("project-spine/01-charter.md");
console.log(`  brief: ${bs || "(absent)"} · interview: ${is || "(absent)"} · charter: ${ch ? "present" : "(absent)"}`);
if (!bs) console.log("      next: bash scripts/intake.sh brief");

// ── 6. Self-drift: advertised os.sh subcommands actually exist ───────────────
section("self-drift (commands)");
try {
  const os = fs.readFileSync("scripts/os.sh", "utf8");
  // The header line lists advertised subcommands.
  const hdr = os.match(/^# Subcommands:\s*(.+)$/m);
  if (hdr) {
    // Extract tokens like start|end|checkpoint|... from the header.
    const advertised = hdr[1].split("|").map(s => s.trim().split(/\s+/)[0]).filter(Boolean);
    // The case dispatch is the source of truth.
    const caseBlock = os.match(/case "\$\{1:-help\}" in[\s\S]*?esac/);
    const dispatched = caseBlock ? caseBlock[0] : "";
    for (const cmd of advertised) {
      if (new RegExp(`^\\s*${cmd}\\)`, "m").test(dispatched)) ok(`os ${cmd}`);
      else bad(`os ${cmd} advertised in header but not in case dispatch`, `add '${cmd})' to the case block, or drop it from the header`);
    }
  }
} catch { bad("could not read scripts/os.sh for self-drift check", ""); }

// ── 7. Self-drift: referenced memory files have a writer ───────────────────
section("self-drift (memory files)");
// decisions.md must be writable (os decide) — check the writer exists.
if (fs.existsSync("scripts/os.sh") && /cmd_decide/.test(fs.readFileSync("scripts/os.sh", "utf8"))) {
  ok("decisions.md has a writer (os decide)");
} else {
  bad("decisions.md is advertised but has no writer (os decide missing)", "add cmd_decide or drop the reference");
}

// ── 8. Self-drift: derived state fields match their filesystem source ───────
// Phase 3a: state.epics projects backlog/epics/*.md, state.handoff_queue
// projects handoffs/**/*.md, and state.completion projects
// project-state/completion.md. If someone hand-edits any away from the derived
// value, that's exactly the drift derivation exists to prevent. Each scan-based
// check runs only when its source dir exists; completion.md is checked whenever
// it exists. All need yaml (reported above if missing).
section("state derivation");
const EPICS_DIR = "backlog/epics";
const HANDOFFS_DIR = "handoffs";
const COMPLETION_FILE = "project-state/completion.md";
const haveEpics = fs.existsSync(EPICS_DIR);
const haveHandoffs = fs.existsSync(HANDOFFS_DIR);
const haveCompletion = fs.existsSync(COMPLETION_FILE);
if (!haveEpics && !haveHandoffs && !haveCompletion) {
  console.log("  (no backlog/epics/, handoffs/, or completion.md — nothing to derive yet)");
} else if (!yaml) {
  bad("cannot verify state derivation (yaml unavailable)", "run: npm install yaml");
} else {
  try {
    const fmOf = (file) => {
      const src = fs.readFileSync(file, "utf8");
      const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!m) return {};
      try { return yaml.parse(m[1]) ?? {}; } catch { return {}; }
    };
    const state = JSON.parse(fs.readFileSync("project-state/state.json", "utf8"));

    if (haveEpics) {
      const derived = fs.readdirSync(EPICS_DIR).filter(f => f.endsWith(".md"))
        .map(f => fmOf(`${EPICS_DIR}/${f}`))
        .filter(e => e.id != null && e.id !== "")
        .map(e => ({ id: String(e.id), title: e.title ?? null, status: e.status ?? null }))
        .sort((a, b) => a.id.localeCompare(b.id));
      const sig = (arr) => (arr || []).map(e => `${e.id}|${e.title ?? ""}|${e.status ?? ""}`).sort().join("\n");
      if (sig(state.epics) === sig(derived)) ok(`state.epics matches backlog/epics/ (${derived.length} epic(s))`);
      else bad(`state.epics drifts from backlog/epics/ (state ${(state.epics || []).length} vs derived ${derived.length})`, "run `os render` to re-derive from the filesystem");
    }

    if (haveHandoffs) {
      const derived = [];
      for (const dir of fs.readdirSync(HANDOFFS_DIR)) {
        const sub = `${HANDOFFS_DIR}/${dir}`;
        if (!fs.statSync(sub).isDirectory()) continue;
        for (const f of fs.readdirSync(sub).filter(x => x.endsWith(".md"))) {
          const fm = fmOf(`${sub}/${f}`);
          if (fm.id == null || fm.id === "") continue;
          derived.push({ id: String(fm.id), status: "pending" });
        }
      }
      const hsig = (arr) => (arr || []).map(h => `${h.id}|${h.status ?? "pending"}`).sort().join("\n");
      if (hsig(state.handoff_queue) === hsig(derived)) ok(`state.handoff_queue matches handoffs/ (${derived.length} entr${derived.length === 1 ? "y" : "ies"})`);
      else bad(`state.handoff_queue drifts from handoffs/ (state ${(state.handoff_queue || []).length} vs derived ${derived.length})`, "run `os render` to re-derive from the filesystem");
    }

    if (haveCompletion) {
      const fm = fmOf(COMPLETION_FILE);
      const list = (v) => Array.isArray(v) ? v : (v == null || v === "" ? [] : [v]);
      const derived = {
        summary: fm.summary ?? "", done: list(fm.done),
        remaining: list(fm.remaining), blocked: fm.blocked ?? "none",
      };
      const csig = (c) => `summary=${c?.summary ?? ""}|done=${(c?.done || []).join(",")}|remaining=${(c?.remaining || []).join(",")}|blocked=${c?.blocked ?? "none"}`;
      if (csig(state.completion) === csig(derived)) ok("state.completion matches project-state/completion.md");
      else bad("state.completion drifts from project-state/completion.md", "run `os render` to re-derive from the file");
    }
  } catch (e) {
    bad(`could not verify state derivation (${e.message})`, "run `os render`");
  }
}

console.log("");
if (fail) { console.log("[doctor] ✗ issues found — see above."); process.exit(1); }
console.log("[doctor] ✓ healthy.");
