---
id: EPIC-004
title: About page — hybrid intro, sticky cards, timeline, magazine section, socials
status: done
phase: 1
priority: P1
risk_level: medium
roadmap_ref: 09-roadmap.md#p1
depends_on: [EPIC-002, EPIC-003]
blocks: []
references:
  - 12-ui-element-map.md
  - 11-content-strategy.md
  - 10-design-system.md
  - 07-architecture-principles.md
related:
  - 09-roadmap.md
roadmap_refs: [ROAD-001]
goal_refs: [GOAL-001, GOAL-002, GOAL-003, GOAL-004]
progress_weight: 1
---

# EPIC-004 — About page

> Build `/about` per the approved content outline
> ([11-content-strategy.md](../../project-spine/11-content-strategy.md) §4 `/about`)
> and the component map ([12-ui-element-map.md](../../project-spine/12-ui-element-map.md) §3
> `/about`). Structure borrows from brittanychiang.com: a hybrid business/personal
> intro, a two-column scroll experience (sticky modal-opening cards + a GSAP-scrolled
> career timeline), a Scrumtrulescent section, and social links. This is also the
> first epic to need `FlashlightCursor` — the §7 signature primitive EPIC-002
> deliberately deferred to "the page epic that first needs it."

## Pre-existing — already DONE (do not re-derive)

- [`11-content-strategy.md`](../../project-spine/11-content-strategy.md) — approved.
  The `/about` outline (hybrid intro, sticky cards + modals, timeline, magazine
  section, socials, no LinkedIn) is decided; this epic builds it, not re-plans it.
- [`12-ui-element-map.md`](../../project-spine/12-ui-element-map.md) — draft (same
  flag as EPIC-003; treated as the build contract, not blocking).

## Goal & non-goals

**Goal:** `/about` renders the full structure: hybrid intro with `FlashlightCursor`
active, two sticky cards opening interest/bio modals, a GSAP scroll-revealed career
timeline, a Scrumtrulescent "what/why" section, social links (no LinkedIn), and a CTA
band. Fully static, token-styled, accessible, `prefers-reduced-motion`-safe.

**Non-goals:**
- **Abe's actual biography, interests, and career timeline are not in any spine
  document.** This epic is not the place to invent them. Every content-bearing block
  (the "Who I am" bio modal, the "The way I am" interests modal, and the timeline
  beats) ships with **clearly placeholder copy** (`public_text: false`, structurally
  complete, not final) — same pattern EPIC-002 used for font binaries and EPIC-003
  used for social handle URLs: scaffold the real shape, flag the real content as an
  owner-confirmed follow-up. Do not fabricate personal history to make placeholders
  "feel real."
- Real social handle URLs — placeholders (`#`) again, same as EPIC-003's footer,
  until the owner confirms profile links (one list, reusable by both).
- `/capabilities`, `/work`, `/contact` page content → EPIC-005/006/008.
- Cursor's *other* consumer (a general-purpose hover cursor, separate from the
  flashlight) is not introduced here — only `FlashlightCursor` is needed by this
  page's blocks; build only what's used (architecture principle #6 in reverse: don't
  pre-build unused primitives).

## Architecture constraints this epic must honour

From [07-architecture-principles.md](../../project-spine/07-architecture-principles.md):
- **One animation library per job** (§4): Framer for `AboutIntro`/card hover/modal
  transitions; **GSAP + ScrollTrigger** for the `Timeline` reveal-on-scroll (the only
  scroll-driven multi-element sequence in this epic), torn down on unmount.
