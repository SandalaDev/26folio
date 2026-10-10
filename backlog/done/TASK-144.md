---
id: TASK-144
title: "Work-section polish: drop sandala.dev, steady clips, upscaled OK Pharmacy rasters"
status: done
priority: P2
risk_level: medium
epic_ref: EPIC-029
progress_weight: 1
files_allowed:
  - src/lib/projects.ts
  - tools/build-clips.mjs
  - public/images/projects/
  - public/videos/projects/
  - planning/content/page-copy/Work.md
  - planning/dependencies/DEP-20261010-realesrgan-local-tool.md
skill_refs: []
parallel:
  suitable: false
  reason: The clip rebuild depends on the upscaled stills; one coordinator, sequential.
  dependencies: []
  result: null
testing:
  recommendation: with-task
  reason: Data and asset changes plus a local tool; lint, typecheck and build cover the site, and the clips are measured for frame-to-frame wobble.
  commands:
    - - node
      - node_modules/eslint/bin/eslint.js
      - .
      - --max-warnings
      - "0"
    - - node
      - node_modules/typescript/bin/tsc
      - --noEmit
    - - node
      - node_modules/next/dist/bin/next
      - build
started_at: 2026-10-10T21:35:16Z
completed_at: 2026-10-10T22:08:42Z
---
# Task: Work-section polish: drop sandala.dev, steady clips, upscaled OK Pharmacy rasters
## Scope

Owner feedback on 2026-10-10, after reviewing the work section:

1. "the video previews looks shaky". Cause: `tools/build-clips.mjs` rounded the
   crop window to whole pixels every frame, so its size and position stepped out
   of phase and the picture wobbled, worst on small stills shown enlarged. Fix:
   fractional windows sampled with a bicubic affine transform from a still
   pre-sized per shot, and geometric zoom. Rebuild every clip.
2. "the raster images for the ok pharmacy project are low res and need to be
   upscaled". AI-upscale the small OK Pharmacy originals (the owner chose this
   over re-exporting) and re-derive the WebPs at larger sizes.
3. "the sandala.dev itself shouldn't be a project remove it". Remove the
   project, its screen captures, its copy and its manifest section. This is an
   owner scope change to EPIC-029 decision 3 (seven projects).

## Acceptance Criteria

- [x] sandala.dev has no card, no page and no assets; /work/sandala-dev 404s.
- [x] Rebuilt clips show no frame-to-frame wobble during zooms.
- [x] OK Pharmacy rasters are larger, inspected by eye and recorded in the manifest.
- [x] Lint, typecheck and build pass.

## Dependency Evidence
- plan: planning/dependencies/DEP-20261010-realesrgan-local-tool.md
<!-- If this task adds, upgrades, or replaces a package, invoke
     opensrc-research and replace none with planning/dependencies/DEP-....md
     before changing the package manifest. -->
## Testing
<!-- Filled by the planning agent. Assess: what could break, and what testing
     (if any) this warrants. "none" is a valid answer — say why. If a dedicated
     test task is warranted, create it (new-task.sh task TASK-XXX "tests: ...")
     and reference it here. Tests never block a push; they are backlog work the
     human prioritizes. Guide by risk: low → usually none; medium → happy-path
     coverage with the task; high/critical → recommend a dedicated test task. -->
- recommendation: with-task
- rationale: Asset and data changes; build checks plus a wobble measurement on the clips.
## Notes

### Evidence (2026-10-11)

- sandala.dev: `/work` lists five cards; `/work/sandala-dev` returns 404 on a
  production build. With an odd count the lead card (Scrumtrulescent) spans
  both columns, as `work-grid.tsx` intends.
- Clip wobble, measured as the sub-pixel drift of the centre patch between
  consecutive frames during each clip's first shot (mean frame-to-frame change,
  old to new): OK Pharmacy hero 0.709 to 0.017px, card 0.473 to 0.023px;
  Provision Finance hero 0.344 to 0.016px, card 0.499 to 0.008px; Gardenfare
  hero 0.342 to 0.003px; Flavour Grills card 0.386 to 0.043px (that shot pans,
  so its drift is intended motion). Every clip is under the 1 MB card and 3 MB
  hero budget.
- OK Pharmacy: six rasters AI-upscaled with tone restored from the originals,
  two re-derived larger; each compared with its original by eye (faces,
  lettering, logo edges). All nine rasters serve 200 through the image
  optimizer. Manifest updated.
- `os verify-task TASK-144`: eslint, tsc and next build exit 0. The commands
  call node directly because `spawnSync` without a shell cannot run `npm` on
  Windows.
