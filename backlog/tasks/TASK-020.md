---
id: TASK-020
title: "Sticky cards & modals — StickyCard, InterestsModal, BioModal"
status: done
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-004
slice: EPIC-004-SLICE-3
depends_on: [TASK-018]
design_refs: [12-ui-element-map.md, 11-content-strategy.md]
skill_refs: [design-taste-frontend, shadcn-ui-builder]

verification_required:
  lint: true
  typecheck: true
  unit: false
  integration: false
  e2e: false
  accessibility: false

public_text: false
handoff_required: true
handoff_type:
  - review
handoff_file: handoffs/review/HANDOFF-REVIEW-TASK-020.md
protected_paths_touched: []
files_allowed:
  - src/components/ui/dialog.tsx
  - src/components/about/sticky-card.tsx
  - src/components/about/interests-modal.tsx
  - src/components/about/bio-modal.tsx
  - package.json
  - package-lock.json
  - backlog/tasks/TASK-020.md
---

# Task: Sticky cards & modals

> **Placeholder content (epic decision #1).** "The way I am" (interests) and "Who I
> am" (biography) are real personal content with no source in this repo's spine —
> ship the structural modal/card components against clearly placeholder categories
> and bio text, not invented specifics.

## Scope
- Vendor `src/components/ui/dialog.tsx` from the known shadcn `Dialog` source
  (same Radix primitive family as `Sheet`), hard-cornered, rose-focus-ring, no
  default rounding. Add `@radix-ui/react-dialog` if not already present (TASK-012
  already added it for `Sheet` — reuse, don't re-add).
- `StickyCard`: a card that opens a `Dialog` on click, `position: sticky` within its
  column, Framer hover (subtle lift/scale).
- `InterestsModal`: categorised interest list (3-4 placeholder categories, no real
  images yet — use a token-styled placeholder block, not an external image URL),
  playful grid layout, Framer content stagger on open.
- `BioModal`: longer placeholder biography text, Framer fade on open.

## Acceptance criteria
- [ ] `Dialog` reuses the `@radix-ui/react-dialog` dependency already installed for
  `Sheet` (TASK-012) — no duplicate dependency added.
- [ ] Both modals are real Radix `Dialog`s: focus trap, `Escape` closes, labelled
  (`DialogTitle`), trigger has an accessible name.
- [ ] `StickyCard`'s sticky positioning doesn't break inside the two-column layout
  TASK-023 composes it into (verify against a realistic column height, not just in
  isolation).
- [ ] No external image URLs (`next/image` with a real `src` would need real assets
  that don't exist yet) — interest "images" are token-styled placeholder blocks.
- [ ] `npm run lint` and `npm run typecheck` pass; `npm run build` green + static.

## Notes
Medium risk: shared modal pattern + dependency reuse — route via cross-model review
(`handoffs/review/HANDOFF-REVIEW-TASK-020.md`). All content is structural
placeholder, `public_text: false`.
