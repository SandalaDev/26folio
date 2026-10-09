---
id: TASK-139
title: Revise the four brand pages to the new rules
status: ready
priority: P1
risk_level: low
epic_ref: EPIC-029
progress_weight: 1
depends_on:
  - TASK-130
  - TASK-131
files_allowed:
  - src/lib/projects.ts
  - public/images/projects/ok-pharmacy/
skill_refs:
  - writing-style
  - stop-slop
parallel:
  suitable: false
  reason: Edits projects.ts.
  dependencies:
    - TASK-131
  result: null
testing:
  recommendation: none
  reason: Copy and data; reviewed by the owner.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
started_at: 2026-10-09T23:31:14Z
---

# Task: Revise the four brand pages to the new rules

## Scope

1. Credit labels: Flavour Grills "Client"; the other three "Self-commissioned",
   also said in the first sentence of each page.
2. Link each to the new design capability (TASK-141).
3. Swap the OK Pharmacy cover for the regenerated scene once it arrives; until
   then use the signage mockup. Never the current Gemini scene.
4. Owner approves the revised copy.

## Acceptance Criteria

- [x] No brand page could be read as client work unless it is.
- [ ] Owner approved the copy.

## Dependency Evidence

- plan: none

## Testing

- recommendation: none
- rationale: Copy and data; reviewed by the owner.

## Notes

Shaped at the EPIC-029 kickoff on 2026-10-09. See the epic for the decisions
this task carries out.

## Result (2026-10-10): built, copy awaiting owner approval

The three self-commissioned texts now open with "Self-commissioned"; every
"self-initiated" is gone, as is Provision's 2018. Caption and alt strings use
"Label: detail" instead of em-dashes. The full set is in
`planning/content/page-copy/Work.md` for review; stop-slop 50/50.

Correction to this task's scope item 3: the current OK Pharmacy cover was
never the Gemini scene. It is the owner's own `cover.jpg` (a photograph with
the monogram overlaid), so it stays until the regenerated scene arrives.

Open owner decisions, carried in `Work.md`: Flavour Grills' phone numbers and
web address are legible on `poster-pastry` (also in its clips); `role` is
unset. The task stays open until the copy is approved.
