<!-- generated — do not edit; source: project-state/STATE.json -->
---
updated: 2026-07-05T11:29:19.518Z
updated_by: claude-code
---
# Current State
## Active work
Epic: EPIC-012   Slice: complete   Task: complete
Branch: feature/EPIC-012   Actor: claude-code / claude-fable-5 (planner)
## Completion status
EPIC-012 (design-system fidelity) EXECUTED and CLOSED on feature/EPIC-012 — all six tasks done, PR into dev pending review. TASK-049: FlashlightCursor is global chrome (site layout, z-0 under z-[1] main), 520px peach-led preview recipe via color-mix tokens, usePointerMotion + useMotionTemplate + soft springs, zero re-renders per move; verified gliding live. TASK-050: hero static fallback rebuilt as low-alpha (14%/12% cap) three-stop washes, MeshBg mid-stops, shader grain on (0.12/0.06); verified in-browser. TASK-051: Blob blur moved into SVG user space (feGaussianBlur, props-derived deterministic filter id — Blob renders in RSCs, no useId; overflow-visible so washes never clip square); consumers retuned stdDev 12-16; verified live. TASK-052: palette redistribution — Eyebrow tone prop (rose/caramel alternation), caramel step numbers + tech hover-card labels, peach tech accents, surface-2/border-2 elevation hovers, soft tertiary text (footer links, captions, timeline meta); rose 42 -> 27; caramel verified computing live. TASK-053: all display h1s single-weight, new display-gradient utility (ink-to-soft, applied to all five h1s incl hero + contact), contact success state sage; verified computed. TASK-054: shared TiltCard/useDoorTilt primitive (edge-hinged door swing, animate()-driven springs, motion values bound at mount ALWAYS — the original bug was conditional style binding — pointer measured on the un-transformed frame) rolled out to WorkCard (+synced zoom), capability rail (frame carries data-rail-card for GSAP), magazine teaser cards, sticky cards, tech tiles; magazine-section skipped (text link, not a card). CRITICAL SESSION LESSON captured in agent memory: a hidden preview tab freezes rAF entirely — ALL framer motion (variants, springs, transforms, templates) looks dead while React events still work; cost hours chasing phantom framer-API bugs before document.hidden was checked. The tilt therefore ships verified at fiber/pipeline level + lint/typecheck/build; its ANIMATED transform needs one owner eyeball in a visible browser.
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
- EPIC-011 TASK-043: hero single-weight enlarged h1 + CTA/portrait aligned to h1 ends + larger portrait-cropped image
- EPIC-011 TASK-044: header confirmed fully transparent in live build (no destructive change; already bg-transparent)
- EPIC-011 TASK-045: footer low-contrast light-brown (caramel) text + filled low-opacity masonry texture
- EPIC-011 TASK-046: CTA hover unified - CTACallout uses MagneticButton site-wide; MagneticButton gained type/disabled
- EPIC-011 TASK-047: featured-work card hover retuned to door-opening tilt (rotateY hinge) + synchronized spring zoom
- EPIC-011 TASK-048: contact page built - ContactForm (validation + states) + confirmation + contact-details aside
- EPIC-011 merged to dev (PR #13); merged branches cleaned up locally (EPIC-009/010/011, chore/os-cleanup-and-simplify)
- EPIC-012 planned: design-system fidelity gap analysis + 5 task specs (TASK-049..053) on feature/EPIC-012
- EPIC-012 re-planned 2026-07-05: owner second pass folded in — TASK-049 amended (About flashlight width), TASK-054 authored (card door-tilt root cause + rollout), SLICE-4 added
- EPIC-012 executed: TASK-049 global flashlight, TASK-050 smooth ramps + shader grain, TASK-051 SVG-space blob blur, TASK-052 palette redistribution (rose 42->27), TASK-053 single-weight h1s + display-gradient + sage success, TASK-054 TiltCard door-tilt on all cards
## What remains
- OWNER REVIEW (EPIC-012, in a REAL visible browser at npm run dev): 1) door-tilt on featured work cards, rail cards, article cards, sticky cards, tech tiles — hinge feel, amplitude, smoothness on enter AND leave (code-verified to the fiber level but the preview tab was hidden = rAF frozen, so the animated transform itself was not eyeballed this session); 2) global 520px flashlight glide on all five pages incl /about width feel; 3) gradient smoothness at your monitors (hero fallback + shader grain 0.12/0.06 + blob washes); 4) palette redistribution + display-gradient h1s + sage contact success — confirm the taste calls.
- OWNER REVIEW (drafted copy, EPIC-010): project descriptors/taglines for Provision Finance + OK Pharmacy (src/lib/projects.ts, incl. their /work/<slug> placeholder problem/outcome), and the two new services' copy + item lists (src/lib/services.ts: mobile-payments, e-commerce; custom-software items were redistributed). All neutral drafts, no invented claims — confirm or supply real lines.
- OWNER REVIEW (gate fix, EPIC-010 TASK-041): verify-task.sh's slop check now scores only changed src/ files (it previously fed generated views + planning docs to the scorer, which made every public_text push fail on internal files). Sanity-check the reasoning in backlog/done/TASK-041.md.
- Owner: eyeball EPIC-010 in a REAL browser (npm run dev): hero portrait size/placement, blob wash intensities (opacity dials in each component), featured-card tilt feel, rail focus emphasis, and the new full-viewport width on your monitors.
- Follow-up: owner may supply his own blob SVG paths (Blob accepts a custom `path` prop) to replace the generated presets.
- Follow-up: remaining §7 signature interactions (timeline, tech-grid logo hovers, video-on-hover) in their own epics.
- Owner-confirmed follow-up still outstanding: EPIC-004's real biography/interests/timeline/social URLs; EPIC-005's full real project list; EPIC-006's TechGrid is a real-but-partial stack list
- Deployment follow-up: set MAGAZINE_API_URL/MAGAZINE_API_KEY in the production environment once scrumtrulescent.com's Payload API is live, to bring the home page's magazine section back
- EPIC-001 SLICE-4: CI smoke (TASK-006, deferred — protected path needs human CODEOWNER commit)
- OWNER REVIEW (EPIC-011, in a real browser at npm run dev): hero h1 single-weight + size and the CTA/portrait alignment to the h1 ends; portrait crop shows the face; featured-work card door-tilt feel + synchronized zoom (pointer-fine only); footer caramel text + filled masonry contrast; transparent header floats; every page CTA has the magnetic hover.
- Owner: supply a real contact email for the contact details block (the spine does not specify one; it currently uses socials + a neutral line). Real Resend delivery (RESEND_API_KEY + wiring /api/contact past its 501 stub) is a separate epic per the no-stored-submissions charter.
- OWNER DECISION (EPIC-012 open questions): 1) keep or drop the extralight counterpoint in section h2s; 2) adopt the preview's ink-to-soft display-gradient text fill on h1s (TASK-053 ships it removable).
- Repo chore (owner, needs push rights): delete stale REMOTE branches origin/feature/EPIC-009, origin/feature/EPIC-010, origin/feature/EPIC-011, origin/chore/os-cleanup-and-simplify (all merged; agent push --delete was permission-blocked). Local feature/EPIC-008 kept deliberately: unmerged Resend contact-form spike (TASK-034) relevant to the future Resend epic.
## Blocked
none for EPIC-012. (TASK-006 CI still deferred - protected .github/workflows/ path needs a human-signed CODEOWNER commit. Real contact email delivery deferred to a Resend epic.)
## Assigned handoffs
none
