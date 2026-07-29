#!/usr/bin/env node
// score.mjs — the stop-slop prose scorer (REBUILT).
//
// The legacy version claimed 5 dimensions but implemented a flat 7-regex counter
// (the DIMS array was dead code). This version reads rule DATA from
// references/tells.json and scores 5 REAL dimensions (10 pts each = 50).
// Rules are externalised — add a tell by editing the JSON, no code change.
//
// Usage:
//   node score.mjs <file>...              # score + write .slop/<file>.score.json
//   node score.mjs --verify <file>...      # recompute; exit 1 if artifact missing or < 35
//   node score.mjs --help
import fs from "node:fs";
import path from "node:path";

const HERE = import.meta.dirname;
const RULES_FILE = path.join(HERE, "references", "tells.json");
const THRESHOLD = 35;
const MAX = 50;
const OUT_DIR = "planning/content/.slop";

function loadRules() {
  if (!fs.existsSync(RULES_FILE)) {
    console.error(`[stop-slop] missing rule corpus: ${RULES_FILE}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(RULES_FILE, "utf8"));
}

function scoreText(text, dimensions) {
  const lower = text.toLowerCase();
  const perDim = {};
  let total = MAX;
  for (const [name, dim] of Object.entries(dimensions)) {
    let hits = 0;
    for (const tell of dim.tells || []) {
      if (dim._regex) {
        try { hits += (lower.match(new RegExp(tell, "g")) || []).length; } catch {}
      } else {
        let idx = 0;
        while ((idx = lower.indexOf(tell, idx)) !== -1) { hits++; idx += tell.length; }
      }
    }
    // Cap hits per dimension so one repeated tell can't alone floor it.
    const capped = Math.min(hits, 6);
    const deduction = Math.min(capped * (dim.penalty || 2), 10);
    perDim[name] = { hits, deduction, score: 10 - deduction };
    total -= deduction;
  }
  return { total: Math.max(0, total), perDim };
}

function scoreFile(file, rules) {
  if (!fs.existsSync(file)) return null;
  const text = fs.readFileSync(file, "utf8");
  const { total, perDim } = scoreText(text, rules.dimensions);
  return { file, score: total, max: MAX, threshold: THRESHOLD, dimensions: perDim, computed: new Date().toISOString() };
}

function writeArtifact(result) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const base = path.basename(result.file).replace(/\.[^.]+$/, "");
  const out = path.join(OUT_DIR, `${base}.score.json`);
  fs.writeFileSync(out, JSON.stringify(result, null, 2) + "\n");
  return out;
}

const args = process.argv.slice(2);
if (args.includes("--help") || !args.length) {
  console.log(`stop-slop scorer — scores public text across 5 dimensions (max ${MAX}, pass ${THRESHOLD}).
Usage:
  node score.mjs <file>...          score files, write .slop/<file>.score.json
  node score.mjs --verify <file>... recompute; exit 1 if artifact missing or < ${THRESHOLD}`);
  process.exit(0);
}

const verify = args.includes("--verify");
const files = args.filter(a => !a.startsWith("--"));
const validExts = [".md", ".mdx", ".txt", ".html", ".csv"];
const toScore = files.filter(f => validExts.some(e => f.endsWith(e)) && fs.existsSync(f));

if (!toScore.length) { console.log("[stop-slop] no scorable files (expect .md/.mdx/.txt/.html)."); process.exit(0); }

const rules = loadRules();
let anyFail = false;

for (const file of toScore) {
  const result = scoreFile(file, rules);
  if (verify) {
    // Gate mode: recompute and compare against any existing artifact.
    const base = path.basename(file).replace(/\.[^.]+$/, "");
    const art = path.join(OUT_DIR, `${base}.score.json`);
    if (!fs.existsSync(art)) {
      console.error(`  [stop-slop] NO SCORE ARTIFACT for ${file} — run score.mjs first`);
      anyFail = true; continue;
    }
    const existing = JSON.parse(fs.readFileSync(art, "utf8"));
    if (existing.score !== result.score) {
      console.error(`  [stop-slop] SCORE MISMATCH ${file}: artifact=${existing.score} recomputed=${result.score}`);
      anyFail = true; continue;
    }
    if (result.score < THRESHOLD) {
      console.error(`  [stop-slop] FAIL ${file}: ${result.score}/${MAX} (threshold ${THRESHOLD})`);
      anyFail = true; continue;
    }
    console.log(`  [stop-slop] ok ${file}: ${result.score}/${MAX}`);
  } else {
    const out = writeArtifact(result);
    const dimStr = Object.entries(result.dimensions).map(([k, v]) => `${k}:${v.score}`).join(" ");
    console.log(`  [stop-slop] ${file}: ${result.score}/${MAX}  [${dimStr}]  -> ${out}`);
    if (result.score < THRESHOLD) anyFail = true;
  }
}

process.exit(anyFail ? 1 : 0);
