---
id: TASK-100
title: "Rebuild the /work grid for four real projects with honest credits"
status: ready
priority: P1
risk_level: low
epic_ref: backlog/epics/EPIC-026.md
progress_weight: 1
files_allowed:
  - src/components/work/work-grid.tsx
  - src/components/home/work-card.tsx
  - src/app/(site)/work/page.tsx
skill_refs: [framer-motion]
---

# Task: Rebuild the /work grid for four real projects with honest credits

## Scope

`/work` currently renders a uniform two-column grid of four `WorkCard`s — two
real projects and two fictional placeholders, all at the same weight. Rebuild it
around the four real projects.

### The grid

`WorkGrid` is nine lines and maps `projects` into an even `md:grid-cols-2`. Give
it composition instead: cards varying in size so the page has a reading order
rather than four equal tiles. With four projects there is room for a deliberate
arrangement — a lead card at greater size, the rest following — and `WorkCard`
already accepts a `featured` prop that switches to `min-h-[34rem]` and a stronger
tilt, so the mechanism exists and is unused on this page.

Size should track how much a project has to show, which the compositions from
`TASK-094` already encode: OK Pharmacy and Provision Finance carry eight and seven
blocks; Gardenfare five; Flavour Grills Cafe six but from six files. Do not
mechanically rank them — this is a design judgment, and the lead card is whichever
project best represents the range.

### Card content

Each card gains, beyond the current tagline and title:

- **Disciplines** from `project.disciplines` — "Brand identity", "Packaging",
  "Web design". This is the range the grid exists to communicate, and it is
  currently invisible.
- **The engagement credit.** Flavour Grills Cafe is a real client engagement; the
  other three are self-initiated. Both states are stated plainly on the card, at
  legible size. This is a hard line from the epic: a self-initiated concept
  presented as client work is exactly the overclaim the charter forbids, and a
  visitor must never have to guess.

Keep `WorkCard`'s existing door-tilt treatment — `useDoorTilt`, the coordinated
`imageScale` spring, the warm scrim, the pointer-fine and reduced-motion gating.
It works and it is `EPIC-012`'s hard-won rebuild; do not re-engineer it.

**No per-project tinting on the cards.** An earlier plan in this epic would have
pushed each project's brand colour into its card hover glow; that is cancelled with
the rest of the accent channel (`TASK-095`). The hover treatment stays rose and
caramel for all four cards. The grid's job is to make four projects feel like one
portfolio, and four differently-tinted cards would work directly against that.

The imageless fallback branch in `WorkCard` (the gradient text card for
placeholders) becomes dead once `TASK-102` removes the placeholders. Leave it in
this task; `TASK-102` decides whether to delete it.

### The page

`src/app/(site)/work/page.tsx` keeps its `PageHero` and `MeshBg` opener and its
closing `CTACallout` — both are correct and part of the shared page family. The
hero's supporting line is currently empty; a single sentence framing what the four
projects are would help, but the copy comes from `TASK-101`, so leave a clear slot
rather than inventing one here.

## Acceptance Criteria

- [ ] The grid renders four real projects with a deliberate size arrangement, not
      four equal tiles.
- [ ] Every card shows its disciplines.
- [ ] Every card states its engagement — client or self-initiated — at legible
      size, and exactly one card reads as a client engagement.
- [ ] `useDoorTilt`, the coordinated image zoom, the warm scrim, and the
      pointer-fine and reduced-motion gating all still work as before.
- [ ] The card title stays AA over all four cover images, including the two that are
      light artwork (OK Pharmacy's white ground, Gardenfare's pale green) — measured,
      not assumed.
- [ ] No card is tinted by the project it links to; the hover treatment is identical
      across all four.
- [ ] The grid reads correctly at mobile, tablet, and desktop widths.
- [ ] `FeaturedWork` on the home page still compiles and renders — `WorkCard` is
      shared, so any prop change must stay backwards compatible.
- [ ] `npm run typecheck` and `npm run lint` pass clean.

## Dependency Evidence

- plan: none

## Testing

- recommendation: with-task
- rationale: `WorkCard` is shared with the home page's `FeaturedWork`, so the real
  risk in this task is a regression somewhere the change was not aimed — a
  required new prop, or a layout assumption that breaks the featured card. That is
  caught by rendering both pages in the browser after the change, which belongs
  here. The other checkable property is title contrast over four very different
  cover images, two of them light artwork, which is measurable and listed above. The
  arrangement itself is a design judgment for owner review, not a test.

## Notes

Depends on `TASK-094` for `disciplines` and `engagement`, and reads better after
`TASK-099` so the cards link to real pages.

The two placeholder entries still exist in `projects.ts` at this point and will
render in the grid. That is expected and temporary — `TASK-102` removes them.
Do not delete them here; the grid work and the data cleanup are separate changes
and keeping them separate keeps each reviewable.
