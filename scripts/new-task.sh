#!/usr/bin/env bash
# scripts/new-task.sh — scaffold a well-formed task or epic.
#
# Writes a valid skeleton so the agent fills in content, not boilerplate. The
# frontmatter is deliberately minimal: enough for state derivation and planning,
# no process ceremony. Testing is PLANNED WORK, not a gate: the Testing section
# is where the planning agent records what testing (if any) this work warrants —
# and, when warranted, creates a dedicated test task alongside it.
#
# Usage:
#   bash scripts/new-task.sh task <ID> "<title>" [epic] [risk]
#   bash scripts/new-task.sh epic <ID> "<title>"
set -euo pipefail

KIND="${1:-}"; ID="${2:-}"; TITLE="${3:-}"

[[ -n "$ID" && -n "$TITLE" ]] || { echo "Usage: new-task.sh <task|epic> <ID> \"<title>\" [epic] [risk]"; exit 2; }

scaffold_task() {
  local epic="${4:-EPIC-001}"; local risk="${5:-medium}"
  local f="backlog/tasks/${ID}.md"
  [[ -f "$f" ]] && { echo "[new-task] $f already exists."; exit 0; }
  mkdir -p "$(dirname "$f")"
  cat > "$f" <<EOF
---
id: ${ID}
title: "${TITLE}"
status: ready
priority: P2
risk_level: ${risk}
epic_ref: backlog/epics/${epic}.md
progress_weight: 1
files_allowed: []          # advisory focus list — helps the agent stay scoped; not enforced
skill_refs: []
---
# Task: ${TITLE}
## Scope
What this task implements.
## Acceptance Criteria
- [ ] criterion 1
## Dependency Evidence
- plan: none
<!-- If this task adds, upgrades, or replaces a package, invoke
     opensrc-research and replace none with planning/dependencies/DEP-....md
     before changing the package manifest. -->
## Testing
<!-- Filled by the planning agent. Assess: what could break, and what testing
     (if any) this warrants. "none" is a valid answer — say why. If a dedicated
     test task is warranted, create it (new-task.sh task TASK-XXX "tests: ...")
     and reference it here. Tests never block a push; they are backlog work the
     human prioritizes. Guide by risk: low → usually none; medium → happy-path
     coverage with the task; high/critical → recommend a dedicated test task. -->
- recommendation: (none | with-task | dedicated: TASK-XXX)
- rationale:
## Notes
EOF
  echo "[new-task] wrote $f — fill in scope, acceptance criteria, and the Testing recommendation."
}

scaffold_epic() {
  local f="backlog/epics/${ID}.md"
  [[ -f "$f" ]] && { echo "[new-task] $f already exists."; exit 0; }
  mkdir -p "$(dirname "$f")"
  cat > "$f" <<EOF
---
id: ${ID}
title: "${TITLE}"
status: draft
priority: P2
roadmap_refs: []            # e.g. [ROAD-001]
goal_refs: []               # e.g. [GOAL-001]
progress_weight: 1
---
# Epic: ${TITLE}
## Outcome
What business/user outcome this epic advances.
## Scope
## Tasks
- [ ] (use new-task.sh task TASK-XXX "title" ${ID} risk)
## Dependency / Architecture Evidence
- plan: none
<!-- Link an OpenSrc architecture or initial dependency plan when this epic
     selects a system-wide technical foundation or package set. -->
## Testing
<!-- Filled by the planning agent after slicing tasks. Recommend the testing
     approach for the epic as a whole: none (why) | per-task coverage | a
     dedicated test task or epic. The human accepts or declines by prioritizing
     the backlog — testing is planned work, never a gate. -->
- recommendation:
- rationale:
EOF
  echo "[new-task] wrote $f — define outcome + scope, add tasks, then record the Testing recommendation."
}

case "$KIND" in
  task) scaffold_task "$@" ;;
  epic) scaffold_epic "$@" ;;
  *) echo "Usage: new-task.sh <task|epic> <ID> \"<title>\" [epic] [risk]"; exit 2 ;;
esac