- **Pointer-fine only, never removes focus** (§10, ui-element-map §1):
  `FlashlightCursor` (and the shared `usePointer()` it's built on) disables itself on
  touch/coarse pointers and must never set `outline: none` — the global rose
  `:focus-visible` ring stays intact everywhere.
- **Composition over duplication** (§6): `usePointer()` is a single `mousemove`
  source; `FlashlightCursor` is its only consumer for now, but the hook itself must
  not assume that — a later epic's `Cursor` component reuses the same source.
- **Accessibility** (§10): modals (`InterestsModal`/`BioModal`) use Radix `Dialog`
  defaults (focus trap, `Escape`, labelled), the timeline stays keyboard-reachable
  and degrades to a plain stacked list under `prefers-reduced-motion`.

## Slices & tasks

### SLICE-1 — Shared pointer primitive
| Task | Title | files_allowed (scope) | risk | proof |
|---|---|---|---|---|
| **TASK-018** | `usePointer()` (single `mousemove` listener, SSR-safe, pointer-fine gated) + `FlashlightCursor` (warm low-opacity rose/peach radial spotlight following the pointer). Disabled entirely on touch/coarse pointers and under `prefers-reduced-motion`; never removes the native focus ring. | `src/components/site/flashlight-cursor.tsx`, `src/lib/use-pointer.ts` | low | lint + typecheck |

### SLICE-2 — Hybrid intro
| Task | Title | files_allowed (scope) | risk | proof |
|---|---|---|---|---|
| **TASK-019** | `AboutIntro`: one opening paragraph that reads as both a business pitch and a personal introduction (per content outline §4.1), `FlashlightCursor` mounted behind it, Framer fade-up entry. Placeholder-quality copy, clearly flagged for an owner pass — not the wedge that ships a guessed biography. | `src/components/about/about-intro.tsx` | low | lint + typecheck |

### SLICE-3 — Sticky cards & modals
| Task | Title | files_allowed (scope) | risk | proof |
|---|---|---|---|---|
| **TASK-020** | Vendor shadcn `Dialog` primitive (hard corners, rose focus). `StickyCard` ×2 ("The way I am" / "Who I am"), sticky-positioned, Framer hover, each opening its modal on click. `InterestsModal` (categorised interests + images, playful layout, content stagger) and `BioModal` (detailed bio, fade). All content is structural placeholder — real interests/bio are an owner-confirmed follow-up. | `src/components/ui/dialog.tsx`, `src/components/about/sticky-card.tsx`, `src/components/about/interests-modal.tsx`, `src/components/about/bio-modal.tsx`, `package.json`, `package-lock.json` | medium | lint + typecheck (+ build smoke) |

### SLICE-4 — Timeline
| Task | Title | files_allowed (scope) | risk | proof |
|---|---|---|---|---|
| **TASK-021** | `Timeline`: vertical career/journey beats revealing on scroll via GSAP `ScrollTrigger` (one trigger per beat, or a single timeline scrubbed — implementer's call as long as it's GSAP, not Framer, per one-lib-per-job). Degrades to a plain static stacked list under `prefers-reduced-motion`. Beats are structural placeholders (3–4 generic milestones), not invented biography. | `src/components/about/timeline.tsx` | medium | lint + typecheck (+ build smoke) |

### SLICE-5 — Magazine section & socials
| Task | Title | files_allowed (scope) | risk | proof |
|---|---|---|---|---|
| **TASK-022** | `MagazineSection`: what Scrumtrulescent is, why it exists, and what a reader should take from it (drawing on the real, documented ecosystem rationale — traffic/audience-building, not invented), linking out to scrumtrulescent.com. `SocialLinks`: TikTok/YouTube/X/Bluesky/GitHub, **no LinkedIn**, placeholder `#` hrefs shared with the footer's list shape. | `src/components/about/magazine-section.tsx`, `src/components/about/social-links.tsx` | low | lint + typecheck |

### SLICE-6 — Page assembly
| Task | Title | files_allowed (scope) | risk | proof |
|---|---|---|---|---|
| **TASK-023** | Assemble `/about`: `AboutIntro` → two-column (`StickyCard`×2 / `Timeline`) → `MagazineSection` → `SocialLinks` → `CTACallout` ("Want to work with me" → `/contact`, per content outline). `force-static` preserved. | `src/app/(site)/about/page.tsx` | low | lint + typecheck (+ build smoke) |

## Key decisions & risks

1. **No invented biography.** This epic's single biggest risk is an agent filling
   placeholder content with plausible-sounding "facts" about Abe that aren't true.
   Every personal-content block ships **structurally complete, explicitly
   placeholder** (e.g. "Milestone — a short description goes here"), `public_text:
   false`, and is called out in the epic's definition of done as **not ready to ship
   to production** until the owner supplies real bio/interests/timeline copy.
2. **`FlashlightCursor` introduced here, reusable later.** Per EPIC-002's deferral
   note, the first page epic that needs a §7 signature interaction builds it. This
   epic builds `usePointer()` generically (not About-specific) so a future `Cursor`
   component can share the same listener without refactoring the hook.
3. **`12-ui-element-map.md` still draft** — same standing flag as EPIC-003 decision
   #1; treated as the build contract.
4. **Social handle list duplication with EPIC-003's footer.** Both ship the same five
   platforms with placeholder `#` hrefs. Not worth a shared-data abstraction yet for
   five static links in two places — if a third consumer appears, extract then (YAGNI,
   architecture principle #6 read narrowly: duplication becomes a problem at 3, not 2).

## Definition of done (epic)

- [ ] `/about` renders hybrid intro (with `FlashlightCursor` active, pointer-fine
      only) → two-column sticky cards/timeline → magazine section → social links →
      CTA band, fully `force-static`.
- [ ] `StickyCard` modals (`InterestsModal`/`BioModal`) are accessible Radix
      `Dialog`s: focus trap, `Escape` to close, labelled.
- [ ] `Timeline`'s GSAP `ScrollTrigger` is cleaned up on unmount and degrades to a
      stacked list under `prefers-reduced-motion`.
- [ ] No LinkedIn link anywhere; social link shape matches the footer's.
- [ ] `npm run build` green and static; `npm run lint` + `npm run typecheck` pass.
- [ ] **Explicitly flagged, not silently shipped:** the bio, interests, and career
      timeline content is placeholder. STATE.json's remaining-work list carries this
      forward until the owner supplies real copy.
