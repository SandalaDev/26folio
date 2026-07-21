---
id: TASK-075
title: "Owner revision pass 4: platter width + shuffle-on-load, drop song count, capped era wall with show-all, Seveneves + watches copy, section reorder"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-018
slice: EPIC-018-SLICE-1
depends_on: [TASK-074]
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
  - planning/content/.slop/
  - planning/slices/EPIC-018-SLICE-1.md
  - backlog/tasks/TASK-075.md
---

# Task: Owner revision pass 4 on /about/the-way-i-am

> Owner (2026-07-21, chat, 7 items): (1) the "on the platter" widget gets
> a responsive width so the full song title shows. (2) It shuffles on page
> load instead of always opening on the same song. (3) Drop the "N songs"
> line from the music intro. (4) Cap the track wall to a preview with a
> "show all" button (like the album wall), applied to the All-eras view.
> (5) New Seveneves review copy. (6) New watches-section intro copy. (7)
> Reorder sections: principles, sources of inspiration, music, creative
> pursuits, collections.

## Notes

- (1) Kiosk box is now `w-fit max-w-2xl`; the title dropped `truncate` and
  wraps (text-balance), so the full title always shows.
- (2) Random opener via useEffect on mount (server renders index 0, client
  shuffles after hydration to avoid a mismatch, then crossfades). Not
  visually confirmable in the preview harness (hidden-tab rAF freeze stalls
  the framer crossfade); state logic verified, show-all click confirms the
  component hydrates.
- (4) Wall capped at 30 rows with a show-all toggle that resets when the
  era filter changes; `visible.length` drives the "Show all N songs" label.
- (7) First pass kept curiosity as the opener; owner then moved it (chat,
  2026-07-21) below Sources of Inspiration and above Music. Final order:
  intro, principles, inspiration, curiosity, music, creative pursuits,
  collections, build. page.tsx + WAY_SECTIONS both reflect it.
