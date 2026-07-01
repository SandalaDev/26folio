---
id: TASK-032
title: "lib/magazine.ts — Payload REST API client"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-007
slice: EPIC-007-SLICE-1
depends_on: []
design_refs: [06-project-technical-plan.md]
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
  - src/lib/magazine.ts
  - src/lib/env.ts
  - env.example
  - backlog/tasks/TASK-032.md
---

# Task: lib/magazine.ts

> **Already specified** — [06-project-technical-plan.md](../../project-spine/06-project-technical-plan.md)
> §"Magazine API client" gives the exact function signature, type, and error
> contract. This task implements it verbatim, it doesn't design a new shape.

## Scope
- `src/lib/env.ts`: add `MAGAZINE_API_URL` and `MAGAZINE_API_KEY` (same
  `process.env.X ?? ""` pattern as the existing entries).
- `env.example`: document both, with a comment noting they're for EPIC-007's
  read-only magazine fetch.
- `src/lib/magazine.ts`:
  - `export type MagazineArticle = { id, title, excerpt, slug, cover_image,
    published_at, category, url }` (all `string`), exactly per the technical plan.
  - `export async function getFeaturedMagazineArticles(): Promise<MagazineArticle[]>`
    — if `env.MAGAZINE_API_URL` is empty, return `[]` immediately (not configured
    yet, not an error). Otherwise `fetch` the featured-articles endpoint with
    `{ next: { revalidate: 3600 } }` and the API key header; wrapped in try/catch;
    on any thrown error, non-2xx response, or JSON parse failure, return `[]`.
    Never throws.

## Acceptance criteria
- [ ] Calling `getFeaturedMagazineArticles()` with no env vars set resolves to
  `[]` without attempting a network request (verified — not just asserted).
- [ ] Every failure path (network error, non-2xx, bad JSON) is caught and resolves
  to `[]`, never rejects/throws.
- [ ] `fetch` call includes `{ next: { revalidate: 3600 } }`.
- [ ] `npm run lint` and `npm run typecheck` pass.

## Notes
Low risk: no real endpoint exists to hit yet, so this can only be exercised
against the "not configured" path plus a manually mocked response during
verification (not shipped as test code — no unit test infra exists in this repo
yet).
