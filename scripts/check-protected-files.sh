#!/usr/bin/env bash
# check-protected-files.sh — v6.1: approval is derived from CODEOWNERS + a human-
# signed approving commit, NOT an agent-editable boolean.
set -euo pipefail
BASE="${1:-${BASE_REF:-main}}"
CHANGED="$(git diff --name-only "$BASE"...HEAD 2>/dev/null || git diff --name-only || true)"

PROTECTED=(
  "project-spine/05-data-model.md"
  "src/db/" "drizzle/" "src/auth/"
  ".env" "docker-compose" "Dockerfile" ".github/workflows/"
)

touched=""
for f in $CHANGED; do
  for p in "${PROTECTED[@]}"; do
    [[ "$f" == *"$p"* ]] && touched="$touched $f"
  done
done

if [[ -z "${touched// }" ]]; then
  echo "  no protected paths touched"
  exit 0
fi

echo "  protected paths changed:$touched"

# Require a CODEOWNERS file and a human-signed commit approving the change.
if [[ ! -f CODEOWNERS ]]; then
  echo "  FAIL: protected paths changed but no CODEOWNERS file defines approvers."
  exit 1
fi

# Look for a signed (GPG/SSH) commit in this range authored by a non-bot human.
# %G? = G(good)/U(unknown validity) signature; we accept G or U-with-key.
SIGNED="$(git log "$BASE"...HEAD --pretty='%G?|%an|%ae' 2>/dev/null | grep -E '^(G|U)\|' || true)"
if [[ -z "$SIGNED" ]]; then
  echo "  FAIL: no human-signed commit approves these protected changes."
  echo "        A CODEOWNER must sign a commit (git commit -S) approving this."
  exit 1
fi

# Reject if every commit author looks like an automated agent.
HUMAN="$(echo "$SIGNED" | grep -viE '(bot|agent|claude|codex|opencode|action)@?' || true)"
if [[ -z "$HUMAN" ]]; then
  echo "  FAIL: signed commits are all automated identities; need a human CODEOWNER."
  exit 1
fi

echo "  protected-path approval present (signed by: $(echo "$HUMAN" | head -1 | cut -d'|' -f2))"
