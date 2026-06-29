#!/usr/bin/env bash
# scripts/intake.sh — the project-start front door. Turns "hydrate the spine"
# from a vibe into a defined, gated phase.
#
# Flow:
#   1. brief    scaffold project-spine/00-original-intent.md (human-authored seed)
#   2. interview generate INTAKE-INTERVIEW.md — gaps an agent must ask about
#                BEFORE drafting any spine file
#   3. ready    fail-closed check: spine hydration is blocked until the brief is
#                filled AND every interview question is answered
#
# The brief is the one purely-human artifact; the spine is agent-elaborated FROM it.
set -euo pipefail
SPINE="project-spine"
BRIEF="$SPINE/00-original-intent.md"
INTERVIEW="$SPINE/INTAKE-INTERVIEW.md"

cmd_brief() {
  mkdir -p "$SPINE"
  if [[ -s "$BRIEF" ]]; then echo "[intake] $BRIEF already exists — edit it, don't overwrite."; exit 0; fi
  cat > "$BRIEF" <<'MD'
---
id: ORIGINAL-INTENT
status: draft            # draft -> ready (you set ready when fully filled)
author: human
created: YYYY-MM-DD
---
# Original Project Intent
> The one purely-human artifact. Written BEFORE any agent touches the spine.
> The spine must stay faithful to this. Never agent-rewritten.
> Replace every [...] prompt. Leave none blank — "none" / "n/a" is a valid answer.

## 1. What is this?
[One paragraph. What are we building, in plain language?]

## 2. Who is it for?
[Primary users / customers / internal teams. Be specific.]

## 3. What does success look like?
[Concrete outcomes. How will you know this worked? Avoid vanity metrics.]

## 4. Hard constraints
[Tech stack mandates, budget, deadline, regulatory/compliance (e.g. ZRA Smart
Invoice), integrations that MUST exist (e.g. MTN MoMo, Airtel, ZamPay), hosting.]

## 5. Explicitly out of scope
[What this project is NOT. The boundaries that stop scope creep later.]

## 6. Known risks & unknowns
[What worries you. What you haven't decided yet. What might change.]

## 7. Existing assets
[Repos, designs, brand, prior docs, data to migrate. Paths or links.]
MD
  echo "[intake] created $BRIEF — fill every section, then set status: ready."
}

cmd_interview() {
  [[ -s "$BRIEF" ]] || { echo "[intake] write $BRIEF first: bash scripts/intake.sh brief"; exit 1; }
  cat > "$INTERVIEW" <<'MD'
---
id: INTAKE-INTERVIEW
status: open            # open -> answered (all questions resolved)
created_by: planning-agent
---
# Spine Hydration Interview
> A planning agent reads 00-original-intent.md and interrogates the GAPS here
> BEFORE drafting any spine file. The human answers inline. Hydration is blocked
> until status: answered. This prevents the agent papering over ambiguity with
> confident guesses that surface as contradictions three epics later.
>
> Agent: add questions ONLY where the brief is genuinely ambiguous or silent on
> something a spine file will need. Do not pad. "No questions" is a valid result
> for a thorough brief.

## Domain & data
- [ ] Q: [e.g. "Brief says multi-tenant — isolation model: service-layer tenantId,
        schema-per-tenant, or db-per-tenant?"]
      A:

## Compliance & integrations
- [ ] Q: [e.g. "ZRA Smart Invoice named — is it required for v1 or a later phase?
        What's the data-retention policy?"]
      A:

## Architecture & constraints
- [ ] Q: [e.g. "Hosting target? This drives the technical plan and deploy story."]
      A:

## Scope & sequencing
- [ ] Q: [e.g. "Which outcome is the P1 must-ship vs nice-to-have?"]
      A:

## Open
- [ ] Q: [anything else the brief leaves undefined that a spine file needs]
      A:
MD
  echo "[intake] created $INTERVIEW — agent asks, you answer inline, then set status: answered."
}

# Fail-closed: is the project ready for spine hydration?
cmd_ready() {
  local ok=1
  if [[ ! -s "$BRIEF" ]]; then echo "  MISSING: $BRIEF (run: intake.sh brief)"; ok=0
  else
    grep -q '^status: ready' "$BRIEF" || { echo "  $BRIEF is not status: ready"; ok=0; }
    grep -q '\[\.\.\.\]\|\[One paragraph\|\[Primary users\|\[Concrete' "$BRIEF" && { echo "  $BRIEF still has unfilled [...] prompts"; ok=0; }
  fi
  if [[ ! -s "$INTERVIEW" ]]; then echo "  MISSING: $INTERVIEW (run: intake.sh interview)"; ok=0
  else
    grep -q '^status: answered' "$INTERVIEW" || { echo "  $INTERVIEW is not status: answered"; ok=0; }
    # any checkbox still unchecked?
    grep -q '^- \[ \]' "$INTERVIEW" && { echo "  $INTERVIEW has unanswered questions"; ok=0; }
  fi
  if [[ "$ok" -eq 1 ]]; then
    echo "[intake] READY — brief filled and interview answered. Spine hydration unblocked."
  else
    echo "[intake] NOT READY — resolve the above before hydrating the spine."
    exit 1
  fi
}

case "${1:-help}" in
  brief)     cmd_brief ;;
  interview) cmd_interview ;;
  ready)     cmd_ready ;;
  *) echo "Usage: bash scripts/intake.sh [brief|interview|ready]" ;;
esac
