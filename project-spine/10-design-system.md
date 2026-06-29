---
id: DESIGN-SYSTEM
status: approved
phase: 4
generated_from:
  - 10-design-system.QUESTIONNAIRE.md
references:
  - https://www.baunfire.com/
  - https://brittanychiang.com/
  - https://www.ramotion.com/
  - references/design/Pasted image 20260628235334.png
  - references/design/Pasted image 20260628235531.png
canonical_tokens: tailwind.config.ts
---

# Design System — sandala.dev

> This document was **elicited**, not guessed. Every token and pattern below traces
> to an answer in the questionnaire or a cited reference. Where a value is a starting
> point awaiting your sign-off, it is marked `(proposed)`.

## 1. Origin & philosophy

The palette is personal: **pink and brown, drawn from Abe's own skin.** Vitiligo
gives the depigmented rose and the pigmented brown — two tones that coexist on one
surface. That is the whole brand idea in one image: *two things that aren't supposed
to go together, made to look intentional.* The site should feel **creative, modern,
futuristic** — and never **boring, static, or serious**.

The system's job is to make every page feel like it came from the same hand: a warm,
dark, airy canvas where refined rose and caramel do the talking and motion is smooth
rather than loud.

## 2. Colour tokens

> **Canonical source of truth is `tailwind.config.ts` → `theme.extend.colors`.**
> This table documents *intent and contrast*; the hex values live in code and flow
> outward to docs — never the reverse. Names are fixed; values are owner-approved.

The palette is a **warm analogous range** — rose → coral → peach → caramel → brown —
on a **warm espresso-black** (not cold navy). The warm base is deliberate: it lets
pink and brown read as one family instead of two clashing accents.

### Base (warm dark)

| Token | Value (proposed) | Role |
|---|---|---|
| `background` | `#1a1411` | page background — warm espresso, not navy |
| `surface` | `#241c18` | card / panel |
| `surface-2` | `#2e2420` | elevated surface |
| `border` | `#3a2e28` | default hairline border |
| `border-2` | `#4a3a32` | elevated / focused border |

### Text

Text is a **light-pink family, never white** — owner decision: the type tone ties
back to the rose accent so the whole surface reads as one skin-derived family.

| Token | Value | Role | Contrast on `background` |
|---|---|---|---|
| `ink` | `#f8dfe7` | primary text (light rose) | ~13:1 — AAA |
| `muted` | `#c9a6b0` | secondary text (muted mauve) | ~6:1 — AA/AAA |
| `soft` | `#e9c8d3` | tertiary / captions (soft pink) | ~10:1 — AAA |

### Brand accents (the skin palette)

| Token | Value (proposed) | Role | Notes |
|---|---|---|---|
| `rose` | `#ec8ca0` | **primary accent** — the depigmented pink | refined dusty rose, *not* magenta |
| `caramel` | `#c99368` | **secondary accent** — the pigmented brown | warm tan, lifts off dark as an accent |
| `peach` | `#f0a98a` | bridge / highlight | connects rose↔caramel without a harsh gradient |

`rose` on `background` ≈ 9:1 (AAA for large, AA for body). When `rose`/`caramel`
are used as a **button fill**, text on them is `background` (`#1a1411`), which gives
strong dark-on-light contrast.

### Functional (kept quiet, so brand stays the story)

| Token | Value (proposed) | Role |
|---|---|---|
| `success` | `#7fb89a` | confirmations (muted sage — cool relief from the warm range) |
| `amber` | `#e3b34e` | warnings / attention |
| `danger` | `#d65a4f` | errors (brick red — kept clearly distinct from `rose`) |

## 3. Colour guardrails (hard anti-patterns)

From your answer — *"vibe-coded magenta and harsh gradients"* — these are **rules**,
not preferences:

- **No magenta.** `rose` stays dusty/coral. If a pink ever drifts toward `#ff00ff`
  / hot fuchsia, it's wrong. Keep saturation moderate.
