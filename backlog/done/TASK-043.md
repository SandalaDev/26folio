---
id: TASK-043
title: "Hero — single-weight enlarged h1, CTA + portrait aligned to h1 ends, larger portrait-cropped image"
status: done
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-011
slice: EPIC-011-SLICE-1
depends_on: []
design_refs: [10-design-system.md, 12-ui-element-map.md]
content_refs: [11-content-strategy.md]
skill_refs: [design-taste-frontend, framer-motion]

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
  - src/components/home/hero.tsx
  - src/app/globals.css
  # This branch's scaffolding (epic + slices + all task files) is authored in
  # this task's commit, mirroring EPIC-010 TASK-038. The epic lives under
  # backlog/epics/ (OS_MANAGED, excluded); slices + task files are listed here.
  - planning/slices/EPIC-011-SLICE-1.md
  - planning/slices/EPIC-011-SLICE-2.md
  - planning/slices/EPIC-011-SLICE-3.md
  - backlog/tasks/TASK-043.md
  - backlog/tasks/TASK-044.md
  - backlog/tasks/TASK-045.md
  - backlog/tasks/TASK-046.md
  - backlog/tasks/TASK-047.md
  - backlog/tasks/TASK-048.md
---

# Task: Hero single-weight enlarged h1 + aligned CTA/portrait + larger portrait crop

> Owner note 1. The h1 drops its heavy/light weight mix for a single, larger
> weight; the CTA and the portrait align to the h1's left/right ends; the portrait
> grows and crops to the face. EPIC-009 machinery (shader background, magnetic
> CTA, reduced-motion fallbacks) is untouched. Hero copy unchanged.

## Scope
- `globals.css`: raise the `--text-display` clamp ceiling so the h1 is visibly
  larger (the token is the canonical place for the display scale; keep the floor
  and the line-height/letter-spacing; do not touch the subhead/heading tokens).
- `hero.tsx`:
  - h1: remove the inline `font-semibold` / `font-extralight` spans so the whole
    headline is one weight (the display token's 650). Copy stays identical.
  - Alignment: replace the 12-col split with a single column anchored to the h1's
    width. On desktop, the portrait and the CTA sit in one row whose left edge
    aligns to the h1's left margin and whose right edge aligns to the h1's right
    margin (portrait on one end, CTA on the other, or portrait under the h1's far
    end as EPIC-010 had it but sized to reach the h1's edge — whichever reads as
    "aligned to the ends of the h1").
  - Portrait: larger (bump the width clamps), portrait (taller) aspect ratio,
    `object-cover` with an `object-position` bias toward the top/face so the crop
    shows the face portrait-style. Keep the blob mask + morph + caramel echo;
    keep `next/image` with explicit `sizes`, priority, alt "Abe Sandala".
  - Mobile: keep the EPIC-010 single-column collapse (portrait above h1, CTA
    below subhead); alignment is desktop-only.
- Keep the hero within the design-lane guardrails (§4.7): fits the initial
  viewport, top padding <= pt-24, <= 4 text elements.

## Acceptance criteria
- [x] h1 renders in a single weight (no inline weight spans), visibly larger than
      before, copy identical.
- [x] On desktop, the CTA and the portrait align to the left/right ends of the
      h1; on mobile the layout collapses to a single column.
- [x] Portrait is larger, portrait-aspect, cropped to show the face, still
      blob-masked; morph pauses under `prefers-reduced-motion`.
- [x] Hero still fits the initial viewport; EPIC-009 shader/CTA untouched.
- [x] lint / typecheck / build green; slop artifact >= 35/50 for `hero.tsx`.
