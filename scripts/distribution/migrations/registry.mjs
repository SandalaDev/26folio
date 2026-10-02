// scripts/distribution/migrations/registry.mjs — ordered, versioned
// project-data migration modules for `os migrate` (RC-FIX-04). Each module
// implements detect/plan/apply/verify per
// scripts/distribution/migration-plan.schema.md. Modules never invent scope,
// an estimate, a capacity assumption, a date, an exit criterion, an
// approval, or a replacement baseline — anything that would require one of
// those surfaces as `unresolved_human_decisions` instead.
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { atomicWriteJSONSync } from "../atomic-write.mjs";
import { resolveTaskHistory } from "../../task-history.mjs";
import { stampTask } from "../../stamp-task.mjs";

const STATE_FILE = "project-state/state.json";
const ROADMAP_FILE = "project-spine/03-roadmap.md";
const LEGACY_BASELINE_FILE = "project-state/release-baselines.json";

function readState(root) {
  return JSON.parse(fs.readFileSync(path.join(root, STATE_FILE), "utf8"));
}
function frontmatter(root, relative) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) return {};
  const match = fs.readFileSync(file, "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return YAML.parse(match?.[1] || "") ?? {};
}
function collection(root, relativeDir) {
  const dir = path.join(root, relativeDir);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(name => name.endsWith(".md"))
    .map(name => ({ file: path.join(relativeDir, name).replace(/\\/g, "/"), ...frontmatter(root, path.join(relativeDir, name)) }));
}

// ── MIG-001: add the distribution compatibility block introduced by TASK-601 ──
const addDistributionCompat = {
  id: "MIG-001-add-distribution-compat",
  version: 1,
  description: "Adds the additive project-state/state.json `distribution` block (template_ref, project_schema, migrations_applied) introduced by RC-FIX-01, without touching any other field.",
  detect(root) {
    const state = readState(root);
    return state.distribution ? "not-matched" : "matched";
  },
  plan() {
    return {
      writes: [{ path: STATE_FILE, transform: "add-distribution-compat", preserves: ["every existing top-level key"] }],
      preserved_values: ["project-state/state.json (all fields except the new `distribution` key)"],
      unresolved_human_decisions: [],
      rollback: `restore ${STATE_FILE} from the pre-apply snapshot recorded in the migration receipt`,
    };
  },
  apply(root, { templateRef = null } = {}) {
    const state = readState(root);
    state.distribution = {
      schema: "agent-os.distribution-compat.v1",
      template_ref: templateRef,
      scaffolded_at: null, // this project was migrated, not scaffolded — never invented
      project_schema: "agent-os.project.v1",
      migrations_applied: [],
    };
    atomicWriteJSONSync(path.join(root, STATE_FILE), state);
  },
  verify(root) {
    const state = readState(root);
    return Boolean(state.distribution && state.distribution.schema === "agent-os.distribution-compat.v1");
  },
};

// ── MIG-002: surface (never rebaseline) a legacy release baseline ──────────
const preserveLegacyBaseline = {
  id: "MIG-002-preserve-legacy-baseline",
  version: 1,
  description: "Detects a legacy release-baseline file or a pre-v2 baseline schema and records that it is preserved as-is; a rebaseline decision always stays with a human.",
  detect(root) {
    if (fs.existsSync(path.join(root, LEGACY_BASELINE_FILE))) return "matched";
    const state = readState(root);
    const baselines = state.release_baselines?.baselines || [];
    return baselines.some(b => b.schema && b.schema !== "agent-os.release-baseline.v2") ? "matched" : "not-matched";
  },
  plan(root) {
    const legacyFile = fs.existsSync(path.join(root, LEGACY_BASELINE_FILE));
    return {
      writes: [],
      preserved_values: [legacyFile ? LEGACY_BASELINE_FILE : `${STATE_FILE} release_baselines (legacy schema)`],
      unresolved_human_decisions: [
        "A legacy release baseline was detected. It is preserved and labeled, never reinterpreted. A human must decide whether to approve a fresh baseline (by editing project-spine/03-roadmap.md and re-approving the release).",
      ],
      rollback: "no writes were made by this module; nothing to roll back",
    };
  },
  apply() { /* observe-only by design — see plan() */ },
  verify(root) {
    return this.detect(root) === "matched"; // still present and still untouched — that IS success
  },
};

