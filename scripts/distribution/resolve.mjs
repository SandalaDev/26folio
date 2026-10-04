// Classify distribution paths: exact match, then longest directory prefix.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_MANIFEST = path.join(HERE, "manifest.json");

export function loadManifest(manifestPath = DEFAULT_MANIFEST) {
  const raw = fs.readFileSync(manifestPath, "utf8");
  const manifest = JSON.parse(raw);
  if (manifest.schema !== "agent-os.distribution-manifest.v1") {
    throw new Error(`unrecognized manifest schema: ${manifest.schema}`);
  }
  return manifest;
}

function normalize(relPath) {
  return relPath.split(path.sep).join("/").replace(/^\.\//, "");
}

// Returns { category, entry, implicit } or { category: "unknown" }.
export function classify(manifest, relPath) {
  const rel = normalize(relPath);

  const exact = manifest.entries.find(e => !e.path.endsWith("/") && e.path === rel);
  if (exact) return { category: exact.category, entry: exact, implicit: false };

  const dirMatches = manifest.entries
    .filter(e => e.path.endsWith("/") && (rel === e.path.slice(0, -1) || rel.startsWith(e.path)))
    .sort((a, b) => b.path.length - a.path.length);

  if (dirMatches.length === 0) return { category: "unknown" };

  const entry = dirMatches[0];
  if (entry.seed_treatment === "empty-dir") {
    const base = path.posix.basename(rel);
    const keep = entry.keep || [];
    if (rel === entry.path.slice(0, -1)) return { category: entry.category, entry, implicit: false };
    if (keep.includes(base)) return { category: entry.category, entry, implicit: false };
    return { category: "template_dev_only", entry, implicit: true };
  }
  return { category: entry.category, entry, implicit: false };
}

// Validate every path in `trackedPaths` (repo-relative, forward-slash or
// native separators) against the manifest. Returns unknown paths (empty on
// success).
export function findUnknown(manifest, trackedPaths) {
  return trackedPaths
    .map(p => ({ path: p, ...classify(manifest, p) }))
    .filter(r => r.category === "unknown");
}