- **No harsh gradients.** Transitions between `rose`, `peach`, and `caramel` must be
  *long and low-contrast* (subtle washes, large blur radii), never a tight two-stop
  ramp. Prefer flat fills + soft radial glows over linear gradients.
- **No pure black, no cold navy.** The base is always *warm* dark.
- Accents are **seasoning, not the meal** — large surfaces stay base tones; rose and
  caramel punctuate.
- **No rounded corners.** Hard 90° corners everywhere — cards, buttons, inputs,
  chips, swatches. `border-radius: 0` is the default; rounding is the exception that
  needs a reason. Angular geometry is part of the brand's futuristic edge.

## 4. Typography

Sans, **unique** but legible, personality **editorial + technical**. Fonts are not
finalised — these are self-hostable proposals (no Google Fonts calls in production,
per the architecture rules) chosen to feel distinctive rather than systemic:

| Role | Proposed face | Why | Weight / size |
|---|---|---|---|
| Display / H1 | **Clash Display** (Fontshare) | characterful, futuristic-editorial | 600–700 · clamp(36px, 5vw, 72px) |
| Headings H2–H3 | **General Sans** (Fontshare) | clean technical neutral with warmth | 600 · 18–26px |
| Body | **General Sans** | pairs with itself; airy at body size | 400 · 16px |
| Mono / code | **JetBrains Mono** | technical signal, self-hostable | 400 · 0.92em |
| Eyebrow / label | General Sans | uppercase, tracked | 700 · 11px, `letter-spacing:.09em` |

- Line height 1.55–1.6 body, 1.05–1.1 display.
- Max line length ~70ch for body.
- **Self-hosted via `@font-face` only.** Fontshare faces are free for this use and
  ship distinctive character without a CDN call.

> If you already have a face in mind, swap it here and the proposals fall away — the
> *roles* (display / heading / body / mono / label) are what's fixed.

## 5. Layout & spacing

**Airy with efficient whitespace** — generous breathing room, but no wasted vertical
acreage. Tight where it should be tight, open where it should breathe.

- Tailwind's default spacing scale only — no arbitrary px.
- Section rhythm: `py-20 md:py-28 px-6 md:px-12 lg:px-24`.
- Constrained content: `max-w-7xl mx-auto`; full-bleed sections, contained copy.
- Grid-based; no float/absolute for flow layout.
- Sticky header with warm blur backdrop.

## 6. Motion system

Motion appetite: **subtle and smooth.** Benchmark: **baunfire.com**. The feeling is
expensive and intentional — things *ease* into place; nothing snaps or bounces hard.

**Library ownership (one per job — an architecture rule):**

| Trigger | Library | Convention |
|---|---|---|
| Element viewport entry | Framer Motion | `opacity 0→1`, `y 20→0`, ease-out |
| Staggered lists/grids | Framer Motion | `staggerChildren: .08` |
| Page transitions | Framer Motion | `AnimatePresence mode="wait"` |
| Scroll-driven (logo, parallax, reveals) | GSAP + ScrollTrigger | `scrub: 1`, cleanup in `useEffect` return |
| Icon / illustration playback | Lottie | `autoplay:false`, play on hover/scroll |

**Duration defaults:** micro 150ms · component 300ms · page 500ms · scroll = progress-driven.

**Easing:** smooth ease-out / custom cubic-bezier (e.g. `[0.22, 1, 0.36, 1]`).
No aggressive springs, no overshoot — "smooth", per your answer.

`prefers-reduced-motion` disables all of the above (Framer `useReducedMotion()`,
GSAP `matchMedia` guard). Reduced-motion users still get the content; they just lose
the choreography.

## 7. Signature interactions (traced to your references)

These are the patterns you explicitly cited. Each becomes a documented, reusable
component rather than a one-off.

