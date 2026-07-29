---
id: TASK-025
title: "Case study detail — minimal per-project page"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-005
epic_ref: backlog/epics/EPIC-005-work-page.md
slice: EPIC-005-SLICE-2
depends_on: [TASK-024]
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
  - src/components/work/case-study-detail.tsx
  - src/app/(site)/work/[slug]/page.tsx
  - backlog/tasks/TASK-025.md
progress_weight: 1
---

# Task: Case study detail

> **Minimal, not a deep dive** (epic non-goal). [11-content-strategy.md](../../project-spine/11-content-strategy.md)
> §4 rules out case-study deep dives/testimonials/metrics for v1 — this is a single
> block giving the existing problem/outcome framing room to breathe, not a new
> multi-section template.

## Scope
- `CaseStudyDetail`: title, problem, outcome, a "back to work" link to `/work`. No
  testimonials, metrics, or image galleries.
- Wire `src/app/(site)/work/[slug]/page.tsx`: replace EPIC-001's empty
  `generateStaticParams` with `projects.map((p) => ({ slug: p.slug }))`; look up the
  matching project (404 via `notFound()` if somehow missing, though `dynamicParams =
  false` already prevents unknown slugs from reaching this point); render
  `CaseStudyDetail`.

## Acceptance criteria
- [ ] `generateStaticParams` returns one entry per `projects` array item — the route
  is genuinely static for every known slug.
- [ ] `dynamicParams = false` is preserved (unknown slugs still 404 rather than
  render on demand).
- [ ] `CaseStudyDetail` renders no testimonial/metric/gallery sections.
- [ ] `npm run lint` and `npm run typecheck` pass; `npm run build` green + static for
  every generated `/work/<slug>` route.

## Notes
Low risk: static data-driven page, no new patterns beyond what TASK-024 set up.
