---
id: TASK-033
title: "Wire lib/magazine.ts into the home page"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-007
epic_ref: backlog/epics/EPIC-007-magazine-integration.md
slice: EPIC-007-SLICE-2
depends_on: [TASK-032]
design_refs: [06-project-technical-plan.md, 12-ui-element-map.md]
skill_refs: [impeccable]

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
  - src/lib/magazine-placeholder.ts
  - src/app/(site)/page.tsx
  - backlog/tasks/TASK-033.md
progress_weight: 1
---

# Task: Wire the magazine client into the home page

> **Contract preserved** (epic decision #3). `MagazineTeaser`'s prop shape does
> not change — only its caller and the data behind the default do.

## Scope
- `src/lib/magazine-placeholder.ts`: extend `Article` additively with
  `id`/`cover_image`/`published_at`/`category` so it structurally matches
  `MagazineArticle` (placeholder objects get plausible filler values for the new
  fields) — `MagazineTeaser`/`ArticleCard` need zero code changes.
- `src/app/(site)/page.tsx`: make `HomePage` `async`, `await
  getFeaturedMagazineArticles()`, pass the result as `<MagazineTeaser articles=
  {...} />` (overriding the component's own placeholder default).

## Acceptance criteria
- [ ] `ArticleCard`/`MagazineTeaser` source files are untouched by this task.
- [ ] With no `MAGAZINE_API_URL` configured (current state), the home page's
  magazine section renders nothing — verify in-browser, not just by reading the
  code (epic non-goal #2: this is expected, not a regression).
- [ ] `npm run lint`, `npm run typecheck` pass; `npm run build` green, `/` still
  fully static.

## Notes
Low risk: composition + additive type change. Also manually verify (dev-only,
not shipped) that a mocked non-empty `getFeaturedMagazineArticles()` result
renders correctly through `MagazineTeaser`, to prove the wiring itself works
independent of having a live magazine API.
