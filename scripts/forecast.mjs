#!/usr/bin/env node
// forecast.mjs — RC readiness, pace, and forecast model.
//
// Answers, from evidence the project already has:
//   - what percentage of the current RC scope is complete;
//   - when the release candidate is likely to be ready;
//   - whether observed pace is above or below the pace the target requires;
//   - how accurate the original estimates were (calibration).
//
// Named values (implemented exactly):
//   baseline_weight            frozen projected RC weight at approval
//   current_projected_weight   sum of current projected in-scope roadmap weight
//   done_weight                completed in-scope task weight
//   remaining_weight           max(0, current_projected_weight - done_weight)
//   rc_progress                min(100, done_weight / current_projected_weight * 100)
//   scope_change               current_projected_weight - baseline_weight
//   observed_pace              completed weight in rolling window / window days
//   required_pace              remaining_weight / calendar days to target
//   forecast_days              remaining_weight / observed_pace
//   forecast_date              today + forecast_days
//
// Dates come from the shared read-only resolver (frontmatter > ledger > git);
// provenance is disclosed with every number that depends on them.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import YAML from "yaml";
import { loadReleaseBaselineModel, loadReleaseScope, computeProjectedScope } from "./release-baseline.mjs";

const DAY_MS = 86_400_000;
const dateValue = value => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date : null;
};
const dayStart = value => {
  const date = value instanceof Date ? value : new Date(value);
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
};
const dayKey = value => dayStart(value).toISOString().slice(0, 10);
const addDays = (date, days) => new Date(date.getTime() + days * DAY_MS);
const daysBetween = (a, b) => (dayStart(b) - dayStart(a)) / DAY_MS;
const round = (value, places = 3) => Number.isFinite(value) ? Number(value.toFixed(places)) : null;

function frontmatter(file) {
  if (!fs.existsSync(file)) return {};
  const source = fs.readFileSync(file, "utf8");
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  try { return YAML.parse(match?.[1] || "") ?? {}; } catch { return {}; }
}

function windowSummary(completions, start, end) {
  const included = completions.filter(item => item.at >= start && item.at <= end);
  const weight = included.reduce((sum, item) => sum + item.weight, 0);
  return {
    start: dayKey(start), end: dayKey(end), weight,
    rate: round(weight / 14), completions: included.length,
  };
}

function hydration(root, charter) {
  const native = dateValue(charter.hydrated);
  if (native) return { date: dayKey(native), at: dayStart(native), source: "native" };
  const relative = "project-spine/01-charter.md";
  if (!fs.existsSync(path.join(root, relative))) return { date: null, at: null, source: null };
  try {
    const output = execFileSync("git", ["log", "--follow", "--diff-filter=A", "--format=%aI", "--", relative], {
      cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"],
    }).trim().split(/\r?\n/).filter(Boolean).at(-1);
    const git = dateValue(output);
    return git ? { date: dayKey(git), at: dayStart(git), source: "git" } : { date: null, at: null, source: null };
  } catch { return { date: null, at: null, source: null }; }
}

