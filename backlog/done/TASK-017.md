---
id: TASK-017
title: "Assemble / — compose home page blocks, final copy pass"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-003
slice: EPIC-003-SLICE-6
depends_on: [TASK-013, TASK-014, TASK-015, TASK-016]
design_refs: [12-ui-element-map.md, 11-content-strategy.md]
skill_refs: [design-taste-frontend, impeccable]

verification_required:
  lint: true
  typecheck: true
  unit: false
  integration: false
  e2e: false
  accessibility: false

public_text: true
handoff_required: false
handoff_type: []
protected_paths_touched: []
files_allowed:
  - src/app/(site)/page.tsx
  - backlog/tasks/TASK-017.md
---

# Task: Assemble `/`

## Scope
Compose `Hero` → `FeaturedWork` → `CapabilityRail` → `MagazineTeaser` → `CTACallout`
in `src/app/(site)/page.tsx`, in the order specified by
[12-ui-element-map.md](../../project-spine/12-ui-element-map.md) §3 Home. Keep
`export const dynamic = "force-static"`. `CTACallout` gets this page's copy
("Want to work together?" / body / "Let's talk" → `/contact`) per
[11-content-strategy.md](../../project-spine/11-content-strategy.md) §3 (Home's CTA is
"Let's talk").

## Acceptance criteria
- [ ] `/` renders Hero, Featured Work, Capability Rail, Magazine Teaser, then the CTA
  band, in that order; no `<h1>` outside `Hero`.
- [ ] `export const dynamic = "force-static"` is preserved.
- [ ] `CTACallout` copy is voice-correct (no em dashes, no "unlock/elevate/seamless",
  first person where it reads naturally).
- [ ] `npm run lint`, `npm run typecheck` pass; `npm run build` green and `/` is
  prerendered as static (`○`).

## Notes
Low risk: pure composition, no new component logic. `public_text: true` for the
CTA copy introduced here — reviewed by hand against stop-slop's TELLS list (see
TASK-013 notes on the scorer's `.md/.html`-only file-extension gap).
