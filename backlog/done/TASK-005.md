---
id: TASK-005
title: "Runtime/motion deps + env doc"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
epic: EPIC-001
slice: EPIC-001-SLICE-3
depends_on: [TASK-004]

files_allowed:
  - package.json
  - package-lock.json
  - env.example
  - src/lib/env.ts

verification_required:
  typecheck: true
  lint: true
  unit: false
  integration: false
  e2e: false
  accessibility: false

public_text: false
handoff_required: false
---

## Goal

Install runtime animation libraries and document required env vars.
No animation code yet — just the packages and env scaffolding.

## Acceptance criteria

- `framer-motion`, `gsap`, `lottie-react` installed as dependencies
- `env.example` documents all required env vars (Resend + Cloudflare R2)
- `src/lib/env.ts` exports typed env accessors (no zod — plain accessors, no throw)
- `npm run typecheck` passes
- `npm run lint` passes