// ── MIG-003: flag (never auto-map) legacy goal-oriented scope tracking ─────
const flagLegacyGoalTracking = {
  id: "MIG-003-flag-legacy-goal-tracking",
  version: 1,
  description: "Detects goal_refs-based scope tracking with no roadmap items yet and names the human mapping decision; never invents a goal-to-roadmap mapping.",
  detect(root) {
    const roadmap = frontmatter(root, ROADMAP_FILE);
    if (Array.isArray(roadmap.roadmap) && roadmap.roadmap.length) return "not-matched";
    const items = [...collection(root, "backlog/epics"), ...collection(root, "backlog/tasks"), ...collection(root, "backlog/done")];
    const hasGoalRefs = items.some(item => {
      const refs = item.goal_refs;
      return Array.isArray(refs) ? refs.length > 0 : Boolean(refs);
    });
    return hasGoalRefs ? "matched" : "not-matched";
  },
  plan() {
    return {
      writes: [],
      preserved_values: ["backlog/**/*.md goal_refs (untouched)"],
      unresolved_human_decisions: [
        "This project uses legacy goal-oriented tracking (goal_refs) with no roadmap items yet. A human must map each goal to a roadmap item in project-spine/03-roadmap.md before RC scope can be computed — this migration will not invent that mapping.",
      ],
      rollback: "no writes were made by this module; nothing to roll back",
    };
  },
  apply() { /* observe-only by design — see plan() */ },
  verify(root) {
    return this.detect(root) === "matched";
  },
};

// Optional, explicit-only integration point for task-history materialization
// (the same read-only resolver scripts/seed-history.mjs already uses). Never
// run automatically — only when a reviewed plan explicitly requested it via
// `os migrate plan --materialize-history`; see MIGRATIONS below for the gate.
export function historyMaterializationCandidates(root) {
  const model = resolveTaskHistory(root);
  return model.tasks.filter(t =>
    (t.startedAt && t.startedSource !== "frontmatter" && t.startedSource !== "missing") ||
    (t.completedAt && t.completedSource !== "frontmatter" && t.completedSource !== "missing"));
}

// ── MIG-004: materialize resolved dates into task frontmatter (opt-in only) ──
const materializeTaskHistory = {
  id: "MIG-004-materialize-task-history",
  version: 1,
  optional: true, // excluded from `os migrate plan` unless --materialize-history is passed
  description: "Materializes ledger/Git-resolved started_at/completed_at into task frontmatter (the same logic as scripts/seed-history.mjs). Never automatic.",
  detect(root) {
    return historyMaterializationCandidates(root).length > 0 ? "matched" : "not-matched";
  },
  plan(root) {
    const candidates = historyMaterializationCandidates(root);
    return {
      writes: candidates.map(t => ({ path: t.file, transform: "materialize-resolved-dates", preserves: ["task body", "existing frontmatter fields"] })),
      preserved_values: ["task bodies (byte-for-byte); any frontmatter date that already exists always wins"],
      unresolved_human_decisions: [],
      rollback: "restore each listed task file from the pre-apply snapshot recorded in the migration receipt",
    };
  },
  apply(root) {
    for (const task of historyMaterializationCandidates(root)) {
      const file = path.join(root, task.file);
      if (task.startedAt && task.startedSource !== "frontmatter" && task.startedSource !== "missing") stampTask(file, "started_at", task.startedAt);
      if (task.completedAt && task.completedSource !== "frontmatter" && task.completedSource !== "missing") stampTask(file, "completed_at", task.completedAt);
    }
  },
  verify(root) {
    return historyMaterializationCandidates(root).length === 0;
  },
};

export const MIGRATIONS = [addDistributionCompat, preserveLegacyBaseline, flagLegacyGoalTracking, materializeTaskHistory];

export function findMigration(id) {
  return MIGRATIONS.find(m => m.id === id) || null;
}
