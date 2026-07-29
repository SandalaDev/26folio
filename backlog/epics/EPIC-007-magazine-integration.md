---
id: EPIC-007
title: Magazine integration — lib/magazine.ts client, wired into MagazineTeaser
status: done
phase: 1
priority: P1
risk_level: low
roadmap_ref: 09-roadmap.md#p1
depends_on: [EPIC-003]
blocks: []
references:
  - 06-project-technical-plan.md
  - 12-ui-element-map.md
related:
  - 09-roadmap.md
roadmap_refs: [ROAD-001]
goal_refs: [GOAL-001, GOAL-002, GOAL-003, GOAL-004]
progress_weight: 1
---

# EPIC-007 — Magazine integration

> Build the real `lib/magazine.ts` client per
> [06-project-technical-plan.md](../../project-spine/06-project-technical-plan.md)
> §"Magazine API client" and swap it into `MagazineTeaser`
> (`src/components/home/magazine-teaser.tsx`, EPIC-003 TASK-016), which was built
> specifically to accept this without changing its own contract.

## Pre-existing — already DONE (do not re-derive)

- The exact client shape (function signature, `MagazineArticle` fields, ISR
  revalidate window, error-handling contract) is already specified in
  [06-project-technical-plan.md](../../project-spine/06-project-technical-plan.md) —
  this epic implements it, it doesn't design it.
- `MagazineTeaser` (EPIC-003 TASK-016) already accepts an `articles` prop and
  defaults to placeholder data; `if (articles.length === 0) return null` is already
  in place — this is precisely the graceful-fallback behaviour the roadmap
  describes ("if the magazine isn't live yet... the section gracefully shows
  nothing").
- `env.ts`/`env.example` scaffolding pattern (EPIC-001 TASK-005) — this epic
  extends it, doesn't redesign it.

## Goal & non-goals

**Goal:** `lib/magazine.ts` exports `getFeaturedMagazineArticles(): Promise<MagazineArticle[]>`
exactly as specified — fetches articles flagged `featured_on_portfolio: true`,
1-hour ISR revalidate, **never throws, never blocks the build**, returns `[]` on any
error (including simply not being configured yet, which is the expected state
right now — no live magazine API exists). The home page awaits it and passes the
result into `MagazineTeaser`.

**Non-goals:**
- No Payload CMS code, no magazine-side changes — this repo is a read-only
  consumer (architecture principle / charter constraint, "Not in sandala.dev
  (ever)").
- No visible behaviour change is guaranteed by this epic — with no live
  `MAGAZINE_API_URL` configured yet, the home page's magazine section will
  correctly render nothing (real graceful fallback) instead of the 3 placeholder
  cards it showed before. **This is the intended, spec'd behaviour, not a
  regression** — flagged clearly in STATE.json so it isn't mistaken for one.
- No redesign of `ArticleCard`/`MagazineTeaser` — same contract, real data source.

## Slices & tasks

### SLICE-1 — Magazine API client
| Task | Title | files_allowed (scope) | risk | proof |
|---|---|---|---|---|
| **TASK-032** | `lib/magazine.ts`: `MagazineArticle` type + `getFeaturedMagazineArticles()` exactly per the technical plan's spec — `fetch` with `{ next: { revalidate: 3600 } }`, wrapped in try/catch, returns `[]` immediately (no fetch attempted) when `MAGAZINE_API_URL` is unset. Add `MAGAZINE_API_URL`/`MAGAZINE_API_KEY` to `src/lib/env.ts` and `env.example`. | `src/lib/magazine.ts`, `src/lib/env.ts`, `env.example` | low | lint + typecheck |

### SLICE-2 — Wire into the home page
| Task | Title | files_allowed (scope) | risk | proof |
|---|---|---|---|---|
| **TASK-033** | Extend `Article` (`src/lib/magazine-placeholder.ts`) additively to match `MagazineArticle`'s full shape (so placeholder data still type-checks against the real type) — `MagazineTeaser`/`ArticleCard` need zero code changes. Make `HomePage` (`src/app/(site)/page.tsx`) `async`, `await getFeaturedMagazineArticles()`, pass the result as `<MagazineTeaser articles={...} />`. | `src/lib/magazine-placeholder.ts`, `src/app/(site)/page.tsx` | low | lint + typecheck (+ build smoke) |

## Key decisions & risks

1. **No real API to test against.** scrumtrulescent.com's Payload API isn't live
   yet, so this epic can only be verified against the "not configured" path (env
   vars empty → `[]` → section hidden) and a manually-mocked success path, not a
   real integration test. Flagged as a real limitation, not glossed over.
2. **Home page visibly changes** (magazine section disappears) once this ships,
   until `MAGAZINE_API_URL`/`MAGAZINE_API_KEY` are set in the deployment
   environment — expected, not a bug (non-goals #2).
3. **Contract preserved.** `MagazineTeaser`'s prop shape doesn't change — only its
   caller (`HomePage`) and the data source behind the default do.

## Definition of done (epic)

- [ ] `getFeaturedMagazineArticles()` never throws under any input (unset env,
      network failure, non-2xx response, malformed JSON) — always resolves to an
      array.
- [ ] With env vars unset (current state), the home page's magazine section
      renders nothing — verified in-browser, not just asserted.
- [ ] With a manually mocked successful response (verification-only, not shipped
      code), `MagazineTeaser` renders the returned articles correctly.
- [ ] `npm run build` green and `/` still fully static; `npm run lint` + `npm run
      typecheck` pass.
- [ ] `env.example` documents both new vars with a comment pointing at this epic.
