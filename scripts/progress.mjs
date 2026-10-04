#!/usr/bin/env node
// progress.mjs — release-scope progress and roadmap calibration.
//
// The dashboard has one delivery goal: release-candidate readiness. This module
// no longer groups delivery under inferred outcome goals (BUILD-*/GOAL-*). It
// reports:
//   - the RC headline (done weight over current projected scope) when a release
//     is configured;
//   - roadmap calibration rows (estimated × risk -> filed -> done);
//   - task inventory with resolved, source-labelled dates.
// Legacy charter goal keys remain readable as non-rendering context plus a
// compatibility diagnostic, so old projects are never silently reinterpreted.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import YAML from "yaml";
import { loadReleaseScope, computeProjectedScope } from "./release-baseline.mjs";
import { resolveTaskHistory } from "./task-history.mjs";

const asList = (value) => {
  if (Array.isArray(value)) return value.filter(v => v != null && v !== "");
  if (value == null || value === "") return [];
  return [value];
};

function frontmatter(file) {
  if (!fs.existsSync(file)) return {};
  const match = fs.readFileSync(file, "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  try { return YAML.parse(match[1]) ?? {}; } catch { return {}; }
}

function normalizedItems(value, prefix) {
  if (Array.isArray(value)) {
    return value.map((item, index) => {
      if (typeof item === "string") return { id: `${prefix}-${index + 1}`, title: item };
      return item && typeof item === "object" ? item : {};
    });
  }
  if (value && typeof value === "object") {
    return Object.entries(value).map(([id, item]) =>
      typeof item === "string" ? { id, title: item } : { id, ...(item || {}) });
  }
  return [];
}

function weightedCompletion(items) {
  const totalWeight = items.reduce((sum, item) => sum + item.progressWeight, 0);
  const doneWeight = items.filter(item => item.done)
    .reduce((sum, item) => sum + item.progressWeight, 0);
  return {
    percent: totalWeight > 0 ? Math.round((doneWeight / totalWeight) * 100) : null,
    planned: totalWeight > 0,
    totalWeight,
    doneWeight,
    tasksTotal: items.length,
    tasksDone: items.filter(item => item.done).length,
  };
}

export function loadProgressModel(root = process.cwd()) {
  const charter = frontmatter(path.join(root, "project-spine/01-charter.md"));
  const scope = loadReleaseScope(root);
  const history = resolveTaskHistory(root);
  const historyById = new Map(history.tasks.map(task => [task.id, task]));

  // Legacy outcome-goal keys are preserved as context only; they never organize
  // the dashboard. A non-build_goals key additionally earns a rename diagnostic.
  const goalSource = charter.build_goals != null
    ? { value: charter.build_goals, key: "build_goals" }
    : charter.goals != null
      ? { value: charter.goals, key: "goals" }
      : charter.business_goals != null
        ? { value: charter.business_goals, key: "business_goals" }
        : { value: undefined, key: null };
  const legacyGoals = normalizedItems(goalSource.value, "BUILD")
    .filter(goal => goal.id || goal.title)
    .map((goal, index) => ({
      id: String(goal.id || `BUILD-${index + 1}`),
      title: goal.title || goal.name || String(goal.id),
      exitCriteria: asList(goal.exit_criteria),
    }));
  const deprecations = [];
  if (goalSource.key && goalSource.key !== "build_goals") {
    deprecations.push(`project-spine/01-charter.md uses legacy \`${goalSource.key}\`; rename it to \`build_goals\`.`);
  }
  if (legacyGoals.length) {
    deprecations.push(`project-spine/01-charter.md defines ${legacyGoals.length} outcome goal(s); they remain as context but the dashboard is organized by the release contract in project-spine/03-roadmap.md.`);
  }

  const tasks = scope.tasks.map(task => {
    const resolved = historyById.get(task.id) || {};
    return {
      id: task.id,
      title: resolved.title || task.id,
      file: task.file,
      epicId: task.epicId,
      roadmapRefs: task.roadmapRefs,
      progressWeight: task.weight,
      status: resolved.status || (task.done ? "done" : "unknown"),
      done: task.done,
      startedAt: resolved.startedAt ?? null,
      startedSource: resolved.startedSource ?? "missing",
      completedAt: resolved.completedAt ?? null,
      completedSource: resolved.completedSource ?? "missing",
      impossibleOrder: Boolean(resolved.impossibleOrder),
    };
  });

  const epics = scope.epics.map(epic => {
    const linked = tasks.filter(task => task.epicId === epic.id);
    return {
      id: epic.id,
      title: epic.title,
      status: epic.status || "planned",
      roadmapRefs: (Array.isArray(epic.roadmap_refs) ? epic.roadmap_refs : epic.roadmap_ref ? [epic.roadmap_ref] : [])
        .map(value => String(value).match(/(ROAD-[A-Za-z0-9_-]+)/)?.[1] || String(value)),
      ...weightedCompletion(linked),
      taskIds: linked.map(task => task.id),
    };
  });

  const projected = computeProjectedScope(scope);
  const roadmap = projected.rows.map(row => {
    const linked = tasks.filter(task => task.roadmapRefs.includes(row.id));
    return {
      ...row,
      ...weightedCompletion(linked),
      estimatedWeight: row.estimatedWeight,
      riskMultiplier: row.riskMultiplier,
      projectedWeight: row.projectedWeight,
      remainingWeight: row.remainingWeight,
      targetEnd: row.targetEnd,
    };
  });

  const mappedTasks = tasks.filter(task => task.roadmapRefs.length);
  const unmappedTasks = tasks.filter(task => !task.roadmapRefs.length);
  const mappedCompletion = weightedCompletion(mappedTasks);
  const allCompletion = weightedCompletion(tasks);
  const unmappedWeight = unmappedTasks.reduce((sum, task) => sum + task.progressWeight, 0);
  const unmapped = {
    count: unmappedTasks.length,
    weight: unmappedWeight,
    percentOfTotalWeight: allCompletion.totalWeight > 0
      ? Math.round((unmappedWeight / allCompletion.totalWeight) * 100)
      : 0,
  };

  let scopeKind = "not-estimable";
  let overallPercent = null;
  if (scope.release) {
    scopeKind = "release";
    overallPercent = projected.rcProgress;
  } else if (mappedTasks.length && roadmap.length) {
    scopeKind = "roadmap";
    overallPercent = mappedCompletion.percent;
  } else if (tasks.length) {
    scopeKind = "task-only";
    overallPercent = allCompletion.percent;
  }

  const linkedToRoadmap = tasks.filter(task => task.roadmapRefs.length).length;
  const coveragePercent = tasks.length ? Math.round((linkedToRoadmap / tasks.length) * 100) : 0;

  return {
    scope: scopeKind,
    overallPercent,
    release: scope.release ? {
      configured: true, id: scope.release.id, title: scope.release.title,
      approved: scope.release.approved, status: scope.release.status,
    } : { configured: false },
    currentProjectedWeight: projected.currentProjectedWeight,
    doneWeight: projected.doneWeight,
    remainingWeight: projected.remainingWeight,
    warning: "Task completion estimates delivery of filed release scope; it does not replace human review of RC exit criteria.",
    deprecations,
    legacyGoals,
    roadmap,
    epics,
    tasks: {
      ...allCompletion,
      mapped: mappedCompletion,
      unmapped,
      linkedToRoadmap,
      coveragePercent,
      unlinked: tasks.filter(task => !task.roadmapRefs.length).map(task => ({ id: task.id, file: task.file })),
      items: tasks,
      historyCoverage: history.coverage,
      impossibleOrder: history.impossibleOrder,
    },
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.stdout.write(JSON.stringify(loadProgressModel(), null, 2) + "\n");
}
