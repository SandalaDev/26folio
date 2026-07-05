---
id: TASK-055
title: "Apply real logo SVGs to SiteHeader and SiteFooter"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-013
slice: EPIC-013-SLICE-1
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
  - src/components/site/site-header.tsx
  - src/components/site/site-footer.tsx
  - public/images/logo/
  - backlog/epics/EPIC-013-content-phase-1.md
  - backlog/tasks/TASK-055.md
---

# Task: Apply real logo SVGs to header and footer

> Owner (2026-07-05): apply the SVGs in `public/images/logo/` to the header and
> footer. Files are named by color; `combo` filenames are symbol+wordmark
> combination marks, plain filenames are the symbol only. Use judgement on
> which color/style fits each chrome, and keep it subtle — very low contrast
> between elements.

## Scope

1. Replace the literal `<Link>Sandala</Link>` text wordmark in `SiteHeader`
   (`src/components/site/site-header.tsx`) with an inline `logo_combo-muted.svg`
   (symbol + wordmark lockup), sized as a compact square brand mark inline with
   the nav row. Muted matches the token already used for low-emphasis chrome
   text and reads as ambient branding rather than a loud stamp against the
   header's transparent, varying background.
2. Replace the `<span>Sandala</span>` text label in `SiteFooter`
   (`src/components/site/site-footer.tsx`) with the same `logo_combo-muted.svg`
   mark, sized slightly larger as the footer's standalone brand block (footer
   already uses `text-muted` for this label, so the color read is unchanged).
3. Both marks keep the existing `<Link href="/">` wrapper and accessible name
   (`aria-label="Sandala"` on the link, `alt=""` / decorative `<Image>` since
   the link already names itself).
4. Use `next/image` for both (static SVG import, fixed intrinsic size) — no
   layout shift, no new dependencies.

## Acceptance criteria
- [x] Header shows the combo-muted mark in place of the text wordmark, home
      link still works, nav layout/height unchanged.
- [x] Footer shows the same mark in place of its text label, column layout
      unchanged.
- [x] Mark reads as subtle/low-contrast in both contexts (muted token, not an
      accent color) per the owner's ask.
- [x] lint / typecheck / build green.

## Verified (2026-07-05)
`logo_combo-muted.svg` wired via `next/image` at 36px (header) / 44px (footer),
both behind an `aria-label="Sandala"` link, `alt=""` since the link already
names itself. Confirmed in-browser (dev server): correct `currentSrc`, no
layout shift (boundingBox matches the declared width/height, no reflow), no
console/network errors. lint + typecheck green; `next build` not re-run this
session (no risk-bearing logic changed beyond static asset swap).
