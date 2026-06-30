---
id: EPIC-006
title: Capabilities page — services, technologies, engagement process, CTA
status: ready            # ready -> in-progress -> done
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
  - 06-project-technical-plan.md
related:
  - 09-roadmap.md
---

# EPIC-006 — Capabilities page

> Build `/capabilities` per [11-content-strategy.md](../../project-spine/11-content-strategy.md)
> §4 `/capabilities` and [12-ui-element-map.md](../../project-spine/12-ui-element-map.md) §3
> `/capabilities`. The roadmap labels this "Services page"; the content strategy and
> UI map are canonical on the **Capabilities** route/label (already flagged for spine
> reconciliation in EPIC-002/003's notes — not re-litigated here, just followed).
> Three sections share **one headless primitive**, `useTabbedContent`
> (ui-element-map §6 decision #4: build it before the two tab-skinned sections so
> they don't fork into two implementations).

## Pre-existing — already DONE (do not re-derive)

Unlike EPIC-004's About page, **most of this page's content is already decided in
the approved spine**, not invented here:
- **Services list** (web development, custom software, AI integration + their
  sub-bullets) — [11-content-strategy.md](../../project-spine/11-content-strategy.md) §4
  `/capabilities` point 1, verbatim source for `ServiceTabs`.
- **Engagement process stages** (inquiry → signed contract + down payment →
  delivery → handover) — [12-ui-element-map.md](../../project-spine/12-ui-element-map.md)
  §3 `/capabilities` #3, verbatim source for `ProcessSteps`.
- **Real tech stack** — [06-project-technical-plan.md](../../project-spine/06-project-technical-plan.md)
  §2 lists the actual stack this site is built with (Next.js 15, TypeScript,
  Tailwind v4, Framer Motion, GSAP, Resend, Node.js, Dokploy). `TechGrid` seeds from
  this real, verifiable list rather than inventing one — see Key decisions #1.

**What's still genuinely unconfirmed:** the *hover copy* per technology ("what Abe
uses it for") is content-inventory "to create" per §5, so each entry's blurb is a
reasonable, accurate description of that tool's actual role in this stack — not a
personal claim about Abe's broader practice beyond what's documented.

## Goal & non-goals

**Goal:** `/capabilities` renders: a `ServiceTabs` section (the three service areas,
vertical tab → content-card swap, addepto.com-style), a Technologies section (intro
+ `TechGrid` with hover detail), a `ProcessSteps` section (the four engagement
stages), and a CTA band ("Request a proposal & quote" → `/contact`). Both tab
sections share `useTabbedContent`.

**Non-goals:**
- Real company logos for tools — `TechGrid` uses text/wordmark-style badges, not
  fetched brand icon assets (no asset pipeline exists yet for that).
- A second motion library for the grid's timed swap — Framer only (one tab/swap
  job, no GSAP needed here; GSAP stays reserved for true scroll-driven sequences
  per architecture principle #4, and this grid's swap is timer-driven, not
  scroll-driven).
- `/contact` form logic → EPIC-008.

## Architecture constraints this epic must honour

From [07-architecture-principles.md](../../project-spine/07-architecture-principles.md):
- **Composition over duplication** (§6): `useTabbedContent` is the single headless
  tab primitive; `ServiceTabs` and `ProcessSteps` are skins over it, not forked
  copies (ui-element-map §6 decision #4).
- **Accessibility** (§10): both tab UIs use real `role="tablist"/"tab"/"tabpanel"`
  semantics with arrow-key navigation and `aria-selected`, not div-soup; `TechGrid`'s
  hover detail (shadcn `HoverCard`) doesn't replace a focusable, keyboard-reachable
  disclosure for the same info.
- **One job per library** (§4): Framer for tab cross-fade, hover card, and the
  tech grid's timed swap — no GSAP in this epic.

## Slices & tasks

### SLICE-1 — Headless tab primitive
| Task | Title | files_allowed (scope) | risk | proof |
|---|---|---|---|---|
| **TASK-027** | `useTabbedContent`: headless hook managing active index + `role="tablist"`/`"tab"`/`"tabpanel"` id wiring + arrow-key navigation (`ArrowLeft`/`ArrowRight` or `Up`/`Down` depending on orientation). No visual opinion — `ServiceTabs`/`ProcessSteps` supply their own skin. | `src/lib/use-tabbed-content.ts` | low | lint + typecheck |

### SLICE-2 — Services
| Task | Title | files_allowed (scope) | risk | proof |
|---|---|---|---|---|
| **TASK-028** | `ServiceTabs` (skin of `useTabbedContent`, vertical topic tabs → content-card swap, addepto.com reference): the three services verbatim from the content outline (Web development, Custom software, AI integration + sub-bullets), Framer cross-fade on tab change. | `src/components/capabilities/service-tabs.tsx` | low | lint + typecheck |

### SLICE-3 — Technologies
| Task | Title | files_allowed (scope) | risk | proof |
|---|---|---|---|---|
| **TASK-029** | Vendor shadcn `HoverCard`. Technologies intro copy (skillset/tooling philosophy). `TechGrid` + `LogoHoverCard`: fixed grid (does not scroll) of the real stack (06-project-technical-plan.md), a visible subset animates/swaps every few seconds (Framer), hover/focus reveals the tech name + its real role in this stack via `HoverCard`. | `src/components/capabilities/technologies-section.tsx`, `src/components/capabilities/tech-grid.tsx`, `src/components/ui/hover-card.tsx`, `package.json`, `package-lock.json` | medium | lint + typecheck (+ build smoke) |

### SLICE-4 — How I work
| Task | Title | files_allowed (scope) | risk | proof |
|---|---|---|---|---|
| **TASK-030** | `ProcessSteps` (skin of `useTabbedContent`, addepto.com/ai-integration-services/ reference): the four engagement stages already decided in the UI map, Framer step-content swap. | `src/components/capabilities/process-steps.tsx` | low | lint + typecheck |

### SLICE-5 — Page assembly
| Task | Title | files_allowed (scope) | risk | proof |
|---|---|---|---|---|
| **TASK-031** | Assemble `/capabilities`: `ServiceTabs` → Technologies (`TechGrid`) → `ProcessSteps` → `CTACallout` ("Request a proposal & quote" → `/contact`). `force-static` preserved. | `src/app/(site)/capabilities/page.tsx` | low | lint + typecheck (+ build smoke) |

## Key decisions & risks

1. **`TechGrid` seeds from the real, documented tech stack**, not invented tools —
   the one place this epic can responsibly use "real content" for a to-create item,
   because the stack is independently verifiable in
   [06-project-technical-plan.md](../../project-spine/06-project-technical-plan.md).
   Flagged in STATE.json as a starting list for Abe to confirm/expand, not assumed
   exhaustive.
2. **One primitive, two skins** (ui-element-map §6 decision #4) — built in dependency
   order (TASK-027 before 028/030) specifically to avoid the fork the map warns
   against.
3. **No GSAP in this epic.** The tech grid's "animate a new set in every few
   seconds" is timer-driven, not scroll-driven — Framer's `AnimatePresence` is the
   correct tool per architecture principle #4, not a ScrollTrigger misuse.

## Definition of done (epic)

- [ ] `/capabilities` renders `ServiceTabs` → Technologies/`TechGrid` →
      `ProcessSteps` → CTA band, fully `force-static`.
- [ ] Both tab UIs are real ARIA tabs (`tablist`/`tab`/`tabpanel`, arrow-key nav,
      `aria-selected`), built on the shared `useTabbedContent`, not two forks.
- [ ] `TechGrid` entries are the real, documented stack; hover/focus reveals
      accurate (not invented) usage detail.
- [ ] `npm run build` green and static; `npm run lint` + `npm run typecheck` pass.
- [ ] EPIC-003's Capability Rail anchors (`/capabilities#web-development` etc.) now
      resolve to a real page instead of 404ing.
