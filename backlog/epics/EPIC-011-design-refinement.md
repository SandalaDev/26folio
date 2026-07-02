---
id: EPIC-011
title: Design refinement wave — hero, header, footer, buttons, cards, contact (owner review of EPIC-010)
status: in-progress      # ready -> in-progress -> done
phase: 4
priority: P1
risk_level: medium
roadmap_ref: 09-roadmap.md
depends_on: [EPIC-010]
blocks: []
references:
  - 10-design-system.md
  - 11-content-strategy.md
  - 12-ui-element-map.md
related:
  - 09-roadmap.md
---

# EPIC-011 — Design refinement wave (owner review of EPIC-010)

> Owner reviewed EPIC-010 in a browser (2026-07-02) and sent six concrete
> calibration notes. This epic is the response: not a redesign, a tune-up against
> the existing warm-dark, vitiligo-skin brand. Each item maps to one task.

## Goal & non-goals

**Goal:** land the six owner notes as six bounded tasks, each inside the EPIC-010
design system (no new tokens, no new type, no layout-max-width reintroduced).

**Non-goals:**
- No brand/tokens/type overhaul (EPIC-010 owns that; this wave works inside it).
- No real Resend email delivery (the contact form validates + posts to the
  existing `/api/contact` 501 stub and shows a graceful state; wiring Resend is a
  separate epic, per the spine's no-stored-submissions charter constraint).
- No invented claims: contact/CTA copy is neutral and functional; project/service
  descriptors stay as EPIC-010 drafted them.
- The `Button` primitive's variants are not changed; the magnetic hover is layered
  on top via the existing `MagneticButton`, which already reuses `buttonVariants`.

## Owner notes → tasks

| # | Owner note | Task |
|---|---|---|
| 1 | Hero: drop the double font-weight in the h1, enlarge the h1, align the CTA and image to the ends of the h1, enlarge the image slightly and crop in to show the face portrait-style. | TASK-043 |
| 2 | Header: transparent, no background — logo and links should just float. (Already `bg-transparent` in code; verify in the live build and remove anything that paints.) | TASK-044 |
| 3 | Footer: lower the contrast — text/links light brown; masonry grid lower-contrast against the background and filled, not just borders. | TASK-045 |
| 4 | All buttons share the hero button's on-hover behavior. | TASK-046 |
| 5 | Featured-work card hover: the whole div tilts like a door opening while the image zooms — smooth, not jerky. | TASK-047 |
| 6 | Fix the contact page (currently a bare `<h1>Contact</h1>` stub). | TASK-048 |

## Key decisions

1. **Hero h1 goes single-weight.** EPIC-010 used heavy/light weight contrast inside
   the h1; the owner wants one weight. The `--text-display` token already targets
   weight 650, so the h1 keeps its single display weight and the inline
   `<span class="font-semibold">` / `font-extralight` spans are removed. The h1 is
   enlarged by raising the `--text-display` clamp ceiling (a token change, the
   canonical place for type scale). `measure` still governs body width, not the h1.
2. **Hero alignment: CTA and portrait to the h1's ends.** A single-column stack
   with the portrait and CTA in a row that aligns to the h1's left/right edges
   (the h1's own block width), replacing the 12-col split. The portrait grows
   (portrait aspect, cropped to the face) and stays blob-masked.
3. **Header transparency is verified, not re-built.** `site-header.tsx` and
   `navigation-menu.tsx` are already `bg-transparent`. The task confirms this in
   the running build and strips any stray background/blur/border, rather than
   asserting a change that is already true.
4. **Footer contrast is lowered via the palette, not new tokens.** Text/links move
   to the caramel accent (`--color-caramel`, a light brown) at the muted opacity
   the design system already uses for tertiary text; the masonry pattern switches
   from `fill="none"` hairlines to a low-opacity `surface`/`border` fill so it
   reads as a filled texture, not an outlined grid, and its contrast against the
   background drops.
5. **One button hover, site-wide.** The hero `MagneticButton` (GSAP magnetic pull
   + peach fill sweep + text-mask reveal, EPIC-009 signature interaction §7 #4)
   becomes the canonical CTA. `CTACallout` (the end-of-page band on every page)
   switches from the plain `Button` to `MagneticButton`. `MagneticButton` already
   degrades to a plain styled button under reduced-motion/coarse pointers, so the
   page is never motion-gated.
6. **Card hover: door tilt + image zoom.** The existing tilt (EPIC-010 TASK-041)
   is re-tuned toward a "door opening" feel: a larger, smoother rotateY toward the
   pointer (single axis reads as a hinge), driven by motion values + springs, with
   the image zoom easing in on the same enter. Pointer-fine + motion-allowed only;
   coarse/reduced-motion get a static card with a plain zoom.

## Slices & tasks

### SLICE-1 — Hero & header (first viewport)
| Task | Title | risk | proof |
|---|---|---|---|
| **TASK-043** | Hero: single-weight enlarged h1, CTA + portrait aligned to h1 ends, larger portrait-cropped image. **public_text** (h1 copy is rendered public text). | medium | lint + typecheck + build + slop |
| **TASK-044** | Header: confirm/enforce fully transparent floating header. | low | lint + typecheck + build |

### SLICE-2 — Chrome & buttons
| Task | Title | risk | proof |
|---|---|---|---|
| **TASK-045** | Footer: light-brown low-contrast text/links + filled low-contrast masonry. **public_text** (footer link labels). | medium | lint + typecheck + build + slop |
| **TASK-046** | Unify CTA hover: every page's CTA uses the magnetic button treatment. | medium | lint + typecheck + build |

### SLICE-3 — Cards & contact
| Task | Title | risk | proof |
|---|---|---|---|
| **TASK-047** | Featured-work card hover: door-opening tilt + image zoom, smooth (spring-driven). | medium | lint + typecheck + build |
| **TASK-048** | Contact page: inquiry form (name/email/message + optional project type) with client validation + confirmation state, plus contact details/socials. **public_text**. | medium | lint + typecheck + build + slop |

## Definition of done

- [ ] Hero h1 is single-weight and visibly larger; CTA + portrait align to the
      h1's left/right edges; portrait is larger, portrait-aspect, cropped to the
      face, still blob-masked; hero copy unchanged.
- [ ] Header is fully transparent in the live build (logo + nav float), with no
      background/blur/border painted by header, menu, or mobile nav.
- [ ] Footer text/links read as light brown (caramel) at low contrast; the
      masonry texture is filled (not outline-only) and lower-contrast against the
      background.
- [ ] Every page's primary CTA uses the magnetic hover (pull + fill sweep + text
      reveal) and degrades cleanly under reduced-motion/coarse pointers.
- [ ] Featured-work cards tilt like a door opening (single-axis hinge) while the
      image zooms, as one smooth spring-driven motion; pointer-fine/motion-allowed
      only.
- [ ] Contact page renders the inquiry form (name/email/message + optional project
      type) with client-side validation and a confirmation state, plus contact
      details/socials, matching the spine (11-content-strategy §4, 12-ui-element-map §3).
- [ ] lint / typecheck / build green; slop artifacts present and >= 35/50 for the
      three public-text tasks; in-browser verification done.

## Notes for the owner

- The contact form will not actually send email yet. `src/app/api/contact/route.ts`
  is a 501 stub; real Resend delivery (`RESEND_API_KEY`) is its own epic, per the
  charter's no-stored-submissions constraint. The form validates on the client and
  posts to the route, showing a clear state for each outcome.
- Contact details (an email address) are not specified anywhere in the spine, so
  the "contact details" block uses the social links (already in the footer/about)
  plus a neutral line until you supply a real address. Flagged in STATE for
  confirmation.
