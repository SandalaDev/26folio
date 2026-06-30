---
id: EPIC-002
title: Design system — tokens, typography, colour, spacing, base components
status: ready            # ready -> in-progress -> done
phase: 1
priority: P1
risk_level: medium
roadmap_ref: 09-roadmap.md#p1
depends_on: [EPIC-001]
blocks: [EPIC-003, EPIC-004, EPIC-005, EPIC-006, EPIC-008]
references:
  - 10-design-system.md
  - 07-architecture-principles.md
  - 12-ui-element-map.md
related:
  - 06-project-technical-plan.md
  - 09-roadmap.md
---

# EPIC-002 — Design system (tokens, typography, colour, spacing, base components)

> Turn the **approved** [10-design-system.md](../../project-spine/10-design-system.md) into living code. EPIC-001 shipped a correct-but-empty
> skeleton with a deliberately blank `tailwind.config.ts` and a bare `globals.css`.
> This epic fills the canonical token layer, the self-hostable type system, the
> shared motion constants, and the brand-styled shadcn primitives that every later
> page epic (EPIC-003–006, 008) composes. It produces **no page content** — only the
> reusable design substrate.

## Pre-existing — already DONE (do not re-create, do not re-derive)

The **design decisions are not open** — Phase 4 already produced and approved them:

- [`project-spine/10-design-system.md`](../../project-spine/10-design-system.md) — the
  written spec (`status: approved`).
- [`project-spine/10-design-system.html`](../../project-spine/10-design-system.html) —
  a complete rendered reference that already hard-codes every token value, the type
  scale, the motion constants, and working demos of the §7 interactions.

What that means for this epic: **every value is decided.** The colour hexes, the
font roles + fallback stacks, the type sizes/line-heights, the motion durations and
easing, the focus-ring and hard-corner rules, the eyebrow treatment — all of it lives
in those two files. Tasks here **port** them verbatim into the app; they do **not**
re-pick palettes, fonts, or timings. If an implementation value would differ from the
HTML reference, that is a bug, not a choice. Treat the HTML as the source-of-truth to
port *from* (the §12 reconciliation runs the other way only once `tailwind.config.ts`
becomes canonical).

This is captured below as **SLICE-0 (design specification) — already complete.**

## Goal & non-goals

**Goal:** after this epic, the whole warm-dark skin palette (§2), typography roles
(§4), spacing rhythm (§5), motion constants (§6), and base primitives (§8) exist as
tokens + components a page can `import` and `className` against. `npm run build`
stays green and fully static; `npm run lint` / `npm run typecheck` pass clean.

**Non-goals (owned elsewhere — do not do them here):**
- Page content, sections, copy → **EPIC-003–006** (home, about, work, capabilities).
- The **signature interaction components** of §7 (`ScrollLogo`, `Cursor`,
  `FlashlightCursor`, `WorkCard`, `Timeline`, `TechGrid`, `IconTabs`, `TopicTabs`…)
  → built by the page epic that first needs each, on top of this epic's motion
  tokens. This epic ships the *constants and primitives*, not the choreography.
- Real font **binaries**. Fonts are explicitly *proposals, not finalised* (§4) and
  the architecture forbids CDN/Google-Fonts calls (§4, [07](../../project-spine/07-architecture-principles.md) §rendering). This epic
  scaffolds `@font-face` + robust fallback stacks + a `public/fonts/` drop-in README;
  committing specific Fontshare/JetBrains binaries is a later owner-confirmed step.
- Contact form / inputs wired to logic → **EPIC-008** (this epic ships the *unstyled-
  to-branded* `Input`/`Textarea`/`Label` primitives only).

## Architecture constraints this epic must honour

From [07-architecture-principles.md](../../project-spine/07-architecture-principles.md) and [10-design-system.md](../../project-spine/10-design-system.md):
- **Tailwind only** ([07](../../project-spine/07-architecture-principles.md) §5): all tokens live in the Tailwind v4 layer, not scattered
  inline. See decision 1 on *where* in v4.
- **No CDN fonts** (§4): self-hosted `@font-face` only; no `next/font/google`.
- **Colour guardrails are rules, not taste** (§3): no magenta, no harsh gradients,
  no pure black / cold navy, **no rounded corners** (`border-radius: 0` default).
- **Static by default** ([07](../../project-spine/07-architecture-principles.md) §1): nothing added here may force SSR/dynamic.
- **Accessibility floor AA** (§10): `outline-2 outline-rose outline-offset-2` focus
  ring on every interactive element; `prefers-reduced-motion` honoured by the motion
  constants.

## Slices & tasks

> Each task becomes `backlog/tasks/TASK-0NN.md` with frontmatter enforced by
> `scripts/validate-task.mjs`. The verify gate rejects any diff escaping
> `files_allowed`. Token names are stable contracts (§12); values are owner-tunable.

### SLICE-0 — Design specification ✅ DONE (pre-existing)
| Task | Title | Deliverable | Status |
|---|---|---|---|
| — | Palette, type, spacing, motion, interaction patterns elicited & rendered | [10-design-system.md](../../project-spine/10-design-system.md) + [10-design-system.html](../../project-spine/10-design-system.html) | **done** (Phase 4, approved) |

