#!/usr/bin/env node
// effort.mjs — estimate where effort actually goes, from data the OS already
// collects. A view: it reads the ledger and task files, never writes state.
//
// No new tracking burden: sessions are already logged to ledger.jsonl with a
// task id and duration, and tasks carry a planned progress_weight. We aggregate
// those into three signals the dashboard surfaces:
//   1. longest tasks        (where the effort went, incl. retries/thrash)
//   2. estimation calibration (planned weight vs observed time)
//   3. quick wins           (cheapest ready task to pick up next)
//
// Honesty over confidence: miss flags are suppressed until enough tasks have
// completed to form a baseline (n < MIN_N). minutes come from duration_min when
// numeric, else ended-started, else are unknown (counted, never summed).
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import YAML from "yaml";

const MIN_N = 5; // match render-metrics.mjs low-confidence threshold
const BASENAME = (value) => path.basename(String(value || ""), ".md");

function readLedgerRows(root) {
  const file = path.join(root, "project-state/ledger.jsonl");
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, "utf8").split(/\r?\n/).filter(Boolean)
    .map(line => { try { return JSON.parse(line); } catch { return null; } })
    .filter(Boolean);
}

// Four shapes in the wild: a path (os end <path>), a bare id (crash rows), the
// string "none", or absent. Map the last two to the unattributed bucket.
function normalizeTaskId(raw) {
  const s = (raw == null ? "" : String(raw)).trim();
  if (!s || s === "none") return "unattributed";
  return BASENAME(s) || "unattributed";
}

// duration_min may be an integer, the string "unknown", or absent. Prefer the
// field; fall back to ended-started; else null.
function minutesOf(row) {
  if (Number.isFinite(+row.duration_min)) return +row.duration_min;
  if (row.started && row.ended) {
    const dt = (new Date(row.ended) - new Date(row.started)) / 60000;
    if (Number.isFinite(dt) && dt >= 0) return dt;
  }
  return null;
}

function frontmatter(file) {
  if (!fs.existsSync(file)) return {};
  const match = fs.readFileSync(file, "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  try { return YAML.parse(match[1]) ?? {}; } catch { return {}; }
}

function readTasks(root) {
  const map = new Map();
  for (const dir of ["backlog/tasks", "backlog/done"]) {
    const full = path.join(root, dir);
    if (!fs.existsSync(full)) continue;
    for (const name of fs.readdirSync(full)) {
      if (!name.endsWith(".md")) continue;
      const fm = frontmatter(path.join(full, name));
      const id = String(fm.id || path.basename(name, ".md"));
      map.set(id, {
        id,
        title: fm.title || id,
        epic_ref: fm.epic_ref || null,
        weight: Number(fm.progress_weight) > 0 ? Number(fm.progress_weight) : 1,
        status: fm.status || "unknown",
        priority: fm.priority || "P2",
        done: dir.endsWith("done"),
      });
    }
  }
  return map;
}

const priorityRank = (p) => { const n = Number(String(p || "P2").replace(/[^0-9]/g, "")); return Number.isFinite(n) ? n : 2; };

export function loadEffortModel(root = process.cwd()) {
  const rows = readLedgerRows(root);
  const tasks = readTasks(root);

  // Aggregate ledger rows per normalized task id.
  const agg = new Map();
  let unattributed = { minutes: 0, sessions: 0 };
  for (const r of rows) {
    const id = normalizeTaskId(r.task);
    const min = minutesOf(r);
    if (id === "unattributed") {
      unattributed.sessions++;
      if (min != null) unattributed.minutes += min;
      continue;
    }
    let a = agg.get(id);
    if (!a) { a = { id, totalMin: 0, sessions: 0, crashed: 0, gateFails: 0, lastTouched: null }; agg.set(id, a); }
    a.sessions++;
    if (r.status === "crashed") a.crashed++;
    if (r.gate === "fail" || r.gate === "warn") a.gateFails++;
    if (min != null) a.totalMin += min;
    if (r.ended && (!a.lastTouched || r.ended > a.lastTouched)) a.lastTouched = r.ended;
  }

  // Join with task files; tasks with no file still surface (renamed/deleted).
  const perTask = [...agg.entries()].map(([id, a]) => {
    const t = tasks.get(id);
    return {
      id,
      title: t ? t.title : `${id} (no file)`,
      epic: t ? BASENAME(t.epic_ref) : null,
      weight: t ? t.weight : 1,
      status: t ? t.status : "unknown",
      done: t ? t.done : false,
      noFile: !t,
      ...a,
    };
  });

  // Baseline: minutes per weight unit across tasks with a real file, known
  // effort, and a positive weight. Suppressed below MIN_N tasks.
  let baseMin = 0, baseWeight = 0, baseN = 0;
  for (const t of perTask) {
    if (t.noFile || t.totalMin <= 0 || !t.weight) continue;
    baseMin += t.totalMin;
    baseWeight += t.weight;
    baseN++;
  }
  const baselineMinPerWeight = baseWeight > 0 && baseN >= MIN_N ? baseMin / baseWeight : null;

  // Miss flag: observed time > 2x the weight-adjusted baseline. Only when a
  // baseline exists (honest silence before that).
  for (const t of perTask) {
    t.miss = baselineMinPerWeight != null && t.totalMin > 2 * (t.weight * baselineMinPerWeight);
    t.flag = t.miss ? "est. miss" : (t.crashed > 0 ? "thrash" : "");
  }

  const trackedMin = perTask.reduce((sum, t) => sum + t.totalMin, 0);
  const longest = [...perTask].sort((x, y) => y.totalMin - x.totalMin).slice(0, 5);

  const quickWins = [...tasks.values()]
    .filter(t => !t.done && t.status === "ready")
    .sort((x, y) => (x.weight - y.weight) || (priorityRank(x.priority) - priorityRank(y.priority)))
    .slice(0, 3)
    .map(t => ({ id: t.id, title: t.title, weight: t.weight }));

  return {
    trackedMin,
    longest,
    quickWins,
    calibration: { baselineMinPerWeight, n: baseN, lowN: baselineMinPerWeight == null },
    unattributed,
  };
}

// Helpers for the new-task.sh hint: print a human baseline line, or nothing.
function baselineLine() {
  const m = loadEffortModel();
  if (m.calibration.baselineMinPerWeight == null) return "";
  return `weight-1 tasks averaged ~${Math.round(m.calibration.baselineMinPerWeight)} min (n=${m.calibration.n})`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.includes("--baseline")) {
    const line = baselineLine();
    if (line) console.log(line);
  } else {
    process.stdout.write(JSON.stringify(loadEffortModel(), null, 2) + "\n");
  }
}
