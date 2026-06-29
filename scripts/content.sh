#!/usr/bin/env bash
# scripts/content.sh — Phase 5. Gated on an APPROVED, visually-inspected design system. Elicits the
# content strategy AND the explicit site structure: the generated 11-content-strategy.md
# must prescribe a sitemap, a per-page content outline, and a content inventory.
#
# Flow:
#   questionnaire  scaffold 11-content-strategy.QUESTIONNAIRE.md + references/content/
#   ready          fail-closed: design approved AND questionnaire answered
set -euo pipefail
SPINE="project-spine"
DESIGN="$SPINE/10-design-system.md"
PREVIEW="$SPINE/10-design-system.html"
Q="$SPINE/11-content-strategy.QUESTIONNAIRE.md"
OUT="$SPINE/11-content-strategy.md"
REF="$SPINE/references/content"

require_design_approved() {
  [[ -s "$DESIGN" ]] || { echo "[content] $DESIGN missing — finish Phase 4 first."; exit 1; }
  [[ -s "$PREVIEW" ]] || { echo "[content] $PREVIEW missing — Phase 4 requires a rendered visual reference you inspected before approving. Run: bash scripts/design.sh preview"; exit 1; }
  grep -q '^status: approved' "$DESIGN" || { echo "[content] design system is not status: approved — inspect the preview, iterate, then approve before content."; exit 1; }
}

cmd_questionnaire() {
  require_design_approved
  mkdir -p "$REF"
  if [[ -s "$Q" ]]; then echo "[content] $Q already exists — edit it, don't overwrite."; exit 0; fi
  cat > "$Q" <<'MD'
---
id: CONTENT-STRATEGY-QUESTIONNAIRE
status: open            # open -> answered
phase: 5
---
# Content Strategy & Structure Questionnaire
> Answer every prompt. The generated 11-content-strategy.md must come out the other
> side with a concrete sitemap and per-page content — not just "voice and tone".
> Set status: answered when done, then run: bash scripts/content.sh ready

## Visual references (tone / layout)
- ref: [filename in references/content/ or URL]
  like: [what about its content/structure you want]

## 1. Audience
- [ ] Primary audience (who must this convert?):
- [ ] Secondary audiences:
- [ ] What each should DO (the conversion action):

## 2. Voice & tone
- [ ] Three words for the voice:
- [ ] Things to never sound like:

## 3. Site structure (REQUIRED — be concrete)
- [ ] List every page/route the site needs:
- [ ] For each page: its single job in one sentence:
- [ ] The primary call-to-action per page:

## 4. Per-page content
- [ ] For each page, the sections/blocks it must contain:
- [ ] What proof appears where (case studies, testimonials, metrics, logos):

## 5. Content inventory
- [ ] What content already exists (paths/links):
- [ ] What must be newly created (and by whom):

## 6. SEO intent
- [ ] Search intents / keywords that matter:
- [ ] Canonical domain, OG image policy:
MD
  echo "[content] created $Q and $REF/ — answer it, then: bash scripts/content.sh ready"
}

cmd_ready() {
  require_design_approved
  local ok=1
  if [[ ! -s "$Q" ]]; then echo "  MISSING: $Q (run: content.sh questionnaire)"; ok=0
  else
    grep -q '^status: answered' "$Q" || { echo "  $Q is not status: answered"; ok=0; }
    grep -q '^- \[ \]' "$Q" && { echo "  $Q has unanswered prompts"; ok=0; }
  fi
  if [[ "$ok" -eq 1 ]]; then
    echo "[content] READY — design approved, questionnaire answered."
    echo "[content] next: agent generates $OUT (sitemap + per-page content + inventory); you set status: approved."
  else
    echo "[content] NOT READY — resolve the above before generating the content strategy."; exit 1
  fi
}

case "${1:-help}" in
  questionnaire) cmd_questionnaire ;;
  ready)         cmd_ready ;;
  *) echo "Usage: bash scripts/content.sh [questionnaire|ready]" ;;
esac
