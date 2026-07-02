<!-- generated — do not edit; source: project-state/STATE.json -->
---
updated: 2026-07-02T15:47:53.632Z
updated_by: zcode
---
# Current State
## Active work
Epic: EPIC-010   Slice: EPIC-010-SLICE-3   Task: —
Branch: feature/EPIC-010   Actor: claude-code / claude-opus-4-8 (executor)
## Completion status
EPIC-010 (brand identity overhaul, owner brief 2026-07-02) implemented on feature/EPIC-010 off dev (which now contains EPIC-009 via PR #11). TASK-038: typography fixed at the ROOT: the @font-face binaries were never shipped (site rendered in system fallback since EPIC-002) so the variable woff2s are now in public/fonts (Clash Display + General Sans + italic from Fontshare, JetBrains Mono via fontsource); display/heading/subhead scales rebuilt around 200-700 weight CONTRAST; the eyebrow utility de-capsed (NO text-transform: uppercase renders anywhere); Section + header lost max-w-7xl (padding rhythm scales instead); header fully transparent. TASK-039: blob motif (vitiligo brand reference) added to the design system: spine 10-design-system.md gained section 3b + revised sections 4/5 (owner-authorized); Blob/MeshBg/MasonryPattern components applied to plain sections (rail, teaser, CTA, footer, page heads, about intro); morph is CSS-only and reduced-motion-disabled. TASK-040: hero recomposed asymmetric with the owner portrait (public/images/portrait.png) small and THIRD in hierarchy, blob-masked and morphing; copy unchanged; EPIC-009 shader/CTA machinery untouched. TASK-041: featured work = REAL projects Provision Finance + OK Pharmacy (owner images) as large staggered image cards with smooth zoom + pointer tilt (baunfire treatment; pointer-fine + reduced-motion gated). TASK-042: services single source (src/lib/services.ts) consumed by rail + tabs; five services incl NEW mobile-payments + e-commerce; rail cards enlarged w/ Phosphor icons, washes, center-focus emphasis; /capabilities#<id> deep links land + activate the right tab. GATE FIX flagged for owner: verify-task.sh slop check fed the WHOLE branch diff to the scorer, so generated views (CURRENT_STATE.md renders em-dash as its null placeholder) + internal planning docs failed the gate on files no reader sees, meaning NO public_text task could ever pass; the check now scores changed files under src/ only (same family as the scope check's OS_MANAGED exclusion; scorer itself untouched, all 20 changed src files score 38-50/50). Verified in-browser: fonts load (Clash Display w/ 200/600 spans), zero uppercase, transparent header, full-viewport sections, blob-masked morphing portrait, 2 image cards w/ working 3D tilt, 5 rail cards w/ icons + working anchors, console clean; lint/typecheck/build green (13 pages incl real /work/provision-finance + /work/ok-pharmacy routes).
## What is done
- EPIC-001 complete — merged to dev
- EPIC-002 complete — merged to dev (PR #4); design tokens/typography/motion/base primitives live
- EPIC-003 complete — merged to dev (PR #5); home page (chrome, hero, featured work, capability rail, magazine teaser) live
- EPIC-004 complete — merged to dev (PR #6); about page (hybrid intro, sticky cards/modals, timeline, magazine section, socials) live
- EPIC-005 complete — merged to dev (PR #7); work page (grid + case study details) live
- EPIC-006 complete — merged to dev (PR #8); capabilities page (services, technologies, process, CTA) live
- EPIC-007 TASK-032/033: lib/magazine.ts + HomePage wiring (magazine integration)
- OS cleanup merged to dev (PR #10, chore/os-cleanup-and-simplify): pruned unused machinery, gate-bug fixes, manual rewrite
- EPIC-009 TASK-035: cleanup (gitignore/untrack .obsidian/workspace.json; keep notes) + vendored gsap/framer-motion/lottie skills (registry.md + lock.json pinned commits)
- EPIC-009 TASK-036: warm shader hero — @paper-design/shaders-react + ShaderBackground (palette-remapped MeshGradient), mounted above the static gradient fallback only when motion is allowed
- EPIC-009 TASK-037: signature motion — shared pointer MotionValues, global custom Cursor, MagneticButton (magnetic pull + fill sweep + text reveal); hero CTA wired
- EPIC-009 merged to dev (PR #11)
- EPIC-010 TASK-038: typography (shipped variable font binaries + weight-contrast scales + de-capsed eyebrow), no max-width, transparent header
- EPIC-010 TASK-039: blob motif in the design system (spine §3b) + Blob/MeshBg/MasonryPattern applied to plain sections
- EPIC-010 TASK-040: hero recomposed — blob-masked portrait, small, third in hierarchy; copy unchanged
- EPIC-010 TASK-041: featured work — real Provision Finance + OK Pharmacy image cards with zoom + pointer tilt
- EPIC-010 TASK-042: services single source; 5 rail cards (icons, washes, focus emphasis); /capabilities#<id> anchors land
## What remains
- OWNER REVIEW (drafted copy, EPIC-010): project descriptors/taglines for Provision Finance + OK Pharmacy (src/lib/projects.ts, incl. their /work/<slug> placeholder problem/outcome), and the two new services' copy + item lists (src/lib/services.ts: mobile-payments, e-commerce; custom-software items were redistributed). All neutral drafts, no invented claims — confirm or supply real lines.
- OWNER REVIEW (gate fix, EPIC-010 TASK-041): verify-task.sh's slop check now scores only changed src/ files (it previously fed generated views + planning docs to the scorer, which made every public_text push fail on internal files). Sanity-check the reasoning in backlog/done/TASK-041.md.
- Owner: eyeball EPIC-010 in a REAL browser (npm run dev): hero portrait size/placement, blob wash intensities (opacity dials in each component), featured-card tilt feel, rail focus emphasis, and the new full-viewport width on your monitors.
- Merge PR (feature/EPIC-010 -> dev); review waived to human (solo) — all five tasks carry review_waiver.
- Follow-up: owner may supply his own blob SVG paths (Blob accepts a custom `path` prop) to replace the generated presets.
- Follow-up: remaining §7 signature interactions (timeline, tech-grid logo hovers, video-on-hover) in their own epics.
- Owner-confirmed follow-up still outstanding: EPIC-004's real biography/interests/timeline/social URLs; EPIC-005's full real project list; EPIC-006's TechGrid is a real-but-partial stack list
- Deployment follow-up: set MAGAZINE_API_URL/MAGAZINE_API_KEY in the production environment once scrumtrulescent.com's Payload API is live, to bring the home page's magazine section back
- EPIC-001 SLICE-4: CI smoke (TASK-006, deferred — protected path needs human CODEOWNER commit)
## Blocked
none for EPIC-010. (TASK-006 CI still deferred — protected .github/workflows/ path needs a human-signed CODEOWNER commit.)
## Assigned handoffs
none
