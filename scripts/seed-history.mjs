#!/usr/bin/env node
// seed-history.mjs — explicit, optional migration: materialize resolved dates
// into task frontmatter. Reuses the shared read-only resolver; rendering itself
// never writes frontmatter. Nothing runs unless a human invokes this command.
//
// Usage:
//   node scripts/seed-history.mjs --dry-run   # print proposed writes + sources
//   node scripts/seed-history.mjs             # apply the proposed writes
//
// Only fields that are missing in frontmatter but resolved from the ledger or
// Git are written, together with a provenance field (<field>_source). Task
// bodies are preserved byte-for-byte; existing frontmatter dates always win.
import path from "node:path";
import { pathToFileURL } from "node:url";
import { resolveTaskHistory } from "./task-history.mjs";
import { stampTask } from "./stamp-task.mjs";

function main() {
  const dryRun = process.argv.includes("--dry-run");
  const root = process.cwd();
  const model = resolveTaskHistory(root);

  let seeded = 0, kept = 0, skipped = 0;
  for (const task of model.tasks) {
    const file = path.join(root, task.file);
    // A "frontmatter" source means the field already exists and always wins;
    // only ledger/git resolutions are materialization candidates.
    const writes = [];
    if (task.startedAt && task.startedSource !== "frontmatter" && task.startedSource !== "missing") {
      writes.push(["started_at", task.startedAt, task.startedSource]);
    }
    if (task.completedAt && task.completedSource !== "frontmatter" && task.completedSource !== "missing") {
      writes.push(["completed_at", task.completedAt, task.completedSource]);
    }
    if (!writes.length) {
      if (task.startedSource === "frontmatter" || task.completedSource === "frontmatter") {
        kept++;
        console.log(`[seed-history] keep ${task.file}: frontmatter dates already present`);
      } else {
        skipped++;
        console.log(`[seed-history] skip ${task.file}: no ledger or Git evidence`);
      }
      continue;
    }
    if (dryRun) {
      for (const [key, value, source] of writes) {
        console.log(`[seed-history] would stamp ${task.file}: ${key}=${value} (${source})`);
      }
      seeded++;
      continue;
    }
    for (const [key, value, source] of writes) {
      stampTask(file, key, value);
      stampTask(file, `${key}_source`, source);
      console.log(`[seed-history] seeded ${task.file}: ${key}=${value} (${source})`);
    }
    seeded++;
  }
  console.log(`[seed-history] ${dryRun ? "dry run " : ""}complete: ${dryRun ? "would seed" : "seeded"}=${seeded} kept=${kept} skipped=${skipped}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
