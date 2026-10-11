---
id: TASK-099
title: "Build the ProjectComposition renderer and rebuild /work/[slug] around it"
status: superseded
priority: P1
risk_level: medium
epic_ref: backlog/epics/EPIC-026.md
progress_weight: 1
files_allowed:
  - src/components/work/project-composition.tsx
  - src/components/work/case-study-detail.tsx
  - src/app/(site)/work/[slug]/page.tsx
skill_refs: []
---

# Task: Build the ProjectComposition renderer and rebuild /work/[slug] around it

## Scope

The piece that makes the model generative: walk a project's `blocks` array and
render each variant with its component. This is the whole "no rigid template"
mechanism in one file.

### `ProjectComposition`

```tsx
<ProjectComposition project={project} />
```

Maps over `project.blocks` and dispatches each on `kind` to its block component
from `TASK-096`–`TASK-098`. No theming wrapper: per the owner's clarification
(`EPIC-026`, owner confirmation 3) the renderer introduces no per-project visual
context, only per-project block sequence.

**The switch must be exhaustive at compile time.** Assign the block to a `never`
in the default branch so adding an eleventh `ProjectBlock` variant without a
renderer arm becomes a TypeScript error rather than a silently missing section.
This is deliberately load-bearing: the epic's testing rationale relies on the
compiler catching this class of bug, so it must actually be wired that way.

Blocks receive their own variant and nothing else beyond the project identity
fields they need. No block reaches back into `project` for arbitrary data — that
is how a "flexible" renderer quietly becomes a template again.

Vertical rhythm between blocks is the renderer's job, not each block's. Blocks
own their internal spacing; `ProjectComposition` owns the gaps between them, so a
project with four blocks and one with eight both breathe correctly.

### Rebuild `/work/[slug]`

Replace `CaseStudyDetail` with `ProjectComposition`. Preserve everything the
route already gets right:

- `export const dynamic = "force-static"` and `dynamicParams = false`.
- `generateStaticParams` enumerating `projects`.
- `notFound()` for an unknown slug.
- The closing `CTACallout` to `/contact`.
- The "back to work" link, which `CaseStudyDetail` currently owns and which must
  survive its deletion.

Add previous / next project navigation at the foot, above the CTA. With four
projects a visitor who likes one should be one click from the next, not back
through the grid.

Then **delete `src/components/work/case-study-detail.tsx`**. It was `EPIC-005`'s
deliberately minimal detail view under the old "no deep dives" content rule, and
that rule is superseded by this epic (see `EPIC-026` → *Supersedes*, reconciled in
`TASK-104`). Leaving it behind as dead code invites a future session to wonder
which one is canonical. Confirm nothing else imports it before removing.

### Metadata

Give each project page a real `generateMetadata`: title, description drawn from
the project's own copy, and the cover as the OpenGraph image. These are the pages
most likely to be shared as evidence of the work, and they currently have
nothing.

## Acceptance Criteria

- [ ] `ProjectComposition` renders every block kind and dispatches on `kind` only.
- [ ] The switch is exhaustive via a `never` assignment — verified by temporarily
      adding a dummy variant and confirming `npm run typecheck` fails, then
      removing it.
- [ ] Each of the four project pages renders its own block sequence in order, and
      no page renders a block it has no assets for.
- [ ] Inter-block spacing is owned by the renderer; a four-block page and an
      eight-block page both read correctly.
- [ ] `dynamic = "force-static"`, `dynamicParams = false`, `generateStaticParams`,
      and `notFound()` behaviour are all preserved.
- [ ] The "back to work" link survives `CaseStudyDetail`'s deletion.
- [ ] Previous / next project navigation works from every project, including
      wrapping or correctly hiding at the ends.
- [ ] `generateMetadata` supplies title, description, and OG image per project.
- [ ] `src/components/work/case-study-detail.tsx` is deleted and nothing imports
      it.
- [ ] `npm run build` succeeds and every `/work/*` route is statically generated.
- [ ] `npm run typecheck` and `npm run lint` pass clean.

## Dependency Evidence

- plan: none

## Testing

- recommendation: with-task
- rationale: The exhaustive-switch guarantee is the single most important
  correctness property in this epic and the reason no dedicated test task is
  proposed for the renderer — so it must be proven rather than assumed. Verifying
  it is concrete: add a dummy union member, confirm the typecheck fails, remove it.
  The other real failure is a route regression that only shows up at build time
  (a page falling out of static generation, or an unknown slug no longer 404ing),
  which `npm run build` and a direct check of the build output catch. Both belong
  in this task because they are properties of this change specifically.

## Notes

Depends on `TASK-094` for the types and `TASK-096`–`TASK-098` for the block
components. This is the integration point: the first task where a real project
page can actually be looked at end to end.

Do not run a production build while the dev server is running — a prior finding on
this project is that it clobbers `.next` and produces failures unrelated to the
code.

## Superseded by EPIC-029 (2026-10-09)

EPIC-029 replaces EPIC-026. Work built for this task on the unmerged local
branch `feature/EPIC-026` is salvaged by TASK-130; what remains is re-planned
in EPIC-029.
