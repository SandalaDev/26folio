#!/usr/bin/env node
// task-history.mjs — the shared, read-only task date resolver.
//
// Every renderer recovers task start/completion dates from evidence the project
// already has, in this priority order:
//   1. explicit task frontmatter
//   2. session ledger (task-attributed rows)
//   3. Git history (path appearance)
//   4. unavailable ("missing")
//
// Rules:
//   - started_at:  frontmatter, else earliest task-attributed ledger `started`,
//     else first Git appearance in backlog/tasks.
//   - completed_at: frontmatter, else latest task-attributed ledger `ended` from
//     a completed session, else the Git move/addition into backlog/done.
//   - provenance is preserved as frontmatter | ledger | git | missing;
//   - bare IDs and task paths are normalized before matching ledger rows;
//   - rendering NEVER writes frontmatter — seed-history.mjs is the explicit,
//     optional migration command for materializing resolved dates;
//   - impossible ordering (completed < started) is flagged, never silently
//     swapped. Completions still count for throughput; cycle time excludes them.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import YAML from "yaml";

export const HISTORY_SOURCES = ["frontmatter", "ledger", "git", "missing"];

export function parseDate(value) {
  if (value == null || value === "") return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isFinite(date.getTime()) ? date : null;
}

const iso = value => {
  const date = parseDate(value);
  return date ? date.toISOString() : null;
};

// Ledger task references arrive in several shapes: a path (os end <path>), a
// bare id (crash rows), the string "none", or absent. Normalize to the bare id.
export function normalizeTaskRef(raw) {
  const text = String(raw ?? "").trim().replace(/\\/g, "/");
  if (!text || text === "none") return null;
  const id = text.split("/").pop().replace(/\.md$/i, "");
  return id || null;
}

export function readLedgerRows(root) {
  const file = path.join(root, "project-state/ledger.jsonl");
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, "utf8").split(/\r?\n/).filter(Boolean)
    .map(line => { try { return JSON.parse(line); } catch { return null; } })
    .filter(Boolean);
}

export function frontmatter(file) {
  if (!fs.existsSync(file)) return {};
  const match = fs.readFileSync(file, "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  try { return YAML.parse(match[1]) ?? {}; } catch { return {}; }
}

export function readTaskFiles(root) {
  const tasks = [];
  for (const dir of ["backlog/tasks", "backlog/done"]) {
    const full = path.join(root, dir);
    if (!fs.existsSync(full)) continue;
    for (const name of fs.readdirSync(full).filter(entry => entry.endsWith(".md")).sort()) {
      const file = path.join(full, name);
      const fm = frontmatter(file);
      tasks.push({
        id: String(fm.id || path.basename(name, ".md")),
        fileName: name,
        dir,
        file: `${dir}/${name}`,
        title: fm.title || path.basename(name, ".md"),
        weight: Number(fm.progress_weight) > 0 ? Number(fm.progress_weight) : 1,
        status: String(fm.status || "").toLowerCase(),
        done: dir === "backlog/done" || String(fm.status).toLowerCase() === "done",
        fm,
      });
    }
  }
  return tasks;
}

// Git queries run through an injected runner so tests never depend on the
// template repository's own history. The runner receives git arguments and
// returns stdout; failures throw and are treated as "no Git evidence".
export function defaultGitRunner(root) {
  return args => execFileSync("git", args, {
    cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"],
  });
}

// First commit that added a path (its oldest appearance). --no-renames makes
// the new side of a `git mv` count as an addition, so "appearance at this
// path" is well-defined for both direct adds and moves.
function firstAppearanceAt(runGit, relativePath) {
  try {
    const output = runGit(["log", "--no-renames", "--diff-filter=A", "--format=%aI", "--", relativePath]);
    const lines = String(output).trim().split(/\r?\n/).filter(Boolean);
    return lines.length ? iso(lines.at(-1)) : null;
  } catch { return null; }
}

function emptyCoverage() {
  return {
    started: { frontmatter: 0, ledger: 0, git: 0, missing: 0 },
    completed: { frontmatter: 0, ledger: 0, git: 0, missing: 0 },
  };
}

// Resolve start/completion dates for every task file. Read-only: this function
// never writes. Options:
//   runGit(args)  injected git command runner (default: execFileSync in root)
//   ledger        pre-read ledger rows (default: readLedgerRows(root))
//   now           unused by resolution; accepted for model symmetry
export function resolveTaskHistory(root = process.cwd(), options = {}) {
  const runGit = options.runGit || defaultGitRunner(root);
  const ledger = options.ledger || readLedgerRows(root);
  const rowsById = new Map();
  for (const row of ledger) {
    const id = normalizeTaskRef(row.task);
    if (!id) continue;
    if (!rowsById.has(id)) rowsById.set(id, []);
    rowsById.get(id).push(row);
  }

  const coverage = emptyCoverage();
  const impossibleOrder = [];
  const tasks = readTaskFiles(root).map(task => {
    let startedAt = iso(task.fm.started_at);
    let startedSource = startedAt ? "frontmatter" : "missing";
    if (!startedAt) {
      const starts = (rowsById.get(task.id) || [])
        .map(row => parseDate(row.started)).filter(Boolean);
      if (starts.length) {
        startedAt = new Date(Math.min(...starts.map(date => date.getTime()))).toISOString();
        startedSource = "ledger";
      } else {
        const git = firstAppearanceAt(runGit, `backlog/tasks/${task.fileName}`);
        if (git) { startedAt = git; startedSource = "git"; }
      }
    }

    let completedAt = null;
    let completedSource = "missing";
    const fmCompleted = iso(task.fm.completed_at);
    if (fmCompleted) {
      completedAt = fmCompleted;
      completedSource = "frontmatter";
    } else if (task.done) {
      const ends = (rowsById.get(task.id) || [])
        .filter(row => row.status === "completed")
        .map(row => parseDate(row.ended)).filter(Boolean);
      if (ends.length) {
        completedAt = new Date(Math.max(...ends.map(date => date.getTime()))).toISOString();
        completedSource = "ledger";
      } else {
        const git = firstAppearanceAt(runGit, `backlog/done/${task.fileName}`);
        if (git) { completedAt = git; completedSource = "git"; }
      }
    }

    coverage.started[startedSource]++;
    coverage.completed[completedSource]++;
    const ordered = startedAt && completedAt && parseDate(completedAt) < parseDate(startedAt);
    if (ordered) impossibleOrder.push({ id: task.id, file: task.file, startedAt, completedAt });
    return {
      id: task.id,
      title: task.title,
      file: task.file,
      weight: task.weight,
      status: task.status || (task.done ? "done" : "unknown"),
      done: task.done,
      startedAt, startedSource,
      completedAt, completedSource,
      impossibleOrder: ordered,
    };
  });

  const doneTasks = tasks.filter(task => task.done);
  return {
    tasks,
    doneTasks,
    coverage: {
      tasks: tasks.length,
      doneTasks: doneTasks.length,
      started: coverage.started,
      completed: coverage.completed,
    },
    impossibleOrder,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.stdout.write(JSON.stringify(resolveTaskHistory(), null, 2) + "\n");
}
