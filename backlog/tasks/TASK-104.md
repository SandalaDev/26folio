---
id: TASK-104
title: "Reconcile the spine: content strategy, UI element map, design system"
status: ready
priority: P2
risk_level: low
epic_ref: backlog/epics/EPIC-026.md
progress_weight: 1
files_allowed:
  - project-spine/10-design-system.md
  - project-spine/11-content-strategy.md
  - project-spine/12-ui-element-map.md
skill_refs: [writing-style]
---

# Task: Reconcile the spine: content strategy, UI element map, design system

## Scope

Three approved spine documents will describe a `/work` section that no longer
exists once this epic lands. `AGENTS.md` is explicit: durable decisions reflect in
Markdown or code, or they were not made. Leaving the code silently contradicting an
approved document is how a future session re-derives a decision that was already
taken, or worse, "fixes" the code back to the doc.

Do this **last**, after the work exists, so the documents describe what was built
rather than what was planned.

### `11-content-strategy.md` §4 `/work`

Currently: *"Grid of projects, each with a brief description (problem/outcome
framing where possible). No case-study deep dives, testimonials, or metrics in v1 —
projects stand on their own for now (§5)."*

Amend to record that the deep-dive prohibition is superseded by owner instruction
(2026-08-15), and that **testimonials and metrics remain excluded**. That second
half is not a compromise — it is still the correct rule and still binds
`TASK-101`. Make the distinction explicit, because it is the part a future reader
will otherwise collapse: showing more artwork with honest description is not the
same as claiming unverified results.

Also update §5's content inventory, which currently marks project entries as "To
create — Abe supplies projects; agent writes briefs." Four projects are supplied.
Record what is now real and what still awaits owner approval.

### `12-ui-element-map.md` §3 `/work`

Currently one row for `WorkGrid` + `WorkCard`, with the note "No case
studies/metrics in v1". Replace with the actual structure: the grid, the
composition renderer, and the block vocabulary — `ProjectComposition` plus the
eleven block components — along with `ArtefactPlate` and `SvgTreatment`. Note that
`CaseStudyDetail` was removed and by which task.

Record the composition model itself as the structural idea, not just the component
list. The next person adding a project needs to understand that they author a block
sequence, not edit a template.

### `10-design-system.md` — one amendment and one new rule

Both were proposed in `EPIC-026`, built in `TASK-095`, and measured against real
artwork. Write them in with the evidence, not as assertions.

**§9 Imagery** currently reads *"no cold, blue-cast stock imagery dropped onto a
warm canvas."* Add the distinction the epic introduced: **site imagery** (portraits,
decorative illustration, backdrops — where the palette is Abe's to choose) keeps the
existing rule; **artefact imagery** (client and project work) is presented faithfully
and mediated by `ArtefactPlate`, because recolouring a client's navy identity to suit
a warm-dark portfolio would misrepresent the work. Name the three plate tones —
`neutral`, `sunken`, `bare` — and when each applies, with the measured caption
contrast ratios from `TASK-095`.

**A new rule for treating vector assets** — the `SvgTreatment` license and, more
importantly, its bound. Record both halves: an inlined mark may be drawn, masked,
outlined, or used as texture *filled with site tokens*, and it may never be
mistakable for a colour-inaccurate reproduction of the real mark. Faithful
presentation is absolute in the artefact blocks. This is a genuinely new capability
in the system and the bound is the part that keeps it safe.

**Record the rejected alternative.** The owner's clarification (2026-08-15) ruled out
per-project brand theming: *"the projects have to be presented as projects on our
existing UI design, not a fully redesigned page."* An earlier plan in the same
session would have added a scoped `--project-accent` channel; it was not built. Say
so, with the reason, in whichever section covers colour ownership. Without it, the
next reader looking at four visually identical project pages full of clashing artwork
will reasonably propose the same idea again.

Respect §12's drift policy: the token layer in `src/app/globals.css` is canonical
and this document is reconciled *to* it, never the reverse. Do not introduce a value
here that does not exist in the code. Note specifically that this epic added **no
new colour tokens**.

Confirm the §3 guardrails still read correctly alongside the new SVG rule — they
should, since the treatments were built to obey them, but say so explicitly so a
future reader does not read the license as an exemption.

## Acceptance Criteria

- [ ] §4 of `11-content-strategy.md` records the supersession, its date, and its
      owner authority, and states plainly that testimonials and metrics remain
      excluded.
- [ ] §5's content inventory reflects four supplied projects and their approval
      state.
- [ ] §3 `/work` of `12-ui-element-map.md` lists the real components and explains
      the composition model as a structural idea.
- [ ] `CaseStudyDetail`'s removal is recorded with the task that did it.
- [ ] §9 of `10-design-system.md` distinguishes site imagery from artefact imagery
      and documents `ArtefactPlate`'s three tones with measured contrast ratios.
- [ ] A new rule documents the `SvgTreatment` license *and* its bound.
- [ ] The rejected per-project accent channel is recorded with its date and reason.
- [ ] No value is introduced that does not exist in `src/app/globals.css`, and the
      document states that this epic added no new colour tokens.
- [ ] Every statement describes something that was actually built — no aspirational
      documentation.

## Dependency Evidence

- plan: none

Documentation only.

## Testing

- recommendation: none
- rationale: There is nothing executable here. The only failure mode is documenting
  something that was not built or a token value that does not exist in the code,
  and both are caught by reading the code alongside the doc — which the acceptance
  criteria require. The design system already has a drift policy (§12) naming the
  code as canonical; following it is the check.

## Notes

Do this after `TASK-095`, `TASK-099`, `TASK-100`, and `TASK-101` so the documents
can describe the finished thing. Writing it earlier produces a spec that the
implementation then quietly diverges from, which is the exact problem this task
exists to prevent.

`10-design-system.html` is a visual reference generated from the tokens. If it
needs regenerating after the accent-channel addition, note it here rather than
hand-editing the HTML — §12 forbids hand-authoring that preview.
