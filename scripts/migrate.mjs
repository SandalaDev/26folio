#!/usr/bin/env node
// scripts/migrate.mjs — `os migrate inspect|plan|apply|verify` (RC-FIX-04).
//
// inspect and plan are read-only except for plan's own explicitly requested
// `--write` artifact. apply writes only the paths a reviewed plan declared,
// using atomic writes, and records a receipt (module id + timestamp) in
// project-state/state.json's `distribution.migrations_applied` — the
// idempotency key for every subsequent inspect/apply/verify. No module here
// invents scope, an estimate, a capacity assumption, a date, an exit
// criterion, an approval, or a replacement baseline.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import YAML from "yaml";
import { MIGRATIONS, findMigration } from "./distribution/migrations/registry.mjs";
import { atomicWriteJSONSync } from "./distribution/atomic-write.mjs";

const SCHEMA = "agent-os.migration-plan.v1";
const STATE_FILE = "project-state/state.json";
const ROADMAP_FILE = "project-spine/03-roadmap.md";

// Refuses to run ANY module against a project whose own bookkeeping files
// don't parse — "malformed or ambiguous data that must stop with a precise
// manual action," per the schema, before a single byte is written.
function preflight(root) {
  const stateFile = path.join(root, STATE_FILE);
  if (!fs.existsSync(stateFile)) {
    fail(`${STATE_FILE} does not exist — this does not look like an agent-os project. No migration can run.`);
  }
  let state;
  try { state = JSON.parse(fs.readFileSync(stateFile, "utf8")); }
  catch (error) { fail(`${STATE_FILE} is malformed JSON (${error.message}). Fix it by hand before running a migration; nothing was written.`); }

  const roadmapFile = path.join(root, ROADMAP_FILE);
  if (fs.existsSync(roadmapFile)) {
    const match = fs.readFileSync(roadmapFile, "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (match) {
      try { YAML.parse(match[1]); }
      catch (error) { fail(`${ROADMAP_FILE} frontmatter is malformed YAML (${error.message}). Fix it by hand before running a migration; nothing was written.`); }
    }
  }
  return state;
}

function fail(message) {
  console.error(`[migrate] ERROR: ${message}`);
  process.exit(1);
}

function detectedProjectSchema(state) {
  return state.distribution?.project_schema || "agent-os.project.v0-legacy";
}
function appliedIds(state) {
  return new Set((state.distribution?.migrations_applied || []).map(m => m.id));
}

function cmdInspect(root, { json }) {
  const state = preflight(root);
  const applied = appliedIds(state);
  const rows = MIGRATIONS.map(module => {
    if (applied.has(module.id)) return { id: module.id, version: module.version, optional: Boolean(module.optional), status: "already-applied", description: module.description };
    let status;
    try { status = module.detect(root); } catch (error) { status = "ambiguous"; return { id: module.id, version: module.version, optional: Boolean(module.optional), status, description: module.description, reason: error.message }; }
    return { id: module.id, version: module.version, optional: Boolean(module.optional), status, description: module.description };
  });
  // Only a REQUIRED (non-optional) match means "this project needs a
  // migration"; an opt-in-only match (e.g. history materialization) is
  // never surfaced as something the human must act on.
  const requiredAvailable = rows.some(r => r.status === "matched" && !r.optional);
  const optionalAvailable = rows.some(r => r.status === "matched" && r.optional);
  const result = {
    schema: SCHEMA,
    detected_project_schema: detectedProjectSchema(state),
    target_project_schema: "agent-os.project.v1",
    migrations_applied: state.distribution?.migrations_applied || [],
    modules: rows,
    migration_available: requiredAvailable,
    optional_migration_available: optionalAvailable,
  };
  if (json) { console.log(JSON.stringify(result, null, 2)); return; }
  console.log("=== os migrate inspect ===");
  console.log(`detected project schema: ${result.detected_project_schema}`);
  console.log(`target project schema:   ${result.target_project_schema}`);
  console.log(`migrations already applied: ${result.migrations_applied.length ? result.migrations_applied.map(m => m.id).join(", ") : "none"}`);
  console.log("");
  for (const row of rows) console.log(`  [${row.status}]${row.optional ? " (optional)" : ""} ${row.id} — ${row.description}${row.reason ? `\n      ${row.reason}` : ""}`);
  console.log("");
  if (requiredAvailable) console.log("Next: bash scripts/os.sh migrate plan");
  else console.log("No migration available — this project is on the current schema.");
  if (optionalAvailable) console.log("Optional: task-history materialization is available — bash scripts/os.sh migrate plan --materialize-history");
}

