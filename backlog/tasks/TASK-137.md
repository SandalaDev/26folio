---
id: TASK-137
title: Scrumtrulescent and sandala.dev pages
status: ready
priority: P1
risk_level: medium
epic_ref: EPIC-029
progress_weight: 2
depends_on:
  - TASK-131
  - TASK-133
files_allowed:
  - src/lib/projects.ts
skill_refs:
  - writing-style
  - stop-slop
parallel:
  suitable: false
  reason: Edits projects.ts alongside 138 and 139.
  dependencies:
    - TASK-133
  result: null
testing:
  recommendation: with-task
  reason: Copy is owner-approved; renders checked in the browser.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
started_at: 2026-10-09T23:33:12Z
---

# Task: Scrumtrulescent and sandala.dev pages

## Scope

1. Scrumtrulescent: reader side against editor side. Links to the `cms`
   capability.
2. sandala.dev: short; design system, motion, contact delivery. Links to the
   `motion` proof area.
3. Short narrative (150 to 300 words), stack in one line, no metrics.
4. Owner approves the copy.

## Acceptance Criteria

- [ ] Both pages render with real screens and owner-approved copy. (sandala.dev renders; Scrumtrulescent waits on TASK-132)
- [ ] Lint, typecheck and build pass.

## Dependency Evidence

- plan: none

## Testing

- recommendation: with-task
- rationale: Copy is owner-approved; renders checked in the browser.

## Notes

Shaped at the EPIC-029 kickoff on 2026-10-09. See the epic for the decisions
this task carries out.

## Progress (2026-10-10)

**sandala.dev: built, copy awaiting owner approval.** Entry `sandala-dev`:
credit "Own venture"; hero, note, Capabilities, About and Contact screens, and
a phone row. About 200 words, stack in one line, every claim checked against
the code (Turnstile, `src/lib/contact/resend.ts`, the auto-reply, the package
versions). stop-slop 50/50. It ends on the design service rather than the
"motion" technology area the plan named: that area is a tab, which a link
cannot open. `DevicesBlock` gained a row for sets with no landscape mock,
because two phones in the lead slot rendered taller than the viewport. No
preview clip until the owner's recording arrives (TASK-132).

**Scrumtrulescent: blocked.** No screens exist (the site is not live) and its
status line is unknown; both are on the TASK-132 list. Nothing is published
for it until they land.
