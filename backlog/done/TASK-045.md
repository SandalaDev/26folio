---
id: TASK-045
title: "Footer — light-brown low-contrast text/links + filled low-contrast masonry"
status: done
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-011
slice: EPIC-011-SLICE-2
depends_on: []
design_refs: [10-design-system.md, 12-ui-element-map.md]
content_refs: [11-content-strategy.md]
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
  - src/components/site/site-footer.tsx
  - src/components/site/masonry-pattern.tsx
  - backlog/tasks/TASK-045.md
---

# Task: Footer low-contrast light-brown text + filled low-contrast masonry

> Owner note 3. Reduce footer contrast: text/links become light brown; the
> masonry texture drops contrast against the background and becomes a fill, not
> just borders.

## Scope
- `site-footer.tsx`: text and links use the caramel accent (`--color-caramel`) at
  the muted opacity the system uses for tertiary text (this is the "light brown"),
  hover to rose. The wordmark stays quiet. Keep the three columns, the magazine
  link, and the social set (no LinkedIn, per 11-content-strategy §7). This is a
  palette/contrast pass only — no structural change.
- `masonry-pattern.tsx`: switch the rects from `fill="none"` (outline-only) to a
  low-opacity fill in the `surface`/`border` tone so the texture reads as a filled
  wash over the background rather than an outlined grid, and lower its overall
  contrast vs. the current hairlines. Keep it `aria-hidden`, decorative, behind
  content. The fill opacity and the per-pattern `opacity` prop stay whisper-quiet.
- Keep the footer's existing Framer entry animation and reduced-motion handling.

## Acceptance criteria
- [x] Footer text and links read as light brown (caramel) at low contrast; hover
      goes to rose; contrast still passes WCAG AA against the background.
- [x] Masonry renders as a low-opacity filled texture (not outline-only), lower
      contrast against the background than before.
- [x] Footer structure, magazine link, and social set unchanged.
- [x] lint / typecheck / build green; slop artifact >= 35/50 for `site-footer.tsx`.
