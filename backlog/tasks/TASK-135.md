---
id: TASK-135
title: "Build brand-project clips from stills"
status: ready
priority: P1
risk_level: medium
epic_ref: EPIC-029
progress_weight: 2
depends_on: [TASK-134, TASK-131]
files_allowed:
  - public/videos/projects/
  - tmp/
skill_refs: []
parallel:
  suitable: true
  reason: Writes only video files.
  dependencies: [TASK-134]
  result: null
testing:
  recommendation: with-task
  reason: Check size budget, muted track, loop seam and poster frame for each clip.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
---

# Task: Build brand-project clips from stills

## Scope

Card loop (5 to 8 s) and hero loop (10 to 15 s) for each brand project,
built only from the owner's existing artwork:

- Flavour Grills: pan across the flatlay, then the posters.
- Provision Finance: scroll down the full-page homepage.
- OK Pharmacy: pan across the new cover, signage, bag (needs the regenerated cover).
- Gardenfare Foods: the four packs in sequence.

MP4 (H.264) and WebM, no audio track, about 1 MB per card clip and 3 MB per
hero clip, plus a poster frame. No new imagery is generated.

## Acceptance Criteria

- [ ] Eight clips plus posters exist and meet the size budget.
- [ ] Every frame is the owner's artwork.

## Dependency Evidence

- plan: TASK-134

## Testing

- recommendation: with-task
- rationale: Check size budget, muted track, loop seam and poster frame for each clip.

## Notes

Shaped at the EPIC-029 kickoff on 2026-10-09. See the epic for the decisions
this task carries out.
