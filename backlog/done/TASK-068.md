---
id: TASK-068
title: "Recompose /about/the-way-i-am: hero blob portrait, section removals, Creative Pursuits, nav"
status: done
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-018
epic_ref: backlog/epics/EPIC-018-the-way-content-overhaul.md
slice: EPIC-018-SLICE-1
depends_on: []
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
  - public/images/abe2.jpg
  - public/images/about/
  - planning/content/.slop/
  - planning/slices/EPIC-018-SLICE-1.md
  - backlog/tasks/TASK-068.md
  - backlog/tasks/TASK-069.md
  - backlog/tasks/TASK-070.md
  - backlog/tasks/TASK-071.md
progress_weight: 1
---

# Task: Recompose the page skeleton

> Owner (2026-07-17, prompt items 2, 5, 6, 8): center the hero blob and
> embed `public/images/abe2.jpg` in it; delete the "Recently listening" and
> "In the studio" cards; rename Creative Practice to Creative Pursuits and
> add Music Production; delete the Hobbies section entirely.

## Scope

1. Commit the new image assets (`public/images/abe2.jpg`,
   `public/images/about/**`) so later tasks can reference them.
2. `way-hero.tsx`: blob moves from the right edge to the page center and
   becomes a blob-masked `next/image` portrait of abe2.jpg (home-hero
   technique); parallax/reveal choreography preserved, reduced-motion safe.
3. `music-hall.tsx`: movements one and two (now-playing TiltCard, studio
   corner) deleted; section keeps heading + artists (until TASK-071) +
   album wall (TASK-069). `MUSIC.production` / `recentlyListening` data
   removed from `src/lib/the-way.ts`.
4. `practice-line.tsx` + data: section renamed "Creative Pursuits",
   Music Production added to the word line.
5. `hobbies-wall.tsx` deleted; `HOBBIES` export removed; page composition,
   `WAY_SECTIONS`, TOC and anchors updated; no dangling ids.

## Acceptance criteria
- [ ] abe2.jpg renders centered inside the blob mask, no layout shift.
- [ ] Hobbies, Recently listening and In the studio are gone from DOM and
      data; TOC matches the remaining sections.
- [ ] Creative Pursuits renders with Music Production in the line.
- [ ] lint / typecheck / build green; slop >= 35/50 on changed src files.

## Verified (2026-07-17)
Dev-server DOM verification (hidden-pane rAF quirk: screenshots stall, DOM
checks used instead, same as EPIC-016/017). Eight [data-way-section]
anchors, hobbies gone from DOM, data and TOC; abe2.jpg renders centered in
the blob mask (224px wide and centered at 375px, col-span-6 center column
at desktop); Creative Pursuits heading with Music Production in the line;
no now-playing or studio cards. lint + typecheck + next build (14 routes)
green; stop-slop 50/50 on all changed src files.
