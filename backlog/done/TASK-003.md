---
id: TASK-003
title: "shadcn/ui init"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
epic: EPIC-001
epic_ref: backlog/epics/EPIC-001-project-scaffold.md
slice: EPIC-001-SLICE-2
depends_on: [TASK-002]

files_allowed:
  - package.json
  - package-lock.json
  - components.json
  - src/lib/utils.ts
  - tsconfig.json
  - src/app/globals.css

verification_required:
  typecheck: true
  lint: false
  unit: false
  integration: false
  e2e: false
  accessibility: false

public_text: false
handoff_required: false
progress_weight: 1
---

## Goal

Initialize shadcn/ui: write `components.json`, install `clsx` + `tailwind-merge`,
create `src/lib/utils.ts` with the `cn` helper. No components added yet.

## Acceptance criteria

- `components.json` present with RSC + cssVariables + neutral base
- `src/lib/utils.ts` exports `cn` using clsx + tailwind-merge
- `@/lib/utils` path alias resolves (tsconfig already has `@/*`)
- `npm run typecheck` passes
