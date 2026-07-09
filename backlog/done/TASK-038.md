---
id: TASK-038
title: "Typography overhaul (binaries + weight contrast + de-caps), full-viewport layout, transparent header"
status: done
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-010
slice: EPIC-010-SLICE-1
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

public_text: false
handoff_required: false
handoff_type: []
handoff_file: ""
review_waiver: "Solo dev (reviewer: human). Cross-model review reassigned to the human at the PR into dev, per OS degraded mode."
protected_paths_touched: []
files_allowed:
  - public/fonts/
  - src/app/globals.css
  - src/app/(site)/
  - src/components/site/
  - src/components/home/
  - src/components/about/
  - src/components/capabilities/
  - src/components/work/
  - src/components/ui/
  - planning/slices/EPIC-010-SLICE-1.md
  - planning/slices/EPIC-010-SLICE-2.md
  - planning/slices/EPIC-010-SLICE-3.md
  - backlog/tasks/TASK-038.md
  - backlog/tasks/TASK-039.md
  - backlog/tasks/TASK-040.md
  - backlog/tasks/TASK-041.md
  - backlog/tasks/TASK-042.md
---

# Task: Typography, layout width, transparent header

> Owner brief item 7. Root cause found in exploration: the @font-face binaries
> were never shipped, so the site rendered in system fallback. All-caps lives in
> one `eyebrow` utility; max-width lives in `Section` + the header.

## Scope
- Install variable font binaries into `public/fonts/` (Clash Display + General
  Sans from Fontshare, incl. italic; JetBrains Mono variable via fontsource) —
  filenames match the existing @font-face block; add the italic face declaration.
- globals.css: restyle `eyebrow` (normal case, 13px, weight 500, slight
  tracking); tune `--text-display` (larger clamp, tighter tracking, weight 650);
  add `text-subhead` light-weight utility and heading weight-contrast helpers.
- `section.tsx`: drop `max-w-7xl mx-auto`; padding rhythm scales instead
  (`px-5 md:px-10 lg:px-16 xl:px-24`).
- `site-header.tsx`: transparent (no border, no bg, no blur), no `max-w-7xl`;
  logo + nav text only; hide-on-scroll kept.
- Heading sweep: section h2s move to the weight-contrast scale; eyebrow usage
  thinned to the design lane's restraint rule (≤ 1 per 3 sections per page);
  `about-intro` width constraint relaxed.

## Acceptance criteria
- [x] `public/fonts/*.woff2` present; display text renders Clash Display (not
      system fallback) in-browser.
- [x] No `text-transform: uppercase` computed anywhere on any page.
- [x] `Section`/header have no layout max-width; content spans the viewport with
      the padding rhythm.
- [x] Header computed style: transparent background, no border/blur.
- [x] `npm run lint`, `npm run typecheck`, `npm run build` green.

## Notes
Medium risk: global cascade (every page). Copy is untouched (CSS-only case
change) so `public_text` stays false.
