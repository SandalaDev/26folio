---
id: TASK-041
title: "Featured work — real projects as large image cards with zoom + angular tilt"
status: done
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-010
epic_ref: backlog/epics/EPIC-010-brand-identity.md
slice: EPIC-010-SLICE-3
depends_on: [TASK-039]
design_refs: [10-design-system.md, 11-content-strategy.md, 12-ui-element-map.md]
skill_refs: [design-taste-frontend, framer-motion, stop-slop]

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
  - src/lib/projects.ts
  - src/components/home/work-card.tsx
  - src/components/home/featured-work.tsx
  - src/components/work/
  - public/images/
  - scripts/verify-task.sh
  - backlog/tasks/TASK-041.md
progress_weight: 1
---

# Task: Featured work image cards

> Owner brief item 5. Featured projects are **Provision Finance** and
> **OK Pharmacy** (owner-supplied images in `public/images/projects/`). Hover is
> the baunfire treatment: smooth zoom + angular tilt.

## Scope
- `projects.ts`: real entries `provision-finance` and `ok-pharmacy` with an
  `image` field and **neutral drafted descriptors** (no invented outcomes or
  metrics; flagged in STATE for owner confirmation). Placeholder entries stay so
  `/work` keeps building.
- `work-card.tsx` rewrite: large media card, background image (next/image
  `fill` + warm scrim for AA text contrast), title + descriptor. Hover
  (pointer-fine, reduced-motion safe): image zoom 1→1.06 and pointer-tracked
  tilt (rotateX/rotateY ≈ ±3.5°, perspective, Framer motion values + springs —
  never useState).
- `featured-work.tsx`: the two real projects in an enlarged, staggered
  asymmetric two-column layout.

## Acceptance criteria
- [x] Both cards show their owner-supplied image; title/descriptor pass AA on
      the scrim.
- [x] Zoom + tilt run only on fine pointers with motion allowed; card is a plain
      link otherwise; keyboard focus ring intact.
- [x] Drafted copy is neutral, em-dash-free, and the stop-slop artifact scores
      ≥ 35/50 (recomputed by the gate).
- [x] lint / typecheck / build green.

## Gate fix shipped with this task (flagged for owner review)

The first public_text push after the scorer's .tsx fix exposed another gate
over-breadth bug: `verify-task.sh` fed the WHOLE branch diff to the scorer, so
internal planning docs and the GENERATED views (CURRENT_STATE.md renders `—` as
its null placeholder by design) failed the gate on files no reader ever sees —
meaning no public_text task could ever pass. Fix (same family as the scope
check's OS_MANAGED exclusion): the slop check now scores changed files under
`src/` only, the actual rendered public surface. The scorer itself is untouched
and still recomputes independently.
