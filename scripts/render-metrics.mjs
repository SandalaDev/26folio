#!/usr/bin/env node
// Aggregate dated session evidence and sanitized operation telemetry. Feature
// uses and opportunities are always measured over the same observation window.
import fs from "node:fs";
import { transaction } from "./runtime.mjs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import YAML from "yaml";
import { FEATURES, THRESHOLDS, classify, featureForEvent } from "./os-feature-registry.mjs";
import { resolveTaskHistory } from "./task-history.mjs";

const MIN_N = 5;
const readJson = file => { try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return null; } };
const readJsonl = file => fs.existsSync(file) ? fs.readFileSync(file, "utf8").split(/\r?\n/)
  .filter(Boolean).map(line => { try { return JSON.parse(line); } catch { return null; } }).filter(Boolean) : [];
const rate = (n, d) => d > 0 ? Math.round((n / d) * 100) : null;
const timestamp = value => { const date = new Date(value); return Number.isFinite(date.getTime()) ? date.getTime() : null; };
const rowTimestamp = row => timestamp(row.ended || row.started || row.ts || row.created_at || row.completed_at);
const inWindow = (value, start, end) => value != null && value >= start && value <= end;
const operationOf = event => event.action || event.cmd || null;
const isOperation = event => event?.type !== "observation-start" && operationOf(event);

export function dispatcherCommands(root = process.cwd()) {
  const source = fs.readFileSync(path.join(root, "scripts/os.sh"), "utf8");
  const block = source.slice(source.indexOf("dispatch() {"), source.indexOf("\n}\n\n# Normalize", source.indexOf("dispatch() {")));
  const commands = new Set();
  for (const match of block.matchAll(/^\s{2}([a-z][a-z|-]*)\)/gm)) {
    for (const command of match[1].split("|")) commands.add(command);
  }
  return [...commands].sort();
}

