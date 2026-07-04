---
id: TASK-051
title: "De-jag blob washes — blur proportional to rendered size (SVG-space feGaussianBlur)"
status: ready
priority: P2
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-012
slice: EPIC-012-SLICE-2
depends_on: []
design_refs: [10-design-system.md]
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
  - src/components/site/blob.tsx
  - src/components/home/hero.tsx
  - src/components/about/about-intro.tsx
  - src/components/site/cta-callout.tsx
  - src/components/home/magazine-teaser.tsx
  - src/components/home/capability-rail.tsx
  - src/app/(site)/capabilities/page.tsx
  - src/app/(site)/contact/page.tsx
  - backlog/tasks/TASK-051.md
---

# Task: De-jag the blob washes

> Blob "washes" ship with 2–8px CSS blurs on SVGs scaled to 26rem+, so §3's
> "soft washes, large blur radii" renders as stepped organic edges. Blur must
> scale with the rendered size.

## Scope
- `blob.tsx`: move the blur inside the SVG — a `feGaussianBlur` filter whose
  `stdDeviation` is expressed in the 200×200 viewBox's user space, so the blur
  scales with the blob automatically. Keep the `blur` prop's meaning ("soft
  wash strength"), reinterpreting it in user-space units; a unique filter id
  per instance (React `useId`) so multiple blobs don't collide. Widen the
  filter region (`x/y/width/height` margins) so the blur is never clipped
  square at the SVG edge.
- Consumers (listed in files_allowed): retune `blur`/`opacity` per instance so
  every shipped blob reads as a soft pool of light — no visible path edge at
  its rendered size. No new blobs, no removed blobs, positions unchanged.
- Blobs used as image masks (`blob-mask-*` utilities) are out of scope — only
  the SVG wash instances.

## Acceptance criteria
- [ ] No stepped/jagged blob edge at any shipped size on /, /about,
      /capabilities, /contact (in-browser check).
- [ ] Blur scales with the blob (resize the window; edges stay soft).
- [ ] Wash intensities still read as seasoning (§3), not pools of paint.
- [ ] lint / typecheck / build green.
