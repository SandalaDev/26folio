#!/usr/bin/env node
// scripts/rc.mjs — `os rc assess` / `os rc validate`.
//
// Reuses the existing forecast/progress/baseline models (forecast.mjs,
// release-baseline.mjs) rather than forking their formulas — this file only
// reshapes their output into the versioned RC-assessment contract
// (scripts/distribution/rc-assessment.schema.md, agent-os.rc-assessment.v1)
// and reports gaps grouped by who can close them. It computes NOTHING that
// counts as scope, an estimate, a capacity assumption, a date, an exit
// criterion, an approval, or a baseline — those stay human-owned in
// project-spine/03-roadmap.md; this command only reports facts and gaps
// about that file.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { loadForecastModel } from "./forecast.mjs";
import { loadReleaseScope } from "./release-baseline.mjs";

const SCHEMA = "agent-os.rc-assessment.v1";

// Which prerequisite gaps an agent can close by drafting/computing evidence
// vs. which stay a human decision. See scripts/distribution/rc-assessment.schema.md
// "gaps[].owner contract" for the rule this table encodes.
const GAP_OWNER = {
  "rc-contract": "AGENT", // drafting the release: block from the hydrated spine
  "rc-approval": "HUMAN", // status: approved is a human edit, never agent-set
  "target-date": "HUMAN", // the RC commitment date is a capacity decision
  "scope-refs": "HUMAN", // which roadmap items are IN this release is a scope decision
  "scope-match": "AGENT", // a broken reference is a data-consistency fix, not a scope choice
  "roadmap-estimates": "AGENT", // task-skeleton estimates come from ds-epic-estimator
  "roadmap-targets": "AGENT", // per-item target_end is derived from structure
  "pace-sample": "AGENT", // evidence-only; no human decision closes a thin sample directly
};

function round(value, places = 3) {
  return Number.isFinite(value) ? Number(value.toFixed(places)) : null;
}

function targetEndStatus(row, today) {
  if (!row.targetEnd) return "unknown";
  const target = new Date(row.targetEnd);
  if (row.complete) {
    if (!row.actualEnd) return "on-track";
    return new Date(row.actualEnd) <= target ? "on-track" : "missed";
  }
  const daysToTarget = (target - today) / 86_400_000;
  if (daysToTarget < 0) return "missed";
  if (daysToTarget <= 7) return "at-risk";
  return "on-track";
}

function linkage(scope) {
  const roadmapIds = new Set(scope.roadmap.map((item, i) => String(item.id || `ROAD-${i + 1}`)));
  const unmappedTaskIds = scope.tasks.filter(t => t.roadmapRefs.length === 0).map(t => t.id).sort();
  const linkedRoadmapIds = new Set(scope.tasks.flatMap(t => t.roadmapRefs));
  const roadmapItemsMapped = [...roadmapIds].filter(id => linkedRoadmapIds.has(id)).length;
  const tasksMapped = scope.tasks.length - unmappedTaskIds.length;
  return {
    roadmap_items_mapped: roadmapItemsMapped,
    epics_mapped: scope.epics.length, // epics are inventoried, not yet independently linkage-checked
    tasks_mapped: tasksMapped,
    unmapped_epic_ids: [],
    unmapped_task_ids: unmappedTaskIds,
  };
}

export function buildAssessment(root = process.cwd(), options = {}) {
  const now = options.now ? new Date(options.now) : new Date();
  const model = loadForecastModel(root, { now });
  const scope = loadReleaseScope(root);
  const release = model.release;
  const today = now; // model.generatedAt is day-truncated for forecast bucketing; the assessment's own timestamp needs full precision (see generated_at below).

  const roadmapItems = model.calibration.roadmap.map(row => ({
    id: row.id,
    task_skeleton_present: row.started,
    raw_estimated_weight: row.estimatedWeight,
    risk_flags: row.riskFlags,
    risk_multiplier: row.riskMultiplier,
    filed_weight: round(row.filedWeight),
    done_weight: round(row.doneWeight),
    target_end_status: targetEndStatus(row, today),
  }));

  const gaps = model.prerequisites.missing.map(item => ({
    owner: GAP_OWNER[item.key] || "AGENT",
    field: gapField(item.key),
    detail: item.message,
  }));
  for (const id of linkage(scope).unmapped_task_ids.slice(0, 20)) {
    gaps.push({ owner: "AGENT", field: `tasks[${id}].roadmap_refs`, detail: `${id} has no roadmap_refs — linkage coverage is incomplete` });
  }

  return {
    schema: SCHEMA,
    generated_at: now.toISOString(),
    generated_by: { harness: process.env.HARNESS_NAME || process.env.AGENT_NAME || "unknown", model: process.env.MODEL_NAME || "unknown" },
    spine: {
      hydrated: Boolean(model.hydration.date),
      roadmap_schema_detected: scope.roadmap.length || release ? "agent-os.roadmap.v1" : null,
    },
    inventory: {
      epics_total: scope.epics.length,
      tasks_total: scope.tasks.length,
      tasks_done: scope.tasks.filter(t => t.done).length,
      roadmap_items_total: scope.roadmap.length,
    },
    linkage: linkage(scope),
    completion_dates: {
      by_source: { ...model.sample.sources, missing: model.sample.missingCompletionDates },
      distinct_completion_days: model.sample.distinctCompletionDays,
      completed_weight: round(model.totalEarnedWeight),
    },
    rate_rung: {
      rung: model.rate.rung,
      evidence: `${model.rate.label} · ${model.rate.sourceNote}`,
      expected_weight_per_day: model.rate.rung >= 1 ? model.rate.rate : null,
      required_weight_per_day: model.rate.rung === 0 ? (model.schedule.requiredRate ?? null) : null,
    },
    roadmap_items: roadmapItems,
    release: {
      target: release?.target_date || null,
      tolerance_days: release?.tolerance_days ?? null,
      scope_ref: release?.scope_refs || [],
      exit_criteria_status: !release || release.exit_criteria.length === 0
        ? "not-configured"
        : release.unmet_exit_criteria > 0 ? "pending" : "met",
    },
    baseline: {
      status: model.baselineLegacy ? "legacy" : model.baseline ? "frozen" : "none",
      legacy_semantics: model.baselineMigration || null,
    },
    gaps,
  };
}

