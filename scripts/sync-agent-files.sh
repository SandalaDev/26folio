#!/usr/bin/env bash
# sync-agent-files.sh — generate the harness instruction file from canonical AGENTS.md.
# Copy (not symlink) for Windows/MINGW64 compatibility. Run after editing AGENTS.md.
# Only CLAUDE.md is generated — this project runs one harness (Claude Code). Add a
# target here if another harness is adopted; don't hand-maintain a second copy.
set -euo pipefail
SRC="AGENTS.md"
[[ -f "$SRC" ]] || { echo "missing $SRC"; exit 1; }
BANNER="<!-- generated from AGENTS.md — do not edit; run scripts/sync-agent-files.sh -->"
{ echo "$BANNER"; echo; cat "$SRC"; } > CLAUDE.md
echo "[sync] CLAUDE.md regenerated from AGENTS.md"
