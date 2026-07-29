---
id: TASK-014
title: "Featured work — WorkCard x2 + Section"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-003
epic_ref: backlog/epics/EPIC-003-home-page.md
slice: EPIC-003-SLICE-4
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
  - src/components/home/work-card.tsx
  - src/components/home/featured-work.tsx
  - src/lib/projects.ts
  - backlog/tasks/TASK-014.md
progress_weight: 1
---

# Task: Featured work

> **Minimum shape, not the real data model.** [12-ui-element-map.md](../../project-spine/12-ui-element-map.md)
> §3 Home #2 wants `WorkCard` ×2 inside a `Section`, baunfire-style on-hover motion.
> The full `/work` project list + case-study data model belongs to **EPIC-005**; this
> task's `src/lib/projects.ts` is the minimum typed shape `WorkCard` needs, with 2
> placeholder entries, structured so EPIC-005 extends the array rather than
> re-shaping it.

## Scope
- `src/lib/projects.ts`: exports a `Project` type (`slug`, `title`, `description`,
  `href`) and a `projects: Project[]` array with 2 entries (placeholder copy,
  `public_text: false` — not final).
- `WorkCard`: zoom + diagonal-reveal hover (Framer), token-styled (hard corners,
  `surface` background), links to the project's `href`.
- `FeaturedWork`: `Section` wrapper, `Eyebrow` + heading, renders `WorkCard` for the
  first 2 `projects` entries.

## Acceptance criteria
- [ ] `Project` type and `projects` array are the **only** data EPIC-005 needs to
  extend (no shape changes anticipated there).
- [ ] `WorkCard` hover motion is Framer only (no GSAP — §architecture one-lib-per-job).
- [ ] No rounded corners; rose focus ring preserved on the card's link.
- [ ] `npm run lint` and `npm run typecheck` pass.

## Notes
Low risk: structural component + placeholder data, no copy finalisation
(`public_text: false`).
