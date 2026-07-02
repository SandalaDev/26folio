---
id: TASK-040
title: "Hero — blob-masked portrait (small, third in hierarchy) + asymmetric recomposition"
status: done
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-010
slice: EPIC-010-SLICE-2
depends_on: [TASK-039]
design_refs: [10-design-system.md, 12-ui-element-map.md]
skill_refs: [design-taste-frontend, framer-motion]

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
  - src/components/home/hero.tsx
  - public/images/
  - "Portrait 800 transparent.png"
  - backlog/tasks/TASK-040.md
---

# Task: Hero portrait + recomposition

> Owner brief items 1–2. The portrait must NOT dominate: hierarchy is h1 →
> subhead + CTA → portrait. EPIC-009 machinery (shader background, magnetic CTA,
> reduced-motion fallbacks) is untouched.

## Scope
- Asset: owner's `Portrait 800 transparent.png` moved/renamed to
  `public/images/portrait.png` (root copy deletion committed).
- `hero.tsx`: asymmetric composition on the new full-viewport width. Desktop:
  text block left (h1 with heavy/light weight mix, subhead, CTA); portrait
  offset right and low, ~200px, blob-masked (SLICE-1 `.blob-mask-*` + morph),
  soft `Blob` echo behind it. Mobile: portrait ~112px above the h1. Portrait via
  next/image with explicit `sizes`, alt "Abe Sandala".
- Hero copy unchanged.

## Acceptance criteria
- [x] Portrait renders inside an organic blob mask; morph pauses under
      `prefers-reduced-motion`.
- [x] Visual hierarchy reads h1 → subhead/CTA → portrait (portrait is small,
      offset, never overlaps text).
- [x] Hero still fits the initial viewport; ≤ 4 text elements; copy identical.
- [x] lint / typecheck / build green.
