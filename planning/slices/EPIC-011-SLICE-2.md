---
id: EPIC-011-SLICE-2
title: Chrome & buttons — low-contrast footer + unified magnetic CTA (owner notes 3 & 4)
epic: EPIC-011
status: ready
phase: 4
risk_level: medium
design_refs: [10-design-system.md, 12-ui-element-map.md]
content_refs: [11-content-strategy.md]
skill_refs: [design-taste-frontend, framer-motion]
tasks: [TASK-045, TASK-046]
---

# SLICE-2 — Chrome & buttons

> Owner notes 3 and 4. The footer drops contrast: text/links go light brown
> (caramel), the masonry texture becomes a filled, lower-contrast wash instead of
> an outlined grid. Every page's primary CTA adopts the hero's magnetic hover.

## Intent
Calm the footer so it stops competing with the page, and make the call-to-action
feel the same everywhere a visitor meets it.

## Scope / Non-goals
- **In:** `site-footer.tsx` palette/contrast; `masonry-pattern.tsx` fill + opacity;
  `cta-callout.tsx` swap plain `Button` for `MagneticButton`.
- **Out:** footer structure/columns (unchanged), `MagneticButton` internals, the
  `Button` primitive's variants, the magazine link, social link set.

## Content and design
- Footer text/links: caramel (`--color-caramel`) at the muted opacity the system
  uses for tertiary text, hover to rose. Wordmark stays quiet. This is the
  "light brown" the owner asked for, inside the existing palette (no new tokens).
- Masonry: switch rects to a fill (`surface`/`border` tone) at very low opacity so
  it reads as a filled texture over the background, and lower its contrast vs.
  the current hairline outlines. Keep it `aria-hidden`, decorative, behind content.
- CTA: `CTACallout` renders `MagneticButton` (href variant) instead of the plain
  `Button asChild` link, so the conversion band's button shares the hero's pull +
  fill sweep + text reveal. Reduced-motion/coarse-pointer degrade is already
  handled in `MagneticButton`.

## Task map
| Task | Purpose | Risk | Required proof |
|---|---|---|---|
| [TASK-045](../../backlog/tasks/TASK-045.md) | Footer light-brown low-contrast text + filled low-contrast masonry | medium | lint + typecheck + build + slop |
| [TASK-046](../../backlog/tasks/TASK-046.md) | Unify CTA hover site-wide (magnetic button) | medium | lint + typecheck + build |

## Gates
- [x] Spine references valid (10-design-system §2 palette, §3 guardrails, §7 #4; 12-ui-element-map §1 CTA, §2 footer).
- [x] Skills selected (design lane; framer-motion for the magnetic component family).
- [x] Test plan: lint/typecheck/build + in-browser footer/CTA check.
- [x] Protected paths declared (none).
