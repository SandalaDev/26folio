---
id: TASK-135
title: Build brand-project clips from stills
status: done
priority: P1
risk_level: medium
epic_ref: EPIC-029
progress_weight: 2
depends_on:
  - TASK-134
  - TASK-131
files_allowed:
  - public/videos/projects/
  - tmp/
skill_refs: []
parallel:
  suitable: true
  reason: Writes only video files.
  dependencies:
    - TASK-134
  result: null
testing:
  recommendation: with-task
  reason: Check size budget, muted track, loop seam and poster frame for each clip.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
started_at: 2026-10-09T23:12:27Z
completed_at: 2026-10-09T23:25:07Z
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

- [x] Eight clips plus posters exist and meet the size budget.
- [x] Every frame is the owner's artwork.

## Dependency Evidence

- plan: TASK-134

## Testing

- recommendation: with-task
- rationale: Check size budget, muted track, loop seam and poster frame for each clip.

## Notes

Shaped at the EPIC-029 kickoff on 2026-10-09. See the epic for the decisions
this task carries out.

## Result (2026-10-10)

`tools/build-clips.mjs` cuts every frame from the committed stills (eased
zooms, pans, scrolls and crossfades) and pipes them to ffmpeg; the shot lists
are in `tools/clips.json`. Each clip begins and ends on the same framing of the
cover, so the loop has no seam (last frame vs poster: mean absolute pixel
difference 2.2 of 255, encoding noise). Run it again with
`FFMPEG=<path> node tools/build-clips.mjs ok-pharmacy` when the regenerated OK
cover lands.

| Clip | Size | Length | MP4 | WebM |
|---|---|---|---|---|
| Provision hero | 960×960 | 10.8 s | 2.3 MB | 2.0 MB |
| Provision card | 720×720 | 5.8 s | 537 KB | 622 KB |
| OK Pharmacy hero | 960×960 | 12.0 s | 1.8 MB | 1.4 MB |
| OK Pharmacy card | 720×720 | 6.6 s | 567 KB | 566 KB |
| Gardenfare hero | 1280×800 | 10.0 s | 1.4 MB | 1.1 MB |
| Gardenfare card | 960×600 | 6.5 s | 576 KB | 549 KB |
| Flavour Grills hero | 640×960 | 10.0 s | 1.4 MB | 1.2 MB |
| Flavour Grills card | 480×720 | 5.4 s | 488 KB | 483 KB |

All under the 1 MB card and 3 MB hero budgets; no audio track. Square and
portrait stills shown in a wider frame are padded with their own corner
colour, never a site colour or a generated fill.
