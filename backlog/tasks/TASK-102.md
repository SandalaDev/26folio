---
id: TASK-102
title: "Retire the placeholder projects and the two orphaned cover images"
status: ready
priority: P2
risk_level: low
epic_ref: backlog/epics/EPIC-026.md
progress_weight: 1
files_allowed:
  - src/lib/projects.ts
  - src/components/home/work-card.tsx
  - public/images/projects/
skill_refs: []
---

# Task: Retire the placeholder projects and the two orphaned cover images

## Scope

Clean up what the real content replaces. Deliberately a separate change from the
grid rebuild so each is independently reviewable and revertible.

### Remove the placeholder projects

`placeholder-three` ("Project three") and `placeholder-four` ("Project four") were
`EPIC-005`'s honest stand-ins — clearly fictional rather than real work left
unlabelled, which was the right call at the time. Four real projects now exist, so
they go. Removing them also removes their `/work/placeholder-three` and
`/work/placeholder-four` static routes.

### Remove the orphaned cover images

`public/images/projects/provision.png` and `public/images/projects/ok-pharmacy.jpg`
are the old low-resolution covers. They were deleted from the working tree during
this session's asset drop and restored during repo cleanup so the branch would keep
rendering; their replacements come from `TASK-093`. Delete them here, once nothing
references them.

Check `src/lib/projects.ts` for the last `image:` references and confirm no other
file points at either path before deleting.

### Decide on `WorkCard`'s imageless branch

`WorkCard` has an early-return branch for projects without an image — the
pre-`EPIC-010` gradient text card, which existed only for the placeholders. With
them gone it becomes unreachable, since all four real projects have covers.

Two defensible options; pick one and say why in the Notes:

- **Delete it.** Simpler component, and `Project.image` can become required, which
  makes a future coverless project a compile error rather than a silently ugly
  card.
- **Keep it.** A genuine fallback for a future project whose assets are not ready.

Do not leave the decision implicit. An unreachable branch nobody chose to keep is
how components rot.

## Acceptance Criteria

- [ ] `placeholder-three` and `placeholder-four` are gone from `projects.ts`.
- [ ] `npm run build` no longer emits `/work/placeholder-three` or
      `/work/placeholder-four`, and both now 404 (`dynamicParams = false`).
- [ ] `public/images/projects/provision.png` and `ok-pharmacy.jpg` are deleted, and
      a repository-wide search finds no remaining reference to either path.
- [ ] The `WorkCard` imageless branch is either deleted or explicitly kept with a
      recorded reason; if deleted, `Project.image` becomes required and typecheck
      confirms every project supplies one.
- [ ] `/work` shows exactly four projects; the home page `FeaturedWork` still
      renders.
- [ ] `npm run build`, `npm run typecheck`, and `npm run lint` all pass clean.

## Dependency Evidence

- plan: none

## Testing

- recommendation: with-task
- rationale: This is a deletion, and the failure mode of a deletion is a dangling
  reference — a card pointing at a removed image, or a link to a route that no
  longer exists. Both are cheaply and completely checked: a repository-wide search
  for the two image paths, and a build whose route list is inspected directly.
  Doing that here is sufficient; nothing about this change warrants standing up a
  test framework.

## Notes

Depends on `TASK-093` (replacement assets committed), `TASK-099` (routes rebuilt),
and `TASK-100` (grid rebuilt). Running it earlier leaves the site with visibly
broken images.

Note for whoever picks this up: the two orphaned images were restored during this
session's cleanup specifically so that no commit on this branch would render broken
images. Deleting them is the intended end state, not a reversal of that decision.