const TRUNK = new Set(["main", "dev", "none", ""]);
function minutesOf(row) {
  if (Number.isFinite(+row.duration_min)) return +row.duration_min;
  const start = timestamp(row.started), end = timestamp(row.ended);
  return start != null && end != null && end >= start ? (end - start) / 60000 : null;
}
function frontmatterDate(file) {
  try {
    const match = fs.readFileSync(file, "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const fm = YAML.parse(match?.[1] || "") || {};
    return rowTimestamp(fm);
  } catch { return null; }
}
function datedFiles(root, relativeDir, accept = () => true) {
  const dir = path.join(root, relativeDir);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(name => name.endsWith(".md") && accept(name))
    .map(name => ({ file: name, at: frontmatterDate(path.join(dir, name)) }));
}
function alignedCount(rows, predicate, start, end, date = rowTimestamp) {
  const eligible = rows.filter(predicate);
  if (eligible.some(row => date(row) == null)) return null;
  return eligible.filter(row => inWindow(date(row), start, end)).length;
}

// Unknown is intentional: an undated opportunity could fall on either side of
// the observation boundary, so no underuse/overuse conclusion is defensible.
export function opportunityDenominators(root, ledger, state, window = {}) {
  const start = timestamp(window.start), end = timestamp(window.end);
  if (start == null || end == null || end < start) return Object.fromEntries(Object.keys({
    session: 0, "task-session": 0, "long-session": 0, "completed-task": 0,
    "handoff-event": 0, "dependency-plan": 0, "feature-branch": 0, unknown: 0,
  }).map(key => [key, null]));

  let completedTask = null;
  try {
    const done = resolveTaskHistory(root).tasks.filter(task => task.done);
    completedTask = done.some(task => timestamp(task.completedAt) == null) ? null
      : done.filter(task => inWindow(timestamp(task.completedAt), start, end)).length;
  } catch { completedTask = null; }

  const crashes = ledger.filter(row => row.status === "crashed");
  const handoffs = datedFiles(root, "handoffs/session");
  const handoffEvent = crashes.some(row => rowTimestamp(row) == null) || handoffs.some(row => row.at == null) ? null
    : crashes.filter(row => inWindow(rowTimestamp(row), start, end)).length
      + handoffs.filter(row => inWindow(row.at, start, end)).length;
  const plans = datedFiles(root, "planning/dependencies", name => name !== "README.md");

  return {
    session: alignedCount(ledger, row => row.status === "completed", start, end),
    "task-session": alignedCount(ledger, row => row.task && row.task !== "none", start, end),
    "long-session": alignedCount(ledger, row => (minutesOf(row) ?? -1) >= THRESHOLDS.longSessionMinutes, start, end),
    "completed-task": completedTask,
    "handoff-event": handoffEvent,
    "dependency-plan": plans.some(row => row.at == null) ? null : plans.filter(row => inWindow(row.at, start, end)).length,
    "feature-branch": alignedCount(ledger, row => row.branch && !TRUNK.has(row.branch), start, end),
    unknown: null,
  };
}

export function featureUtilization(root, events, ledger, state) {
  const operations = events.filter(isOperation);
  const datedOperations = operations.filter(event => timestamp(event.ts) != null);
  const globalStart = datedOperations.length ? Math.min(...datedOperations.map(event => timestamp(event.ts))) : null;
  const globalEnd = datedOperations.length ? Math.max(...datedOperations.map(event => timestamp(event.ts))) : null;
  const markers = new Map(events.filter(event => event.type === "observation-start" && timestamp(event.ts) != null)
    .map(event => [event.feature, timestamp(event.ts)]));
  const denominatorCache = new Map();
  const denominatorFor = (start, end, type) => {
    const key = `${start}|${end}`;
    if (!denominatorCache.has(key)) denominatorCache.set(key, opportunityDenominators(root, ledger, state, { start, end }));
    return denominatorCache.get(key)[type];
  };

  const features = FEATURES.map(feature => {
    const allUsed = operations.filter(event => featureForEvent(event)?.id === feature.id);
    const earliestUse = allUsed.map(event => timestamp(event.ts)).filter(value => value != null).sort((a, b) => a - b)[0] ?? null;
    const start = feature.observationPolicy === "log-start" ? globalStart : (markers.get(feature.id) ?? earliestUse);
    const used = allUsed.filter(event => inWindow(timestamp(event.ts), start, globalEnd))
      .sort((a, b) => String(a.ts).localeCompare(String(b.ts)));
    const invalidUseDates = allUsed.some(event => timestamp(event.ts) == null);
    const uses = used.length;
    const failures = used.filter(event => Number(event.exit) !== 0).length;
    const sessionsWithUse = new Set(used.map(event => event.session).filter(value => value && value !== "none")).size;
    const opportunities = invalidUseDates || start == null || globalEnd == null ? null
      : denominatorFor(start, globalEnd, feature.opportunity);
    const verdict = classify(feature, { uses, failures, sessionsWithUse, opportunities }, THRESHOLDS);
    return {
      id: feature.id, commands: feature.commands, pruneable: feature.pruneable, automatable: feature.automatable,
      opportunity: feature.opportunity, introducedAt: feature.introducedAt, observationPolicy: feature.observationPolicy,
      observationStart: start == null ? null : new Date(start).toISOString(),
      observationEnd: globalEnd == null ? null : new Date(globalEnd).toISOString(),
      observationEvents: used.length, uses, failures, successes: uses - failures, sessionsWithUse,
      lastUsed: used.at(-1)?.ts || null, opportunities, opportunityKnown: opportunities != null,
      utilization: opportunities > 0 ? Math.round((uses / opportunities) * 100) : null,
      usesPerSession: sessionsWithUse > 0 ? Math.round((uses / sessionsWithUse) * 10) / 10 : null,
      maxUsesPerOpportunity: feature.maxUsesPerOpportunity,
      repetition: verdict.repetition, automationCandidate: verdict.automationCandidate,
      classification: verdict.classification, rationale: verdict.rationale,
    };
  });
  return { features, thresholds: THRESHOLDS, globalStart, globalEnd };
}

export function repeatedSequences(events, minRepeats = 3) {
  const bySession = new Map();
  for (const event of events.filter(isOperation)) {
    if (!event.session || event.session === "none") continue;
    if (!bySession.has(event.session)) bySession.set(event.session, []);
    bySession.get(event.session).push(event);
  }
  const bigrams = new Map();
  for (const rows of bySession.values()) {
    const seen = new Set();
    const ordered = rows.sort((a, b) => String(a.ts).localeCompare(String(b.ts)));
    for (let i = 0; i + 1 < ordered.length; i++) {
      const key = `${operationOf(ordered[i])} -> ${operationOf(ordered[i + 1])}`;
      if (!key.includes("null")) seen.add(key);
    }
    for (const key of seen) bigrams.set(key, (bigrams.get(key) || 0) + 1);
  }
  return [...bigrams.entries()].filter(([, count]) => count >= minRepeats)
    .sort((a, b) => b[1] - a[1]).map(([sequence, count]) => ({ sequence, count }));
}

export function loadMetricsModel(root = process.cwd(), snapshot = null) {
  const ledger = readJsonl(path.join(root, "project-state/ledger.jsonl"));
  const events = readJsonl(path.join(root, "project-state/commands.jsonl"));
  const state = snapshot || readJson(path.join(root, "project-state/state.json")) || {};
  const key = row => `${row.harness} · ${row.model} · ${row.role}`;
  const aggregate = new Map();
  for (const row of ledger) {
    const k = key(row), item = aggregate.get(k) || { harness: row.harness, model: row.model, role: row.role, sessions: 0, gate_pass: 0, gate_fail: 0, mins: 0, dated: 0, crashed: 0 };
    item.sessions++; if (row.status === "crashed") item.crashed++;
    if (["pass", "ok"].includes(row.gate)) item.gate_pass++;
    if (["fail", "warn"].includes(row.gate)) item.gate_fail++;
    const mins = minutesOf(row); if (mins != null) { item.mins += mins; item.dated++; }
    aggregate.set(k, item);
  }
  const combos = [...aggregate.values()].map(item => ({ ...item, graded: item.gate_pass + item.gate_fail,
    gate_pass_rate: rate(item.gate_pass, item.gate_pass + item.gate_fail),
    avg_session_min: item.dated ? Math.round(item.mins / item.dated) : null, low_n: item.sessions < MIN_N }));
  const operations = [...new Set(FEATURES.flatMap(feature => feature.commands))].sort();
  const commandEvents = events.filter(isOperation);
  const commands = operations.map(command => {
    const used = commandEvents.filter(event => operationOf(event) === command).sort((a, b) => String(a.ts).localeCompare(String(b.ts)));
    return { command, uses: used.length, lastUsed: used.at(-1)?.ts || null,
      failures: used.filter(event => Number(event.exit) !== 0).length, signal: used.length ? "observed" : "not observed" };
  });
  const totals = ledger.reduce((out, row) => {
    out.sessions++; if (row.status === "crashed") out.crashed++; if (row.status === "completed") out.completed++;
    if (["pass", "ok"].includes(row.gate)) out.gate_pass++; if (["fail", "warn"].includes(row.gate)) out.gate_fail++;
    if (row.task && row.task !== "none") out.attributed++;
    if (row.harness && row.harness !== "unknown") out.knownHarness++;
    if (row.model && row.model !== "unknown") out.knownModel++;
    return out;
  }, { sessions: 0, completed: 0, crashed: 0, gate_pass: 0, gate_fail: 0, attributed: 0, knownHarness: 0, knownModel: 0 });
  const ended = totals.completed + totals.crashed;
  const created = Number(state.counts?.handoffs_pending || 0) + Number(state.counts?.handoffs_consumed || 0);
  const resolved = Number(state.counts?.handoffs_consumed || 0);
  const pending = Number(state.counts?.handoffs_pending || 0);
  const health = {
    taskAttribution: { numerator: totals.attributed, denominator: totals.sessions, percent: rate(totals.attributed, totals.sessions) },
    cleanEnds: { numerator: totals.completed, denominator: ended, percent: rate(totals.completed, ended), crashed: totals.crashed },
    handoffs: { created, pending, resolved },
    knownIdentity: { harness: totals.knownHarness, model: totals.knownModel, denominator: totals.sessions,
      harnessPercent: rate(totals.knownHarness, totals.sessions), modelPercent: rate(totals.knownModel, totals.sessions) },
  };
  const utilization = featureUtilization(root, events, ledger, state);
  return { updated: new Date().toISOString(), min_n: MIN_N, totals, combos, commands, health,
    commandObservation: { events: commandEvents.length,
      markers: events.filter(event => event.type === "observation-start").length,
      start: utilization.globalStart == null ? null : new Date(utilization.globalStart).toISOString(),
      end: utilization.globalEnd == null ? null : new Date(utilization.globalEnd).toISOString() },
    features: utilization.features, classificationThresholds: utilization.thresholds,
    repeatedSequences: repeatedSequences(events) };
}

const percent = value => value == null ? "unavailable" : `${value}%`;
export function renderMetrics(root = process.cwd()) {
  const model = loadMetricsModel(root), output = path.join(root, "project-state/metrics.md");
  const h = model.health;
  const handoffRow = h.handoffs.created ? `| Handoffs | ${h.handoffs.pending} pending · ${h.handoffs.resolved} resolved |\n` : "";
  const featureRows = model.features.map(item => `| \`${item.id}\` | ${item.uses} | ${item.opportunityKnown ? item.opportunities : "unknown"} | ${item.observationStart || "not started"} | ${item.repetition.status} | ${item.automationCandidate ? "candidate" : "no"} | ${item.classification} |`).join("\n");
  const commandRows = model.commands.map(item => `| \`${item.command}\` | ${item.uses} | ${item.lastUsed || "never"} | ${item.failures} |`).join("\n");
  const comboRows = model.combos.map(item => `| ${item.harness} | ${item.model} | ${item.role} | ${item.sessions} | ${item.gate_pass_rate ?? "—"}% | ${item.avg_session_min ?? "—"} | ${item.crashed} |`).join("\n");
  fs.writeFileSync(output, `<!-- generated — do not edit; sources: state, ledger, sanitized operation events, backlog -->
# Agent OS Metrics
Directional local evidence. Uses and opportunities share each feature's dated observation window.

## OS health
| Signal | Evidence |
|---|---|
| Task attribution | ${percent(h.taskAttribution.percent)} (${h.taskAttribution.numerator}/${h.taskAttribution.denominator} sessions) |
| Clean ends | ${percent(h.cleanEnds.percent)} (${h.cleanEnds.numerator}/${h.cleanEnds.denominator}; ${h.cleanEnds.crashed} crashed) |
${handoffRow}| Known harness / model | ${percent(h.knownIdentity.harnessPercent)} / ${percent(h.knownIdentity.modelPercent)} |

## Feature utilization
Nothing is pruned or automated automatically. Unknown or unaligned denominators abstain from underuse and overuse conclusions.
| Feature | Uses | Opportunities | Observed since | Repetition | Automation | Classification |
|---|---:|---:|---|---|---|---|
${featureRows}

## Command utilization
| Operation | Uses | Last used | Failures |
|---|---:|---|---:|
${commandRows}

Observation window: ${model.commandObservation.start || "not started"} to ${model.commandObservation.end || "not started"}; ${model.commandObservation.events} operation event(s).

## By harness · model · role
| Harness | Model | Role | Sessions | Sanity ok rate | Avg session min | Crashed |
|---|---|---|---:|---|---:|---:|
${comboRows || "| — | — | — | 0 | — | — | 0 |"}
`);
  const stateFile = path.join(root, "project-state/state.json");
  if (fs.existsSync(stateFile) && process.env.OS_RENDER_SNAPSHOT !== "1") {
    transaction(root, state => { state.metrics = model; });
  }
  console.log(`[metrics] aggregated ${model.totals.sessions} sessions and ${model.commandObservation.events} operation event(s) -> project-state/metrics.md`);
  return model;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) renderMetrics();
