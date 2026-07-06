---
id: TASK-056
title: "AboutIntro: real hybrid intro copy"
status: ready
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-014
slice: EPIC-014-SLICE-1
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
  - src/components/about/about-intro.tsx
  - backlog/epics/EPIC-014-about-page-content.md
  - planning/slices/EPIC-014-SLICE-1.md
  - backlog/tasks/TASK-056.md
---

# Task: Real hybrid intro copy for AboutIntro

> Owner (2026-07-06): pasted content blueprint, Part 3, Variation C
> (recommended default) — the balanced infrastructure + design intro that ends
> with a hand-off line to the two-column layout.

## Scope

1. Replace the structural-placeholder copy in `AboutIntro`
   (`src/components/about/about-intro.tsx`) with Variation C, adapted to the
   site's actual voice rules (`11-content-strategy.md` §2): no em dashes, no
   buzzwords, first person.
2. Keep the existing h1 + subhead structure, motion (`fadeUp`/`staggerContainer`),
   `FlashlightCursor`, and `Blob` accent as-is — copy only, no layout change.
3. The final sentence must be the hand-off line ("The short version of how I
   got here is on the left. The longer, more human version is on the right.")
   — this only reads correctly once TASK-057 moves the timeline to the left
   column, so land both tasks together before merging.

## Acceptance criteria
- [ ] `AboutIntro` renders real copy (no "draft copy" placeholder language).
- [ ] Copy reads as both a hiring pitch and a personal bio in one pass.
- [ ] Ends with the two-column hand-off sentence.
- [ ] lint / typecheck / build green; slop score >= 35/50.