// Completion history from RESOLVED dates (frontmatter > ledger > git). A missing
// start date never hides a completion from throughput; impossible ordering is
// excluded from cycle time but still counts as delivered weight.
function completionHistory(scope, now) {
  const resolved = scope.history.tasks.filter(task => task.done);
  const missingCompletionDates = [];
  const completions = [];
  const cycleTimes = [];
  const sources = { frontmatter: 0, ledger: 0, git: 0 };

  for (const task of resolved) {
    const completed = dateValue(task.completedAt);
    if (!completed) {
      missingCompletionDates.push({ id: task.id, file: task.file });
      continue;
    }
    sources[task.completedSource] = (sources[task.completedSource] || 0) + 1;
    completions.push({
      id: task.id, file: task.file, weight: task.weight,
      completedAt: completed.toISOString(), date: dayKey(completed), at: dayStart(completed),
      source: task.completedSource,
    });
    const started = dateValue(task.startedAt);
    if (started && !task.impossibleOrder && completed >= started) {
      cycleTimes.push({ id: task.id, days: round((completed - started) / DAY_MS), startedAt: started.toISOString(), completedAt: completed.toISOString() });
    }
  }
  completions.sort((a, b) => a.at - b.at || a.id.localeCompare(b.id));

  const daily = new Map();
  for (const item of completions) daily.set(item.date, (daily.get(item.date) || 0) + item.weight);
  let earned = 0;
  const earnedWeightByDay = [...daily.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, weight]) => {
    earned += weight;
    return { date, weight, earnedWeight: earned };
  });
  const trailing = windowSummary(completions, addDays(now, -13), now);
  const rolling = [];
  for (let offset = -42; offset <= 0; offset++) {
    const end = addDays(now, offset);
    const summary = windowSummary(completions, addDays(end, -13), end);
    if (summary.weight > 0) rolling.push(summary);
  }
  const best = rolling.length ? [...rolling].sort((a, b) => b.rate - a.rate)[0] : null;
  const worst = rolling.length ? [...rolling].sort((a, b) => a.rate - b.rate)[0] : null;
  return {
    completions, earnedWeightByDay, totalEarnedWeight: earned,
    throughput: { trailing14: trailing, best14: best, worst14: worst, windowDays: 14, historyDays: 56 },
    cycleTimes,
    sample: {
      n: completions.length, distinctCompletionDays: daily.size,
      missingCompletionDates: missingCompletionDates.length, missing: missingCompletionDates, sources,
      firstCompletion: completions[0]?.date || null, lastCompletion: completions.at(-1)?.date || null,
      spanDays: completions.length ? daysBetween(completions[0].at, now) + 1 : 0,
    },
  };
}

// Estimate calibration: each roadmap item rendered once.
//   estimated weight x risk multiplier -> filed weight -> done weight
// Scope discovery (filed / estimated) is reported for started items only.
function roadmapCalibration(scope, projected) {
  const rows = projected.rows.map(row => {
    const linkedTasks = scope.tasks.filter(task => task.roadmapRefs.includes(row.id));
    const completions = linkedTasks.filter(task => task.done && task.completedAt).map(task => dateValue(task.completedAt));
    const complete = linkedTasks.length > 0 && linkedTasks.every(task => task.done);
    return {
      ...row,
      buildGoalRefs: [],
      complete,
      actualEnd: complete && completions.length ? dayKey(new Date(Math.max(...completions.map(date => date.getTime())))) : null,
      breach: row.estimatedWeight ? row.filedWeight / row.estimatedWeight >= 1.25 : false,
    };
  });
  const startedEstimated = rows.filter(row => row.started && row.estimatedWeight);
  const discoveryNumerator = startedEstimated.reduce((sum, row) => sum + row.filedWeight, 0);
  const discoveryDenominator = startedEstimated.reduce((sum, row) => sum + row.estimatedWeight, 0);
  return {
    roadmap: rows,
    discoveryRate: discoveryDenominator > 0 ? round(discoveryNumerator / discoveryDenominator) : 1,
    discoveryEvidence: discoveryDenominator > 0
      ? `${round(discoveryNumerator)} filed / ${round(discoveryDenominator)} estimated across ${startedEstimated.length} started roadmap item(s)`
      : "no started roadmap item has both filed and estimated weight; using 1.0×",
  };
}

// Evidence ladder with source-quality disclosure. Never invents a rate.
function rateLadder(history, release) {
  const { n, distinctCompletionDays, spanDays, sources } = history.sample;
  const observed = history.throughput.trailing14.rate;
  const prior = Number(release?.expected_weight_per_day) > 0 ? Number(release.expected_weight_per_day) : null;
  const sourceNote = `dates: ${sources.frontmatter} frontmatter · ${sources.ledger} ledger · ${sources.git} git`;
  if (n >= 5 && distinctCompletionDays >= 3) {
    return {
      rung: 3, name: "Observed", label: `measured · n=${n} over ${spanDays}d`, rate: observed > 0 ? observed : null,
      prior, assumptionDeltaPercent: prior && observed > 0 ? round(((observed - prior) / prior) * 100, 1) : null,
      confidence: "high", sourceNote,
    };
  }
  if (n >= 1) {
    const share = n / 5;
    const rate = prior ? observed * share + prior * (1 - share) : observed;
    return { rung: 2, name: "Blended", label: `partly measured · n=${n}`, rate: rate > 0 ? round(rate) : null, prior, assumptionDeltaPercent: null, confidence: "medium", sourceNote };
  }
  if (prior) return { rung: 1, name: "Prior", label: "assumption · not yet measured", rate: prior, prior, assumptionDeltaPercent: null, confidence: "low", sourceNote };
  return { rung: 0, name: "Scope only", label: "no rate · scope only", rate: null, prior: null, assumptionDeltaPercent: null, confidence: "none", sourceNote };
}

