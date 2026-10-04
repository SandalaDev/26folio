#!/usr/bin/env node
// release-baseline.mjs — read the release contract and maintain its baseline.
//
// The dashboard has ONE delivery goal: release-candidate readiness. Progress is
// measured against release scope, not against inferred outcome goals.
//
// Release contract (project-spine/03-roadmap.md frontmatter):
//   release:
//     id: RC-001
//     title: Release candidate readiness
//     status: approved            # required before a baseline is created
//     summary: <human-reviewed sentence>
//     target_date: 2026-09-30
//     tolerance_days: 3
//     scope_refs: [ROAD-001, ROAD-002]
//     exit_criteria: [{ id, title, status, evidence }]
//
// Denominator. The baseline freezes PROJECTED roadmap scope, not only the tasks
// already filed, so unfiled estimated work stays in the RC denominator:
//   projected(item) = max(estimated_weight * risk_multiplier, filed task weight)
//   current_projected_weight = sum of projected weights across in-scope items
//   scope_change = current_projected_weight - baseline_weight
// A human approves the release by editing the roadmap; the first render after
// approval snapshots the denominator. Later renders only report drift.
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { resolveTaskHistory } from "./task-history.mjs";

const LEGACY_FILE = "project-state/release-baselines.json";
const STORE_FIELD = "release_baselines";
const STORE_SCHEMA = "agent-os.release-baselines.v1";
const SCHEMA_V2 = "agent-os.release-baseline.v2";
const round = (value, places = 3) => Number.isFinite(value) ? Number(value.toFixed(places)) : null;
const iso = (value) => value instanceof Date ? value.toISOString() : value == null ? null : String(value);
const asList = (value) => Array.isArray(value) ? value.filter(Boolean) : value ? [value] : [];
const refId = (value, pattern) => String(value || "").match(pattern)?.[1] || String(value || "");
const refs = (item, singular, plural, pattern) => [...new Set([
  ...asList(item?.[plural]), ...asList(item?.[singular]),
].map(value => refId(value, pattern)).filter(Boolean))];

