---
id: TASK-065
title: "About page: retire InterestsModal, card links to /about/the-way-i-am"
status: open
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-016
slice: EPIC-016-SLICE-1
depends_on: [TASK-064]
design_refs: [10-design-system.md, 12-ui-element-map.md]
skill_refs: [design-taste-frontend]

verification_required:
  lint: true
  typecheck: true
  unit: false
  integration: false
  e2e: false
  accessibility: false

public_text: true
handoff_required: false
handoff_type: []
handoff_file: ""
review_waiver: "Solo dev (reviewer: human). Cross-model review reassigned to the human at the PR into dev, per OS degraded mode."
protected_paths_touched: []
files_allowed:
  - src/app/(site)/about/page.tsx
  - src/components/about/sticky-card.tsx
  - src/components/about/interests-modal.tsx
  - backlog/tasks/TASK-065.md
---

# Task: Retire the "The way I am" modal

> Owner (2026-07-15): "This is NOT a modal. Remove the modal logic."

## Scope

1. `StickyCard` gains a link mode (`href`): renders the same tilt/hover card
   as a `next/link` navigation instead of a `DialogTrigger`. Modal mode stays
   for "Who I am" (`BioModal` is untouched).
2. `src/app/(site)/about/page.tsx`: "The way I am" card navigates to
   `/about/the-way-i-am`; `InterestsModal` import removed.
3. Delete `src/components/about/interests-modal.tsx` (its six topic chips are
   superseded by the dedicated page's content).

## Acceptance criteria
- [ ] Clicking "The way I am" on /about navigates to the new page.
- [ ] "Who I am" modal still opens.
- [ ] `interests-modal.tsx` deleted; no dangling imports.
- [ ] lint / typecheck / build green; slop score >= 35/50.
