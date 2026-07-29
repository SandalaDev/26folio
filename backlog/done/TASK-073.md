---
id: TASK-073
title: "Owner revision pass 3: per-load Spotify refresh, centered platter kiosk, folder-synced images, owner watch/cologne copy, verbose book reviews, section reorder"
status: done
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-018
epic_ref: backlog/epics/EPIC-018-the-way-content-overhaul.md
slice: EPIC-018-SLICE-1
depends_on: [TASK-072]
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
  - backlog/tasks/TASK-073.md
progress_weight: 1
---

# Task: Owner revision pass 3 on /about/the-way-i-am

> Owner (2026-07-20, root prompt.md, 7 items + textcontent.md): (1) playlist
> edits on Spotify must show up without a rebuild; refresh on every page
> load. (2) The "On the platter" kiosk reads full-width with the art pushed
> right; center the art and pull the whole widget toward the page center.
> (3) Sync every image section with its source folder; new images that have
> no textcontent.md entry get a drafted line from collection + filename.
> (4) Books section adopts the new titles and owner reviews in
> textcontent.md. (5) Watch and cologne sections adopt the owner's
> textcontent.md intros and per-item lines. (6) Restructure the bookshelf
> around the verbose mini reviews (owner delegated the mechanism; on-click
> reveal, design-system transitions). (7) Section order becomes music,
> creative pursuits, sources of inspiration, collections.

## Notes

- Spotify freshness: page goes dynamic; each request re-reads the public
  embed track list (one fetch) and only re-pulls track detail when the
  list actually changed, then rewrites the snapshot best-effort.
- Owner copy ships verbatim minus grammar/flow cleanup, per the explicit
  instructions embedded in textcontent.md (Basic Economics: no rewrite;
  Thinking, Fast and Slow: rewritten from the supplied LLM draft into the
  owner's voice). British spellings in owner copy stay.
- Seveneves, Hyperion and the Status Pro X have covers/shots but no owner
  copy; their lines are agent drafts pending owner review, flagged in
  the data file comments.
- Bookshelf mechanism: shelf rail stays; clicking a cover opens a reading
  panel under the shelf (height-auto reveal + crossfade on book switch,
  static under reduced motion), one open per shelf.
