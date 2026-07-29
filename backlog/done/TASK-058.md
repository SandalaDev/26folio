---
id: TASK-058
title: "BioModal + StickyCard: real Who I Am bio + card reorder"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-014
epic_ref: backlog/epics/EPIC-014-about-page-content.md
slice: EPIC-014-SLICE-2
depends_on: []
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
  - src/components/about/bio-modal.tsx
  - src/components/about/sticky-card.tsx
  - src/app/(site)/about/page.tsx
  - public/images/abe-about.png
  - backlog/epics/EPIC-014-about-page-content.md
  - planning/slices/EPIC-014-SLICE-2.md
  - backlog/tasks/TASK-058.md
progress_weight: 1
---

# Task: Real "Who I Am" bio + sticky-card reorder

> Owner (2026-07-06): pasted content blueprint, Part 2 — six modular bio
> sections (~550-700 words total): opening hook, design roots, telecom
> chapter, the turn, how I work, the close. Also Part 1's recommendation:
> "Who I Am" leads (business case), "The Way I Am" follows (personality layer).

## Scope

1. Replace the placeholder `BioModal` body with the real six-section
   biography, adapted to the site's voice rules (first person, no em dashes,
   no buzzwords, stop-slop compliant).
2. In `sticky-card.tsx`, add an optional `cta` prop rendered as a short
   affordance line under the description (e.g. "Read the full story ->").
3. In `src/app/(site)/about/page.tsx`, reorder the two `StickyCard`s so "Who I
   am" renders first with teaser "From cell towers to codebases, the full
   story of why I build software the way I do." and cta "Read the full
   story", followed by "The way I am" with teaser "The nerdiness, the design
   obsession, and everything I do when I'm not shipping." and cta "Poke
   around" (copy for the second card's modal body is TASK-059).

## Acceptance criteria
- [x] `BioModal` renders the real six-section bio, no placeholder language.
- [x] "Who I am" card is first in DOM/visual order in the right column, with
      real teaser + cta copy.
- [x] lint / typecheck / build green; slop score >= 35/50.

## Verified (2026-07-06)
`BioModal` carries the real six-section biography (~570 words: opening hook,
design roots, telecom chapter, the turn, how I work, the close). `StickyCard`
gained an optional `cta` prop rendered as a rose affordance line. About page
reordered: "Who I am" (teaser + "Read the full story →") first, "The way I
am" (teaser + "Poke around →") second. Confirmed in-browser: clicked "Who I
am", modal opens with the full bio, scrollable, close button works. lint +
typecheck + `next build` (8 routes) green; stop-slop score 46/50.

## Follow-up (2026-07-07, owner feedback on PR #17)
Cards enlarged with image headers: "Who I am" carries the full combo logo
lockup (peach variant, object-contain on the background field), "The way I
am" carries the owner-supplied public/images/abe-about.png portrait
(object-cover, subtle hover zoom). Stickiness moved off the individual cards
onto the column wrapper in page.tsx, so both cards pin together and stay
visible instead of staggering past each other; image height capped at 18vh
so cards + EpochNav fit shorter viewports. Verified in-browser (see
TASK-057 follow-up). lint + typecheck + build green; slop 46/50.
