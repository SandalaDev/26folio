---
id: EPIC-023
title: "Capabilities page: problem-led services and animated technical proof"
status: done
priority: P1
risk_level: high
roadmap_refs: [ROAD-004]
goal_refs: [GOAL-001, GOAL-002, GOAL-004]
progress_weight: 1
---
# Epic: Capabilities page: problem-led services and animated technical proof

## Outcome

The capabilities page helps a non-technical business owner recognize an
operational problem, understand what a useful custom system could do, and see
enough delivery and engineering evidence to start a qualified conversation.

## Scope

- Replace the four-pillar capabilities summary with the owner-supplied
  problem-led service narrative, without inventing outcomes or guarantees.
- Build a distinctive editorial systems experience from the existing
  typography, warm-dark palette, hard-edged geometry, blob motif, and section
  rhythm.
- Use GSAP for scroll-authored sequences and Framer Motion for React state,
  component transitions, and tactile interactions; no element is owned by both.
- Present delivery, ownership, engineering standards, fit, FAQs, and conversion
  content without turning the page into a generic card stack.
- Rebuild the technology section around applicable SVGs in
  `public/icons/color/`, with explicit text-only fallbacks for missing marks.
- Preserve responsive reading order, keyboard access, reduced-motion content,
  and static generation.
- Consume and delete the untracked source brief only after its content is
  represented in the implementation.

## Non-goals

- No new dependency, CMS, database, pricing promise, response-time promise, or
  unverified client outcome.
- No redesign of shared site chrome or unrelated pages.
- No use of colored icons that are absent from the supplied technology copy.

## Design direction

**Design Read:** An editorial systems dossier: warm, cinematic, and exact,
turning business friction into coordinated machinery as the visitor moves
through the page.

- `DESIGN_VARIANCE`: 9/10 — the page must feel authored, not assembled.
- `MOTION_INTENSITY`: 8/10 — motion carries hierarchy and system relationships.
- `VISUAL_DENSITY`: 6/10 — long-form evidence is structured, not hidden.

## Tasks

- [x] TASK-084 — Structure the capabilities narrative and content model.
- [x] TASK-085 — Build the animated services and partnership experience.
- [x] TASK-086 — Build the colored technology atlas.
- [x] TASK-087 — Validate responsive motion, accessibility, and content migration.

## Dependency / Architecture Evidence

- plan: none

The existing GSAP, Framer Motion, Radix HoverCard, Phosphor, Next.js, and
Tailwind stack is sufficient. Free/public 21st.dev FAQ, scroll-FAQ, hero-grid,
and logo-grid candidates were assessed; none matches the approved hard-edged
brand system and interaction contract without importing a generic composition
or new package responsibility, so no source component is copied.

## Testing

- recommendation: dedicated: TASK-087
- rationale: The page combines public claims, a large content migration,
  responsive layouts, timed and scroll-driven motion, keyboard interaction, and
  many local SVG paths. A focused validation task provides better evidence than
  shallow checks distributed across the construction tasks.
