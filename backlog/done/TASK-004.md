---
id: TASK-004
title: "ESLint + Prettier"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
epic: EPIC-001
epic_ref: backlog/epics/EPIC-001-project-scaffold.md
slice: EPIC-001-SLICE-3
depends_on: [TASK-003]

files_allowed:
  - eslint.config.mjs
  - .prettierrc
  - .prettierignore
  - package.json
  - package-lock.json
  - scripts/test/lint.sh
  - scripts/test/typecheck.sh

verification_required:
  typecheck: true
  lint: true
  unit: false
  integration: false
  e2e: false
  accessibility: false

public_text: false
handoff_required: false
progress_weight: 1
---

## Goal

Wire ESLint (Next.js core-web-vitals + @typescript-eslint strict, no-explicit-any error)
and Prettier (with prettier-plugin-tailwindcss). Add npm scripts and shell proof scripts
so verify-task.sh can call them.

## Acceptance criteria

- `eslint.config.mjs` uses flat config extending next/core-web-vitals + next/typescript
- `@typescript-eslint/no-explicit-any` is set to `error`
- `.prettierrc` includes `prettier-plugin-tailwindcss`
- `.prettierignore` excludes `.next/` and `node_modules/`
- `package.json` has `lint` and `format` scripts
- `scripts/test/lint.sh` and `scripts/test/typecheck.sh` exist and are executable
- `npm run lint` passes clean
- `npm run typecheck` passes
