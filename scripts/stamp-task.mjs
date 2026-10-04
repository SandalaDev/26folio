#!/usr/bin/env node
// stamp-task.mjs — update one task-frontmatter scalar while preserving the body.
// Default behavior is write-once; pass force=true for fields such as status
// that intentionally transition. The body after the closing delimiter is untouched.
import fs from "node:fs";
import { pathToFileURL } from "node:url";
import YAML from "yaml";

export function stampTask(file, key, value, { force = false } = {}) {
  if (!fs.existsSync(file)) throw new Error(`missing ${file}`);
  const source = fs.readFileSync(file, "utf8");
  const match = source.match(/^(---\r?\n)([\s\S]*?)(\r?\n---)([\s\S]*)$/);
  if (!match) throw new Error(`${file} has no YAML frontmatter`);

  let frontmatter;
  try { frontmatter = YAML.parse(match[2]) ?? {}; }
  catch (error) { throw new Error(`invalid YAML in ${file}: ${error.message}`); }

  if (!force && frontmatter[key] != null && frontmatter[key] !== "") {
    return { changed: false, value: frontmatter[key] };
  }

  frontmatter[key] = value;
  const eol = match[1].includes("\r\n") ? "\r\n" : "\n";
  const yaml = YAML.stringify(frontmatter, { lineWidth: 0 }).trimEnd().replace(/\n/g, eol);
  fs.writeFileSync(file, `---${eol}${yaml}${eol}---${match[4]}`, "utf8");
  return { changed: true, value };
}

function main() {
  const [file, key, value, flag] = process.argv.slice(2);
  if (!file || !key || value == null) {
    console.error("Usage: node scripts/stamp-task.mjs <file> <key> <value> [--set]");
    process.exit(2);
  }
  try {
    const result = stampTask(file, key, value, { force: flag === "--set" });
    console.log(`[stamp-task] ${result.changed ? (flag === "--set" ? "set" : "stamped") : "keeps"} ${file} ${key}=${result.value}`);
  } catch (error) {
    console.error(`[stamp-task] ${error.message}`);
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
