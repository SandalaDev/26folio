---
id: ARCHITECTURE-PRINCIPLES
status: draft
created: 2026-06-28
source: hydrated from 00-original-intent.md + INTAKE-INTERVIEW.md
---

# Architecture Principles — sandala.dev

These are local rules agents must not violate. They are enforced by the verify
gate; violations are not advisory.

## 1. Static by default

All pages are statically generated at build time (`generateStaticParams`,
`export const dynamic = 'force-static'`). Server-side rendering (SSR) is only
permitted where genuinely dynamic data requires it — and there is none in this
phase. No database calls, no session reads, no SSR.

**Violation signal:** `export const dynamic = 'force-dynamic'` or
`cache: 'no-store'` on a page without a documented reason in the task.

## 2. No database — enforced

No ORM, no migration file, no `src/db/` directory, no database URL env var may
be introduced in this phase. See `05-data-model.md`. Any task that would require
a database must update the data model first and obtain CODEOWNER approval.

## 3. Animation is purposeful, not decorative

Every animation must serve a purpose: communicate hierarchy, guide attention,
reinforce interaction feedback, or provide delight that is *worth the cognitive
cost*. Animations that simply run because they can are cut.

Rules:
- All animations must respect `prefers-reduced-motion` via Framer Motion's
  `useReducedMotion()` hook or CSS media query.
- GSAP ScrollTrigger instances must be cleaned up on component unmount.
- Lottie files must be served from R2, not bundled into the JS payload.
- No animation may block content from being readable or interactable.

## 4. One animation library per animation type

Do not mix Framer Motion and GSAP to animate the same element. Assign ownership:
- **Framer Motion:** component-level transitions, layout animations, hover/tap
  states, page transitions.
- **GSAP:** complex multi-step timelines, SVG path morphing, scroll-driven
  sequences that span multiple elements.
- **Lottie:** self-contained vector animation playback (icons, loaders,
  illustration sequences).

## 5. Tailwind only — no arbitrary inline styles

All styling uses Tailwind utility classes. CSS Modules or `style={{}}` props
are prohibited unless wrapping a third-party component that requires it and the
reason is documented inline. Custom design tokens are defined in
`tailwind.config.ts`, not scattered across components.

## 6. Component composition over duplication

If a UI pattern is used in more than one place, it becomes a component in
`src/components/`. Copy-pasting JSX across pages is not permitted.

## 7. TypeScript strict mode — no `any`

`tsconfig.json` has `"strict": true`. The use of `any`, `@ts-ignore`, or
`@ts-expect-error` requires a comment explaining why and is subject to review
rejection.

## 8. Environment variables for all secrets and config

API keys, email addresses, and external URLs are env vars. They are never
hardcoded. `.env.local` is gitignored. The schema is documented in
`06-project-technical-plan.md`.

## 9. Performance is a feature

- Images use `next/image` with explicit `width`, `height`, and `alt`.
- Video files are served from R2 with appropriate `preload` strategy.
- Third-party scripts (if any) use `next/script` with `strategy="lazyOnload"`.
- Bundle size is monitored; no dependency is added without considering its weight.

## 10. Accessibility is non-negotiable

- Semantic HTML: `<main>`, `<nav>`, `<header>`, `<footer>`, `<article>`, `<section>`
  used correctly.
- All interactive elements have accessible names.
- Focus management is correct after client-side navigation.
- WCAG 2.1 AA contrast ratios are met by the design system tokens.
