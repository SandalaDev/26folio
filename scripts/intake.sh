#!/usr/bin/env bash
# scripts/intake.sh — the light project-start front door.
#
# Replaces the legacy 10-file load-bearing spine + 6-phase intake with a lean
# version: one human-authored brief, one gap interview, one fail-closed gate.
# Hydration (drafting the lean context) is an agent step gated on `ready`.
#
# Subcommands: brief | interview | ready | status
#
# Rebuilt vs legacy: the `ready` gate uses REAL frontmatter parsing (read-fm.mjs)
# and a structural "is the section still placeholder?" check — not grep for literal
# placeholder strings, which false-failed whenever a real answer contained a
# bracketed phrase and could never be extended without mirroring the grep list.
set -euo pipefail

SPINE="project-spine"
BRIEF="$SPINE/00-brief.md"
INTERVIEW="$SPINE/00-interview.md"
have_node() { command -v node >/dev/null 2>&1; }
fm() { have_node && node scripts/read-fm.mjs "$1" "$2" 2>/dev/null || true; }

cmd_brief() {
  [[ -d "$SPINE" ]] || mkdir -p "$SPINE"
  if [[ -f "$BRIEF" ]]; then echo "[intake] $BRIEF exists — fill it in, set status: ready."; exit 0; fi
  cat > "$BRIEF" <<'EOF'
---
phase: brief
status: draft
---
# Project Brief

The one purely-human artifact. Fill every section (or write "none"). This drives
everything an agent drafts later — be specific, not aspirational. Set status: ready
when complete. Never let an agent rewrite this; it is your intent, captured raw.

## 1. What are we building?
One paragraph: the thing, who it's for, the one job it does.

## 2. Why now? / Why this?
The motivating problem or opportunity. What's broken or possible without this?

## 3. Scope (in / out)
What's explicitly in. What's explicitly out (state it — it prevents scope creep).

## 4. Constraints
Runtime/deployment requirements, stack candidates or mandated packages, timeline,
budget, compliance, and non-negotiables. Mark undecided technical foundations as
open questions; exact versions are researched through OpenSrc after hydration.

## 5. Success looks like
How you'll know it worked. Measurable if possible.

## 6. Open questions
Things you haven't decided. An agent will probe these in the interview.
EOF
  echo "[intake] wrote $BRIEF — fill every section, then set status: ready."
}

cmd_interview() {
  [[ -f "$BRIEF" ]] || { echo "[intake] FAIL: write the brief first ('intake.sh brief')."; exit 1; }
  if [[ -f "$INTERVIEW" ]]; then echo "[intake] $INTERVIEW exists — answer it, set status: answered."; exit 0; fi
  cat > "$INTERVIEW" <<'EOF'
---
phase: interview
status: open
---
# Intake Interview

A planning agent fills the gaps the brief left open. Each item is a question the
agent needs resolved before drafting the lean context. Answer each inline (replace
the prompt), then set status: answered. This is gated on by `intake ready`.

## What to ask
Probe gaps that block the lean context (charter / decisions / roadmap). Good
categories: intent, scope, constraints, and decisions the brief left unresolved
or ambiguous. Include runtime/deployment constraints and any mandated technical
foundation that will need an OpenSrc architecture plan. One question per Q slot,
each focused on a single decision.

## What NOT to ask
- Do not repeat questions already listed in the brief's "Open questions" section —
  those are acknowledged, not gaps.
- Do not ask design / content / UI questions (palettes, layouts, copy, component
  choices). Those are deferred to the L4 elicitation phases, not intent hydration.
- Add a recommended default in parentheses where one exists, so a human can answer
  fast by agreeing.

## Q1. [agent fills: the gap]
prompt: (agent writes the question here)
answer: (you answer inline)

## Q2. [agent fills]
prompt:
answer:
EOF
  echo "[intake] wrote $INTERVIEW."
  echo "[intake] A planning agent should populate the gaps, then you answer each and set status: answered."
}

# ready gate: brief is status:ready + no placeholder sections; interview answered.
cmd_ready() {
  local fail=0
  [[ -f "$BRIEF" ]] || { echo "[intake] FAIL: $BRIEF missing — run 'intake.sh brief'."; exit 1; }

  local bs; bs="$(fm "$BRIEF" status)"
  [[ "$bs" == "ready" ]] || { echo "[intake] FAIL: $BRIEF status is '$bs' (need 'ready')."; fail=1; }

  # Structural placeholder check: a section is "unfilled" if its body line is the
  # template prompt (starts with the section title verbatim + no real content).
  # This is structural, not a grep for arbitrary bracketed phrases.
  if have_node; then
    node -e '
      const fs = require("fs");
      const src = fs.readFileSync(process.argv[1], "utf8").replace(/^---[\s\S]*?---/, "");
      const sections = src.split(/^## /m).slice(1);
      let unfilled = 0;
      for (const sec of sections) {
        const title = sec.split("\n")[0].trim();
        const body = sec.split("\n").slice(1).join("\n").trim();
        // unfilled = empty body, or only the word "none"/"tbd" with nothing else, or a bare prompt.
        if (!body || /^(none|tbd|todo|\.\.\.)$/i.test(body)) unfilled++;
      }
      if (unfilled > 0) { console.error("  [intake] " + unfilled + " brief section(s) still empty/placeholder"); process.exit(1); }
    ' "$BRIEF" || fail=1
  fi

  # Interview must exist and be answered (status check only — answers are freeform).
  if [[ -f "$INTERVIEW" ]]; then
    local is; is="$(fm "$INTERVIEW" status)"
    [[ "$is" == "answered" ]] || { echo "[intake] FAIL: $INTERVIEW status is '$is' (need 'answered')."; fail=1; }
  fi

  [[ $fail -ne 0 ]] && { echo "[intake] NOT READY — fix the above."; exit 1; }
  echo "READY: brief complete + interview answered. An agent may now hydrate the lean context."
}

cmd_status() {
  printf 'intake:\n'
  [[ -f "$BRIEF" ]]    && printf '  brief:     %s\n' "$(fm "$BRIEF" status)"    || printf '  brief:     (not created — run intake.sh brief)\n'
  [[ -f "$INTERVIEW" ]] && printf '  interview: %s\n' "$(fm "$INTERVIEW" status)" || printf '  interview: (not created — run intake.sh interview)\n'
}

case "${1:-help}" in
  brief)    cmd_brief ;;
  interview) cmd_interview ;;
  ready)    cmd_ready ;;
  status)   cmd_status ;;
  *) echo "Usage: bash scripts/intake.sh [brief|interview|ready|status]" ;;
esac
