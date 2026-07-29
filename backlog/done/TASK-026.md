---
id: TASK-026
title: "Assemble /work — grid page + CTA bands"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-005
epic_ref: backlog/epics/EPIC-005-work-page.md
slice: EPIC-005-SLICE-3
depends_on: [TASK-024, TASK-025]
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
  - src/app/(site)/work/page.tsx
  - src/app/(site)/work/[slug]/page.tsx
  - backlog/tasks/TASK-026.md
progress_weight: 1
---

# Task: Assemble `/work`

## Scope
`/work`: `Eyebrow` + heading + `WorkGrid` + `CTACallout` ("Start a project" →
`/contact`, per [11-content-strategy.md](../../project-spine/11-content-strategy.md)
§4). The `/work/[slug]` detail page's own `CTACallout` was already wired in TASK-025
alongside `generateStaticParams` (same file, adjacent change) — this task verifies
that composition rather than re-touching it.

## Acceptance criteria
- [ ] `/work` renders heading → `WorkGrid` → CTA band ("Start a project").
- [ ] `force-static` preserved on both `/work` and `/work/[slug]`.
- [ ] `npm run lint`, `npm run typecheck` pass; `npm run build` green, `/work` and
  every generated `/work/<slug>` route prerendered static.

## Notes
Low risk: pure composition. Manually verify in-browser that the grid links to each
detail page and each detail page links back.
