<!-- generated — do not edit; source: project-state/STATE.json -->
---
updated: 2026-06-30T22:58:36.175Z
updated_by: zcode
---
# Current State
## Active work
Epic: EPIC-005   Slice: EPIC-005-SLICE-3   Task: —
Branch: feature/EPIC-005   Actor: claude-code / claude-opus-4-8 (executor)
## Completion status
EPIC-004 merged to dev (PR #6). EPIC-005 (work page) implemented on feature/EPIC-005 — all 3 tasks (024-026) done, all low risk, no review handoffs needed; PR open to dev. Resolved a roadmap/content-spec tension up front: /work/[slug] ships a minimal single-block detail view (problem/outcome framing), not the multi-section 'case study deep dive' the roadmap label implies, honouring 11-content-strategy.md's explicit 'no deep dives in v1' rule. Also fixed a real navigation-breaking bug found during this epic's in-browser verification: EPIC-003's CapabilityRail threw a React removeChild crash on any client-side nav away from / (GSAP pin-spacer reparenting vs React's unmount timing) — fixed by moving its cleanup to useLayoutEffect. Also cleaned up a process slip from last session: EPIC-004's close-out commit had left TASK-018-023 duplicated in both backlog/tasks/ and backlog/done/ (forgot to stage the tasks/ deletion) — removed the stale copies. Verified: lint + typecheck clean, build green, all /work* routes static (4 project detail pages prerendered); manually exercised in-browser — grid, detail pages, back-link, CTA, and confirmed the nav crash fix across multiple routes, zero console errors.
## What is done
- EPIC-001 complete — merged to dev
- EPIC-002 complete — merged to dev (PR #4); design tokens/typography/motion/base primitives live
- EPIC-003 complete — merged to dev (PR #5); home page (chrome, hero, featured work, capability rail, magazine teaser) live
- EPIC-004 complete — merged to dev (PR #6); about page (hybrid intro, sticky cards/modals, timeline, magazine section, socials) live
- EPIC-005 TASK-024: extended Project (problem/outcome, additive) to 4 entries; WorkGrid reuses EPIC-003's WorkCard
- EPIC-005 TASK-025: CaseStudyDetail (minimal, no deep dive) + generateStaticParams wired from projects array
- EPIC-005 TASK-026: assembled /work (heading -> WorkGrid -> CTA band)
- Hotfix: CapabilityRail useEffect -> useLayoutEffect, fixes a live removeChild crash on nav away from / (found via this epic's required in-browser verification)
## What remains
- Open PR feature/EPIC-005 -> dev and merge (no cross-model review needed, all 3 tasks low risk)
- Owner-confirmed follow-up still outstanding from EPIC-004: real biography/interests/timeline/social URLs
- Owner-confirmed follow-up from EPIC-005: real project list (Abe supplies projects, 11-content-strategy.md §5) replacing the 4 fictional placeholders
- EPIC-006: real /capabilities page (EPIC-003's Capability Rail anchors are a forward link until then)
- EPIC-007: real lib/magazine.ts fetch, swapped into MagazineTeaser's articles prop
- Follow-up: vendor the 21st.dev ShaderBackground (celestial-ink-shader) as a Hero upgrade once perf/a11y-audited
- Gate gaps flagged, not fixed (tooling, out of any single epic's scope): scripts/read-fm.mjs reads top-level fields only so verification_required.lint/typecheck never auto-trigger; verify-task.sh's scope check is cumulative against dev so it false-positives once >1 task shares a feature branch; stop-slop's score.mjs only scans .md/.html files, never .tsx
- EPIC-001 SLICE-4: CI smoke (TASK-006, deferred — protected path needs human CODEOWNER commit)
## Blocked
none for EPIC-005. (TASK-006 CI still deferred — protected .github/workflows/ path needs a human-signed CODEOWNER commit.)
## Assigned handoffs
none