function plannedModel(calibration, hydrated, release, now, baseline, history, scope, projected) {
  const weighted = calibration.roadmap.filter(item => item.inScope && item.projectedWeight != null && item.targetEnd);
  const baselineAt = dateValue(baseline?.baseline?.taken_at);
  const origin = baselineAt ? dayStart(baselineAt) : hydrated.at;
  if (!origin || !weighted.length) {
    return {
      totalWeight: projected?.currentProjectedWeight ?? null, plannedWeightToday: null, curve: [], roadmap: [],
      originDate: origin ? dayKey(origin) : null, originWeight: null, originSource: baselineAt ? "release baseline" : hydrated.at ? "hydration" : null,
      reason: !origin ? "release baseline or hydration date unavailable" : "weighted in-scope roadmap target dates unavailable",
    };
  }

  const inScopeTaskIds = new Set(scope.inScopeTasks.map(task => task.id));
  const earnedAtBaseline = baselineAt
    ? history.completions
      .filter(item => inScopeTaskIds.has(item.id) && item.at <= origin)
      .reduce((sum, item) => sum + item.weight, 0)
    : 0;
  const recordedOriginWeight = Number(baseline?.baseline?.done_weight);
  const originWeight = Number.isFinite(recordedOriginWeight) ? recordedOriginWeight : earnedAtBaseline;
  let cursor = origin;
  let cumulative = originWeight;
  let plannedToday = originWeight;
  const curve = [{ date: dayKey(origin), weight: round(originWeight), kind: baselineAt ? "baseline" : "hydration" }];
  const roadmap = [];

  for (const item of weighted) {
    const end = dayStart(item.targetEnd);
    const remainingWeight = Math.max(0, item.remainingWeight ?? item.projectedWeight);
    const start = cursor;
    if (remainingWeight > 0) {
      const duration = Math.max(1, daysBetween(start, end));
      if (now >= end) plannedToday += remainingWeight;
      else if (now > start) plannedToday += remainingWeight * Math.max(0, Math.min(1, daysBetween(start, now) / duration));
      cumulative += remainingWeight;
      curve.push({ date: dayKey(end), weight: round(cumulative), roadmapId: item.id, kind: "planned" });
      cursor = end;
    }
    roadmap.push({
      id: item.id, title: item.title, state: remainingWeight === 0 ? "complete" : item.started ? "in progress" : "remaining",
      plannedStart: remainingWeight > 0 ? dayKey(start) : null, plannedEnd: item.targetEnd ? dayKey(item.targetEnd) : null,
      actualEnd: item.actualEnd, projectedWeight: item.projectedWeight, remainingWeight: item.remainingWeight,
    });
  }
  return {
    totalWeight: projected?.currentProjectedWeight ?? round(cumulative), plannedWeightToday: round(plannedToday), curve, roadmap,
    originDate: dayKey(origin), originWeight: round(originWeight), originSource: baselineAt ? "release baseline" : "hydration",
    reason: null, targetDate: release?.target_date || null,
  };
}

