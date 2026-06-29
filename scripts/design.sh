#!/usr/bin/env bash
# scripts/design.sh — Phase 4 of project start. The design system is ELICITED,
# never hydrated: an agent must not guess your taste from the brief. You answer a
# questionnaire and supply real visual evidence (screenshots + links); the agent
# then GENERATES 10-design-system.md grounded in that evidence.
#
# Flow:
#   questionnaire  scaffold 10-design-system.QUESTIONNAIRE.md + references/design/
#   ready          fail-closed: questionnaire answered AND >=1 reference supplied
#                  → agent generates BOTH 10-design-system.md AND its rendered
#                    visual reference 10-design-system.html
#   preview        fail-closed: the system .md AND .html both exist. You then open
#                  the HTML in a browser, inspect it, and iterate on the tokens +
#                  preview with feedback until it is right. The design system may
#                  NOT be approved unseen — approval requires a rendered preview you
#                  have actually reviewed.
#
# Prereq: the intent spine (00-09) must be hydrated first.
set -euo pipefail
SPINE="project-spine"
Q="$SPINE/10-design-system.QUESTIONNAIRE.md"
OUT="$SPINE/10-design-system.md"
PREVIEW="$SPINE/10-design-system.html"
REF="$SPINE/references/design"

require_hydrated() {
  for f in 00-manifesto 01-project-charter 03-project-prd 09-roadmap; do
    [[ -s "$SPINE/$f.md" ]] || { echo "[design] hydrate the intent spine first (missing $SPINE/$f.md)"; exit 1; }
  done
}

cmd_questionnaire() {
  require_hydrated
  mkdir -p "$REF"
  if [[ -s "$Q" ]]; then echo "[design] $Q already exists — edit it, don't overwrite."; exit 0; fi
  cat > "$REF/README.md" <<'MD'
# Design references
Drop screenshots of UIs/sites whose look you want to borrow from into THIS folder.
Name them so you can cite them in the questionnaire, e.g. hero-linear.png, type-stripe.png.
The agent reads these images directly. Pair each with a note in the questionnaire's
"Visual references" section saying WHAT you like about it.
MD
  cat > "$Q" <<'MD'
---
id: DESIGN-SYSTEM-QUESTIONNAIRE
status: open            # open -> answered (you), then the agent generates the system
phase: 4
---
# Design System Questionnaire
> The design system is elicited from YOUR taste, not guessed. Answer every prompt
> and supply real evidence. "Show, don't tell" — a screenshot beats an adjective.
> Set status: answered when done, then run: bash scripts/design.sh ready

## Visual references (REQUIRED — at least one)
> List the screenshots you dropped in references/design/ and/or live links.
> For each, say what specifically you want to borrow (type, spacing, colour, motion).
- ref: [filename or URL]
  like: [what specifically — e.g. "the restraint of the palette, the huge type"]
- ref:
  like:

## 1. Emotional intent
- [ ] Three adjectives this should evoke (e.g. precise, warm, confident):
- [ ] Three adjectives it must NOT feel like:

## 2. Colour direction
- [ ] Light, dark, or both?
- [ ] Existing brand colours / hex values (or "none yet"):
- [ ] Accent appetite: monochrome-restrained or colourful?

## 3. Typography
- [ ] Serif, sans, or mixed? Any fonts you already love?
- [ ] Personality: neutral-systemic, editorial, technical, expressive?

## 4. Layout & density
- [ ] Minimal/airy or rich/dense?
- [ ] Whitespace appetite (generous / efficient):

## 5. Motion appetite
- [ ] Subtle and restrained, or bold and expressive?
- [ ] Anything you've seen that nailed it (cite a reference):

## 6. Imagery style
- [ ] Photography, illustration, 3D, abstract, none?

## 7. Hard anti-patterns
- [ ] Looks/trends you never want to see here:

## 8. Brand assets / constraints
- [ ] Logo, existing palette, mandated fonts, accessibility floor (e.g. WCAG AA):
MD
  echo "[design] created $Q and $REF/ — answer it, drop screenshots, then: bash scripts/design.sh ready"
}

cmd_ready() {
  local ok=1
  if [[ ! -s "$Q" ]]; then echo "  MISSING: $Q (run: design.sh questionnaire)"; ok=0
  else
    grep -q '^status: answered' "$Q" || { echo "  $Q is not status: answered"; ok=0; }
    grep -q '^- \[ \]' "$Q" && { echo "  $Q has unanswered prompts"; ok=0; }
    grep -q '\[what specifically\|\[filename or URL\|\[what specifically —' "$Q" && { echo "  $Q still has placeholder reference prompts"; ok=0; }
  fi
  # at least one reference file OR an http link in the questionnaire
  local has_ref=0
  [[ -d "$REF" ]] && [[ -n "$(find "$REF" -type f ! -name README.md 2>/dev/null)" ]] && has_ref=1
  grep -qiE 'https?://' "$Q" 2>/dev/null && has_ref=1
  if [[ "$has_ref" -eq 0 ]]; then echo "  no visual references — drop a screenshot in $REF/ or paste a link in $Q"; ok=0; fi
  if [[ "$ok" -eq 1 ]]; then
    echo "[design] READY — questionnaire answered, references present."
    echo "[design] next: agent generates $OUT AND its rendered preview $PREVIEW from the"
    echo "[design]       questionnaire + references; then run: bash scripts/design.sh preview"
  else
    echo "[design] NOT READY — resolve the above before generating the design system."; exit 1
  fi
}

# Fail-closed: has the system been rendered for visual inspection?
# The design system must be SEEN before it can be approved.
cmd_preview() {
  local ok=1
  [[ -s "$OUT" ]] || { echo "  MISSING: $OUT (agent generates it after design.sh ready)"; ok=0; }
  [[ -s "$PREVIEW" ]] || { echo "  MISSING: $PREVIEW — the agent must generate a standalone HTML visual reference (palette swatches, type scale, spacing, component states, motion) rendered FROM the tokens in $OUT"; ok=0; }
  if [[ "$ok" -eq 1 ]]; then
    echo "[design] PREVIEW PRESENT — open $PREVIEW in a browser and inspect the system."
    echo "[design] Iterate: note what is off, have the agent revise $OUT + regenerate $PREVIEW, repeat until right."
    echo "[design] ONLY THEN set status: approved in $OUT. The design system must not be approved unseen."
  else
    echo "[design] NOT READY FOR APPROVAL — generate the visual reference and inspect it before approving."; exit 1
  fi
}

case "${1:-help}" in
  questionnaire) cmd_questionnaire ;;
  ready)         cmd_ready ;;
  preview)       cmd_preview ;;
  *) echo "Usage: bash scripts/design.sh [questionnaire|ready|preview]" ;;
esac
