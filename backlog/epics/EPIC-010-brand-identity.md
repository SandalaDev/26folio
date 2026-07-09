---
id: EPIC-010
title: Brand identity overhaul — blobs, typography, layout, hero portrait, card redesigns
status: in-progress      # ready -> in-progress -> done
phase: 4
priority: P1
risk_level: medium
roadmap_ref: 09-roadmap.md
depends_on: [EPIC-002, EPIC-003, EPIC-009]
blocks: []
references:
  - 10-design-system.md
  - 11-content-strategy.md
  - 12-ui-element-map.md
related:
  - 09-roadmap.md
---

# EPIC-010 — Brand identity overhaul

> Owner-directed redesign wave (2026-07-02 brief, 7 items): blob shapes join the
> design system as the vitiligo brand motif; typography gets a real overhaul
> (install the never-shipped font binaries + heavy/light weight contrast, no
> all-caps); layout drops the global max-width; the header goes transparent;
> the hero gains a small blob-masked portrait and an asymmetric composition;
> featured work becomes large image cards (real projects) with baunfire
> zoom + tilt; the what-I-do rail grows to five richer cards with icons and
> anchored capability links; plain sections get blob/mesh/masonry backgrounds.

## Goal & non-goals

**Goal:** make the site read as *this* brand: the two-tones-on-one-surface idea
(§1) now expressed through organic blob shapes layered over the angular system,
distinctive self-hosted type with real weight contrast, full-viewport layout,
and image-led cards for real work.

**Non-goals:**
- No new pages, routes, or copy strategy changes; drafted copy (projects,
  services) is neutral and flagged for owner confirmation, never invented claims.
- The base `Button`, shader hero background, cursor, and magnetic CTA from
  EPIC-009 are untouched.
- `measure` (70ch prose readability) stays; only *layout* max-widths go.
- Blobs are decorative masks/washes only; UI chrome keeps hard 90° corners (§3).

## Key decisions

1. **Blob motif is decorative, never structural.** Organic border-radius masks +
   a few SVG paths, warm tokens only, low opacity, aria-hidden, never behind
   long-form text. The `Blob` component accepts custom SVG paths so the owner's
   own shapes can drop in later. Documented in 10-design-system.md (owner-
   authorized spine edit).
2. **Typography fix starts with binaries.** globals.css always declared
   Clash Display / General Sans / JetBrains Mono but the woff2 files were never
   shipped; the whole site rendered in system fallback. This epic installs the
   variable binaries (Fontshare + fontsource) and then exploits 200–700 weight
   range: heavy display against light subheads.
3. **All-caps dies in one place.** The `eyebrow` utility owns every uppercase
   instance; it is restyled (normal case) and eyebrow *usage* is thinned per the
   design lane's restraint rule (max 1 per 3 sections).
4. **Max-width dies in two places.** `Section` and the header container held the
   global `max-w-7xl`; both go, replaced by a scaling padding rhythm.
5. **Icons: Phosphor** (`@phosphor-icons/react`) — the design lane's allowed
   library; lucide is discouraged there. One family, one strokeWidth.
6. **Services get one source of truth.** `src/lib/services.ts` dedupes the
   rail/tabs duplication and adds the two new services (mobile money & online
   payments; e-commerce) with real `id=` anchors on the capabilities page.

## Slices & tasks

### SLICE-1 — Global foundations
| Task | Title | risk | proof |
|---|---|---|---|
| **TASK-038** | Typography (binaries + weight contrast + de-caps), layout width, transparent header, heading sweep. | medium | lint + typecheck + build |
| **TASK-039** | Blob motif + background system (Blob/MeshBg/MasonryPattern) applied to plain sections; spine §update. | medium | lint + typecheck + build |

### SLICE-2 — Hero
| Task | Title | risk | proof |
|---|---|---|---|
| **TASK-040** | Blob-masked portrait (small, third in hierarchy) + asymmetric hero recomposition. | medium | lint + typecheck + build |

### SLICE-3 — Cards
| Task | Title | risk | proof |
|---|---|---|---|
| **TASK-041** | Featured work: real projects (Provision Finance, OK Pharmacy) as large image cards with zoom + angular tilt. **public_text** | medium | lint + typecheck + build + slop |
| **TASK-042** | What-I-do rail: 5 enlarged icon cards + services lib + anchored capabilities sections. **public_text** | medium | lint + typecheck + build + slop |

## Definition of done

- [ ] Font binaries live in `public/fonts/`; display/body render Clash Display /
      General Sans with visible heavy/light contrast; no `text-transform:
      uppercase` renders anywhere.
- [ ] `Section` and header span the viewport (padding rhythm, no `max-w-7xl`);
      header is transparent (logo + nav text only).
- [ ] Blob motif in the design system doc + `Blob`/`MeshBg`/`MasonryPattern`
      components applied to the flagged plain sections, all decorative and
      reduced-motion safe.
- [ ] Hero: portrait blob-masked, small, visually third; layout asymmetric; copy
      unchanged.
- [ ] Featured work: two real projects with background images, smooth zoom +
      pointer tilt (pointer-fine, reduced-motion safe); drafted copy flagged.
- [ ] Rail: five cards with Phosphor icons, backgrounds, focus emphasis, links
      landing on real anchors at `/capabilities#<id>`.
- [ ] lint / typecheck / build green; slop artifacts present and ≥ 35/50 for the
      two public-text tasks; in-browser verification done.
