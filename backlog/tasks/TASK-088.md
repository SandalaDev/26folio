---
id: TASK-088
title: "Refine technology atlas and delivery motion"
status: in-progress
priority: P1
risk_level: high
epic_ref: backlog/epics/EPIC-023.md
progress_weight: 1
files_allowed:
  - backlog/
  - public/icons/color/
  - src/components/capabilities/
  - src/lib/capabilities.ts
skill_refs: [gsap, framer-motion, lottie]
---

# Task: Refine technology atlas and delivery motion

## Scope

Refine the technology atlas with the requested applicable brand marks,
consistent perceptual sizing, an authored hover/focus/tap disclosure, and
clear fallbacks for marks that are unavailable or not distinct brands. Improve
the stack-flow and partnership sequences with monochrome iconography and
responsive, reduced-motion-safe choreography.

## Acceptance Criteria

- [ ] Requested applicable technology marks are wired to their correct groups;
      missing or ambiguous marks remain explicit rather than fabricated.
- [ ] Technology marks have materially larger, perceptually consistent frames;
      wide wordmarks and the white Ollama mark are handled deliberately.
- [ ] Desktop hover/focus reveals an angled panel with typed-in context, while
      touch layouts use an accessible tap-to-disclose pattern.
- [ ] The stack-flow section communicates system relationships with monochrome
      icons and motion.
- [ ] The partnership sequence gains subtle desktop horizontal scroll motion
      while remaining linear and readable on mobile and reduced-motion modes.
- [ ] Lint, strict TypeScript, production build, icon-path audit, and responsive
      browser review pass.

## Dependency Evidence

- plan: none

## Testing

- recommendation: with-task
- rationale: The change is high-risk visually but bounded to one page. Automated
  checks plus desktop, touch-width, keyboard, overflow, and reduced-motion
  browser review provide proportionate coverage without another backlog task.

## Notes

Paused at the owner's request while they add the missing SVG marks to
`public/icons/color/`. Keep this task and `backlog/epics/EPIC-023.md` in
progress.

Current implementation is in `src/lib/capabilities.ts` and
`src/components/capabilities/`. Public marks already sourced during this pass
are under `public/icons/color/`. The remaining text-only entries are Africa's
Talking, generic Mobile Money gateways, and ZRA Smart Invoice / VSDC; map the
owner-supplied filenames when they arrive and remove their fallbacks.

Lint, strict TypeScript, and a clean production build have passed. Desktop
browser review confirmed materially larger marks, a 128x72 wide frame for
Node.js, zero document overflow, and the angled typed disclosure.

The owner-supplied Africa's Talking, Mobile Money, Smart Invoice, Figma Make,
and Webhooks assets are now mapped in `src/lib/capabilities.ts`. A clean
production build and desktop browser review confirm all seven Platforms &
Integrations marks load and the document has no horizontal overflow. TASK-088
remains in progress pending the
remaining partnership-scroll, mobile, and reduced-motion review.

Visitor-facing asset-audit language has been removed from the technology
atlas. The focus panel now names only the active technology and uses the dark
background token on peach; rendered contrast measures 9.33:1. Lint, strict
TypeScript, production build, and browser copy checks pass.
