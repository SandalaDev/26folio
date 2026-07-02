---
id: TASK-042
title: "What-I-do rail — five enlarged icon cards + services lib + anchored capabilities sections"
status: done
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-010
slice: EPIC-010-SLICE-3
depends_on: [TASK-039]
design_refs: [10-design-system.md, 11-content-strategy.md, 12-ui-element-map.md]
skill_refs: [design-taste-frontend, gsap, stop-slop]

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
  - src/lib/services.ts
  - src/components/home/capability-rail.tsx
  - src/components/capabilities/
  - package.json
  - package-lock.json
  - backlog/tasks/TASK-042.md
---

# Task: What-I-do rail + services source of truth

> Owner brief item 6 (+ owner answer: add the new sections to the capabilities
> page with drafted copy). Icons come from Phosphor, the design lane's allowed
> library.

## Scope
- `src/lib/services.ts` (new): single source `{ id, title, description, icon,
  items }` consumed by both the home rail and the capabilities tabs (kills the
  existing duplication). Five services: web development, custom software, AI
  integration, **mobile money & online payments**, **e-commerce** (drafted
  neutral copy, flagged for owner review).
- `capability-rail.tsx`: five enlarged cards (focus card takes more viewport via
  the existing GSAP scrub), Phosphor icon per card, surface background with a
  per-card blob/mesh accent, arrow link to `/capabilities#<id>`.
- `service-tabs.tsx`: consume the lib; render a real `id={service.id}` anchor so
  deep links land; include the two new services with item lists.
- Add `@phosphor-icons/react` (one family, standardized weight).

## Acceptance criteria
- [x] Rail shows five cards with icons, backgrounds, and working anchor links;
      focused card is visually dominant on desktop; vertical stack on
      touch/reduced-motion.
- [x] `/capabilities#mobile-payments` and `/capabilities#e-commerce` land on
      real anchored sections.
- [x] Rail and tabs read from `services.ts` (no duplicated arrays).
- [x] Drafted copy neutral, em-dash-free; stop-slop artifact ≥ 35/50.
- [x] lint / typecheck / build green.
