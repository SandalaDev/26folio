#!/usr/bin/env node
// .agents/skills/stop-slop/score.mjs — deterministic AI-slop scorer.
// Writes planning/content/.slop/<basename>.score.json for each public-text file.
// --verify <files...> : recompute and FAIL (exit 1) if any file scores < 35/50
//                       or its score artifact is missing/disagrees.
import fs from "node:fs";
import path from "node:path";

const TELLS = [
  /\bin today'?s (fast-paced|ever-changing|digital) world\b/i,
  /\bit'?s (important|worth) (to note|noting)\b/i,
  /\bwhether you'?re a [^.]+ or a [^.]+/i,   // binary contrast
  /\b(unlock|elevate|empower|seamless(ly)?|robust|leverage|cutting-edge|game-?changer)\b/i,
  /\bnot only [^,]+, but also\b/i,
  /—/,                                        // em dash
  /\bdelve\b/i,
];
const DIMS = ["openers","jargon","contrast","emdash","agency"]; // 10 pts each = 50

function scoreText(t) {
  let penalties = 0;
  for (const re of TELLS) { const hits = (t.match(new RegExp(re, "gi")) || []).length; penalties += Math.min(hits, 6); }
  const raw = Math.max(0, 50 - penalties * 4);
  return Math.min(50, raw);
}

const args = process.argv.slice(2);
const verify = args[0] === "--verify";
const files = (verify ? args.slice(1) : args).join(" ").split(/\s+/).filter(Boolean)
  .filter(f => /\.(md|mdx|txt|html?)$/i.test(f) && fs.existsSync(f));

const outDir = "planning/content/.slop";
fs.mkdirSync(outDir, { recursive: true });
let fail = 0;
for (const f of files) {
  const score = scoreText(fs.readFileSync(f, "utf8"));
  const artifact = path.join(outDir, path.basename(f) + ".score.json");
  const payload = { file: f, score, max: 50, threshold: 35, computed: new Date().toISOString() };
  if (verify) {
    if (!fs.existsSync(artifact)) { console.error(`  missing score artifact for ${f}`); fail = 1; continue; }
    if (score < 35) { console.error(`  ${f}: ${score}/50 (< 35) — revise, do not ship`); fail = 1; }
    else console.log(`  ${f}: ${score}/50 — pass`);
  } else {
    fs.writeFileSync(artifact, JSON.stringify(payload, null, 2));
    console.log(`  ${f}: ${score}/50 -> ${artifact}`);
  }
}
process.exit(fail);