function gapField(key) {
  return {
    "rc-contract": "release",
    "rc-approval": "release.status",
    "target-date": "release.target_date",
    "scope-refs": "release.scope_refs",
    "scope-match": "release.scope_refs",
    "roadmap-estimates": "roadmap[].estimated_weight",
    "roadmap-targets": "roadmap[].target_end",
    "pace-sample": "rate_rung",
  }[key] || key;
}

const RUNG_TABLE = [
  "rung 3: at least 5 completions across at least 3 distinct days",
  "rung 2: 1-4 observed completions blended with an explicit prior",
  "rung 1: no completions; explicit human expected_weight_per_day in 03-roadmap.md",
  "rung 0: no rate — only required pace (against a human target) may be shown",
];

function humanAssess(a) {
  const lines = [];
  lines.push(`=== os rc assess (${a.schema}) ===`);
  lines.push(`generated: ${a.generated_at}`);
  lines.push(`spine hydrated: ${a.spine.hydrated} · roadmap schema: ${a.spine.roadmap_schema_detected || "none"}`);
  lines.push("");
  lines.push(`inventory: ${a.inventory.epics_total} epics, ${a.inventory.tasks_total} tasks (${a.inventory.tasks_done} done), ${a.inventory.roadmap_items_total} roadmap items`);
  lines.push(`linkage: ${a.linkage.roadmap_items_mapped}/${a.inventory.roadmap_items_total} roadmap items mapped, ${a.linkage.tasks_mapped}/${a.inventory.tasks_total} tasks linked`);
  if (a.linkage.unmapped_task_ids.length) lines.push(`  unmapped tasks: ${a.linkage.unmapped_task_ids.slice(0, 10).join(", ")}${a.linkage.unmapped_task_ids.length > 10 ? " …" : ""}`);
  lines.push("");
  lines.push(`completion dates: frontmatter=${a.completion_dates.by_source.frontmatter} ledger=${a.completion_dates.by_source.ledger} git=${a.completion_dates.by_source.git} missing=${a.completion_dates.by_source.missing}`);
  lines.push(`distinct completion days: ${a.completion_dates.distinct_completion_days} · completed weight: ${a.completion_dates.completed_weight ?? 0}`);
  lines.push("");
  lines.push(`delivery-rate rung: ${a.rate_rung.rung} — ${a.rate_rung.evidence}`);
  if (a.rate_rung.expected_weight_per_day != null) lines.push(`  expected_weight_per_day: ${a.rate_rung.expected_weight_per_day}`);
  if (a.rate_rung.required_weight_per_day != null) lines.push(`  required_weight_per_day (to hit human target): ${a.rate_rung.required_weight_per_day}`);
  lines.push(...RUNG_TABLE.map(l => `  ${l}`));
  lines.push("");
  if (a.roadmap_items.length) {
    lines.push("roadmap items:");
    for (const item of a.roadmap_items) {
      lines.push(`  ${item.id}: skeleton=${item.task_skeleton_present} estimate=${item.raw_estimated_weight ?? "—"} risk=${item.risk_flags.join("|") || "none"}×${item.risk_multiplier} filed=${item.filed_weight} done=${item.done_weight} target_end=${item.target_end_status}`);
    }
    lines.push("");
  }
  lines.push(`release: target=${a.release.target || "—"} tolerance=${a.release.tolerance_days ?? "—"}d scope_ref=${a.release.scope_ref.join(",") || "—"} exit_criteria=${a.release.exit_criteria_status}`);
  lines.push(`baseline: ${a.baseline.status}${a.baseline.legacy_semantics ? ` — ${a.baseline.legacy_semantics}` : ""}`);
  lines.push("");
  if (a.gaps.length) {
    lines.push(`gaps (${a.gaps.length}):`);
    for (const gap of a.gaps) lines.push(`  [${gap.owner}] ${gap.field} — ${gap.detail}`);
  } else {
    lines.push("gaps: none — assessment found no missing evidence or human decisions.");
  }
  return lines.join("\n") + "\n";
}