> Nothing to build here — SLICE-1…3 below consume this. Listed so the epic is honest
> about what already exists and to stop any re-derivation of decided values.

### SLICE-1 — Tokens & global foundation
| Task | Title | files_allowed (scope) | risk | proof |
|---|---|---|---|---|
| **TASK-007** | Author the full **colour + base token set** (§2) and the global base layer into the Tailwind v4 `@theme` in `globals.css`; reconcile `tailwind.config.ts` (decision 1). Set warm-dark `background`, `ink` text, **`border-radius: 0` default**, rose focus ring, warm selection. | `src/app/globals.css`, `tailwind.config.ts`, `src/app/layout.tsx` | medium | lint + typecheck (+ build smoke) |

### SLICE-2 — Typography
| Task | Title | files_allowed (scope) | risk | proof |
|---|---|---|---|---|
| **TASK-008** | Wire the **typography system** (§4): `@font-face` scaffolding with self-hostable faces + fallback stacks, font CSS variables (display/sans/mono), type scale, line-heights, and the tracked uppercase eyebrow/label utility. Add `public/fonts/README.md` documenting the binary drop-in. No CDN calls. | `src/app/globals.css`, `src/app/layout.tsx`, `public/fonts/` | low | lint + typecheck |

### SLICE-3 — Motion tokens & base primitives
| Task | Title | files_allowed (scope) | risk | proof |
|---|---|---|---|---|
| **TASK-009** | Add the shared **motion constants** module (§6): duration scale (micro/component/page), easing cubic-béziers (`[0.22,1,0.36,1]`), Framer variant presets (fade-up, stagger), and a `prefers-reduced-motion` helper. Pure constants — no components. | `src/lib/motion.ts` | low | lint + typecheck |
| **TASK-010** | Add the **base shadcn primitives** (§8): `Button` (brand variants + motion-ready), `Card`, `Input`, `Textarea`, `Label`, styled to the tokens (hard corners, rose focus, accent fills). Install `class-variance-authority` + `@radix-ui/react-slot`. No page usage. | `src/components/ui/`, `package.json`, `package-lock.json`, `src/app/globals.css` | medium | lint + typecheck (+ build smoke) |

## Key decisions & risks

1. **Where tokens live in Tailwind v4.** [10-design-system.md](../../project-spine/10-design-system.md) §12 names
   `tailwind.config.ts` "canonical", but that doc predates the project landing on
   **Tailwind v4**, whose canonical token home is the CSS-first `@theme` block. This
   epic implements tokens in `@theme` inside `globals.css` (so `bg-background`,
   `text-ink`, `text-rose`, etc. generate) and keeps `tailwind.config.ts` as a thin,
   documented companion. Flag for the next spine pass: reconcile §12's wording to say
   "the Tailwind v4 `@theme` layer is canonical" — same intent, correct mechanism.
2. **No rounded corners is a hard default.** Per §3, base `--radius: 0`. shadcn's
   default components assume `rounded-*`; TASK-010 must strip rounding from the
   vendored primitives, not inherit it. Rounding is the audited exception.
3. **Fonts are scaffolded, not shipped.** Faces are proposals (§4) and binaries are
   not in the repo. TASK-008 ships `@font-face` + fallback stacks so the site renders
   immediately with system fallbacks, plus a `public/fonts/README.md` listing exactly
   which files to drop in. Committing binaries waits on owner font sign-off.
4. **One library per motion job** (§6). TASK-009 ships only *Framer* presets +
   duration/easing constants and the reduced-motion guard. GSAP/Lottie helpers arrive
   with the scroll/illustration components in later epics — not pre-emptively.
5. **shadcn via CLI vs vendored.** The shadcn registry is reachable, but to keep the
   primitives token-bound and rounding-free we **author them from the known shadcn
   source** (MIT) rather than `npx add` + post-edit — fewer churned files, and the
   diff stays inside `files_allowed`. `cva` + `@radix-ui/react-slot` are real deps.
6. **public_text:** these are code/token files, not public copy — `public_text:false`
   on every task; the slop gate is n/a. The `public/fonts/README.md` is developer
   documentation, not client-facing marketing.

## Definition of done (epic)

- [ ] `globals.css` `@theme` defines every §2 token (base, text, accents, functional);
      `bg-background`/`text-ink`/`text-rose`/`border-border` etc. resolve in build.
- [ ] Global base layer applies warm-dark background, light-rose `ink` text,
      `border-radius: 0` default, and the rose focus ring on `:focus-visible`.
- [ ] Typography: display/sans/mono font variables + type scale + eyebrow utility
      exist; `@font-face` self-hosted with fallbacks; `public/fonts/README.md` present;
      **no Google-Fonts / CDN call** anywhere.
- [ ] `src/lib/motion.ts` exports duration + easing constants, fade-up/stagger Framer
      variants, and a reduced-motion helper.
- [ ] `Button`, `Card`, `Input`, `Textarea`, `Label` exist in `src/components/ui/`,
      token-styled, hard-cornered, rose-focus, with no rounded corners.
- [ ] `npm run build` is green and **static** for every route; `npm run lint` +
      `npm run typecheck` pass clean; the verify gate is green per task.
- [ ] No page content, copy, or signature-interaction components introduced.
