#!/usr/bin/env bash
# sync-agent-files.sh — generate per-harness instruction files from canonical AGENTS.md.
# Copies (not symlinks) for Windows/MINGW64 compatibility. Run after editing AGENTS.md.
set -euo pipefail
SRC="AGENTS.md"
[[ -f "$SRC" ]] || { echo "missing $SRC"; exit 1; }
BANNER="<!-- generated from AGENTS.md — do not edit; run scripts/sync-agent-files.sh -->"
for target in CLAUDE.md CODEX.md GEMINI.md; do
  { echo "$BANNER"; echo; cat "$SRC"; } > "$target"
  echo "  wrote $target"
done
echo "[sync] per-harness files regenerated from AGENTS.md"
