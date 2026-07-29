---
id: TASK-029
title: "Technologies section — intro + TechGrid + LogoHoverCard"
status: done
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-006
epic_ref: backlog/epics/EPIC-006-capabilities-page.md
slice: EPIC-006-SLICE-3
depends_on: []
design_refs: [12-ui-element-map.md, 06-project-technical-plan.md]
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
handoff_file: handoffs/review/HANDOFF-REVIEW-TASK-029.md
protected_paths_touched: []
files_allowed:
  - src/components/capabilities/technologies-section.tsx
  - src/components/capabilities/tech-grid.tsx
  - src/components/ui/hover-card.tsx
  - package.json
  - package-lock.json
  - backlog/tasks/TASK-029.md
progress_weight: 1
---

# Task: Technologies section

> **Real stack, not invented** (epic decision #1). [06-project-technical-plan.md](../../project-spine/06-project-technical-plan.md)
> §2 documents the actual stack this site is built with — use it as the seed list,
> flagged as a starting point for Abe to confirm/expand, not presented as exhaustive.

## Scope
- Vendor `src/components/ui/hover-card.tsx` from the known shadcn `HoverCard`
  source (`@radix-ui/react-hover-card`), hard-cornered, token-styled.
- `TechGrid`: fixed grid (does not scroll) of text/wordmark-style badges for the
  real stack (Next.js, TypeScript, Tailwind CSS, Framer Motion, GSAP, Resend,
  Node.js, Dokploy). A visible subset (e.g. 6 of 8) animates/swaps every few
  seconds via Framer `AnimatePresence` (no GSAP — timer-driven, not scroll-driven,
  per architecture principle #4). Each badge is also a `HoverCard` trigger showing
  the tech's name and its real, documented role in this stack (not invented usage).
- `TechnologiesSection`: `Section` + `Eyebrow` + intro copy on skillset/tooling
  philosophy + `TechGrid`.

## Acceptance criteria
- [ ] Every `TechGrid` entry's hover detail is traceable to
  [06-project-technical-plan.md](../../project-spine/06-project-technical-plan.md)
  §2 — no invented tools or fabricated usage claims.
- [ ] The grid container itself never scrolls; only the *visible badge set*
  changes over time.
- [ ] `HoverCard` content is also reachable via keyboard focus (Radix `HoverCard`
  opens on focus by default) — not mouse-hover-only.
- [ ] Timer interval is cleared on unmount.
- [ ] `npm run lint` and `npm run typecheck` pass; `npm run build` green + static.

## Notes
Medium risk: timer-driven animation lifecycle (interval cleanup) + a new vendored
primitive — route via cross-model review
(`handoffs/review/HANDOFF-REVIEW-TASK-029.md`).