| # | Pattern | Component (proposed) | Source reference |
|---|---|---|---|
| 1 | Logo animates on scroll | `ScrollLogo` (GSAP ScrollTrigger) | baunfire.com |
| 2 | Custom cursor + hover cursor states | `Cursor` / `useCursor()` | baunfire.com |
| 3 | Work cards: smooth zoom + diagonal reveal | `WorkCard` (Framer) | baunfire.com |
| 4 | Button hover animation | `Button` motion variants | baunfire.com |
| 5 | About: vertical timeline | `Timeline` | brittanychiang.com |
| 6 | About: flashlight cursor spotlight | `FlashlightCursor` (radial mask follows pointer) | brittanychiang.com |
| 7 | Tech logos: fixed grid, logos animate in, scope-of-work preview on hover | `TechGrid` + `LogoHoverCard` | ramotion.com |
| 8 | Video-on-hover on cards | `HoverVideo` | ramotion.com |
| 9 | Icon row → content swaps below on click | `IconTabs` | addepto (`...235334.png`) |
| 10 | Vertical topic tabs → content card swaps | `TopicTabs` | addepto (`...235531.png`) |

Patterns **9 & 10** are the same idea — a selector that swaps a content panel — so
they should share one headless primitive (`useTabbedContent`) with two skins
(horizontal icon row / vertical topic list). The flashlight spotlight (6) and custom
cursor (2) both hang off a single shared pointer tracker to avoid two competing
`mousemove` listeners.

The **flashlight cursor** must respect the colour guardrails: a *warm* soft glow
(low-opacity `peach`/`rose` radial), not a harsh white spotlight.

## 8. Component sources

| Need | Source | Rule |
|---|---|---|
| Primitives (Button, Card, Dialog, Form, Input, Toast, Tooltip…) | **shadcn/ui** | don't re-implement |
| Expressive / hero / feature blocks | **21st.dev** | document each usage in its task |
| Signature interactions (§7) | **custom** in `src/components/motion/` | one library per job |

Preference order: shadcn primitive → 21st.dev for expressive blocks → custom only
when a cited reference demands it.

## 9. Imagery

**Photography + illustration.** Photography carries warmth and humanity (ties to the
skin-derived palette); illustration carries the futuristic edge. Keep them tonally
consistent with the warm-dark base — no cold, blue-cast stock imagery dropped onto a
warm canvas. Decorative images use `alt=""`; meaningful images carry real `alt` text.

## 10. Accessibility

- WCAG **AA** floor (4.5:1 text); body text pairs above target AAA (see §2).
- Focus ring: `outline-2 outline-rose outline-offset-2` on every interactive element.
- `prefers-reduced-motion`: honoured everywhere (see §6).
- Custom cursor and flashlight effects **never** remove the native focus path —
  keyboard users get full visible focus.
- Icon-only buttons carry `aria-label`.

## 11. Responsive

| Name | Width | Tailwind |
|---|---|---|
| mobile | < 640px | `sm` |
| tablet | 640–1024px | `md`, `lg` |
| desktop | > 1024px | `xl`, `2xl` |

Mobile-first. Signature interactions **degrade gracefully**: custom cursor and
flashlight are pointer-fine only (disabled on touch); scroll choreography simplifies
rather than disappears.

## 12. Token ownership & drift policy

- `tailwind.config.ts` is **canonical**. This file and any visual reference are
  **generated from / reconciled to** it — never the source of truth.
- If a value changes, it changes in `tailwind.config.ts` first; this doc is updated
  to match. A future `design-system.html` preview must be **built from the config**,
  not hand-authored (that was the flaw in the discarded v1).
- Token *names* are stable contracts; values may be tuned until `status: approved`.

---

### Your next step

Review §2 (palette), §4 (fonts), and §7 (interactions) — those are the three places I
made proposals from your evidence. When it reads right:

1. Set `status: approved` in the frontmatter above.
2. Run `bash scripts/content.sh questionnaire` to begin Phase 5 (content + sitemap),
   which is gated on this file being approved.
