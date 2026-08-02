#!/usr/bin/env node
// progress.mjs — estimate implementation progress toward business intent.
//
// Task completion is a delivery proxy, not proof that a business outcome was
// achieved. This module keeps that distinction explicit while tracing:
//   goal <- roadmap item <- epic <- task
//
// Canonical metadata:
//   project-spine/01-charter.md frontmatter:
//     goals: [{ id, title, weight, success_signal, outcome_status }]
//   project-spine/03-roadmap.md frontmatter:
//     roadmap: [{ id, title, goal_refs, weight }]
//   backlog/epics/*.md:
//     roadmap_ref(s), goal_refs, progress_weight
//   backlog/{tasks,done}/*.md:
//     epic_ref, optional roadmap_ref(s)/goal_refs, progress_weight, status
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import YAML from "yaml";

const asList = (value) => {
  if (Array.isArray(value)) return value.filter(v => v != null && v !== "");
  if (value == null || value === "") return [];
  return [value];
};

const idFromRef = (value, pattern) => {
  const match = String(value || "").match(pattern);
  return match ? match[1] : null;
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

function readCollection(root, relativeDir, kind) {
  const dir = path.join(root, relativeDir);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(name => name.endsWith(".md")).map(name => {
    const file = path.join(dir, name);
    const fm = frontmatter(file);
    return {
      ...fm,
      id: String(fm.id || path.basename(name, ".md")),
      title: fm.title || path.basename(name, ".md"),
      file: path.relative(root, file).replace(/\\/g, "/"),
      kind,
    };
  });
}

const refs = (item, singular, plural, pattern) => {
  const raw = [...asList(item[plural]), ...asList(item[singular])];
  return [...new Set(raw.map(value => idFromRef(value, pattern) || String(value)).filter(Boolean))];
};

function weightedCompletion(items) {
  const totalWeight = items.reduce((sum, item) => sum + item.progressWeight, 0);
  const doneWeight = items.filter(item => item.done)
    .reduce((sum, item) => sum + item.progressWeight, 0);
  return {
    percent: totalWeight > 0 ? Math.round((doneWeight / totalWeight) * 100) : null,
    totalWeight,
    doneWeight,
    tasksTotal: items.length,
    tasksDone: items.filter(item => item.done).length,
  };
}

export function loadProgressModel(root = process.cwd()) {
  const charter = frontmatter(path.join(root, "project-spine/01-charter.md"));
  const roadmapDoc = frontmatter(path.join(root, "project-spine/03-roadmap.md"));
  const goals = normalizedItems(charter.goals ?? charter.business_goals, "GOAL")
    .filter(goal => goal.id || goal.title)
    .map((goal, index) => ({
      id: String(goal.id || `GOAL-${index + 1}`),
      title: goal.title || goal.name || String(goal.id),
      weight: Number(goal.weight) > 0 ? Number(goal.weight) : 1,
      successSignal: goal.success_signal || goal.success_metric || null,
      outcomeStatus: goal.outcome_status || "unvalidated",
    }));
  const roadmap = normalizedItems(roadmapDoc.roadmap ?? roadmapDoc.items, "ROAD")
    .filter(item => item.id || item.title)
    .map((item, index) => ({
      id: String(item.id || `ROAD-${index + 1}`),
      title: item.title || item.name || String(item.id),
      weight: Number(item.weight) > 0 ? Number(item.weight) : 1,
      goalRefs: refs(item, "goal_ref", "goal_refs", /(GOAL-[A-Za-z0-9_-]+)/),
      status: item.status || "planned",
    }));

  const epics = readCollection(root, "backlog/epics", "epic");
  const epicById = new Map(epics.map(epic => [epic.id, epic]));
  const openTasks = readCollection(root, "backlog/tasks", "task");
  const doneTasks = readCollection(root, "backlog/done", "done");
  const roadmapById = new Map(roadmap.map(item => [item.id, item]));

  const tasks = [...openTasks, ...doneTasks].map(task => {
    const epicId = idFromRef(task.epic_ref, /(EPIC-[A-Za-z0-9_-]+)/);
    const epic = epicById.get(epicId) || {};
    const roadmapRefs = refs(task, "roadmap_ref", "roadmap_refs", /(ROAD-[A-Za-z0-9_-]+)/);
    const inheritedRoadmapRefs = roadmapRefs.length
      ? roadmapRefs
      : refs(epic, "roadmap_ref", "roadmap_refs", /(ROAD-[A-Za-z0-9_-]+)/);
    let goalRefs = refs(task, "goal_ref", "goal_refs", /(GOAL-[A-Za-z0-9_-]+)/);
    if (!goalRefs.length) goalRefs = refs(epic, "goal_ref", "goal_refs", /(GOAL-[A-Za-z0-9_-]+)/);
    if (!goalRefs.length) {
      goalRefs = [...new Set(inheritedRoadmapRefs.flatMap(ref => roadmapById.get(ref)?.goalRefs || []))];
    }
    const progressWeight = Number(task.progress_weight) > 0 ? Number(task.progress_weight) : 1;
    const status = String(task.status || "").toLowerCase();
    return {
      id: task.id,
      title: task.title,
      file: task.file,
      epicId,
      roadmapRefs: inheritedRoadmapRefs,
      goalRefs,
      progressWeight,
      status,
      done: task.kind === "done" || status === "done",
    };
  });

  const roadmapProgress = roadmap.map(item => {
    const linked = tasks.filter(task => task.roadmapRefs.includes(item.id));
    const progress = weightedCompletion(linked);
    return { ...item, ...progress };
  });

  const goalProgress = goals.map(goal => {
    const linked = tasks.filter(task => task.goalRefs.includes(goal.id));
    const progress = weightedCompletion(linked);
    return { ...goal, ...progress };
  });

  let scope = "not-estimable";
  let overallPercent = null;
  if (tasks.length && goalProgress.length) {
    scope = "business-goal";
    const total = goalProgress.reduce((sum, goal) => sum + goal.weight, 0);
    overallPercent = total
      ? Math.round(goalProgress.reduce((sum, goal) => sum + (goal.percent ?? 0) * goal.weight, 0) / total)
      : null;
  } else if (tasks.length && roadmapProgress.length) {
    scope = "roadmap";
    const total = roadmapProgress.reduce((sum, item) => sum + item.weight, 0);
    overallPercent = total
      ? Math.round(roadmapProgress.reduce((sum, item) => sum + (item.percent ?? 0) * item.weight, 0) / total)
      : null;
  } else if (tasks.length) {
    scope = "task-only";
    overallPercent = weightedCompletion(tasks).percent;
  }

  const linkedToRoadmap = tasks.filter(task => task.roadmapRefs.length).length;
  const linkedToGoals = tasks.filter(task => task.goalRefs.length).length;
  const fullyLinked = tasks.filter(task => task.roadmapRefs.length && task.goalRefs.length).length;
  const coveragePercent = tasks.length ? Math.round((fullyLinked / tasks.length) * 100) : 0;
  const plannedRoadmap = roadmapProgress.filter(item => item.tasksTotal > 0).length;
  const plannedGoals = goalProgress.filter(item => item.tasksTotal > 0).length;
  const scopeCoveragePercent = goals.length && roadmap.length
    ? Math.round(((plannedRoadmap / roadmap.length) + (plannedGoals / goals.length)) * 50)
    : 0;
  const confidence = goals.length && roadmap.length && coveragePercent >= 90 && scopeCoveragePercent === 100
    ? "high"
    : ((goals.length || roadmap.length) && coveragePercent >= 60 && scopeCoveragePercent >= 60 ? "medium" : "low");

  return {
    scope,
    overallPercent,
    confidence,
    warning: "Task completion estimates delivery toward intent; it does not prove the business outcome was achieved.",
    goals: goalProgress,
    roadmap: roadmapProgress,
    tasks: {
      ...weightedCompletion(tasks),
      linkedToRoadmap,
      linkedToGoals,
      fullyLinked,
      coveragePercent,
      scopeCoveragePercent,
      unlinked: tasks.filter(task => !task.roadmapRefs.length || !task.goalRefs.length)
        .map(task => ({ id: task.id, file: task.file })),
    },
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.stdout.write(JSON.stringify(loadProgressModel(), null, 2) + "\n");
}
