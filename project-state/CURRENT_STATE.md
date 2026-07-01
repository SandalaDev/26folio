<!-- generated — do not edit; source: project-state/STATE.json -->
---
updated: 2026-06-30T23:54:50.809Z
updated_by: zcode
---
# Current State
## Active work
Epic: EPIC-006   Slice: EPIC-006-SLICE-5   Task: —
Branch: feature/EPIC-006   Actor: claude-code / claude-opus-4-8 (executor)
## Completion status
EPIC-005 merged to dev (PR #7). EPIC-006 (capabilities page) implemented on feature/EPIC-006 — all 5 tasks (027-031) done, awaiting cross-model review of TASK-029 (medium risk, technologies/hover-card) + PR to dev. Unlike EPIC-004/005, most content here was already decided in the approved spine (services list, engagement-process stages) rather than invented; TechGrid additionally seeds from the real, documented tech stack (06-project-technical-plan.md) instead of placeholder tools. Built useTabbedContent once and skinned it twice (ServiceTabs, ProcessSteps) per ui-element-map §6 decision #4. Found and fixed two real accessibility/correctness bugs during required in-browser verification: (1) hash-based tab pre-selection silently failed due to a classic useState-initial-argument staleness bug; (2) arrow-key tab navigation updated aria-selected but left DOM focus behind, violating the WAI-ARIA tabs pattern. Both fixed and re-verified live. Verified: lint + typecheck clean, build green, /capabilities fully static; manually exercised end to end (hash deep links, tab cross-fade, tech grid swap/hover, keyboard nav) with zero console errors.
## What is done
- EPIC-001 complete — merged to dev
- EPIC-002 complete — merged to dev (PR #4); design tokens/typography/motion/base primitives live
- EPIC-003 complete — merged to dev (PR #5); home page (chrome, hero, featured work, capability rail, magazine teaser) live
- EPIC-004 complete — merged to dev (PR #6); about page (hybrid intro, sticky cards/modals, timeline, magazine section, socials) live
- EPIC-005 complete — merged to dev (PR #7); work page (grid + case study details) live
- EPIC-006 TASK-027: useTabbedContent headless ARIA tabs primitive (roving tabindex, arrow/Home/End nav, focus-follows-selection)
- EPIC-006 TASK-028: ServiceTabs — services content verbatim from spine, tab ids match CapabilityRail's anchors
- EPIC-006 TASK-029: TechnologiesSection + TechGrid (real documented stack) + vendored HoverCard
- EPIC-006 TASK-030: ProcessSteps — four engagement stages already decided in the UI map
- EPIC-006 TASK-031: assembled /capabilities (ServiceTabs -> Technologies -> ProcessSteps -> CTACallout)
- EPIC-003's CapabilityRail anchors now resolve to a real page with the matching tab pre-selected, instead of 404ing
## What remains
- Cross-model review of TASK-029 (handoffs/review/HANDOFF-REVIEW-TASK-029.md); solo dev -> reviewer: human
- Open PR feature/EPIC-006 -> dev and merge after review
- Owner-confirmed follow-up still outstanding: EPIC-004's real biography/interests/timeline/social URLs; EPIC-005's real project list; EPIC-006's TechGrid is a real-but-partial stack list, confirm/expand with Abe's full toolset
- EPIC-007: real lib/magazine.ts fetch, swapped into MagazineTeaser's articles prop
- Follow-up: vendor the 21st.dev ShaderBackground (celestial-ink-shader) as a Hero upgrade once perf/a11y-audited
- Gate gaps flagged, not fixed (tooling, out of any single epic's scope): scripts/read-fm.mjs reads top-level fields only so verification_required.lint/typecheck never auto-trigger; verify-task.sh's scope check is cumulative against dev so it false-positives once >1 task shares a feature branch; stop-slop's score.mjs only scans .md/.html files, never .tsx
- EPIC-001 SLICE-4: CI smoke (TASK-006, deferred — protected path needs human CODEOWNER commit)
## Blocked
none for EPIC-006. (TASK-006 CI still deferred — protected .github/workflows/ path needs a human-signed CODEOWNER commit.)
## Assigned handoffs
- handoffs/review/HANDOFF-REVIEW-TASK-029.md
