---
id: TASK-052
title: "Palette redistribution — soft/caramel/peach/surface-2/border-2 carry their §2 roles; rose back to seasoning"
status: done
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-012
slice: EPIC-012-SLICE-3
depends_on: []
design_refs: [10-design-system.md, 10-design-system.html, 12-ui-element-map.md]
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
  - src/components/site/eyebrow.tsx
  - src/components/site/section.tsx
  - src/components/site/site-footer.tsx
  - src/components/capabilities/service-tabs.tsx
  - src/components/capabilities/process-steps.tsx
  - src/components/capabilities/tech-grid.tsx
  - src/components/capabilities/technologies-section.tsx
  - src/components/home/capability-rail.tsx
  - src/components/home/work-card.tsx
  - src/components/home/featured-work.tsx
  - src/components/home/magazine-teaser.tsx
  - src/components/about/sticky-card.tsx
  - src/components/about/magazine-section.tsx
  - src/components/about/timeline.tsx
  - src/components/site/contact-form.tsx
  - backlog/tasks/TASK-052.md
---

# Task: Palette redistribution — apply the full token set

> Grep audit (epic §3): rose 42 uses; soft 1, surface-2 1, caramel 9 (mostly
> blob fills), peach 8, success 0. The preview distributes the palette; the
> site is a rose monoculture, which is why it reads flatter than the preview.

## Scope
Follow the preview's own assignments — this task moves existing elements onto
the tokens the design system already gives them; it invents nothing:
- **caramel** takes the label/technical accent role: section numbers/labels,
  table-header-like text, mono accents (the preview's `.num`, `.label`,
  `mtable th`, footer `code`). Give `Eyebrow` a tone variant (rose default,
  caramel option) and alternate tones across sections so rose stops being the
  only voice.
- **soft** takes tertiary text: card captions/taglines, role/description
  lines, timeline meta — anywhere a third text level currently reuses `muted`
  or `ink/70`.
- **peach** takes mono/code accents and bridge highlights (the preview's
  `.sample-mono`, `mtable code`), e.g. tech-grid hover accents.
- **surface-2 / border-2** become the elevation step: hovered/active cards
  and tab rails move `surface → surface-2` and `border → border-2` (the
  preview's swatch-hover pattern), instead of leaning on rose for every state
  change.
- **rose** keeps: primary CTAs, active/selected states, focus ring, selection
  wash. Its site-wide count should drop materially from 42.
- Do not touch: `Button`/`MagneticButton` variants, layout, copy, any hex.

## Acceptance criteria
- [ ] soft, caramel, peach, surface-2, border-2 each carry their §2 role on
      at least one real, visible element family (not a one-off).
- [ ] Rose usage drops materially (from 42 component-level references) and
      reads as seasoning; no page has rose as the only accent voice.
- [ ] Every text-on-background pairing stays AA (soft/caramel/peach on
      background/surface all pass at their sizes).
- [ ] No layout shifts, no copy changes, no functional changes.
- [ ] lint / typecheck / build green; before/after eyeball on all five pages.
