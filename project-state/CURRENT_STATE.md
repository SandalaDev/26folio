<!-- generated — do not edit; source: project-state/STATE.json -->
---
updated: 2026-06-30T21:51:03.025Z
updated_by: zcode
---
# Current State
## Active work
Epic: EPIC-003   Slice: EPIC-003-SLICE-6   Task: —
Branch: feature/EPIC-003   Actor: claude-code / claude-opus-4-8 (executor)
## Completion status
EPIC-002 merged to dev (PR #4). EPIC-003 (home page) implemented on feature/EPIC-003 — all 7 tasks (011-017) done, awaiting cross-model review of TASK-012/TASK-015 (medium risk) + PR to dev. Two scope overlaps resolved in the epic plan rather than discovered mid-build: MagazineTeaser ships against typed placeholder data (real lib/magazine.ts fetch stays EPIC-007's job); ShaderBackground (21st.dev WebGL) deferred in favour of the static warm-gradient hero, which is the documented reduced-motion fallback anyway. Verified per task: lint + typecheck clean, build green + fully static; manually exercised in-browser (preview tool) — hero, capability rail pin/scrub, mobile nav drawer, magazine teaser, CTA band, footer all render with zero console errors.
## What is done
- EPIC-001 complete — merged to dev
- EPIC-002 complete — merged to dev (PR #4); design tokens/typography/motion/base primitives live
- EPIC-003 TASK-011: Section/Eyebrow/CTACallout shared primitives
- EPIC-003 TASK-012: global chrome — SiteHeader/MobileNav/SiteFooter, vendored Sheet + NavigationMenu primitives, wired into (site)/layout.tsx
- EPIC-003 TASK-013: Hero — voice-correct headline/sub, static warm-gradient background (doubles as the reduced-motion fallback)
- EPIC-003 TASK-014: Featured Work — WorkCard x2 against a minimal src/lib/projects.ts shape EPIC-005 extends
- EPIC-003 TASK-015: Capability Rail — GSAP ScrollTrigger pinned horizontal scroll, degrades to a stacked list under reduced motion/touch
- EPIC-003 TASK-016: Magazine Teaser — MagazineTeaser/ArticleCard against typed placeholder data shaped like the planned lib/magazine.ts response
- EPIC-003 TASK-017: assembled / (Hero -> Featured Work -> Capability Rail -> Magazine Teaser -> CTACallout), force-static preserved
## What remains
- Cross-model review of TASK-012 + TASK-015 (handoffs/review/HANDOFF-REVIEW-TASK-0{12,15}.md); solo dev -> reviewer: human
- Open PR feature/EPIC-003 -> dev and merge after review
- EPIC-006: real /capabilities page (Capability Rail's anchors are a forward link until then)
- EPIC-007: real lib/magazine.ts fetch, swapped into MagazineTeaser's articles prop
- Follow-up: vendor the 21st.dev ShaderBackground (celestial-ink-shader) as a Hero upgrade once perf/a11y-audited
- Gate gaps flagged, not fixed (out of this epic's scope): scripts/read-fm.mjs reads top-level fields only so verification_required.lint/typecheck never auto-trigger; verify-task.sh's scope check is cumulative against dev so it false-positives once >1 task shares a feature branch; stop-slop's score.mjs only scans .md/.html files, never .tsx
- EPIC-001 SLICE-4: CI smoke (TASK-006, deferred — protected path needs human CODEOWNER commit)
## Blocked
none for EPIC-003. (TASK-006 CI still deferred — protected .github/workflows/ path needs a human-signed CODEOWNER commit.)
## Assigned handoffs
- handoffs/review/HANDOFF-REVIEW-TASK-012.md
- handoffs/review/HANDOFF-REVIEW-TASK-015.md
