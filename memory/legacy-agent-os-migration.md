# Legacy Agent OS migration map

EPIC-022 replaces runtime machinery; it does not erase the path taken to the
current portfolio.

## Preserved evidence

- `project-spine/00-original-intent.md` through
  `project-spine/12-ui-element-map.md`: the detailed legacy product, design,
  content, technical, domain, data, and risk context.
- `backlog/epics/`: twenty prior epic narratives plus EPIC-022.
- `backlog/done/`: seventy-five completed task records with implementation and
  verification detail.
- `planning/slices/`: historical execution slices.
- `planning/content/`: approved or review-pending page copy and content strategy.
- `handoffs/` archived below this migration record: historical review artifacts,
  no longer active continuity work.

## New active sources

- `project-spine/00-brief.md` and `00-interview.md`: migrated owner intent and
  answered foundation decisions.
- `project-spine/01-charter.md`, `02-decisions.md`, and `03-roadmap.md`: the lean
  briefing context.
- `project-state/state.json`: the only active runtime state.
- `project-state/completion.md`: concise current position and owner actions.
- `project-state/decisions.md`: append-only durable decisions.

## Interpretation rules

Legacy documents remain authoritative evidence for the decisions and work they
record, but they are not loaded by default every session. Follow their paths
when a task references them. If a legacy plan conflicts with the lean current
context, stop and resolve the difference with the owner rather than silently
choosing one.

Task completion measures delivery, not whether consulting, opportunity,
reputation, or quality outcomes occurred. Those goals remain unvalidated until
real-world signals exist.

## Future template updates

The template updater owns shared OS machinery, so a later sync can overwrite
project adaptations. Reconcile these files after each update instead of
accepting them blindly:

- `AGENTS.md` and `README.md`: keep the 26folio purpose, routes, constraints,
  and trunk-dev workflow.
- `setup.sh` and `.github/workflows/quality.yml`: keep the post-intake setup
  path and Node.js 22 runtime.
- `scripts/progress.mjs`: keep support for slugged historical epic filenames.
- `scripts/skills.sh` and `.agents/skills/registry.md`: keep direct-child skill
  discovery and the Framer Motion, GSAP, and Lottie extensions.

Shared law and security fixes from the template still need to be incorporated.
This list marks reconciliation points; it is not a reason to skip updates.
