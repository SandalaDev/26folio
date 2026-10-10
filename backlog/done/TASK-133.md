---
id: TASK-133
title: Capture public screens of scrumtrulescent.com and sandala.dev
status: done
priority: P1
risk_level: low
epic_ref: EPIC-029
progress_weight: 1
depends_on:
  - TASK-131
files_allowed:
  - public/images/projects/scrumtrulescent/
  - public/images/projects/sandala-dev/
skill_refs: []
parallel:
  suitable: true
  reason: Only writes new image folders.
  dependencies:
    - TASK-131
  result: null
testing:
  recommendation: none
  reason: Static images; checked by eye and by fetching each optimized URL.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
started_at: 2026-10-09T22:56:10Z
completed_at: 2026-10-09T23:09:08Z
---

# Task: Capture public screens of scrumtrulescent.com and sandala.dev

## Scope

1. Capture at 2x: Scrumtrulescent home, an article page, the same article on a
   phone-width viewport; sandala.dev home, about, capabilities and contact.
2. Optimize to webp with ascii-slug filenames (unicode names break the Next
   image optimizer).
3. No private data in any capture.

## Acceptance Criteria

- [x] Each image loads through the Next image optimizer.
- [ ] Build passes.

## Dependency Evidence

- plan: none

## Testing

- recommendation: none
- rationale: Static images; checked by eye and by fetching each optimized URL.

## Notes

Shaped at the EPIC-029 kickoff on 2026-10-09. See the epic for the decisions
this task carries out.

## Result (2026-10-10)

**sandala.dev: done.** Six screens in `public/images/projects/sandala-dev/`
(see `MANIFEST.md`), captured from a local production build. Headless Chrome's
`--screenshot` flag hangs or renders blank on animated pages and cannot go
below about 500px wide, so captures go through the DevTools Protocol with
device emulation (a scratch script, not committed). `/work` is not captured:
it changes in TASK-140.

**Scrumtrulescent: moved to TASK-132.** scrumtrulescent.com is not live; the
domain answers with a Wix "connect your domain" 404. Running the magazine
locally would need its own Postgres database and content, and that repository
has uncommitted work of its own, so the agent did not start it without asking.
The owner either supplies the public screens with the admin ones, or authorizes
a local run.
