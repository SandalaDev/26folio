---
id: TASK-053
title: "Type & functional fidelity — single-weight page h1s, optional display gradient, sage success state"
status: done
priority: P2
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-012
epic_ref: backlog/epics/EPIC-012-design-system-fidelity.md
slice: EPIC-012-SLICE-3
depends_on: [TASK-052]
design_refs: [10-design-system.md, 10-design-system.html]
skill_refs: [design-taste-frontend]

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
handoff_file: ""
review_waiver: "Solo dev (reviewer: human). Cross-model review reassigned to the human at the PR into dev, per OS degraded mode."
protected_paths_touched: []
files_allowed:
  - src/app/globals.css
  - src/app/(site)/capabilities/page.tsx
  - src/app/(site)/work/page.tsx
  - src/components/about/about-intro.tsx
  - src/components/site/contact-form.tsx
  - backlog/tasks/TASK-053.md
progress_weight: 1
---

# Task: Type & functional fidelity

> Two leftovers the preview gets right: display h1s are single-weight (owner
> note 1, EPIC-011, was applied to the hero only — /capabilities, /work and
> /about h1s still mix extralight/semibold), and the preview's h1 carries an
> ink→soft gradient text fill. Plus: the contact form's success state doesn't
> use the `success` token (site-wide count: 0).

## Scope
- Page h1s (`text-display`): remove the extralight/semibold span mix on
  /capabilities, /work, and the About intro so every display heading matches
  the hero's single-weight treatment (the display token's weight carries it).
  Words unchanged — spans unwrap, copy identical.
- Section h2 weight mixes are OUT of scope (deliberate EPIC-010 counterpoint;
  owner open-question #1 in the epic decides their fate later).
- Optional signature (epic open-question #2, ship-and-easy-to-revert): a
  `display-gradient` utility in `globals.css` — the preview's
  `linear-gradient(180deg, ink, soft)` + `background-clip: text` — applied to
  the display h1s. One class, trivially removable if the owner passes.
- `contact-form.tsx`: the success confirmation state adopts `success` (muted
  sage) for its affirmative accent, per §2 "functional — kept quiet"; `danger`
  stays on field errors, `amber` stays on the unavailable state.

## Acceptance criteria
- [ ] No `text-display` h1 mixes font weights; copy byte-identical.
- [ ] `display-gradient` utility exists and is applied (or consciously
      dropped, recorded in the task log) — if applied, headings remain
      readable and AA (gradient spans ink→soft, both AAA on background).
- [ ] Contact success state uses the sage `success` token; form behavior,
      states, and validation untouched.
- [ ] lint / typecheck / build green.
