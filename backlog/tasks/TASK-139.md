---
id: TASK-139
title: "Revise the four brand pages to the new rules"
status: ready
priority: P1
risk_level: low
epic_ref: EPIC-029
progress_weight: 1
depends_on: [TASK-130, TASK-131]
files_allowed:
  - src/lib/projects.ts
  - public/images/projects/ok-pharmacy/
skill_refs: [writing-style, stop-slop]
parallel:
  suitable: false
  reason: Edits projects.ts.
  dependencies: [TASK-131]
  result: null
testing:
  recommendation: none
  reason: Copy and data; reviewed by the owner.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
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

- [ ] No brand page could be read as client work unless it is.
- [ ] Owner approved the copy.

## Dependency Evidence

- plan: none

## Testing

- recommendation: none
- rationale: Copy and data; reviewed by the owner.

## Notes

Shaped at the EPIC-029 kickoff on 2026-10-09. See the epic for the decisions
this task carries out.
