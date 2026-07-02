---
id: EPIC-010-SLICE-3
title: Cards — featured work image cards + five-service rail with anchors
epic: EPIC-010
status: ready
phase: 4
risk_level: medium
design_refs: [10-design-system.md, 11-content-strategy.md, 12-ui-element-map.md]
skill_refs: [design-taste-frontend, framer-motion, gsap, stop-slop]
tasks: [TASK-041, TASK-042]
---

# SLICE-3 — Cards

> The two image-led card systems: featured work becomes large media cards for the
> first two real projects (Provision Finance, OK Pharmacy) with the baunfire
> zoom + angular-tilt hover; the what-I-do rail grows to five bigger cards with
> Phosphor icons, backgrounds, and links that land on real anchors on the
> capabilities page.

## Intent
Replace fictional text cards with real, visual work; make the service story
complete (five services incl. mobile money & online payments, e-commerce).

## Scope / Non-goals
- **In:** `projects.ts` (2 real entries + `image` field), `work-card.tsx`
  rewrite (image bg, zoom, tilt), `featured-work.tsx` layout;
  `src/lib/services.ts` (new, single source), `capability-rail.tsx` (5 cards,
  icons, focus emphasis, backgrounds), `service-tabs.tsx` (consume lib, real
  anchors, 2 new services); `@phosphor-icons/react`.
- **Out:** `/work` page redesign (cards there inherit WorkCard improvements but
  the grid/detail pages are untouched); real case-study copy (owner supplies).

## Content and design
**public_text: true on both tasks** — drafted descriptors and service copy are
neutral (no invented outcomes/metrics), flagged in STATE for owner confirmation,
em-dash-free, and pass the recomputed stop-slop gate (≥35/50). Tilt/zoom are
pointer-fine + reduced-motion safe (Framer motion values, no useState tracking).
Image text overlays sit on a warm scrim for AA contrast.

## Task map
| Task | Purpose | Risk | Required proof |
|---|---|---|---|
| [TASK-041](../../backlog/tasks/TASK-041.md) | Featured work image cards | medium | lint + typecheck + build + slop |
| [TASK-042](../../backlog/tasks/TASK-042.md) | Services lib + rail + anchors | medium | lint + typecheck + build + slop |

## Gates
- [x] Spine references valid.
- [x] Skills selected (design lane, framer-motion, gsap, stop-slop).
- [x] Test plan: lint/typecheck/build + slop artifacts + in-browser interaction checks.
- [x] Protected paths declared (none).