// RC schedule: compares observed pace, required pace, and remaining work.
// Missing prerequisites are named with the source file that owns them —
// never replaced with zero.
function scheduleModel({ release, rate, projected, planned, baseline, now }) {
  const tolerance = release?.tolerance_days ?? 3;
  const target = dateValue(release?.target_date);
  const remaining = projected?.remainingWeight ?? 0;
  const weightedScope = Boolean(projected?.scoped?.length);
  const requiredDays = target ? Math.max(0, daysBetween(now, dayStart(target))) : null;
  const requiredRate = target && requiredDays > 0 ? round(remaining / requiredDays) : null;
  const scopeNote = baseline?.scopeChange
    ? `scope ${baseline.scopeChange.deltaWeight >= 0 ? "+" : ""}${baseline.scopeChange.deltaWeight} since baseline`
    : (baseline?.legacy ? "legacy baseline pending migration" : "no baseline yet");

  if (!release) {
    return {
      status: "Insufficient data", statusKey: "insufficient", varianceDays: null, forecastDate: null, range: null,
      targetDate: null, toleranceDays: tolerance, requiredRate: null, remainingWeight: null,
      evidence: "RC not configured — add a release: block to project-spine/03-roadmap.md",
    };
  }
  if (!release.approved) {
    return {
      status: "Insufficient data", statusKey: "insufficient", varianceDays: null, forecastDate: null, range: null,
      targetDate: release.target_date ? dayKey(release.target_date) : null, toleranceDays: tolerance, requiredRate: null,
      remainingWeight: round(remaining), evidence: `RC contract is ${release.status || "draft"}, not approved; historical pace remains available · ${scopeNote}`,
    };
  }
  if (!release.scope_refs.length) {
    return {
      status: "Insufficient data", statusKey: "insufficient", varianceDays: null, forecastDate: null, range: null,
      targetDate: release.target_date ? dayKey(release.target_date) : null, toleranceDays: tolerance, requiredRate: null,
      remainingWeight: round(remaining), evidence: `release.scope_refs is missing in project-spine/03-roadmap.md · ${scopeNote}`,
    };
  }
  if (!target) {
    return {
      status: "Insufficient data", statusKey: "insufficient", varianceDays: null, forecastDate: null, range: null,
      targetDate: null, toleranceDays: tolerance, requiredRate: null, remainingWeight: round(remaining),
      evidence: `release.target_date is missing in project-spine/03-roadmap.md · ${scopeNote}`,
    };
  }
  if (!weightedScope) {
    return {
      status: "Insufficient data", statusKey: "insufficient", varianceDays: null, forecastDate: null, range: null,
      targetDate: dayKey(target), toleranceDays: tolerance, requiredRate: null, remainingWeight: round(remaining),
      evidence: `release.scope_refs match no roadmap items in project-spine/03-roadmap.md · ${scopeNote}`,
    };
  }
  if (projected.unestimated.length) {
    return {
      status: "Insufficient data", statusKey: "insufficient", varianceDays: null, forecastDate: null, range: null,
      targetDate: dayKey(target), toleranceDays: tolerance, requiredRate: null, remainingWeight: null,
      evidence: `in-scope roadmap estimate(s) missing: ${projected.unestimated.join(", ")} · ${scopeNote}`,
    };
  }
  if (!rate.rate) {
    return {
      status: "Insufficient data", statusKey: "insufficient", varianceDays: null, forecastDate: null, range: null,
      targetDate: dayKey(target), toleranceDays: tolerance, requiredRate, remainingWeight: round(remaining),
      evidence: `${rate.label} · target implies ${requiredRate ?? "unavailable"} weight/day · ${scopeNote}`,
    };
  }

  const forecastAt = addDays(now, remaining / rate.rate);
  const forecastDate = dayKey(forecastAt);
  const daysLate = daysBetween(dayStart(target), dayStart(forecastAt));
  let status = "On schedule";
  let statusKey = "on-schedule";
  if (daysLate > tolerance) { status = "Behind"; statusKey = "behind"; }
  else if (daysLate < -tolerance) { status = "Ahead"; statusKey = "ahead"; }

  const earned = projected?.doneWeight ?? 0;
  const planVarianceWeight = planned?.plannedWeightToday != null ? round(earned - planned.plannedWeightToday) : null;
  const varianceDays = planVarianceWeight != null ? round(planVarianceWeight / rate.rate, 1) : null;
  const recoveryNote = planVarianceWeight == null
    ? null
    : planVarianceWeight < 0 && statusKey === "on-schedule"
      ? `below plan by ${Math.abs(planVarianceWeight)} weight; current pace still reaches the target within tolerance`
      : planVarianceWeight < 0
        ? `below plan by ${Math.abs(planVarianceWeight)} weight`
        : planVarianceWeight > 0
          ? `ahead of plan by ${planVarianceWeight} weight`
          : "matches the baseline plan";
  const range = null;
  return {
    status, statusKey, varianceDays, forecastDate, range, targetDate: dayKey(target), toleranceDays: tolerance,
    requiredRate, remainingWeight: round(remaining), planVarianceWeight, recoveryNote,
    evidence: `${rate.label} · ${rate.rate} weight/day observed vs ${requiredRate ?? "—"} required · ${scopeNote}`,
  };
}

