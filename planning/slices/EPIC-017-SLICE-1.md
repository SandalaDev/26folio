# EPIC-017 SLICE-1 — the "Who I Am" chaptered reader

Owner brief 2026-07-15. Copy source stays `src/components/about/bio-modal.tsx`
as merged from EPIC-014/015 (owner-approved; do not rewrite). Design system
locked: warm espresso dark, rose primary with caramel/peach support, Clash
Display display type, General Sans body, hard 90-degree corners, no springs.

## Design read

One line: a magazine longform feature bound inside a modal — the width buys
a chapter spine and typographic air, never longer lines. Dials: variance 6
(editorial, calm), motion 5 (scroll-linked, restrained), density 3.

## The chapters

The existing copy already has the structure; surface it:

| Chapter | Content today | Accent |
|---|---|---|
| Prologue | the three intro paragraphs ("I'm Abraham Sandala…" → "…three defining epochs.") | ink/muted |
| I — Foundation | 5 paragraphs | caramel |
| II — Convergence | 5 paragraphs | peach |
| III — Awakening | 7 paragraphs (last line "The next epoch is…" may style as a coda) | rose |

Pull-quote candidates (typographic emphasis, copy verbatim): "I didn't have
a name for it then, but I was learning to think in systems." / "Webflow
changed the direction of my life more than any tool before it." / "That
changed the day I discovered Payload CMS."

## Layout contract

- Shell: local `DialogContent` override `w-[min(80vw,80rem)]` at lg+,
  ~92vw below, `h-[85vh]`, internal scroll container (the shared
  `src/components/ui/dialog.tsx` defaults do not change).
- lg+ grid: chapter rail (fixed within the modal, left) + reading pane.
  Reading pane text measure capped ~65–70ch; surplus width goes to rail,
  gutters, numeral backdrops.
- Mobile: rail collapses to a top hairline progress bar + current-chapter
  label; chapters stack.
- Chapter openings: eyebrow (Epoch N), Clash Display title with weight
  contrast (light/semibold pairing), first-paragraph lede (larger size or
  weight shift), oversized epoch numeral as low-contrast backdrop.
- Watermark: standalone logo symbol via CSS mask (same technique as the
  timeline's tinted icons), ~3–6% opacity, oversized, behind the text.

## Motion contract

- `useScroll({ container })` on the modal's scroll region — progress bar
  / rail fill, parallax `useTransform` offsets for numerals + watermark
  (slower than text; subtle, tens of px, not hundreds).
- IntersectionObserver active-chapter state on the rail (EpochNav
  language); rail click scrolls smoothly (respecting reduced motion).
- Chapter title/lede reveal as each chapter enters the viewport; modal
  entrance choreography on open (stagger, transform/opacity).
- Everything: EASE_OUT + DURATION from `src/lib/motion`, transform/opacity
  only, gated by `useReducedMotion` / `motion-reduce`. Framer Motion only;
  no GSAP unless a recorded justification lands in the task file.

## Files

- `src/lib/who-i-am.ts` (typed chapter content, extracted from the
  component — same pattern as `src/lib/the-way.ts`)
- `src/components/about/bio-modal.tsx` (rebuilt shell + composition)
- `src/components/about/who-i-am/*` (chapter rail, chapter section,
  pull quote, watermark — split as needed)
- `src/app/(site)/about/page.tsx` (only if the card cta line changes)
