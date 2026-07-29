---
id: TASK-070
title: "Wishlist section: five image-backed wishlists with intro, descriptions, per-item hover copy"
status: done
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-018
epic_ref: backlog/epics/EPIC-018-the-way-content-overhaul.md
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
review_waiver: "Solo dev (reviewer: human). Cross-model review reassigned to the human at the PR into dev, per OS degraded mode. Personal-voice hover lines (watches, colognes) are agent drafts the owner reviews at the PR."
protected_paths_touched: []
files_allowed:
  - src/app/(site)/about/the-way-i-am/
  - src/components/the-way/
  - src/lib/the-way.ts
  - public/images/about/
  - planning/content/.slop/
  - planning/slices/EPIC-018-SLICE-1.md
  - backlog/tasks/TASK-070.md
progress_weight: 1
---

# Task: Collections becomes the wishlist wing

> Owner (2026-07-17, prompt item 7): the Collections section becomes an
> intro paragraph plus five wishlists with brief descriptions: audiophile
> gear, dream home music studio build, planned video equipment, watch
> wishlist, nostalgic/want-to-try colognes. Hover text per item: watches =
> why he likes it; audio/video gear = what the piece is for; colognes =
> why he wants it. Images: `public/images/about/wishlist/`. Owner confirmed
> the agent drafts the personal-voice copy for review.

## Scope

1. `src/lib/the-way.ts`: typed wishlist data (name, image, hover line) for
   all five lists from the folder contents (12 audiophile, 13 studio,
   18 video, 13 watches, 27 colognes). Gear lines are factual purpose
   descriptions; watch/cologne lines are enthusiast-informed drafts,
   marked for owner review in the PR.
2. `collection-shelves.tsx` replaced by a wishlist component: section
   intro paragraph, five sub-collections each with a one-line description,
   image-backed item cases in the shelf language (hard corners, shelf
   boards, hover lift), hover/focus reveals the item line; mobile
   tap-to-reveal consistent with TASK-069's bookshelf behavior.

## Acceptance criteria
- [ ] Intro + five described wishlists render with every image resolved.
- [ ] Hover, focus and tap reveal the right kind of line per list.
- [ ] Personal-voice drafts flagged for owner review in the PR body.
- [ ] No horizontal overflow at 375px; reduced-motion safe.
- [ ] lint / typecheck / build green; slop >= 35/50 on changed src files.

## Verified (2026-07-17)
Intro plus five wishlists render (Audiophile gear, Dream home music studio,
Planned video equipment, Watch wishlist, Colognes), 84 item cases with
resolved images; tap toggles the note drawer with one open per list
(aria-expanded verified), hover/focus reveal on transform/opacity. Four
unicode filenames 400'd in the Next image optimizer and were renamed to
ascii slugs (follow-up commit). Personal-voice watch/cologne lines are
drafts for owner review at the PR. lint/typecheck/build green; slop 50/50.
