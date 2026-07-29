#!/usr/bin/env bash
# scripts/verify.sh — NON-BLOCKING sanity check for agent-os.
#
# This is not a quality gate. Quality is caught by tests (planned as backlog
# work — see the Testing methodology in OPERATING_MANUAL.md) and by manual
# review after the PR, both outside the system. What this script checks is the
# OS's own memory integrity — the things that, when broken, corrupt every
# future session:
#
#   1. Task frontmatter parses and has the minimal fields (when a task is given).
#   2. state.json is structurally consistent with the files it's derived from.
#
# Callers treat the exit code as INFORMATION, not a gate: `os end` reports and
# continues; CI shows it on the PR; nothing blocks a push.
#
# Usage: bash scripts/verify.sh [<task-file>]
set -euo pipefail

TASK="${1:-}"
FAIL=0

have_node() { command -v node >/dev/null 2>&1; }

section() { echo; echo "── $1"; }

# 1) Task metadata (only when a task is supplied)
section "task metadata"
if [[ -z "$TASK" ]]; then
  echo "  no task supplied — skipped"
elif [[ ! -f "$TASK" ]]; then
  echo "  ⚠ task file not found: $TASK"; FAIL=1
elif have_node; then
  node scripts/validate-task.mjs "$TASK" || FAIL=1
else
  echo "  skip (no node)"
fi

# 2) State consistency (structural only — counts are legitimately stale until render)
section "state consistency"
if have_node; then node scripts/render-state.mjs --check-structural || FAIL=1; else echo "  skip (no node)"; fi

echo
if [[ "$FAIL" -ne 0 ]]; then
  echo "[verify] issues found — see above. (Advisory: nothing is blocked; fix to keep state.json trustworthy.)"
  exit 1
fi
echo "[verify] sanity checks pass."
