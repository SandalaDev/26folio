---
id: TASK-085
title: "Build the animated services and partnership experience"
status: done
priority: P1
risk_level: high
epic_ref: backlog/epics/EPIC-023.md
depends_on: [TASK-084]
progress_weight: 1
files_allowed:
  - src/app/(site)/capabilities/page.tsx
  - src/components/capabilities/
  - src/lib/capabilities.ts
  - src/lib/motion.ts
skill_refs:
  - impeccable
  - gsap
  - gsap-react
  - gsap-scrolltrigger
  - framer-motion
  - framer-motion-react
  - framer-motion-variants
  - lottie
---
# Task: Build the animated services and partnership experience

## Scope

Build the problem-led hero, service system, integration map, delivery model,
ownership and engineering-standard proof, fit guidance, FAQs, and conversion
sequence using the approved visual and motion direction.

## Acceptance Criteria

- [x] Business problems and starting points stay scannable without hiding the source detail.
- [x] GSAP owns authored scroll sequences; Framer Motion owns disclosure, hover, and state transitions.
- [x] Each major animation communicates hierarchy, sequence, or relationship and has a static reduced-motion equivalent.
- [x] Interactive content is keyboard-operable with correct names, expanded state, and focus visibility.
- [x] Mobile layout preserves reading order without pinning or horizontal-scroll traps.

## Dependency Evidence

- plan: none

## Testing

- recommendation: dedicated: TASK-087
- rationale: Scroll choreography, disclosure state, responsive fallbacks, and
  reduced motion interact across the full page and warrant a focused browser
  pass after construction.

## Notes

Motion personality is premium: 150ms micro, 300ms component, 500ms page, and
progress-driven GSAP; smooth ease-out, no bounce or overshoot.

GSAP owns the hero, problem wire, and partnership sequence. Framer Motion owns
service entry, integration/standards feedback, technology state, fit entry, and
FAQ disclosure. Reduced-motion branches preserve rendered content.