function frontmatter(file) {
  if (!fs.existsSync(file)) return {};
  const match = fs.readFileSync(file, "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/);
  try { return YAML.parse(match?.[1] || "") ?? {}; } catch { return {}; }
}

function collection(root, relativeDir) {
  const dir = path.join(root, relativeDir);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(name => name.endsWith(".md")).map(name => {
    const file = path.join(dir, name);
    const fm = frontmatter(file);
    return { ...fm, id: String(fm.id || path.basename(name, ".md")), file: path.relative(root, file).replace(/\\/g, "/") };
  });
}

// Normalize the exit_criteria list into { id, title, status, evidence } rows and
// count how many are still unmet. Statuses are human-owned; anything other than
// an explicit met/complete/done/pass is treated as unmet.
const MET = new Set(["met", "complete", "completed", "done", "pass", "passed", "approved"]);
function normalizeExitCriteria(releaseRaw) {
  const criteria = asList(releaseRaw?.exit_criteria).map((item, index) => {
    const row = item && typeof item === "object" ? item : { title: String(item) };
    const status = String(row.status || "pending").toLowerCase();
    return {
      id: String(row.id || `RC-CRIT-${index + 1}`),
      title: row.title || row.id || `criterion ${index + 1}`,
      status,
      met: MET.has(status),
      evidence: row.evidence ?? null,
    };
  });
  return { criteria, unmet: criteria.filter(item => !item.met).length };
}

export function loadReleaseScope(root = process.cwd()) {
  const roadmapDoc = frontmatter(path.join(root, "project-spine/03-roadmap.md"));
  const releaseRaw = roadmapDoc.release && typeof roadmapDoc.release === "object" ? roadmapDoc.release : null;
  const exit = normalizeExitCriteria(releaseRaw);
  const release = releaseRaw?.id ? {
    ...releaseRaw,
    id: String(releaseRaw.id),
    title: releaseRaw.title || null,
    summary: releaseRaw.summary || null,
    status: String(releaseRaw.status || "").toLowerCase(),
    approved: String(releaseRaw.status || "").toLowerCase() === "approved",
    target_date: iso(releaseRaw.target_date),
    tolerance_days: Number(releaseRaw.tolerance_days) >= 0 ? Number(releaseRaw.tolerance_days) : 3,
    scope_refs: refs(releaseRaw, "scope_ref", "scope_refs", /(ROAD-[A-Za-z0-9_-]+)/),
    exit_criteria: exit.criteria,
    unmet_exit_criteria: exit.unmet,
  } : null;

  const epics = collection(root, "backlog/epics");
  const epicById = new Map(epics.map(epic => [epic.id, epic]));
  const history = resolveTaskHistory(root);
  const historyById = new Map(history.tasks.map(task => [task.id, task]));

  const tasks = [...collection(root, "backlog/tasks"), ...collection(root, "backlog/done")].map(task => {
    const epicId = refId(task.epic_ref, /(EPIC-[A-Za-z0-9_-]+)/);
    const epic = epicById.get(epicId) || {};
    const direct = refs(task, "roadmap_ref", "roadmap_refs", /(ROAD-[A-Za-z0-9_-]+)/);
    const roadmapRefs = direct.length ? direct : refs(epic, "roadmap_ref", "roadmap_refs", /(ROAD-[A-Za-z0-9_-]+)/);
    const resolved = historyById.get(task.id) || {};
    return {
      id: task.id,
      file: task.file,
      epicId: epicId || null,
      roadmapRefs,
      weight: Number(task.progress_weight) > 0 ? Number(task.progress_weight) : 1,
      done: task.file.startsWith("backlog/done/") || String(task.status).toLowerCase() === "done",
      started: Boolean(resolved.startedAt),
      startedAt: resolved.startedAt ?? null,
      startedSource: resolved.startedSource ?? "missing",
      completedAt: resolved.completedAt ?? null,
      completedSource: resolved.completedSource ?? "missing",
      impossibleOrder: Boolean(resolved.impossibleOrder),
    };
  });
  const scope = new Set(release?.scope_refs || []);
  const inScopeTasks = release ? tasks.filter(task => task.roadmapRefs.some(ref => scope.has(ref))) : [];
  return {
    release,
    roadmap: Array.isArray(roadmapDoc.roadmap) ? roadmapDoc.roadmap : [],
    epics,
    tasks,
    inScopeTasks,
    history,
  };
}

// Projected weight for one roadmap item: the estimate adjusted by risk, but never
// less than the work already filed. This keeps unfiled estimated work in the RC
// denominator while exposing scope growth when filed work exceeds the estimate.
export function projectedWeight({ estimatedWeight, riskMultiplier = 1, filedWeight = 0 }) {
  const estimated = Number.isFinite(estimatedWeight) && estimatedWeight > 0
    ? estimatedWeight * (Number.isFinite(riskMultiplier) && riskMultiplier > 0 ? riskMultiplier : 1)
    : null;
  if (estimated == null) return round(filedWeight);
  return round(Math.max(estimated, filedWeight));
}

// Per-roadmap-item projected scope for the release. Only items named in
// scope_refs contribute to the RC denominator.
export function computeProjectedScope(scope) {
  const { release, roadmap, epics, tasks } = scope;
  const inScope = new Set(release?.scope_refs || []);
  const epicById = new Map(epics.map(epic => [epic.id, epic]));
  const rows = roadmap.map((item, index) => {
    const id = String(item.id || `ROAD-${index + 1}`);
    const linkedTasks = tasks.filter(task => task.roadmapRefs.includes(id));
    const filedWeight = linkedTasks.reduce((sum, task) => sum + task.weight, 0);
    const doneWeight = linkedTasks.filter(task => task.done).reduce((sum, task) => sum + task.weight, 0);
    // Estimate may live on the roadmap item, or be inherited from a sole linked epic.
    const linkedEpics = epics.filter(epic => refs(epic, "roadmap_ref", "roadmap_refs", /(ROAD-[A-Za-z0-9_-]+)/).includes(id));
    const inheritedEstimate = linkedEpics.reduce((sum, epic) => sum + (Number(epic.estimated_weight) > 0 ? Number(epic.estimated_weight) : 0), 0);
    const estimatedWeight = Number(item.estimated_weight) > 0 ? Number(item.estimated_weight)
      : (linkedEpics.length === 1 && inheritedEstimate > 0 ? inheritedEstimate : null);
    const riskMultiplier = Number(item.risk_multiplier) > 0 ? Number(item.risk_multiplier)
      : (linkedEpics.length === 1 && Number(linkedEpics[0].risk_multiplier) > 0 ? Number(linkedEpics[0].risk_multiplier) : 1);
    const projected = projectedWeight({ estimatedWeight, riskMultiplier, filedWeight });
    return {
      id,
      title: item.title || id,
      inScope: inScope.has(id),
      estimatedWeight,
      estimateMissing: !(Number.isFinite(estimatedWeight) && estimatedWeight > 0),
      riskMultiplier,
      riskFlags: asList(item.risk_flags),
      targetEnd: item.target_end ? iso(item.target_end) : null,
      filedWeight,
      doneWeight,
      projectedWeight: projected,
      remainingWeight: round(Math.max(0, projected - doneWeight)),
      unfiledWeight: round(Math.max(0, projected - filedWeight)),
      scopeRatio: estimatedWeight ? round(filedWeight / estimatedWeight) : null,
      started: linkedTasks.length > 0,
      epicIds: linkedEpics.map(epic => epic.id),
    };
  });
  const scoped = rows.filter(row => row.inScope);
  const currentProjectedWeight = round(scoped.reduce((sum, row) => sum + (row.projectedWeight || 0), 0));
  const doneWeight = round(scoped.reduce((sum, row) => sum + (row.doneWeight || 0), 0));
  const filedWeight = round(scoped.reduce((sum, row) => sum + row.filedWeight, 0));
  const remainingWeight = round(Math.max(0, currentProjectedWeight - doneWeight));
  const unfiledWeight = round(scoped.reduce((sum, row) => sum + (row.unfiledWeight || 0), 0));
  const unestimated = scoped.filter(row => row.estimateMissing).map(row => row.id);
  const missingTargetEnds = scoped.filter(row => !row.targetEnd).map(row => row.id);
  const rcProgress = currentProjectedWeight > 0 && !unestimated.length
    ? Math.min(100, Math.round((doneWeight / currentProjectedWeight) * 100)) : null;
  return {
    rows, scoped,
    currentProjectedWeight, doneWeight, filedWeight, remainingWeight, unfiledWeight,
    unestimated, missingTargetEnds, rcProgress,
  };
}

const emptyStore = () => ({ schema: STORE_SCHEMA, baselines: [] });
const validBaseline = item => item && typeof item === "object" && typeof item.release_id === "string"
  && item.release_id.length > 0 && Number.isFinite(Number(item.baseline_weight ?? item.total_weight));
function canonicalStore(state) {
  const raw = state?.[STORE_FIELD];
  return { schema: STORE_SCHEMA, baselines: Array.isArray(raw?.baselines) ? raw.baselines.filter(validBaseline) : [],
    ...(raw?.legacy_migration ? { legacy_migration: raw.legacy_migration } : {}) };
}
function legacyStore(root) {
  const file = path.join(root, LEGACY_FILE);
  if (!fs.existsSync(file)) return { exists: false, store: emptyStore(), invalid: 0 };
  let parsed;
  try { parsed = JSON.parse(fs.readFileSync(file, "utf8")); }
  catch (error) { throw new Error(`${LEGACY_FILE} is malformed (${error.message}); canonical state was not changed`); }
  if (!parsed || !Array.isArray(parsed.baselines)) {
    throw new Error(`${LEGACY_FILE} is malformed (baselines must be an array); canonical state was not changed`);
  }
  const baselines = parsed.baselines.filter(validBaseline);
  return { exists: true, store: { schema: STORE_SCHEMA, baselines }, invalid: parsed.baselines.length - baselines.length };
}
function makeBaseline(scope, store, now) {
  const previous = store.baselines.at(-1) || null;
  const projected = computeProjectedScope(scope);
  return {
    schema: SCHEMA_V2, release_id: scope.release.id, taken_at: new Date(now || Date.now()).toISOString(),
    target_date: scope.release.target_date, scope_refs: scope.release.scope_refs,
    roadmap: projected.scoped.map(row => ({ id: row.id, estimated_weight: row.estimatedWeight,
      risk_multiplier: row.riskMultiplier, projected_weight: row.projectedWeight,
      filed_weight: row.filedWeight, target_end: row.targetEnd })),
    baseline_weight: projected.currentProjectedWeight,
    done_weight: projected.doneWeight,
    tasks: scope.inScopeTasks.map(task => ({ id: task.id, weight: task.weight })).sort((a, b) => a.id.localeCompare(b.id)),
    total_weight: projected.currentProjectedWeight,
    previous_release_id: previous?.release_id || null,
    previous_baseline_weight: previous?.baseline_weight ?? previous?.total_weight ?? null,
  };
}

// Pure state transition used by render-state. It migrates valid legacy history,
// leaves the legacy file in place, and optionally creates the first approved
// baseline. The caller performs the one canonical state.json write.
export function synchronizeReleaseBaselines(root, state, options = {}) {
  const store = canonicalStore(state), legacy = legacyStore(root);
  let migrated = 0;
  if (legacy.exists) {
    const known = new Set(store.baselines.map(item => item.release_id));
    for (const item of legacy.store.baselines) {
      if (!known.has(item.release_id)) { store.baselines.push(item); known.add(item.release_id); migrated++; }
    }
    store.legacy_migration = {
      source: LEGACY_FILE, status: "superseded", imported_count: legacy.store.baselines.length,
      invalid_count: legacy.invalid, migrated_at: store.legacy_migration?.migrated_at || new Date(options.now || Date.now()).toISOString(),
    };
  }
  const scope = loadReleaseScope(root);
  let reason = null, created = false;
  if (!scope.release) reason = "release-not-set";
  else if (!scope.release.approved) reason = "release-not-approved";
  let baseline = scope.release ? store.baselines.find(item => item.release_id === scope.release.id) || null : null;
  if (!reason && !baseline) {
    baseline = makeBaseline(scope, store, options.now); store.baselines.push(baseline); created = true;
  }
  const before = JSON.stringify(state?.[STORE_FIELD] || null);
  return { store, baseline, created, migrated, legacy: legacy.exists, legacyInvalid: legacy.invalid,
    reason, changed: before !== JSON.stringify(store) };
}

// Explicit writer for tests and maintenance commands. Read-only model loaders
// never call this function.
export function ensureReleaseBaseline(root = process.cwd(), options = {}) {
  const file = path.join(root, "project-state/state.json");
  const state = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : { schema: "agent-os.state.v1", current: {} };
  const result = synchronizeReleaseBaselines(root, state, options);
  if (result.changed) {
    state[STORE_FIELD] = result.store;
    const tmp = `${file}.tmp`;
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(tmp, JSON.stringify(state, null, 2) + "\n");
    fs.renameSync(tmp, file);
  }
  return result;
}

export function loadReleaseBaselineModel(root = process.cwd()) {
  const scope = loadReleaseScope(root);
  if (!scope.release) return { release: null, baseline: null, scopeChange: null, progress: null, legacy: false };
  const state = (() => { try { return JSON.parse(fs.readFileSync(path.join(root, "project-state/state.json"), "utf8")); } catch { return {}; } })();
  let store = canonicalStore(state);
  let legacyFile = false;
  if (!store.baselines.length) {
    try { const legacy = legacyStore(root); if (legacy.exists) { store = legacy.store; legacyFile = true; } } catch { /* surfaced by render-state migration */ }
  }
  const baseline = store.baselines.find(item => item.release_id === scope.release.id) || null;
  if (!baseline) return { release: scope.release, baseline: null, scopeChange: null, progress: null, legacy: false };

  // Versioned reader: a v1 baseline froze only already-filed task weight. We do
  // NOT silently reinterpret that denominator as projected scope — surface a
  // migration message instead so a human decides whether to rebaseline.
  if (baseline.schema !== SCHEMA_V2) {
    return {
      release: scope.release, baseline, scopeChange: null, progress: null, legacy: true,
      migration: `Baseline for ${scope.release.id} predates projected-scope baselines (frozen filed weight ${baseline.total_weight}). Its history is preserved${legacyFile ? ` from ${LEGACY_FILE}` : " in state.json"}; a human must decide whether to rebaseline.`,
    };
  }

  const projected = computeProjectedScope(scope);
  const baselineWeight = baseline.baseline_weight ?? baseline.total_weight ?? 0;
  const scopeChange = projected.currentProjectedWeight - baselineWeight;
  return {
    release: scope.release,
    baseline,
    legacy: false,
    progress: {
      doneWeight: projected.doneWeight,
      currentProjectedWeight: projected.currentProjectedWeight,
      baselineWeight,
      percent: projected.rcProgress,
    },
    scopeChange: {
      baselineWeight,
      currentWeight: projected.currentProjectedWeight,
      deltaWeight: round(scopeChange),
      percent: baselineWeight > 0 ? Math.round((scopeChange / baselineWeight) * 100) : 0,
    },
  };
}