function cmdPlan(root, { json, write, materializeHistory }) {
  const state = preflight(root);
  const applied = appliedIds(state);
  const modules = [];
  for (const module of MIGRATIONS) {
    if (applied.has(module.id)) continue;
    if (module.optional && !materializeHistory) continue; // opt-in only — never included by default
    let status;
    try { status = module.detect(root); } catch (error) { fail(`${module.id} detect() failed: ${error.message}`); }
    if (status !== "matched") continue;
    const planned = module.plan(root, { materializeHistory });
    modules.push({ id: module.id, detect_result: status, ...planned });
  }
  const plan = {
    schema: SCHEMA,
    generated_at: new Date().toISOString(),
    source_template_ref: process.env.AGENT_OS_TEMPLATE_REF || null,
    detected_project_schema: detectedProjectSchema(state),
    target_project_schema: "agent-os.project.v1",
    modules,
    receipt_preview: { migration_ids: modules.map(m => m.id), applied_at: null, idempotent_if_rerun: true },
  };
  let file = null;
  if (write) {
    const dir = path.join(root, "planning/migrations");
    fs.mkdirSync(dir, { recursive: true });
    const stamp = plan.generated_at.replace(/[:.]/g, "-");
    file = path.join(dir, `PLAN-${stamp}.json`);
    atomicWriteJSONSync(file, plan);
  }
  if (json) { console.log(JSON.stringify(plan, null, 2)); }
  else {
    console.log("=== os migrate plan ===");
    if (!modules.length) console.log("No migration modules matched — nothing to plan.");
    for (const m of modules) {
      console.log(`  ${m.id}:`);
      for (const w of m.writes) console.log(`    write: ${w.path} (${w.transform})`);
      for (const d of m.unresolved_human_decisions) console.log(`    HUMAN: ${d}`);
      console.log(`    rollback: ${m.rollback}`);
    }
  }
  if (file) console.error(`[migrate] wrote ${path.relative(root, file)}`); // stderr: keeps --json stdout parseable
  return plan;
}

