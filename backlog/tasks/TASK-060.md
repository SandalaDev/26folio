---
id: TASK-060
title: "New DualCtaBand: closing conversion band"
status: ready
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-014
slice: EPIC-014-SLICE-2
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

public_text: true
handoff_required: false
handoff_type: []
handoff_file: ""
review_waiver: "Solo dev (reviewer: human). Cross-model review reassigned to the human at the PR into dev, per OS degraded mode."
protected_paths_touched: []
files_allowed:
  - src/components/about/dual-cta-band.tsx
  - src/app/(site)/about/page.tsx
  - backlog/epics/EPIC-014-about-page-content.md
  - planning/slices/EPIC-014-SLICE-2.md
  - backlog/tasks/TASK-060.md
---

# Task: Dual-CTA closing band

> Owner (2026-07-06): pasted content blueprint, Part 1 §4 — "the page
> currently has no landing zone after the depth content. Add a full-width
> closing band with two paths": clients ("Have a product in mind? -> Start a
> conversation") and employers/teams ("Looking for the formal version? ->
> Download CV / View work").

## Scope

1. Build `DualCtaBand` (`src/components/about/dual-cta-band.tsx`): a
   full-width band with two side-by-side (stacked on mobile) paths, each with
   its own heading + CTA button, reusing `MagneticButton` for hover parity
   with every other CTA on the site.
2. Client path: "Have a product in mind?" -> `MagneticButton` "Start a
   conversation" -> `/contact`.
3. Teams/employer path: "Looking for the formal version?" -> `MagneticButton`
   "View my work" -> `/work`. No CV/resume file exists in the repo, so this
   path points at the work page instead of a download; flag the CV gap as an
   owner follow-up rather than fabricating an asset.
4. In `src/app/(site)/about/page.tsx`, replace the closing generic
   `CTACallout` with `DualCtaBand`.

## Acceptance criteria
- [ ] Full-width band with two distinct, clearly-labeled paths.
- [ ] Both CTAs use `MagneticButton` and degrade cleanly under reduced-motion.
- [ ] Page's final section is this band (single generic `CTACallout` removed).
- [ ] lint / typecheck / build green; slop score >= 35/50.
