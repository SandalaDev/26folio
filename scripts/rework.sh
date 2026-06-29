#!/usr/bin/env bash
# scripts/rework.sh — capture review feedback as a repo artifact that blocks
# task closure until resolved. The DIRECT COMMAND is the source of truth;
# the GitHub adapter is an optional convenience that lands feedback here too.
#
#   rework.sh open    TASK-XXX "feedback text"   open a rework item (you)
#   rework.sh resolve TASK-XXX 001 "what I did"  mark item resolved (agent)
#   rework.sh close   TASK-XXX                   accept (fails unless all resolved)
#   rework.sh status  TASK-XXX                   exit 1 if any item open
#   rework.sh list    TASK-XXX
#   rework.sh from-github <PR_URL_or_number> TASK-XXX   optional adapter (needs gh)
set -euo pipefail
have_node() { command -v node >/dev/null 2>&1; }
have_node || { echo "[rework] needs node"; exit 1; }

cmd="${1:-help}"; shift || true

case "$cmd" in
  open|resolve|close|status|list)
    node scripts/rework.mjs "$cmd" "$@"
    ;;
  from-github)
    # Optional GitHub adapter. Reads PR review comments via the gh CLI and
    # materializes each as a rework item. The PR thread is only the INPUT;
    # the artifact in handoffs/rework/ remains the source of truth.
    PR="${1:-}"; TASK="${2:-}"
    [[ -n "$PR" && -n "$TASK" ]] || { echo "Usage: rework.sh from-github <PR> TASK-XXX"; exit 2; }
    command -v gh >/dev/null 2>&1 || { echo "[rework] gh CLI not found — install it or use 'rework.sh open' directly"; exit 1; }
    # Pull review comments (body + path + line) as TSV; one rework item each.
    gh pr view "$PR" --json reviews,comments \
      --jq '(.reviews[]?.body // empty), (.comments[]?.body // empty)' 2>/dev/null \
      | while IFS= read -r line; do
          [[ -z "${line// }" ]] && continue
          REVIEWER_NAME="github-pr" node scripts/rework.mjs open "$TASK" "$line"
        done
    echo "[rework] imported PR feedback into handoffs/rework/REWORK-${TASK}.md (source of truth)."
    ;;
  *)
    echo "Usage: bash scripts/rework.sh [open|resolve|close|status|list TASK-XXX ...|from-github <PR> TASK-XXX]"
    ;;
esac
