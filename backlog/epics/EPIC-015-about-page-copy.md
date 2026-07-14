---
id: EPIC-015
title: About page copy — editorial pass on the about-page prose
status: ready          # ready -> in-progress -> done
phase: 5
priority: P1
risk_level: low
roadmap_ref: 09-roadmap.md
depends_on: [EPIC-014]
blocks: []
references:
  - 11-content-strategy.md
  - 12-ui-element-map.md
related:
  - EPIC-014-about-page-content.md
---

# EPIC-015 — About page copy & timeline redesign

A copy and structure pass over the about page. EPIC-014 filled in the page's
real content structure; this epic (a) applies the owner's canonical biography
(`planning/content/page-copy/About.md`) to the intro, bio modal and sticky
cards, and (b) redesigns the timeline against the owner's epoch-timeline
prototype (2026-07-10) so it faithfully mirrors the biography instead of
flattening the career into one lane per employer.

## Non-goals

- No new design tokens; the redesign reuses the caramel/peach/rose epoch
  coding and existing motion primitives.
- No schema/auth/billing/infra changes.

## Slices & tasks

### SLICE-1 — Timeline redesign (done, pending owner review)
| Task | Title | risk | proof |
|---|---|---|---|
| **TASK-061** | Timeline restructured to mirror the biography: 8 beats across the three epochs per the owner's period table (Foundation x2, Convergence x4 with the explicit telecom/design duality preserved, Awakening x2); epoch header cards (padded, bordered, sticky) show the epoch numeral small, the name large and bold, a "Circa 20xx - 20xx" light-weight timestamp, and the epigraph; learning split into Technical/Human pill rows; the Convergence tool odyssey chain (Muse -> WordPress -> Webflow -> Elementor -> code itself); dashed "Epoch IV" closing teaser with blinking caret. Foundation accent moved caramel -> amber (owner tweak: caramel was indistinguishable from peach); EpochNav updated to match. | medium | lint + typecheck + build + slop + in-browser |
| **TASK-062** | New `EpochIconCycler`: each epoch header card cycles the era's most significant tools one icon at a time (crossfade, tab-hidden aware, reduced-motion static); owner's monochrome brand SVGs in `public/icons/` tinted to the epoch accent via CSS mask, Phosphor stand-ins where no brand mark exists yet (missing-icon list tracked below). The "Disciplines, accumulated" chart was built and then cut on owner review. | low | same |
| **TASK-063** | `SocialLinks` renders the owner's social marks (`public/icons/social/` + gitHub.svg) as mask-tinted icon squares; profile URLs still placeholder. | low | same |

### Missing brand icons (owner to supply in `public/icons/`, then swap the Phosphor stand-ins)
- Foundation: Macromedia Fireworks (currently PenNib stand-in)
- Convergence: Adobe Muse, WordPress, Webflow, Elementor (currently a generic Globe stand-in for "WordPress & Elementor")
- Awakening: an AI mark (Claude/Anthropic or generic, currently Sparkle stand-in)

### SLICE-3 — Owner copy edits round 1 (done)
| Change | proof |
|---|---|
| Timeline intro paragraph rewritten to the owner's "I think of my career in three distinct epochs..." version | lint + typecheck + build + slop + in-browser |
| `AboutIntro` subhead gains a name/location line: "I'm Abraham Sandala, a self-taught software engineer and designer based in Lusaka, Zambia." | same |
| Epoch icon cyclers restricted to software/design tooling with a direct line to today's skillset; telecom hardware and domain knowledge (GSM, microwave, 48V DC, solar) dropped from the cycler. Foundation: Windows & PC hardware, Fireworks MX. Convergence: Photoshop, Illustrator, InDesign, WordPress & Elementor. Awakening: unchanged. | same |

### SLICE-4 — Owner review round 2: narrative over inventory (done)
| Change | proof |
|---|---|
| Social icons moved into the about page's sticky column, directly under the EpochNav epoch indicators, so they pin with the column and stay visible without scrolling; the standalone bottom social section removed. | lint + typecheck + build + slop + in-browser |
| Timeline hairline made continuous: one shared rail spans all three epochs (no breaks between sections); the per-epoch color fills draw over it on scroll as before. | same |
| Beat cards restructured per external design feedback the owner endorsed: the false "Technical"/"Human" categorization removed; each card now carries a one-line accent-colored takeaway (why the period matters) plus a single "What stayed with me" list of capabilities kept, replacing the tool-inventory chips (tools live in the epoch cycler and the odyssey chain). | same |
| Feedback consciously not adopted: capability ribbons/bars (a re-skin of the cut accumulation chart) and per-epoch artifact icon changes (cyclers already cover it). | n/a |

### SLICE-2 — Page copy (in progress, working tree)
Intro rewrite ("Engineer. Designer. Builder."), bio modal aligned to the
canonical About.md, sticky-card horizontal split. Carried in the working tree
from the owner's session; to be finalized under this epic.

## Definition of done

- [ ] Timeline mirrors the biography's period table, duality intact.
- [ ] Circa timestamps, cycling tool icons, accumulation chart shipped.
- [ ] lint / typecheck / build green; slop >= 35/50 on all public-text files;
      in-browser verification on desktop and mobile.
- [ ] Owner confirms the copy set (intro, bio modal, timeline strings).
