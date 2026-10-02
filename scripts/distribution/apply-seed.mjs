#!/usr/bin/env node
// Export the staged manifest into a clean independent project.
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadManifest, classify } from "./resolve.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));

function listFiles(dir, base = dir, out = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) listFiles(full, base, out);
    else if (name.isFile()) out.push(path.relative(base, full).split(path.sep).join("/"));
  }
  return out;
}

function main() {
  const [stagedDir, targetDir, resolvedRef, profile = "frontend"] = process.argv.slice(2);
  if (!stagedDir || !targetDir || !resolvedRef) {
    console.error("Usage: apply-seed.mjs <stagedDir> <targetDir> <resolvedRef>");
    process.exit(2);
  }
  if (!["core","frontend"].includes(profile)) throw new Error("Profile must be core or frontend");
  const manifest = loadManifest(path.join(stagedDir,"scripts/distribution/manifest.json"));
  const hashes = {};
  const stagedFiles = listFiles(stagedDir);

  // ---- closed-list validation FIRST: refuse to write anything if any
  // staged file is unclassified. ----
  const unknown = stagedFiles
    .map(p => ({ path: p, ...classify(manifest, p) }))
    .filter(r => r.category === "unknown");
  if (unknown.length) {
    console.error("[scaffold] ERROR: unclassified path(s) in the source tree — refusing to scaffold:");
    for (const u of unknown) console.error(`  ${u.path}`);
    console.error("Add each path to scripts/distribution/manifest.json before scaffolding.");
    process.exit(1);
  }

  // ---- 1. machinery: recursive copy ----
  let machineryCount = 0;
  for (const rel of stagedFiles) {
    const { category } = classify(manifest, rel);
    if (category !== "machinery" || (profile === "core" && rel.startsWith("pack-frontend/"))) continue;
    hashes[rel] = crypto.createHash("sha256").update(fs.readFileSync(path.join(stagedDir,rel))).digest("hex");
    const src = path.join(stagedDir, rel);
    const dest = path.join(targetDir, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    machineryCount++;
  }

  // ---- 2. seed: per seed_treatment ----
  const seedEntries = manifest.entries.filter(e => e.category === "seed");
  let seedCount = 0;
  for (const entry of seedEntries) {
    if (entry.path.endsWith("/")) {
      const dirRel = entry.path.slice(0, -1);
      const dirDest = path.join(targetDir, dirRel);
      fs.mkdirSync(dirDest, { recursive: true });
      if (entry.seed_treatment === "empty-dir") {
        for (const keepName of entry.keep || []) {
          const keepPath = path.join(dirDest, keepName);
          if (!fs.existsSync(keepPath)) fs.writeFileSync(keepPath, "");
        }
      } else if (entry.seed_treatment === "as-is") {
        const dirSrc = path.join(stagedDir, dirRel);
        if (fs.existsSync(dirSrc)) {
          for (const rel of listFiles(dirSrc)) {
            const dest = path.join(dirDest, rel);
            fs.mkdirSync(path.dirname(dest), { recursive: true });
            fs.copyFileSync(path.join(dirSrc, rel), dest);
          }
        }
      } else {
        throw new Error(`unsupported directory seed_treatment '${entry.seed_treatment}' for ${entry.path}`);
      }
      seedCount++;
      continue;
    }

    const dest = path.join(targetDir, entry.path);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    switch (entry.seed_treatment) {
      case "as-is": {
        const src = path.join(stagedDir, entry.path);
        fs.copyFileSync(src, dest);
        break;
      }
      case "empty-file": {
        fs.writeFileSync(dest, "");
        break;
      }
      case "reset-template": {
        const templateSrc = path.join(stagedDir, entry.template);
        let content = fs.readFileSync(templateSrc, "utf8");
        if (entry.path === "project-state/state.json") {
          const parsed = JSON.parse(content);
          parsed.distribution = parsed.distribution || {};
          parsed.distribution.schema = "agent-os.distribution-compat.v1";
          parsed.distribution.template_ref = resolvedRef;
          parsed.distribution.profile = profile;
          parsed.distribution.scaffolded_at = new Date().toISOString();
          content = JSON.stringify(parsed, null, 2) + "\n";
        }
        fs.writeFileSync(dest, content);
        break;
      }
      default:
        throw new Error(`unsupported seed_treatment '${entry.seed_treatment}' for ${entry.path}`);
    }
    seedCount++;
  }

  const packagePath=path.join(targetDir,"package.json");
  const pkg=JSON.parse(fs.readFileSync(packagePath,"utf8"));
  for(const key of Object.keys(pkg.scripts||{})) if(key === "test" || key.startsWith("test:")) delete pkg.scripts[key];
  fs.writeFileSync(packagePath,JSON.stringify(pkg,null,2)+"\n");
  fs.writeFileSync(path.join(targetDir,"project-state/distribution-receipts.jsonl"), JSON.stringify({ref:resolvedRef,profile,at:new Date().toISOString(),files:hashes})+"\n");
  console.log(`[scaffold] copied ${machineryCount} machinery file(s), materialized ${seedCount} seed path(s).`);
}

main();
