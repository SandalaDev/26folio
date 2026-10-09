---
id: TASK-133
title: "Capture public screens of scrumtrulescent.com and sandala.dev"
status: ready
priority: P1
risk_level: low
epic_ref: EPIC-029
progress_weight: 1
depends_on: [TASK-131]
files_allowed:
  - public/images/projects/scrumtrulescent/
  - public/images/projects/sandala-dev/
skill_refs: []
parallel:
  suitable: true
  reason: Only writes new image folders.
  dependencies: [TASK-131]
  result: null
testing:
  recommendation: none
  reason: Static images; checked by eye and by fetching each optimized URL.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
---

# Task: Capture public screens of scrumtrulescent.com and sandala.dev

## Scope

1. Capture at 2x: Scrumtrulescent home, an article page, the same article on a
   phone-width viewport; sandala.dev home, about, capabilities and contact.
2. Optimize to webp with ascii-slug filenames (unicode names break the Next
   image optimizer).
3. No private data in any capture.

## Acceptance Criteria

- [ ] Each image loads through the Next image optimizer.
- [ ] Build passes.

## Dependency Evidence

- plan: none

## Testing

- recommendation: none
- rationale: Static images; checked by eye and by fetching each optimized URL.

## Notes

Shaped at the EPIC-029 kickoff on 2026-10-09. See the epic for the decisions
this task carries out.
