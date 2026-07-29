---
id: TASK-023
title: "Assemble /about — two-column layout, page composition"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-004
epic_ref: backlog/epics/EPIC-004-about-page.md
slice: EPIC-004-SLICE-6
depends_on: [TASK-019, TASK-020, TASK-021, TASK-022]
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
  - src/app/(site)/about/page.tsx
  - backlog/tasks/TASK-023.md
progress_weight: 1
---

# Task: Assemble `/about`

## Scope
Compose `AboutIntro` → a two-column section (`StickyCard`×2 with `InterestsModal`/
`BioModal` in one column, `Timeline` in the other) → `MagazineSection` →
`SocialLinks` → `CTACallout` ("Want to work with me" → `/contact`, per
[11-content-strategy.md](../../project-spine/11-content-strategy.md) §3).

## Acceptance criteria
- [ ] Two-column layout stacks to a single column on mobile (sticky cards lose their
  sticky behaviour gracefully — no broken positioning on narrow viewports).
- [ ] `export const dynamic = "force-static"` preserved.
- [ ] `CTACallout` copy: "Want to work with me" per the content strategy's per-page
  CTA label.
- [ ] `npm run lint`, `npm run typecheck` pass; `npm run build` green and `/about` is
  prerendered as static.

## Notes
Low risk: pure composition. Manually verify in-browser (preview tool) that the
sticky cards, modals, and timeline all function together before calling this done.
