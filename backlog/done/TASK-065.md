---
id: TASK-065
title: "About page: retire InterestsModal, card links to /about/the-way-i-am"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-016
epic_ref: backlog/epics/EPIC-016-the-way-i-am-page.md
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
progress_weight: 1
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
- [x] Clicking "The way I am" on /about navigates to the new page.
- [x] "Who I am" modal still opens.
- [x] `interests-modal.tsx` deleted; no dangling imports.
- [x] lint / typecheck / build green; slop score >= 35/50.

## Verified (2026-07-15)
StickyCard gained an `href` link mode (motion.create(Link), same tilt +
hover language); modal mode untouched. On /about the "The way I am" card
renders as a single link to /about/the-way-i-am with the new "Walk through
it" cta, and the "Who I am" card still opens its dialog (confirmed
in-browser: role="dialog" mounts with the "Who I am" title).
interests-modal.tsx removed via `git rm`; typecheck confirms no dangling
imports. lint + typecheck + build green; sticky-card.tsx 42/50,
about/page.tsx 46/50 on the slop gate.