// Forecast range uses best/worst rolling windows only when both carry a
// meaningful sample; otherwise the point forecast stands with low confidence.
function forecastRange({ rate, history, remaining, now }) {
  const best = history.throughput.best14;
  const worst = history.throughput.worst14;
  const meaningful = window => window && window.rate > 0 && window.completions >= 2;
  if (rate.rung !== 3 || !meaningful(best) || !meaningful(worst) || remaining == null) return null;
  return {
    earliest: dayKey(addDays(now, remaining / best.rate)),
    latest: dayKey(addDays(now, remaining / worst.rate)),
  };
}

function visualizationModel({ scope, planned, schedule, baseline, projected, now }) {
  const baselineDate = planned.originDate || (baseline.baseline?.taken_at ? dayKey(baseline.baseline.taken_at) : null);
  const dateCandidates = [
    baselineDate, dayKey(now), schedule.range?.earliest, schedule.range?.latest, schedule.forecastDate, schedule.targetDate,
  ].map(dateValue).filter(Boolean).map(dayStart);
  if (!scope.release || dateCandidates.length < 2) {
    return {
      available: false, width: 900, height: 190, runway: null, roadmapRows: planned.roadmap || [],
      summary: "Timeline unavailable until an RC target and release baseline are available.",
    };
  }
  let minDate = new Date(Math.min(...dateCandidates.map(date => date.getTime())));
  let maxDate = new Date(Math.max(...dateCandidates.map(date => date.getTime())));
  if (maxDate <= minDate) maxDate = addDays(minDate, 1);
  const width = 900, height = 190, left = 70, right = 70;
  const x = value => value ? round(left + ((dayStart(value) - minDate) / (maxDate - minDate)) * (width - left - right), 1) : null;
  const runway = {
    domain: { start: dayKey(minDate), end: dayKey(maxDate) },
    baseline: baselineDate ? { date: baselineDate, x: x(baselineDate), weight: planned.originWeight } : null,
    today: { date: dayKey(now), x: x(now) },
    range: schedule.range ? { ...schedule.range, x1: x(schedule.range.earliest), x2: x(schedule.range.latest) } : null,
    forecast: schedule.forecastDate ? { date: schedule.forecastDate, x: x(schedule.forecastDate) } : null,
    target: schedule.targetDate ? { date: schedule.targetDate, x: x(schedule.targetDate) } : null,
  };
  const rangeText = schedule.range ? `${schedule.range.earliest} to ${schedule.range.latest}` : "not available";
  return {
    available: true, width, height, runway, roadmapRows: planned.roadmap || [],
    summary: `Baseline ${baselineDate || "not available"}; today ${dayKey(now)}; forecast range ${rangeText}; point forecast ${schedule.forecastDate || "not available"}; target ${schedule.targetDate || "not set"}.`,
  };
}

