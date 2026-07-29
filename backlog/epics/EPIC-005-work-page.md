---
id: EPIC-005
title: Work page — project grid + individual case study pages
status: done
phase: 1
priority: P1
risk_level: low
roadmap_ref: 09-roadmap.md#p1
depends_on: [EPIC-002, EPIC-003]
blocks: []
references:
  - 12-ui-element-map.md
  - 11-content-strategy.md
  - 10-design-system.md
related:
  - 09-roadmap.md
roadmap_refs: [ROAD-001]
goal_refs: [GOAL-001, GOAL-002, GOAL-003, GOAL-004]
progress_weight: 1
---

# EPIC-005 — Work page

> Build `/work` (project grid) and `/work/[slug]` (individual project pages) per
> [11-content-strategy.md](../../project-spine/11-content-strategy.md) §4 `/work` and
> [12-ui-element-map.md](../../project-spine/12-ui-element-map.md) §3 `/work`. EPIC-001
> scaffolded both routes with a comment deferring data to this epic
> (`src/app/(site)/work/[slug]/page.tsx`: "No project entries yet — EPIC-005 supplies
> them"); EPIC-003 already built `WorkCard` and a minimal `Project` shape for the
> home page's Featured Work block — this epic **extends that shape**, not a new one.

## Pre-existing — already DONE (do not re-derive)

- [`11-content-strategy.md`](../../project-spine/11-content-strategy.md) — approved.
  §4 `/work`: "Grid of projects, each with a brief description (problem/outcome
  framing where possible). **No case-study deep dives, testimonials, or metrics in
  v1** — projects stand on their own for now." §5 content inventory marks project
  entries "To create — Abe supplies projects; agent writes briefs."
- `WorkCard` (`src/components/home/work-card.tsx`, EPIC-003 TASK-014) and
  `Project`/`projects` (`src/lib/projects.ts`) — reused here, not rebuilt.

## Goal & non-goals

**Goal:** `/work` renders a grid of all projects via `WorkCard`; each project's
`/work/[slug]` renders a minimal detail view (title + problem/outcome framing) and
links back to the grid. Both fully static (`generateStaticParams` enumerates the
`projects` array). CTA bands per content outline ("Start a project" on the grid).

**Non-goals — resolves a real tension between the roadmap and the content spec:**
the roadmap's epic label says "individual case study pages," but
[11-content-strategy.md](../../project-spine/11-content-strategy.md) §4 explicitly
rules out "case-study deep dives" for v1. Resolution: `/work/[slug]` is a **minimal**
detail view — the same problem/outcome framing already on the card, given room to
breathe, not a new multi-section case-study template (no testimonials, no metrics,
no image galleries). That satisfies "individual pages exist" without violating the
approved "no deep dives" content rule.
- **Real project content is not invented here.** Per the content inventory, Abe
  supplies the actual projects; this epic ships placeholder entries with the
  shape `lib/projects.ts` needs, extended from EPIC-003's 2 to 4, clearly fictional
  ("Project one/two/three/four"), not real but unlabeled client work guessed at.
- No testimonials, metrics, or image galleries on the detail page (content rule).
- No CMS, no database — `projects` stays a static typed array in `src/lib/projects.ts`
  (architecture principle #2).

## Slices & tasks

### SLICE-1 — Extend project data & grid
| Task | Title | files_allowed (scope) | risk | proof |
|---|---|---|---|---|
| **TASK-024** | Extend `src/lib/projects.ts`'s `Project` type with `problem`/`outcome` fields (additive — `WorkCard`'s existing `description` usage keeps working unchanged) and grow the placeholder list from 2 to 4 entries. Add `WorkGrid`: renders `WorkCard` for every entry in `projects`. | `src/lib/projects.ts`, `src/components/work/work-grid.tsx` | low | lint + typecheck |

### SLICE-2 — Case study detail
| Task | Title | files_allowed (scope) | risk | proof |
|---|---|---|---|---|
| **TASK-025** | `CaseStudyDetail`: minimal single-block detail view (title, problem, outcome, a "back to work" link) — deliberately not a multi-section template (epic non-goal). Wire `src/app/(site)/work/[slug]/page.tsx`'s `generateStaticParams` to enumerate `projects`, replacing the empty-array placeholder from EPIC-001. | `src/components/work/case-study-detail.tsx`, `src/app/(site)/work/[slug]/page.tsx` | low | lint + typecheck (+ build smoke) |

### SLICE-3 — Page assembly
| Task | Title | files_allowed (scope) | risk | proof |
|---|---|---|---|---|
| **TASK-026** | Assemble `/work`: `Eyebrow` + heading + `WorkGrid` + `CTACallout` ("Start a project" → `/contact`, per content outline). Add a `CTACallout` to the bottom of each `/work/[slug]` detail page too (same destination). | `src/app/(site)/work/page.tsx`, `src/app/(site)/work/[slug]/page.tsx` | low | lint + typecheck (+ build smoke) |

## Key decisions & risks

1. **Roadmap vs. content-spec tension on "case study pages"** — resolved above
   (non-goals): minimal detail view, not a deep-dive template.
2. **Extend, don't reshape, `Project`.** EPIC-003's `FeaturedWork` already imports
   `Project`/`projects`/`WorkCard`; TASK-024 only *adds* fields, so EPIC-003's home
   page code needs zero changes.
3. **No real projects yet.** Same content-inventory gap as EPIC-004's biography —
   placeholder entries are clearly fictional, not real client work left unlabeled.
   Flagged in STATE.json as an owner-confirmed follow-up.

## Definition of done (epic)

- [ ] `/work` renders all `projects` entries via `WorkGrid`, ending in a "Start a
      project" CTA band.
- [ ] `/work/[slug]` exists (statically generated) for every project slug; unknown
      slugs 404 (`dynamicParams = false` preserved from EPIC-001's scaffold).
- [ ] Detail pages contain no testimonials/metrics/galleries — problem/outcome
      framing only, per the content-spec's "no deep dives" rule.
- [ ] `npm run build` green and static for every `/work*` route; `npm run lint` +
      `npm run typecheck` pass clean.
- [ ] Home page's `FeaturedWork` (EPIC-003) still builds and renders unchanged.
