#!/usr/bin/env bash
# scripts/ui.sh — Phase 6. Gated on an APPROVED content strategy. Walks the approved
# sitemap and elicits how each content block is PRESENTED. References matter most here:
# "the hero like this screenshot, the cards like that link." The generated
# 12-ui-element-map.md maps every content block to an exact UI element + source + ref.
#
# Flow:
#   questionnaire  scaffold 12-ui-element-map.QUESTIONNAIRE.md + references/ui/
#   ready          fail-closed: content approved AND questionnaire answered
set -euo pipefail
SPINE="project-spine"
CONTENT="$SPINE/11-content-strategy.md"
Q="$SPINE/12-ui-element-map.QUESTIONNAIRE.md"
OUT="$SPINE/12-ui-element-map.md"
REF="$SPINE/references/ui"

require_content_approved() {
  [[ -s "$CONTENT" ]] || { echo "[ui] $CONTENT missing — finish Phase 5 first."; exit 1; }
  grep -q '^status: approved' "$CONTENT" || { echo "[ui] content strategy is not status: approved — approve it before UI."; exit 1; }
}

cmd_questionnaire() {
  require_content_approved
  mkdir -p "$REF"
  if [[ -s "$Q" ]]; then echo "[ui] $Q already exists — edit it, don't overwrite."; exit 0; fi
  cat > "$Q" <<'MD'
---
id: UI-ELEMENT-MAP-QUESTIONNAIRE
status: open            # open -> answered
phase: 6
---
# UI Element Map Questionnaire
> For each page in the APPROVED sitemap, specify how each content block is presented.
> This is the most reference-driven phase: cite a screenshot or link per block.
> Set status: answered when done, then run: bash scripts/ui.sh ready

## Component sources allowed
- [ ] Preference order (e.g. shadcn/ui first, 21st.dev for hero/feature, custom last):

## Per page / per block
> Repeat this block for every page and every section in it.
### Page: [route]
- block: [e.g. hero]
  present-as: [e.g. split hero with animated headline]
  source: [shadcn | 21st.dev | custom]
  reference: [filename in references/ui/ or URL]
  motion: [e.g. Framer fade-up on entry]
- block:
  present-as:
  source:
  reference:
  motion:

## Global elements
- [ ] Header/nav treatment + reference:
- [ ] Footer treatment + reference:
- [ ] Hard nos (elements/patterns you refuse):
MD
  echo "[ui] created $Q and $REF/ — answer it per page, then: bash scripts/ui.sh ready"
}

cmd_ready() {
  require_content_approved
  local ok=1
  if [[ ! -s "$Q" ]]; then echo "  MISSING: $Q (run: ui.sh questionnaire)"; ok=0
  else
    grep -q '^status: answered' "$Q" || { echo "  $Q is not status: answered"; ok=0; }
    grep -q '^- \[ \]' "$Q" && { echo "  $Q has unanswered prompts"; ok=0; }
  fi
  if [[ "$ok" -eq 1 ]]; then
    echo "[ui] READY — content approved, questionnaire answered."
    echo "[ui] next: agent generates $OUT (block → exact element); you set status: approved. Project start complete."
  else
    echo "[ui] NOT READY — resolve the above before generating the UI element map."; exit 1
  fi
}

case "${1:-help}" in
  questionnaire) cmd_questionnaire ;;
  ready)         cmd_ready ;;
  *) echo "Usage: bash scripts/ui.sh [questionnaire|ready]" ;;
esac