export function loadForecastModel(root = process.cwd(), options = {}) {
  const now = dayStart(options.now || new Date());
  const scope = loadReleaseScope(root);
  const history = completionHistory(scope, now);
  const baseline = loadReleaseBaselineModel(root);
  const projected = scope.release ? computeProjectedScope(scope) : null;
  const charter = frontmatter(path.join(root, "project-spine/01-charter.md"));
  const hydrated = hydration(root, charter);
  const calibration = roadmapCalibration(scope, projected || computeProjectedScope(scope));
  const rate = rateLadder(history, scope.release);
  const planned = plannedModel(calibration, hydrated, scope.release, now, baseline, history, scope, projected);
  const schedule = scheduleModel({ release: scope.release, rate, projected, planned, baseline, now });
  const range = forecastRange({ rate, history, remaining: projected?.remainingWeight, now });
  if (range && schedule.forecastDate) schedule.range = range;
  const visualization = visualizationModel({ scope, planned, schedule, baseline, projected, now });
  const matchedScope = projected?.scoped?.length || 0;
  const prerequisites = {
    present: [
      scope.release ? `RC contract ${scope.release.id}` : null,
      scope.release?.approved ? "RC contract approved" : null,
      scope.release?.target_date ? `target ${dayKey(scope.release.target_date)}` : null,
      scope.release?.scope_refs?.length ? `${scope.release.scope_refs.length} scope reference(s)` : null,
      matchedScope ? `${matchedScope} matched roadmap item(s)` : null,
      history.sample.n ? `${history.sample.n} dated completion(s)` : "0 dated completions",
      rate.rate ? `historical pace ${rate.rate} weight/day (${rate.name})` : null,
      schedule.forecastDate ? `forecast ${schedule.forecastDate}` : null,
    ].filter(Boolean),
    missing: [
      !scope.release ? { key: "rc-contract", message: "RC contract missing" } : null,
      scope.release && !scope.release.approved ? { key: "rc-approval", message: `RC contract drafted but not approved (status: ${scope.release.status || "unset"})` } : null,
      scope.release && !scope.release.target_date ? { key: "target-date", message: "target date missing" } : null,
      scope.release && !scope.release.scope_refs.length ? { key: "scope-refs", message: "scope references missing" } : null,
      scope.release?.scope_refs.length && !matchedScope ? { key: "scope-match", message: "scope references match no roadmap items" } : null,
      projected?.unestimated?.length ? { key: "roadmap-estimates", message: `roadmap estimates missing: ${projected.unestimated.join(", ")}` } : null,
      projected?.missingTargetEnds?.length ? { key: "roadmap-targets", message: `roadmap target ends missing: ${projected.missingTargetEnds.join(", ")}` } : null,
      !rate.rate ? { key: "pace-sample", message: `insufficient pace sample (${history.sample.n} dated completion(s))` } : null,
    ].filter(Boolean),
    forecastAvailable: Boolean(schedule.forecastDate),
  };

  // RC readiness keeps weighted delivery and exit criteria as separate facts:
  // 100% weighted progress does not make the RC ready while criteria are pending.
  const rc = scope.release ? {
    configured: true,
    approved: scope.release.approved,
    id: scope.release.id,
    title: scope.release.title,
    summary: scope.release.summary,
    percent: projected.rcProgress,
    doneWeight: projected.doneWeight,
    remainingWeight: projected.remainingWeight,
    unfiledWeight: projected.unfiledWeight,
    unestimatedRoadmap: projected.unestimated,
    missingTargetEnds: projected.missingTargetEnds,
    currentProjectedWeight: projected.currentProjectedWeight,
    baselineWeight: baseline.baseline ? (baseline.baseline.baseline_weight ?? baseline.baseline.total_weight) : null,
    scopeChange: baseline.scopeChange?.deltaWeight ?? null,
    targetDate: scope.release.target_date,
    toleranceDays: scope.release.tolerance_days,
    exitCriteria: { total: scope.release.exit_criteria.length, unmet: scope.release.unmet_exit_criteria, items: scope.release.exit_criteria },
    ready: scope.release.approved && projected.unestimated.length === 0
      && (Boolean(projected.rcProgress === 100 && scope.release.unmet_exit_criteria === 0 && scope.release.exit_criteria.length > 0)
        || Boolean(projected.rcProgress === 100 && scope.release.exit_criteria.length === 0)),
    legacyBaseline: baseline.legacy,
  } : { configured: false };

  return {
    generatedAt: now.toISOString(),
    completions: history.completions.map(({ at, ...item }) => item),
    earnedWeightByDay: history.earnedWeightByDay,
    totalEarnedWeight: history.totalEarnedWeight,
    throughput: history.throughput,
    cycleTimes: history.cycleTimes,
    sample: history.sample,
    release: scope.release,
    rc,
    hydration: { date: hydrated.date, source: hydrated.source },
    baseline: baseline.baseline,
    baselineProgress: baseline.progress,
    scopeChange: baseline.scopeChange,
    baselineLegacy: baseline.legacy,
    baselineMigration: baseline.migration || null,
    rate,
    calibration,
    planned,
    schedule,
    visualization,
    prerequisites,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.stdout.write(JSON.stringify(loadForecastModel(), null, 2) + "\n");
}
