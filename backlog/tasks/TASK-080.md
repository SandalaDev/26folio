---
id: TASK-080
title: "Capabilities page rebuild: capability explorer, why-one-engineer strip, Build/Evolve engagement section"
status: in-progress
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-021
slice: EPIC-021-SLICE-1
depends_on: [TASK-079]
design_refs: [10-design-system.md, 12-ui-element-map.md]
skill_refs: [design-taste-frontend, framer-motion, stop-slop]

verification_required:
  lint: true
  typecheck: true
  unit: false
  integration: false
  e2e: false
  accessibility: true

public_text: true
handoff_required: false
handoff_type: []
handoff_file: ""
review_waiver: "Solo dev (reviewer: human). Cross-model review reassigned to the human at the PR into dev, per OS degraded mode."
protected_paths_touched: []
files_allowed:
  - src/app/
  - src/components/
  - src/lib/
  - planning/content/.slop/
  - backlog/tasks/TASK-080.md
---

# Task: Capability explorer page rebuild

> IA + interaction spec: planning/content/page-copy/Capabilities.md §4.
> Depends on TASK-079's pillar data.

## Plan

- New capability explorer components under `src/components/capabilities/`:
  disclosure rows (one open at a time), framer height-reveal into the
  structured panel, `aria-expanded`/`aria-controls` on real buttons,
  keyboard reachable, reduced-motion static. `id` per row so
  /capabilities#<pillar> lands open or scrolled correctly.
- Why-one-engineer manifesto strip (text-first, 3–4 lines).
- Engagement section: Build → Evolve two-beat explorer + ownership
  guarantee line. ProcessSteps comes off the page; delete ProcessSteps /
  ServiceTabs / useTabbedContent only if nothing else imports them.
- Reorder page: hero → explorer → strip → engagement → TechGrid → CTA;
  force-static preserved.
- Verify in-browser at desktop + 375px: explorer open/close/switch,
  anchors from the home rail, no overflow, zero console errors; slop
  artifacts pre-generated for changed public-text files.

## Notes

- House motion only: transform/opacity, EASE_OUT, fadeUp/stagger,
  useReducedMotion gates. No parallax novelty.
- Page shell stays a server component; the explorer is the client island.
