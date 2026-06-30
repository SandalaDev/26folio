---
id: EPIC-003
title: Home page — global chrome, hero, featured work, capability rail, magazine teaser
status: ready            # ready -> in-progress -> done
phase: 1
priority: P1
risk_level: medium
roadmap_ref: 09-roadmap.md#p1
depends_on: [EPIC-002]
blocks: [EPIC-004, EPIC-005, EPIC-006, EPIC-008]
references:
  - 12-ui-element-map.md
  - 11-content-strategy.md
  - 10-design-system.md
  - 07-architecture-principles.md
related:
  - 09-roadmap.md
  - EPIC-007 (magazine integration — see Key decisions #2)
---

# EPIC-003 — Home page

> Build the `/` route plus the **global site chrome** (`SiteHeader`, `MobileNav`,
> `SiteFooter`) every later page epic (004–006, 008) reuses. EPIC-002 shipped the
> token/typography/motion/primitive substrate; this epic is the first to compose it
> into real page content, per the approved content outline
> ([11-content-strategy.md](../../project-spine/11-content-strategy.md) §4 `/` Home)
> and the component map ([12-ui-element-map.md](../../project-spine/12-ui-element-map.md) §2–3).

## Pre-existing — already DONE (do not re-derive)

- [`11-content-strategy.md`](../../project-spine/11-content-strategy.md) — **status:
  approved**. Sitemap, voice rules, and the per-page content outline are decided.
  This epic writes home-page copy *to* §2's voice rules; it does not re-pick the
  positioning or sitemap.
- [`10-design-system.md`](../../project-spine/10-design-system.md) — approved, already
  live as tokens/primitives via EPIC-002.
- [`12-ui-element-map.md`](../../project-spine/12-ui-element-map.md) — **status: draft**
  (flagged, not blocking — see Key decisions #1). Its component-per-block mapping for
  `/` Home (§3) and the global elements (§2) is the build contract for this epic.

## Goal & non-goals

**Goal:** `/` renders the full home page — sticky header + mobile nav, hero, featured
work, a capability rail, a magazine teaser, a CTA band, and the footer — fully static,
token-styled, `prefers-reduced-motion`-safe, voice-correct copy. `SiteHeader` /
`MobileNav` / `SiteFooter` land in `(site)/layout.tsx` so every subsequent page epic
inherits them for free.

**Non-goals (owned elsewhere — do not do them here):**
- The real Payload/Scrumtrulescent API fetch → **EPIC-007** (`lib/magazine.ts`). This
  epic ships the `MagazineTeaser` UI with the final shape and graceful-fallback states,
  fed by typed placeholder data — see Key decisions #2.
- `/about`, `/capabilities`, `/work`, `/contact` page content → EPIC-004–006, EPIC-008.
  The capability rail panels deep-link to `/capabilities` anchors that don't exist
  until EPIC-006; that's an accepted forward link, not a bug.
- The 21st.dev WebGL `ShaderBackground` (celestial-ink-shader) named in
  [12-ui-element-map.md](../../project-spine/12-ui-element-map.md) §3 Home #1 — see Key decisions #3.
  This epic ships the *static, reduced-motion-correct* warm-gradient hero background;
  swapping in the shader is a follow-up task once the 21st.dev component is vendored
  and perf/a11y-audited, not a blocker to shipping the page.
- Contact form wiring (`ContactForm` logic) → EPIC-008.

## Architecture constraints this epic must honour

From [07-architecture-principles.md](../../project-spine/07-architecture-principles.md):
- **Static by default** (§1): every route stays `force-static`; the magazine teaser
  uses placeholder data in this epic specifically *because* a real fetch would force
  dynamic/ISR rendering — that trade is EPIC-007's to make.
- **One animation library per job** (§4): Framer for entry/stagger/hover (`Hero`,
  `WorkCard`, `MagazineTeaser`, `CTACallout`, header show/hide); GSAP+ScrollTrigger
  only for the capability rail's pinned horizontal scroll, cleaned up on unmount.
- **Composition over duplication** (§6): `Section`, `Eyebrow`, `CTACallout` are shared
  primitives other page epics will import — build them generically, not home-specific.
- **Accessibility** (§10): semantic landmarks (`<header>`, `<nav>`, `<footer>`,
  `<section>`), accessible names on icon-only controls, the capability rail must
  degrade to a normal stacked list under `prefers-reduced-motion` / touch / no-JS-pin.
- **No magenta, no rounded corners, rose focus ring** — already enforced by the
  EPIC-002 token layer; this epic only consumes it.

## Slices & tasks

### SLICE-1 — Shared page primitives
| Task | Title | files_allowed (scope) | risk | proof |
|---|---|---|---|---|
| **TASK-011** | `Section` (enforces the `py-20 md:py-28 px-6 md:px-12 lg:px-24` / `max-w-7xl` rhythm), `Eyebrow` (uppercase tracked label), `CTACallout` (shared end-of-page conversion band, per-page copy props, links to `/contact`). | `src/components/site/section.tsx`, `src/components/site/eyebrow.tsx`, `src/components/site/cta-callout.tsx` | low | lint + typecheck |

### SLICE-2 — Global chrome
| Task | Title | files_allowed (scope) | risk | proof |
|---|---|---|---|---|
| **TASK-012** | `SiteHeader` (sticky, warm-blur backdrop, desktop nav, Framer show/hide on scroll) + `MobileNav` (shadcn `Sheet` drawer) + `SiteFooter` (nav + socials, no LinkedIn, Scrumtrulescent link, monochrome wordmark), wired into `(site)/layout.tsx`. Vendor shadcn `Sheet` + `NavigationMenu` primitives (token-styled, hard corners) alongside. | `src/components/site/site-header.tsx`, `src/components/site/mobile-nav.tsx`, `src/components/site/site-footer.tsx`, `src/components/ui/sheet.tsx`, `src/components/ui/navigation-menu.tsx`, `src/app/(site)/layout.tsx`, `package.json`, `package-lock.json` | medium | lint + typecheck (+ build smoke) |

### SLICE-3 — Hero
| Task | Title | files_allowed (scope) | risk | proof |
|---|---|---|---|---|
| **TASK-013** | `Hero`: headline + sub-headline (voice-correct, §2 content outline) + primary CTA ("Let's talk" → `/contact`), static warm-gradient background (rose/peach/caramel only, no magenta/harsh two-stop ramp), Framer fade-up entry, full `prefers-reduced-motion` fallback (no motion, gradient still renders). | `src/components/home/hero.tsx` | low | lint + typecheck |

### SLICE-4 — Featured work
| Task | Title | files_allowed (scope) | risk | proof |
|---|---|---|---|---|
| **TASK-014** | `WorkCard` (zoom + diagonal-reveal hover, Framer) used ×2 inside `Section` for the home "Featured work" block, sourced from a typed local project list (real `/work` data model arrives in EPIC-005 — this epic's list is the minimum shape `WorkCard` needs). | `src/components/home/work-card.tsx`, `src/components/home/featured-work.tsx`, `src/lib/projects.ts` | low | lint + typecheck |

### SLICE-5 — Capability rail
| Task | Title | files_allowed (scope) | risk | proof |
|---|---|---|---|---|
| **TASK-015** | `CapabilityRail`: GSAP ScrollTrigger pinned horizontal scroll across the three capability panels (web dev / custom software / AI integration, per content outline), each deep-linking to its future `/capabilities` anchor; degrades to a normal stacked vertical list under `prefers-reduced-motion`, touch, and no-JS. ScrollTrigger instance cleaned up on unmount. | `src/components/home/capability-rail.tsx` | medium | lint + typecheck (+ build smoke) |

### SLICE-6 — Magazine teaser & page assembly
| Task | Title | files_allowed (scope) | risk | proof |
|---|---|---|---|---|
| **TASK-016** | `MagazineTeaser` + `ArticleCard` ×3 (shadcn `Card`), Framer staggered entry (`stagger .08`), fed by typed placeholder data shaped exactly like the future `lib/magazine.ts` response so EPIC-007 only swaps the data source, not the component contract. Includes the graceful-fallback UI (<3 articles) up front. | `src/components/home/magazine-teaser.tsx`, `src/components/home/article-card.tsx`, `src/lib/magazine-placeholder.ts` | low | lint + typecheck |
| **TASK-017** | Assemble `/`: compose `Hero` → `FeaturedWork` → `CapabilityRail` → `MagazineTeaser` → `CTACallout` in `(site)/page.tsx`; keep `force-static`; final voice/copy pass against §2 rules. | `src/app/(site)/page.tsx` | low | lint + typecheck (+ build smoke) |

## Key decisions & risks

1. **`12-ui-element-map.md` is still `status: draft`.** Its content (component names,
   sources, motion bindings) is mature and already referenced by the merged EPIC-002,
   so this epic treats it as the build contract rather than blocking on the owner
   flipping the flag. Flag for the next spine pass: set `status: approved` once this
   epic confirms the map builds clean.
2. **Magazine teaser ships ahead of the magazine client.** The roadmap lists "From
   Magazine section" under EPIC-003 but assigns `lib/magazine.ts` to EPIC-007.
   Resolution: TASK-016 builds the `MagazineTeaser`/`ArticleCard` UI and graceful
   fallback against **typed placeholder data matching the planned API shape**; EPIC-007
   swaps the data source in, not the component. This keeps `/` static today and avoids
   EPIC-003 reaching into EPIC-007's scope.
3. **`ShaderBackground` (21st.dev) deferred.** [12-ui-element-map.md](../../project-spine/12-ui-element-map.md)
   §3 specs a WebGL shader hero background; vendoring a specific 21st.dev community
   component plus its GPU-tier guard and reduced-motion poster is real, separate work.
   TASK-013 ships the static warm-gradient version (already required as the
   `prefers-reduced-motion` fallback per the map's own hero guardrail), so the page is
   complete and correct without the shader. Swapping in WebGL is a follow-up task, not
   a blocker.
4. **Capability rail forward-links to a page that doesn't exist yet.** `/capabilities`
   ships in EPIC-006. TASK-015's anchors point at `/capabilities#<section>` regardless;
   until EPIC-006 ships, that 404s. Accepted — same pattern as any nav epic shipped
   before its page targets.
5. **`public_text: true` on copy-bearing tasks.** TASK-013 (hero) and TASK-017 (page
   assembly/final copy pass) carry real client-facing copy and must run stop-slop +
   ds-content-review before the verify gate (CLAUDE.md). TASK-014/016 use minimal
   placeholder/structural copy only — `public_text: false`, still voice-consistent ­but
   not the final words.

## Definition of done (epic)

- [ ] `(site)/layout.tsx` renders `SiteHeader` + `MobileNav` + `<main>` + `SiteFooter`;
      nav matches Home · About · Capabilities · Work · Contact, no LinkedIn anywhere.
- [ ] `/` composes Hero → Featured Work → Capability Rail → Magazine Teaser → CTA band,
      fully `force-static`, voice-correct copy, passing stop-slop on public strings.
- [ ] `CapabilityRail`'s GSAP ScrollTrigger is keyboard-reachable and degrades to a
      stacked list under `prefers-reduced-motion` / touch.
- [ ] `MagazineTeaser` renders against placeholder data today with the exact shape
      EPIC-007 will fill in; graceful fallback (<3 items) is implemented now.
- [ ] `npm run build` green and static for every route; `npm run lint` +
      `npm run typecheck` pass clean; verify gate green per task.
- [ ] No `/about`, `/capabilities`, `/work`, `/contact` content introduced; no real
      magazine API client introduced.
