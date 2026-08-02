#!/usr/bin/env bash
# scripts/update-from-template.sh — port OS improvements from the template into an
# existing project that was cloned from it, WITHOUT clobbering project state.
#
# THE PROBLEM THIS SOLVES
# A cloned template contains two kinds of files with opposite needs:
#   - OS machinery (scripts/, .githooks/, .agents/, pack-frontend/, AGENTS.md,
#     OPERATING_MANUAL.md, setup.sh, .gitattributes) — should UPDATE to get fixes.
#   - Project-owned state (state.json, ledger.jsonl, backlog/, handoffs/,
#     project-spine/, decisions.md) — must NEVER be overwritten; that's
#     the project's memory.
# Blindly pulling template changes would clobber state.json and wipe the ledger.
# This script is selective: it updates machinery and preserves state by design.
#
# HOW IT WORKS
# It uses git to read the template at a given ref WITHOUT making it the project's
# remote. It supports two source modes:
#   1) A sibling directory:  --from ../agent-os-template  (a fresh clone of the template)
#   2) A git URL:            --from git@github.com:SandalaDev/agenticOS.git [--ref main]
# It copies machinery files into the working tree, then prints a summary of what
# changed so you can review and commit. It NEVER touches project-owned files.
#
# USAGE
#   bash scripts/update-from-template.sh --from <path-or-url> [--ref main] [--dry-run]
#
# SAFETY
#   --dry-run shows what would change without writing. Run it first.
#   Project-owned files are protected by an explicit allow-list; anything not on the
#   machinery list is left alone. The script refuses to run if it can't classify.
set -euo pipefail

# ── Machinery paths: these GET updated (overwritten) from the template ──────────
MACHINERY=(
  scripts/
  .githooks/
  .agents/skills/
  docs/                   # OS-authored docs (guide chapters, etc.) — machinery, not project content
  pack-frontend/
  AGENTS.md
  OPERATING_MANUAL.md
  README.md
  setup.sh
  .gitattributes
  package.json            # merged specially; never blindly overwritten
)

# ── Project-owned paths: NEVER touched, even if the template has them ──────────
# (Documented for clarity; the script protects these by ONLY copying MACHINERY.)
#   project-state/state.json, ledger.jsonl, AGENT_LOG.md, decisions.md
#   backlog/  handoffs/  planning/  memory/  project-spine/

# ── Config files: special handling (merge, don't clobber) ──────────────────────
# .gitignore is config — we never overwrite. We print a notice if
# the template's version changed so you can merge manually.

FROM=""; REF="main"; DRY=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --from) FROM="$2"; shift 2 ;;
    --ref)  REF="$2";  shift 2 ;;
    --dry-run) DRY=1; shift ;;
    *) echo "unknown arg: $1"; exit 2 ;;
  esac
done

[[ -n "$FROM" ]] || { echo "Usage: update-from-template.sh --from <path-or-url> [--ref main] [--dry-run]"; exit 2; }

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "=== update-from-template ==="
echo "  source: $FROM (ref: $REF)"
echo "  target: $ROOT"
[[ "$DRY" == "1" ]] && echo "  mode:   DRY-RUN (no files written)"

# ── Stage the template into a temp dir ─────────────────────────────────────────
if [[ -d "$FROM" ]]; then
  # Local sibling directory.
  echo "  reading template from local directory"
  (cd "$FROM" && git archive "$REF" | tar -x -C "$TMP") 2>/dev/null || {
    # fallback: plain copy if it's not a git repo
    cp -r "$FROM"/. "$TMP"/ 2>/dev/null || true
  }
else
  # Remote URL: clone shallow into temp, checkout the ref.
  echo "  cloning template from URL..."
  git clone --quiet --depth 1 --branch "$REF" "$FROM" "$TMP/src" 2>/dev/null || {
    echo "ERROR: could not clone '$FROM' at ref '$REF'." >&2; exit 1; }
  # Move contents up so $TMP mirrors a repo root.
  cp -r "$TMP/src"/. "$TMP"/ && rm -rf "$TMP/src"
fi

[[ -f "$TMP/scripts/os.sh" ]] || { echo "ERROR: source doesn't look like an agent-os template (no scripts/os.sh)." >&2; exit 1; }

