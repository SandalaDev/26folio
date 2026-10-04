#!/usr/bin/env node
// Append one sanitized operation event. Callers pass registry-owned constants;
// this writer rejects unknown identifiers and never accepts command arguments.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { FEATURES, featureById } from "./os-feature-registry.mjs";

const [featureId, action, exitRaw, msRaw] = process.argv.slice(2);
const feature = featureById(featureId);
if (!feature || !feature.commands.includes(action)) process.exit(0);

const root = process.cwd();
const file = process.env.OS_COMMAND_LOG || path.join(root, "project-state/commands.jsonl");
const exit = Number(exitRaw);
const ms = Number(msRaw);
const harness = process.env.HARNESS_NAME || process.env.AGENT_NAME
  || (process.env.CLAUDECODE || process.env.CLAUDE_CODE ? "claude-code"
    : process.env.CODEX_ENVIRONMENT ? "codex"
      : process.env.ZCODE ? "zcode"
        : process.env.GEMINI_CLI ? "gemini-cli"
          : process.env.CURSOR_TRACE_ID ? "cursor"
            : process.env.OPENCODE ? "opencode" : "unknown");

let session = "none";
try {
  const lock = fs.readFileSync(path.join(root, "project-state/session.lock"), "utf8");
  const started = lock.match(/^started:\s*(.+)$/m)?.[1]?.trim();
  if (started) session = `s-${crypto.createHash("sha256").update(started).digest("hex").slice(0, 12)}`;
} catch { /* no active session */ }

const existing = fs.existsSync(file) ? fs.readFileSync(file, "utf8").split(/\r?\n/).filter(Boolean)
  .map(line => { try { return JSON.parse(line); } catch { return null; } }).filter(Boolean) : [];
const now = new Date().toISOString();
const markers = [];
for (const item of FEATURES.filter(candidate => candidate.observationPolicy === "marker")) {
  if (!existing.some(event => event.type === "observation-start" && event.feature === item.id)) {
    markers.push({ type: "observation-start", ts: now, feature: item.id, source: "telemetry-v2" });
  }
}
const event = { ts: now, feature: feature.id, action, exit: Number.isFinite(exit) ? exit : 1,
  ms: Number.isFinite(ms) && ms >= 0 ? ms : 0, harness: String(harness), session };
try {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.appendFileSync(file, [...markers, event].map(row => JSON.stringify(row)).join("\n") + "\n");
} catch { /* telemetry is non-blocking */ }
