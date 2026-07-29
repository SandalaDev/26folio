---
id: TASK-016
title: "Magazine teaser — MagazineTeaser + ArticleCard against placeholder data"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-003
epic_ref: backlog/epics/EPIC-003-home-page.md
slice: EPIC-003-SLICE-6
depends_on: [TASK-011]
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
  - src/components/home/magazine-teaser.tsx
  - src/components/home/article-card.tsx
  - src/lib/magazine-placeholder.ts
  - backlog/tasks/TASK-016.md
progress_weight: 1
---

# Task: Magazine teaser

> **Contract, not the fetch (epic decision #2).** The roadmap lists "From Magazine
> section" under EPIC-003 but assigns `lib/magazine.ts` (the real Payload REST fetch)
> to **EPIC-007**. This task ships `MagazineTeaser`/`ArticleCard` against typed
> placeholder data shaped exactly like the planned API response, so EPIC-007 only
> swaps the data source — not the component contract — and `/` stays fully static
> today.

## Scope
- `src/lib/magazine-placeholder.ts`: exports an `Article` type (`slug`, `title`,
  `excerpt`, `url`) matching the shape EPIC-007's `lib/magazine.ts` will return, and a
  `placeholderArticles: Article[]` with 3 entries.
- `ArticleCard`: shadcn `Card` showing one article, linking out (`target="_blank"
  rel="noopener noreferrer"`) to `url` (scrumtrulescent.com — never reproduced inline,
  per the charter constraint).
- `MagazineTeaser`: `Section` + `Eyebrow` + heading, renders `ArticleCard` ×3 with
  Framer staggered entry (`staggerContainer`/`fadeUp`, `stagger .08`). Includes the
  graceful-fallback UI for when fewer than 3 articles are available (render only what
  exists; if zero, render nothing — section omits itself rather than showing an empty
  shell), even though the placeholder data always provides exactly 3 today.

## Acceptance criteria
- [ ] `Article` type shape is the one EPIC-007 is expected to fill in (no fields this
  epic invents that the real API wouldn't have, no fields the real API has that this
  type is missing per [06-project-technical-plan.md](../../project-spine/06-project-technical-plan.md)).
- [ ] `MagazineTeaser` accepts an `articles: Article[]` prop (defaulting to
  `placeholderArticles`) — so EPIC-007 passes real data in without touching this file.
- [ ] Fallback path (`articles.length === 0`) is implemented and renders nothing, not
  an empty `Section`.
- [ ] Links out to scrumtrulescent.com use `target="_blank" rel="noopener noreferrer"`.
- [ ] `npm run lint` and `npm run typecheck` pass.

## Notes
Low risk: structural UI + placeholder data, no live network fetch (this route stays
`force-static`). `public_text: false` — copy is placeholder, not final.