# ── Copy machinery paths ───────────────────────────────────────────────────────
echo
echo "── updating OS machinery ──"
changed=0
for m in "${MACHINERY[@]}"; do
  [[ "$m" == "package.json" ]] && continue
  src="$TMP/$m"
  [[ -e "$src" ]] || continue
  if [[ "$m" == */ ]]; then
    # Directory: rsync-like copy (overwrite machinery files).
    mkdir -p "$ROOT/$m"
    if [[ "$DRY" == "1" ]]; then
      echo "  [would update] $m"
    else
      cp -r "$src". "$ROOT/$m"
      echo "  [updated] $m"
    fi
    changed=1
  else
    if [[ "$DRY" == "1" ]]; then
      echo "  [would update] $m"
    else
      cp "$src" "$ROOT/$m"
      echo "  [updated] $m"
    fi
    changed=1
  fi
done

# ── package.json: merge the yaml dep, don't clobber project deps ───────────────
echo
echo "── config merge ──"
if [[ -f "$TMP/package.json" ]]; then
  if [[ ! -f "$ROOT/package.json" ]]; then
    [[ "$DRY" == 0 ]] && cp "$TMP/package.json" "$ROOT/package.json"
    echo "  [package.json] added (project had none)"
  else
    # Merge only the exact, reviewed OS runtime dependency. Preserve all project
    # packages. A conflicting yaml version needs an explicit evidence plan.
    yaml_spec=$(node -e 'try{const p=require("./package.json");process.stdout.write(String(p.dependencies&&p.dependencies.yaml||""))}catch{}' 2>/dev/null || true)
    if [[ -n "$yaml_spec" && "$yaml_spec" != "2.9.0" ]]; then
      echo "ERROR: project declares yaml '$yaml_spec'; reviewed OS baseline is 2.9.0." >&2
      echo "Research first: bash scripts/os.sh deps plan add \"OS yaml alignment\" yaml@2.9.0" >&2
      exit 1
    elif [[ -z "$yaml_spec" ]]; then
      if [[ "$DRY" == 0 ]]; then
        node scripts/deps.mjs path yaml@2.9.0 >/dev/null
        node -e 'const fs=require("fs");const p=JSON.parse(fs.readFileSync("package.json","utf8"));p.dependencies={...(p.dependencies||{}),yaml:"2.9.0"};fs.writeFileSync("package.json",JSON.stringify(p,null,2)+"\n")'
        npm install --package-lock-only --ignore-scripts --save-exact yaml@2.9.0 >/dev/null
      fi
      echo "  [package.json] added reviewed exact dependency yaml@2.9.0"
    else
      echo "  [package.json] unchanged (reviewed yaml@2.9.0 already present)"
    fi
  fi
fi

# ── Warn on config that should be merged by hand ───────────────────────────────
for cfg in .gitignore; do
  if [[ -f "$TMP/$cfg" && -f "$ROOT/$cfg" ]] && ! diff -q "$TMP/$cfg" "$ROOT/$cfg" >/dev/null 2>&1; then
    echo "  [note] $cfg differs from template — review and merge by hand (project version preserved)"
  fi
done

# ── Re-wire hooks (the update may have changed them) ───────────────────────────
if [[ "$DRY" == 0 ]]; then
  git config core.hooksPath .githooks 2>/dev/null || true
  echo
  echo "── re-wired core.hooksPath = $(git config core.hooksPath) ──"
  # Consult exact source + resolver before any package payload is installed.
  node scripts/deps.mjs baseline
  # Ensure deps are present (an updated render script may need a freshly-added dep).
  if ! node -e "require('yaml')" 2>/dev/null; then
    echo "── installing reviewed dependencies (yaml@2.9.0) ──"
    npm install >/dev/null 2>&1 || echo "  (npm install failed — run it manually)"
  fi
fi

echo
echo "=== done ==="
if [[ "$DRY" == 1 ]]; then
  echo "Dry run complete — no files changed. Re-run without --dry-run to apply."
else
  echo "Machinery updated. Project state (state.json, ledger, backlog, handoffs) untouched."
  echo "Next:"
  echo "  git add -A && git diff --cached           # review the changes"
  echo "  bash setup.sh                             # re-wire hooks if the hook files changed"
  echo "  bash scripts/os.sh check                  # confirm consistency"
  echo "  git commit -m 'chore: update OS machinery from template'"
fi
