---
id: TASK-069
title: "Imagery galleries: album wall from the folder, bookshelf rebuilt around covers"
status: open
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-018
slice: EPIC-018-SLICE-1
depends_on: [TASK-068]
design_refs: [10-design-system.md, 12-ui-element-map.md]
skill_refs: [design-taste-frontend, framer-motion, stop-slop]

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
  - src/app/(site)/about/the-way-i-am/
  - src/components/the-way/
  - src/lib/the-way.ts
  - public/images/about/
  - planning/content/.slop/
  - planning/slices/EPIC-018-SLICE-1.md
  - backlog/tasks/TASK-069.md
---

# Task: Real artwork for the album wall and the bookshelf

> Owner (2026-07-17, prompt items 1, 3): albums folder defines the wall
> (confirmed in chat); books get real covers, a cover-forward redesign, a
> hover "why I like it" summary, a sensible mobile behavior, smooth motion.

## Scope

1. `src/lib/the-way.ts`: album entries carry `cover` paths; the list is
   regenerated from `public/images/about/albums/` (every cover is a tile,
   coverless albums dropped). Book entries carry `cover` paths from
   `public/images/about/books/` (all 14 present).
2. `music-hall.tsx` wall: real sleeves via `next/image` (square, hard
   corners, no layout shift); title/artist as overlay or caption; hover
   lift preserved; palette-wash fallback only if a file fails to resolve.
3. `bookshelf.tsx`: rebuilt cover-forward. Desktop hover reveals the
   takeaway with smooth transform/opacity motion; mobile taps to reveal
   (aria-expanded, one open at a time); keyboard focus mirrors hover;
   reduced-motion collapses to instant swap.

## Acceptance criteria
- [ ] Wall tile count equals the album cover count in the folder.
- [ ] Every book renders its real cover; takeaway reveals on hover,
      focus and tap; motion is smooth and reduced-motion safe.
- [ ] No horizontal overflow at 375px; images sized, no CLS.
- [ ] lint / typecheck / build green; slop >= 35/50 on changed src files.
