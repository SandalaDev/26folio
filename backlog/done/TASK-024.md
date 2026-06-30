---
id: TASK-024
title: "Extend project data + WorkGrid"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-005
slice: EPIC-005-SLICE-1
depends_on: []
design_refs: [12-ui-element-map.md, 11-content-strategy.md]
skill_refs: [design-taste-frontend, impeccable]

verification_required:
  lint: true
  typecheck: true
  unit: false
  integration: false
  e2e: false
  accessibility: false

public_text: false
handoff_required: false
handoff_type: []
protected_paths_touched: []
files_allowed:
  - src/lib/projects.ts
  - src/components/work/work-grid.tsx
  - backlog/tasks/TASK-024.md
---

# Task: Extend project data + WorkGrid

> **Extend, don't reshape** (epic decision #2). `Project`/`projects` already exist
> (EPIC-003 TASK-014) for the home page's Featured Work block. Add fields
> additively so that code keeps compiling and rendering unchanged.

## Scope
- `src/lib/projects.ts`: add `problem: string` and `outcome: string` to `Project`;
  backfill the existing 2 placeholder entries with placeholder problem/outcome text;
  add 2 more placeholder entries (4 total) — clearly fictional ("Project
  three/four"), not real client work.
- `WorkGrid`: renders `WorkCard` (reused from `src/components/home/work-card.tsx`)
  for every entry in `projects`, in a responsive grid (matches `FeaturedWork`'s
  2-column treatment, just for the full list instead of the first 2).

## Acceptance criteria
- [ ] `FeaturedWork` (`src/components/home/featured-work.tsx`) needs zero code
  changes and still builds/renders correctly after this task.
- [ ] All 4 `projects` entries have non-empty `problem`/`outcome` fields.
- [ ] `WorkGrid` imports `WorkCard` rather than duplicating its markup.
- [ ] `npm run lint` and `npm run typecheck` pass.

## Notes
Low risk: additive data change + a grid wrapper around an existing component.
