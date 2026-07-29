#!/usr/bin/env bash
# pack-frontend/elicit-phase.sh — ONE parameterized elicitation phase script.
#
# Replaces the legacy design.sh / content.sh / ui.sh (which were ~85% duplicated).
# Each phase has the same shape: a questionnaire you answer + references you supply
# -> a fail-closed `ready` gate -> an agent generates the artifact -> you approve.
#
# The preview-gate (ported from design.sh): the design phase requires you to OPEN
# the rendered HTML in a browser and inspect it before approving. Never approve
# unseen. content/ui phases have no preview (they're prose, not visual).
#
# Status checks use REAL frontmatter parsing (read-fm.mjs), not grep for literal
# placeholder strings — the legacy grep approach false-failed on real answers.
#
# Usage: bash pack-frontend/elicit-phase.sh <phase> <subcommand>
#   phase:       design | content | ui
#   subcommand:  questionnaire | ready | preview | status
set -euo pipefail

PHASE="${1:-}"
CMD="${2:-help}"
SPINE="project-spine"
have_node() { command -v node >/dev/null 2>&1; }

# Per-phase configuration (the only thing that differs between phases).
phase_config() {
  case "$PHASE" in
    design)
      NUM=10; NAME="design-system"; TITLE="Design System"
      PREREQ=""; HAS_PREVIEW=1; REFS_REQUIRED=1
      ARTIFACT="$SPINE/10-design-system.md"; HTML="$SPINE/10-design-system.html";;
    content)
      NUM=11; NAME="content-strategy"; TITLE="Content Strategy"
      PREREQ="$SPINE/10-design-system.md"; HAS_PREVIEW=0; REFS_REQUIRED=0
      ARTIFACT="$SPINE/11-content-strategy.md"; HTML="";;
    ui)
      NUM=12; NAME="ui-element-map"; TITLE="UI Element Map"
      PREREQ="$SPINE/11-content-strategy.md"; HAS_PREVIEW=0; REFS_REQUIRED=0
      ARTIFACT="$SPINE/12-ui-element-map.md"; HTML="";;
    *) echo "[elicit] unknown phase '$PHASE' (use design|content|ui)"; exit 2;;
  esac
}
phase_config
QUEST="$SPINE/${NUM}-${NAME}.QUESTIONNAIRE.md"
REFS_DIR="$SPINE/references/${PHASE}/"   # references/design/ etc.

fm() { have_node && node scripts/read-fm.mjs "$1" "$2" 2>/dev/null || true; }

cmd_questionnaire() {
  [[ -d "$SPINE" ]] || mkdir -p "$SPINE/references/design" "$SPINE/references/content" "$SPINE/references/ui"
  if [[ -f "$QUEST" ]]; then echo "[elicit] $QUEST already exists — answer it."; exit 0; fi
  cat > "$QUEST" <<EOF
---
phase: $PHASE
status: draft
references_required: $REFS_REQUIRED
has_preview: $HAS_PREVIEW
---
# $TITLE — Questionnaire

Answer each section inline (or write "none"). Drop screenshots/links into
\`references/${PHASE}/\` and reference them below.

## 1. Brief
What is this project, in one sentence? Who is it for?

## 2. References
Links or files (in references/${PHASE}/) that capture the look/feel/structure you want.

## 3. Constraints
Accessibility, brand, performance, tone — anything non-negotiable.

## 4. Notes
Anything else an agent drafting $TITLE should know.
EOF
  echo "[elicit] wrote $QUEST — answer it, set status: ready."
  [[ "$REFS_REQUIRED" == "1" ]] && echo "[elicit] ⚠ this phase REQUIRES at least one visual reference in $REFS_DIR"
}

# ready gate: status:ready + (if references required) at least one reference present.
cmd_ready() {
  [[ -f "$QUEST" ]] || { echo "[elicit] FAIL: $QUEST missing — run 'questionnaire'."; exit 1; }
  local status; status="$(fm "$QUEST" status)"
  [[ "$status" == "ready" ]] || { echo "[elicit] FAIL: $QUEST status is '$status' (need 'ready')."; exit 1; }
  # Reference requirement (design phase). A file OR an https link in the questionnaire.
  if [[ "$REFS_REQUIRED" == "1" ]]; then
    local has_ref=0
    [[ -d "$REFS_DIR" ]] && [[ -n "$(ls -A "$REFS_DIR" 2>/dev/null)" ]] && has_ref=1
    grep -qE 'https?://' "$QUEST" 2>/dev/null && has_ref=1
    [[ "$has_ref" == "1" ]] || { echo "[elicit] FAIL: $TITLE requires at least one visual reference in $REFS_DIR or an https link."; exit 1; }
  fi
  # Prerequisite phase must be approved (content needs design approved, etc.).
  if [[ -n "$PREREQ" && -f "$PREREQ" ]]; then
    local ps; ps="$(fm "$PREREQ" status)"
    [[ "$ps" == "approved" ]] || { echo "[elicit] FAIL: prerequisite $PREREQ status is '$ps' (need 'approved')."; exit 1; }
  fi
  echo "READY: $TITLE questionnaire complete. An agent may now generate $ARTIFACT."
}

# preview gate (design only): refuse to approve until the agent has generated both
# the .md AND the rendered .html, and you've inspected the .html.
cmd_preview() {
  [[ "$HAS_PREVIEW" == "1" ]] || { echo "[elicit] preview is for the design phase only."; exit 0; }
  [[ -f "$ARTIFACT" ]] || { echo "[elicit] FAIL: $ARTIFACT not generated yet."; exit 1; }
  [[ -f "$HTML" ]] || { echo "[elicit] FAIL: $HTML not generated yet — the agent must render the tokens to HTML so you can SEE them."; exit 1; }
  echo "PREVIEW READY: open $HTML in a browser, inspect it, iterate until right."
  echo "Only then set $ARTIFACT status: approved (never approve unseen)."
}

cmd_status() {
  printf '%s (%s):\n' "$TITLE" "$PHASE"
  [[ -f "$QUEST" ]]   && printf '  questionnaire: %s\n' "$(fm "$QUEST" status)"   || printf '  questionnaire: (not created)\n'
  [[ -f "$ARTIFACT" ]] && printf '  artifact:     %s\n' "$(fm "$ARTIFACT" status)" || printf '  artifact:     (not generated)\n'
  [[ -n "$PREREQ" && -f "$PREREQ" ]] && printf '  prereq:       %s (%s)\n' "$PREREQ" "$(fm "$PREREQ" status)"
}

case "$CMD" in
  questionnaire) cmd_questionnaire ;;
  ready)         cmd_ready ;;
  preview)       cmd_preview ;;
  status)        cmd_status ;;
  *) echo "Usage: bash pack-frontend/elicit-phase.sh <design|content|ui> <questionnaire|ready|preview|status>" ;;
esac