function cmdApply(root, planPath, { templateRef }) {
  if (!planPath) fail("apply requires a plan file: os migrate apply <plan.json> (from `os migrate plan --write`)");
  const planFile = path.isAbsolute(planPath) ? planPath : path.join(root, planPath);
  if (!fs.existsSync(planFile)) fail(`plan file not found: ${planPath}`);
  const plan = JSON.parse(fs.readFileSync(planFile, "utf8"));
  if (plan.schema !== SCHEMA) fail(`plan file has unrecognized schema: ${plan.schema}`);

  let state = preflight(root);
  const applied = appliedIds(state);
  const resolvedTemplateRef = templateRef ?? plan.source_template_ref ?? state.distribution?.template_ref ?? null;

  const results = [];
  for (const entry of plan.modules) {
    const module = findMigration(entry.id);
    if (!module) { results.push({ id: entry.id, status: "skipped", reason: "module no longer in registry" }); continue; }
    if (applied.has(module.id)) { results.push({ id: module.id, status: "skipped", reason: "already applied (idempotent)" }); continue; }
    let fresh;
    try { fresh = module.detect(root); } catch (error) { fail(`${module.id}: detect() failed during apply (${error.message}) — refusing to apply a stale/invalid plan`); }
    if (fresh !== "matched") { results.push({ id: module.id, status: "skipped", reason: `no longer matched (${fresh}) — plan is stale, re-run 'os migrate plan'` }); continue; }

    try {
      module.apply(root, { templateRef: resolvedTemplateRef, materializeHistory: Boolean(entry.materialize_history) });
    } catch (error) {
      results.push({ id: module.id, status: "failed", reason: `apply() threw: ${error.message}` });
      console.error(`[migrate] ERROR: ${module.id} apply() failed — stopping before any later module runs. Already-applied modules in this run are unaffected (each write was atomic).`);
      printResults(results);
      process.exit(1);
    }
    const ok = module.verify(root);
    if (!ok) {
      results.push({ id: module.id, status: "failed", reason: "verify() returned false after apply()" });
      console.error(`[migrate] ERROR: ${module.id} verify() failed after apply() — stopping. See ${module.id}'s rollback guidance in the plan.`);
      printResults(results);
      process.exit(1);
    }
    // Receipt: the CLI's own bookkeeping write to project-state/state.json,
    // recorded after a successful apply()+verify() for this module.
    state = preflight(root);
    state.distribution = state.distribution || { schema: "agent-os.distribution-compat.v1", template_ref: resolvedTemplateRef, scaffolded_at: null, project_schema: "agent-os.project.v1", migrations_applied: [] };
    state.distribution.migrations_applied = [...(state.distribution.migrations_applied || []), { id: module.id, applied_at: new Date().toISOString() }];
    atomicWriteJSONSync(path.join(root, STATE_FILE), state);
    applied.add(module.id);
    results.push({ id: module.id, status: "applied" });
  }
  state = preflight(root);
  if (state.distribution && state.distribution.project_schema !== plan.target_project_schema) {
    state.distribution.project_schema = plan.target_project_schema;
    atomicWriteJSONSync(path.join(root, STATE_FILE), state);
  }
  printResults(results);
}

function printResults(results) {
  console.log("=== os migrate apply ===");
  for (const r of results) console.log(`  [${r.status}] ${r.id}${r.reason ? ` — ${r.reason}` : ""}`);
}

function cmdVerify(root, { json }) {
  const state = preflight(root);
  const rows = (state.distribution?.migrations_applied || []).map(receipt => {
    const module = findMigration(receipt.id);
    if (!module) return { id: receipt.id, applied_at: receipt.applied_at, status: "unknown-module" };
    let ok;
    try { ok = module.verify(root); } catch (error) { return { id: receipt.id, applied_at: receipt.applied_at, status: "error", reason: error.message }; }
    return { id: receipt.id, applied_at: receipt.applied_at, status: ok ? "pass" : "fail" };
  });
  if (json) { console.log(JSON.stringify({ schema: SCHEMA, results: rows }, null, 2)); }
  else {
    console.log("=== os migrate verify ===");
    if (!rows.length) console.log("No migrations have been applied to this project.");
    for (const r of rows) console.log(`  [${r.status}] ${r.id} (applied ${r.applied_at})${r.reason ? ` — ${r.reason}` : ""}`);
  }
  process.exitCode = rows.some(r => r.status !== "pass" && r.status !== "unknown-module") ? 1 : 0;
}

function usage() {
  console.error("Usage: migrate.mjs <inspect|plan|apply|verify> [--json] [--write] [<plan-file>] [--template-ref <ref>] [--materialize-history]");
}

function main() {
  const [sub, ...rest] = process.argv.slice(2);
  const root = process.cwd();
  const json = rest.includes("--json");
  const write = rest.includes("--write");
  const materializeHistory = rest.includes("--materialize-history");
  const refIdx = rest.indexOf("--template-ref");
  const templateRef = refIdx >= 0 ? rest[refIdx + 1] : undefined;
  const planArg = rest.find(a => !a.startsWith("--") && a !== templateRef);

  if (sub === "inspect") return cmdInspect(root, { json });
  if (sub === "plan") return cmdPlan(root, { json, write, materializeHistory });
  if (sub === "apply") return cmdApply(root, planArg, { templateRef });
  if (sub === "verify") return cmdVerify(root, { json });
  usage();
  process.exitCode = 2;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