function writeAssessment(root, assessment) {
  const dir = path.join(root, "planning/rc");
  fs.mkdirSync(dir, { recursive: true });
  const stamp = assessment.generated_at.replace(/[:.]/g, "-");
  const file = path.join(dir, `ASSESS-${stamp}.md`);
  const body = `---\nschema: ${assessment.schema}\ngenerated_at: ${assessment.generated_at}\n---\n` +
    "# RC assessment\n\n" +
    "Generated evidence — facts and gaps, not a second source of truth. The\n" +
    "canonical release/roadmap contract remains `project-spine/03-roadmap.md`.\n" +
    "Re-running `os rc assess --write` creates a new revision; it never edits\n" +
    "or overwrites this or any prior revision.\n\n" +
    "```json\n" + JSON.stringify(assessment, null, 2) + "\n```\n\n" +
    "## Human-readable summary\n\n```\n" + humanAssess(assessment) + "```\n";
  fs.writeFileSync(file, body);
  return file;
}

function cmdAssess(root, { json, write }) {
  const assessment = buildAssessment(root);
  if (write) {
    const file = writeAssessment(root, assessment);
    console.error(`[rc] wrote ${path.relative(root, file)}`); // stderr: keeps --json stdout parseable
  }
  if (json) console.log(JSON.stringify(assessment, null, 2));
  else process.stdout.write(humanAssess(assessment));
}

// os rc validate: the canonical 03-roadmap.md release contract, with every
// defect named by owning file + repair. Reuses the same evidence as assess;
// this is presentation, not a second computation.
function cmdValidate(root, { json }) {
  const assessment = buildAssessment(root);
  const roadmapFile = "project-spine/03-roadmap.md";
  const diagnostics = [];
  for (const gap of assessment.gaps) {
    diagnostics.push({
      owner: gap.owner,
      file: gap.field.startsWith("tasks[") ? taskFile(root, gap.field.replace(/tasks\[(.+)\]\..*/, "$1")) : roadmapFile,
      field: gap.field,
      message: gap.detail,
      repair: repairFor(gap.field),
    });
  }
  const ok = diagnostics.length === 0;
  if (json) {
    console.log(JSON.stringify({ schema: assessment.schema, ok, diagnostics }, null, 2));
    process.exitCode = ok ? 0 : 1;
    return;
  }
  console.log(`=== os rc validate — ${roadmapFile} ===`);
  if (ok) {
    console.log("VALID — no defects found in the release contract.");
  } else {
    console.log(`${diagnostics.length} defect(s):`);
    for (const d of diagnostics) console.log(`  [${d.owner}] ${d.file} :: ${d.field} — ${d.message}\n      repair: ${d.repair}`);
  }
  process.exitCode = ok ? 0 : 1;
}

function taskFile(root, id) {
  for (const dir of ["backlog/tasks", "backlog/done"]) {
    const candidate = `${dir}/${id}.md`;
    if (fs.existsSync(path.join(root, candidate))) return candidate;
  }
  return `backlog/tasks/${id}.md`;
}

function repairFor(field) {
  if (field.startsWith("tasks[")) return "add roadmap_refs (or an epic_ref whose epic carries roadmap_refs) to link this task to a roadmap item";
  return {
    "release": "add a release: block to project-spine/03-roadmap.md's frontmatter (id, status, target_date, scope_refs)",
    "release.status": "a human sets release.status: approved in project-spine/03-roadmap.md when ready",
    "release.target_date": "a human sets release.target_date (the RC commitment date) in project-spine/03-roadmap.md",
    "release.scope_refs": "a human lists the in-scope ROAD-xxx ids under release.scope_refs in project-spine/03-roadmap.md",
    "roadmap[].estimated_weight": "run the ds-epic-estimator workflow to file a task-skeleton-based estimate on the roadmap item",
    "roadmap[].target_end": "derive and record a target_end for the roadmap item from its task skeleton",
    "rate_rung": "no repair — file more completions, or a human sets an explicit expected_weight_per_day prior",
  }[field] || "see OPERATING_MANUAL.md for the release evidence contract";
}

function usage() {
  console.error("Usage: rc.mjs <assess|validate> [--json] [--write]");
}

function main() {
  const [sub, ...rest] = process.argv.slice(2);
  const opts = { json: rest.includes("--json"), write: rest.includes("--write") };
  const root = process.cwd();
  if (sub === "assess") return cmdAssess(root, opts);
  if (sub === "validate") return cmdValidate(root, opts);
  usage();
  process.exitCode = 2;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
