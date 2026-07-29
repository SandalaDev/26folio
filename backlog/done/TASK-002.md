---
id: TASK-002
title: "Install Tailwind CSS v4"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
epic: EPIC-001
epic_ref: backlog/epics/EPIC-001-project-scaffold.md
slice: EPIC-001-SLICE-2
depends_on: [TASK-001]

files_allowed:
  - package.json
  - package-lock.json
  - postcss.config.mjs
  - tailwind.config.ts
  - src/app/globals.css
  - src/app/layout.tsx

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

Add Tailwind CSS v4 to the Next.js 15 project using the `@tailwindcss/postcss` integration.
No brand tokens yet — those ship with EPIC-002.

## Acceptance criteria

- `postcss.config.mjs` wires `@tailwindcss/postcss`
- `src/app/globals.css` starts with `@import "tailwindcss"`
- Root layout imports `globals.css`
- Placeholder `tailwind.config.ts` exists (empty, awaiting EPIC-002 tokens)
- `npm run typecheck` passes
