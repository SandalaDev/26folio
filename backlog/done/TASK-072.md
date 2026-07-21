---
id: TASK-072
title: "Owner revision pass 2: live Spotify creds, hero rebalance, music + collections copy, album shuffle, collapsible image walls"
status: done
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-018
slice: EPIC-018-SLICE-1
depends_on: [TASK-068, TASK-069, TASK-070, TASK-071]
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
  - src/lib/spotify.ts
  - src/lib/spotify-snapshot.json
  - public/images/about/
  - planning/content/.slop/
  - planning/slices/EPIC-018-SLICE-1.md
  - backlog/tasks/TASK-072.md
---

# Task: Owner revision pass 2 on /about/the-way-i-am

> Owner (2026-07-18, updated root prompt.md, 7 items): (1) Spotify client
> id + secret supplied in chat; wire the live 10s playlist (creds land in
> .env.local only, never committed; playlist ID still owed by owner).
> (2) Hero intro copy sits too close to the right TOC rail; recompose the
> hero to be balanced. (3) New owner copy for the Music section: section
> intro, The 10s intro, Desert Island Albums intro. (4) Shuffle the album
> wall so one artist's sleeves never cluster; fold in newly added covers.
> (5) Add the new music-studio images to that wishlist. (6) New owner copy
> for Collections: intro + all five list descriptions ("Planned video
> equipment" retitled "Video studio"). (7) The page scrolls too long:
> the image-heavy walls become collapsible, with distinct reveal
> techniques so the page does not repeat itself.

## Notes

- Items 4 (new covers) and 5 (new studio items) were already folded in on
  this branch before the owner updated prompt.md; item 4's shuffle and
  everything else lands here.
- Owner copy ships verbatim minus obvious typos (missing space, casing).
- Collapse techniques: album wall = capped preview grid + gradient fade +
  "show all" reveal; wishlists = accordion rows with thumbnail teaser
  strips. Bookshelf (14 covers) stays fully visible so the page keeps at
  least one open exhibit.
