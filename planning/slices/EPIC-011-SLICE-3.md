---
id: EPIC-011-SLICE-3
title: Cards & contact — door-tilt cards + real contact page (owner notes 5 & 6)
epic: EPIC-011
status: ready
phase: 4
risk_level: medium
design_refs: [10-design-system.md, 12-ui-element-map.md]
content_refs: [11-content-strategy.md]
skill_refs: [design-taste-frontend, framer-motion]
tasks: [TASK-047, TASK-048]
---

# SLICE-3 — Cards & contact

> Owner notes 5 and 6. Featured-work cards tilt like a door opening while the
> image zooms, as one smooth motion. The contact page stops being a stub and
> becomes the inquiry form + contact details the spine always specified.

## Intent
Make hovering a piece of work feel like leaning into it (a hinge, not a wobble),
and make the contact page actually convert (form with validation + a clear
confirmation), without overstepping into email delivery that isn't wired yet.

## Scope / Non-goals
- **In:** `work-card.tsx` hover re-tune; `contact/page.tsx` + a new
  `ContactForm` client component + a contact-details block.
- **Out:** real Resend delivery (route stays 501; deferred to its own epic),
  new routes, the work grid layout, project copy.

## Content and design
- Card hover: keep the EPIC-010 motion-value + spring foundation, retune to a
  larger single-axis rotateY (the hinge) toward the pointer, with the image zoom
  easing on the same enter so the two read as one motion. Pointer-fine +
  motion-allowed only; coarse/reduced-motion get a static card + plain zoom.
- Contact page (11-content-strategy §4, 12-ui-element-map §3 `/contact`): inquiry
  form (name, email, message, optional project-type select) + a confirmation state
  + a contact-details block (social links; no LinkedIn per §7). Form uses the
  existing shadcn-derived `Input`/`Textarea`/`Label` primitives; the submit uses
  the magnetic CTA. Client-side validation; POST to `/api/contact`; clear state per
  outcome (idle / submitting / success / unavailable, since the route returns 501).
- Copy is neutral and functional, passes stop-slop (no em-dashes, no banned verbs).

## Task map
| Task | Purpose | Risk | Required proof |
|---|---|---|---|
| [TASK-047](../../backlog/tasks/TASK-047.md) | Featured-work card door-tilt + zoom hover | medium | lint + typecheck + build |
| [TASK-048](../../backlog/tasks/TASK-048.md) | Contact page: form + confirmation + details | medium | lint + typecheck + build + slop |

## Gates
- [x] Spine references valid (10-design-system §6 motion, §7 #3/#4; 11-content-strategy §4 `/contact`, §7 socials; 12-ui-element-map §3 `/contact`, §1 primitives).
- [x] Skills selected (design lane; framer-motion for the card springs).
- [x] Test plan: lint/typecheck/build + in-browser card hover + form state check.
- [x] Protected paths declared (none).
