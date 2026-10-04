---
id: TASK-098
title: "Build the digital blocks: screens scroll frame and devices rows"
status: ready
priority: P2
risk_level: medium
epic_ref: backlog/epics/EPIC-026.md
progress_weight: 1
files_allowed:
  - src/components/work/blocks/
skill_refs: [framer-motion, design-taste-frontend]
---

# Task: Build the digital blocks: screens scroll frame and devices rows

## Scope

The two blocks that present web design work. Higher risk than the other block
tasks because both involve motion, large images, and a scroll interaction that
can fight the page's own scrolling.

### `ScreensBlock` — `kind: "screens"`

A long web mockup shown inside a clipped frame, so a 2221px-tall page design can
be presented at readable width without eating six screens of vertical scroll.

Two real consumers:

- **Provision Finance** `scroll.jpg` (1920×2221) — the full homepage: red login
  bar, navy nav, a sunflower-field hero reading "Hello. How can we help?", three
  circular Borrow / Transact / Save actions, a live foreign-exchange rate strip
  across seven currencies, a customer-stories row, and a navy footer. This is the
  most substantial single artefact in the whole epic and the clearest evidence
  that Abe designs interfaces, not only marks.
- **OK Pharmacy** `website` (rasterized from a 1920×1836 SVG mockup).

The frame reveals the design progressively as the block enters the viewport,
inside its own clipped container. Two hard constraints:

1. **Never hijack page scroll.** No scroll-jacking, no `overscroll` traps, no
   locking the user inside the frame. If the mechanism is an inner
   `overflow-y: auto`, it must not swallow the page scroll at its boundaries on
   trackpads or touch.
2. **Reduced motion gets a static, complete view.** With
   `prefers-reduced-motion: reduce`, show the design as a plain contained image —
   scrollable by ordinary means, no animation. The artwork must be fully reachable
   without motion.

A scroll-linked reveal driven by `useScroll` on the block's own container, mapped
to a `y` transform on the image, is the straightforward approach and keeps the
page's native scroll untouched. Prefer it over any inner scroll container.

Keyboard users must be able to reach the whole design. If the frame is focusable,
it needs a visible focus ring and arrow-key scrolling; if it is not focusable,
the block must offer another way to see the full image.

### `DevicesBlock` — `kind: "devices"`

Laptop and phone mockups composed as a row. Provision Finance only:
`laptopmock.png` (849×849) and `phonemock.png` (274×573 — small, so it must not be
upscaled past its intrinsic size or it will look soft next to the laptop).
`ProvSiteMockJPG.jpg` (1026×768) is a third option; the manifest decides which
belong here versus in `in-situ`.

Compose them as a deliberate arrangement — phone overlapping the laptop's lower
corner is the conventional and effective treatment — rather than a plain grid.
`bare` plate tone: device mockups carry their own shadow and framing. Stack on
mobile, where an overlap becomes a mess.

### Shared conventions

Same as `TASK-096`. Motion is `framer-motion@12`, already present. `next/image`
with `priority` off for both blocks — these sit well below the fold — and honest
`sizes` so the optimizer does not ship a 2400px asset to a phone.

## Acceptance Criteria

- [ ] `ScreensBlock` presents a 2221px-tall design inside a contained frame at
      readable width without the block occupying more than roughly one and a half
      viewport heights.
- [ ] Page scroll is never captured: scrolling through the block with wheel,
      trackpad, and touch continues past it normally, verified in the browser at
      desktop and mobile widths.
- [ ] With `prefers-reduced-motion: reduce`, the full design is reachable as a
      static contained image with no animation.
- [ ] The complete design is reachable by keyboard, with a visible focus
      indicator if the frame is focusable.
- [ ] `DevicesBlock` never upscales `phonemock` beyond its 274×573 intrinsic size.
- [ ] Devices stack rather than overlap below the `md` breakpoint.
- [ ] Neither block ships an oversized image to a narrow viewport — confirmed by
      inspecting the actual requested optimizer URLs in the network panel.
- [ ] `npm run typecheck` and `npm run lint` pass clean.

## Dependency Evidence

- plan: none

`framer-motion@12.42.0` and `next/image` are both already dependencies. No new
package for the scroll behaviour — if the implementation reaches for a scroll or
carousel library, stop and file a plan first.

## Testing

- recommendation: with-task
- rationale: This is the only block task with real interaction risk rather than
  purely visual risk. Scroll hijacking is a genuine usability failure that is easy
  to introduce accidentally and impossible to notice from source, and a
  reduced-motion path that hides part of the artwork is an accessibility failure
  that a passing build would not reveal. Both are behavioural and must be
  exercised in the browser as part of this task, across wheel, trackpad, touch,
  and keyboard. Automated coverage would need a browser test runner and therefore
  a dependency plan, which is disproportionate to two components; deliberate
  manual verification here plus `TASK-105`'s sweep is the right level.

## Notes

Depends on `TASK-094` and `TASK-095`. Runs in parallel with `TASK-096` and
`TASK-097`.

Prior finding, directly relevant: a hidden preview tab freezes
`requestAnimationFrame`, which makes every scroll-linked animation in this block
appear completely broken. Check `document.hidden` first, before assuming the
`useScroll` wiring is wrong. Also do not run a production build while the dev
server is running — it clobbers `.next` and produces confusing failures.
