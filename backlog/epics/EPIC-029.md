---
id: EPIC-029
title: "Work: content strategy, visual direction and asset plan for every project"
status: ready
priority: P1
roadmap_refs: [ROAD-004]
goal_refs: [GOAL-001, GOAL-002, GOAL-004]
progress_weight: 3
---
# Epic: Work: content strategy, visual direction and asset plan for every project

Opened by the owner in chat on 2026-10-09: start a new epic for `/work` and run
a full interview that shapes a cohesive content strategy, a visual direction
for each project, and the list of assets each project still needs.

The kickoff interview was confirmed in chat on 2026-10-09. The CLI
kickoff (`os interview start epic EPIC-029`) is unavailable for the same reason
recorded in EPIC-028: this project never imported its workflow-v2 discovery and
delivery interviews. The interview runs in chat and its confirmed answers are
recorded under "Kickoff decisions" below.

## Starting facts (researched, not asked)

- **Live `/work` on `dev` is still a placeholder.** `src/lib/projects.ts` holds
  Provision Finance and OK Pharmacy with draft copy, plus two fictional entries
  ("Project three", "Project four"). `CaseStudyDetail` renders a minimal page.
- **EPIC-026 was mostly built and never merged.** Local branch
  `feature/EPIC-026` (6 commits, last 2026-08-19, never pushed) holds TASK-093
  to TASK-101: normalized web assets for four projects under
  `public/images/projects/<slug>/`, the composition model, `ArtefactPlate`, the
  block vocabulary, the renderer and drafted copy. TASK-102 to TASK-105 are
  undone. The epic is still `ready` in state.
- **Owner originals** live in `public/projects/` (gitignored): OK Pharmacy 16
  files, Provision Finance 12, Gardenfare Foods 9, The Flavour Grills Cafe 6.
  The OK Pharmacy cover candidate `Gemini_Generated_Image_*.png` is
  AI-generated, which matters under the honesty rule.
- **Positioning gap.** The site sells engineering (payments, booking, Payload
  CMS, ZRA invoicing, AI, portals). All four projects on hand are brand and
  design work. GOAL-001 and GOAL-002 need evidence of engineering; none exists
  on `/work` today.
- **Standing rules that still bind** (EPIC-026 owner confirmations): no
  testimonials or metrics; self-initiated work is never presented as client
  work; pages use the site design system, layouts adapt to assets, never the
  project's palette; no fabricated mockups.

## Kickoff decisions

Answers given in chat on 2026-10-09. Read back in chat the same day; the owner
answered "Yes, matches".

1. **Page role: design and engineering together.** `/work` shows both crafts
   as one body of work, so it supports the engineering pitch as well as the
   design one.
2. **EPIC-026: salvage, re-decide.** Its processed assets and block renderer
   are raw material. This interview re-decides content and visuals. EPIC-026
   closes as superseded.
3. **Projects in scope: seven.** The four brand projects, Scrumtrulescent,
   sandala.dev, and Cloudege: a suite of about six SaaS products under one
   brand that the owner is building with a partner.
4. **Grid order: real work first.** Cloudege, Scrumtrulescent, sandala.dev,
   The Flavour Grills Cafe, then the three self-commissioned projects.
5. **Depth: short narrative.** About 150 to 300 words per page: the brief, the
   approach, what was made. The artefacts carry the rest.
6. **Cloudege: one entry, six sections.** One card; its page introduces the
   suite, then gives each product its own section.
7. **Cloudege disclosure: partner sign-off required.** Nothing about Cloudege
   ships without the partner's approval. The owner says the partner will sign
   off, so Cloudege launches with the other six. Sign-off gates release.
8. **Cloudege credit: co-founder, design and engineering.**
9. **Credit labels:** "Client" (Flavour Grills), "Own venture" (Cloudege,
   Scrumtrulescent, sandala.dev), "Self-commissioned" (OK Pharmacy, Provision
   Finance, Gardenfare Foods). The owner chose "self-commissioned".
10. **Engineering proof: real UI screens**, in the same plate treatment as the
    brand artwork. Architecture diagrams and a decisions list were offered and
    not chosen.
11. **Video previews on every card and every project hero.** Muted loops,
    paused for reduced motion, poster frame as fallback.
12. **Video production: mixed.** The owner records real flows for Cloudege,
    Scrumtrulescent and sandala.dev. The agent builds brand-project clips from
    existing stills after the owner approves an ffmpeg dependency plan.
13. **AI-generated imagery is allowed when no watermark is visible.** It is
    never used in place of the artwork itself.
14. **OK Pharmacy cover: the owner regenerates a clean scene.** The current
    Gemini scene has no watermark but garbles text and misdraws the OK mark,
    so it is not used.
15. **Flavour Grills: use the existing six files.** No new photos.
16. **No years** on cards or pages.
17. **Page ending: link to the capability the project evidences**, then
    "Start a project".
18. **Add a design capability.** `/capabilities` gains a brand and web design
    service so the four brand projects have a capability to link to. This
    widens the epic into `/capabilities` for that one addition only.

Carried forward from EPIC-026 and not reopened: no testimonials or metrics;
self-commissioned work never presented as client work; pages use the site
design system and layouts adapt to the assets, never the project's palette;
artwork sits on an `ArtefactPlate` made of site tokens; no fabricated mockups.

## Content strategy

`/work` is the evidence page for the whole pitch: one person who designs and
builds. The grid reads as a hierarchy of trust: shipped products you own, then
the client job, then self-commissioned brand work that shows range. Every card
answers three things: what it is, whose it was (the credit label), and which
crafts it shows (discipline tags). Every page answers: what was the brief,
what was made, and which service this proves.

Copy rules: plain description of what the artefacts show; no invented brief,
outcome or quote; self-commissioned projects say so in the first sentence of
the page as well as on the card; engineering pages name the stack in one line
and spend the words on what the product does for its users.

## Per-project plan

| # | Project | Credit | Visual direction (what carries the page) | Capability link |
|---|---|---|---|---|
| 1 | Cloudege | Own venture | Platform story. Suite intro, then six product sections, each one real screen plus a one-line purpose. Hero loop: a montage of product flows. | Chosen once the product list is known (likely portals or memberships) |
| 2 | Scrumtrulescent | Own venture | Editorial product. Reader side (home, article, mobile article) against editor side (Payload admin). Hero loop: reading an article, then publishing one. | `cms` |
| 3 | sandala.dev | Own venture | The site as its own exhibit, kept short: design system, motion, contact delivery. Hero loop: moving through the site. | `motion` proof area |
| 4 | The Flavour Grills Cafe | Client | The stationery flatlay gets a full block; posters; logo colourways. A short page by design. | Gap, see below |
| 5 | Provision Finance | Self-commissioned | Web design story: long homepage in the scroll frame, device row, brand board, pattern as texture. Hero loop: scrolling the homepage. | Gap |
| 6 | OK Pharmacy | Self-commissioned | Identity in the world: new cover scene, signage, bag, poster, social set, storefront screen. Hero loop: pan across scenes. | Gap |
| 7 | Gardenfare Foods | Self-commissioned | Product range: four SKUs as a set, lineup banner, logo sheet. Hero loop: the four packs in sequence. | Gap |

**Capability gap, resolved.** `/capabilities` had no branding or design
service. Decision 18 adds one, and the four "Gap" rows link to it.

## Asset plan

Already processed on `feature/EPIC-026` (salvage): web derivatives for the four
brand projects under `public/images/projects/<slug>/`.

| Project | Owner supplies | Agent produces |
|---|---|---|
| Cloudege | Product names, one-line purpose and status for each of the six; 1 or 2 real screens per product with demo data at 2x; Cloudege logo or wordmark; live URLs if public; card loop (5 to 8 s) and hero loop (10 to 15 s); partner sign-off on the page | Optimized derivatives, poster frames, page copy draft |
| Scrumtrulescent | Payload admin screens and a recorded flow (read, then publish) | Public screens captured from scrumtrulescent.com; derivatives; copy draft |
| sandala.dev | A recorded flow through the site | Screens captured from the site; copy draft |
| The Flavour Grills Cafe | Nothing new | Clips built from stills; copy reuse |
| Provision Finance | Nothing new | Scroll clip from the full-page homepage; copy reuse |
| OK Pharmacy | A regenerated cover scene with the mark and text rendered correctly, no visible watermark | Clips from stills; copy reuse |
| Gardenfare Foods | Nothing new | SKU sequence clip; copy reuse |

Video spec (all clips): H.264 MP4 plus WebM, muted, no audio track, 16:10 for
cards, about 1 MB per card clip and 3 MB per hero clip, with a poster frame.

## Scope

- Salvage the EPIC-026 build onto this branch and extend its model for the
  decisions above.
- Seven project pages and a seven-card grid, in the confirmed order.
- Video previews on every card and hero, with reduced-motion and poster
  fallbacks.
- One new brand and web design service on `/capabilities`.
- Copy drafts for owner approval; spine reconciliation; validation.

## Non-goals

- No CMS, database or admin. `projects.ts` stays static and typed.
- No testimonials, metrics, outcome claims or years.
- No fabricated mockups. The agent does not generate imagery; the regenerated
  OK Pharmacy cover is the owner's.
- No Cloudege content published without the partner's sign-off.
- No other change to `/capabilities`, `/`, `/about` or `/contact`. The home
  page's featured-work block must keep rendering.
- No new runtime dependency. ffmpeg is a local build tool for clips and still
  needs an approved dependency plan before install.

## Tasks

- [x] TASK-130: Salvage the EPIC-026 build onto this branch. (M, 2)
- [x] TASK-131: Extend the project model: credits, disciplines, capability link, video, product suite. (M, 2)
- [ ] TASK-132: Owner asset intake for Cloudege, Scrumtrulescent, sandala.dev and the OK cover. (S, 1) *blocked on owner*
- [x] TASK-133: Capture public screens of scrumtrulescent.com and sandala.dev. (S, 1) sandala.dev done; Scrumtrulescent moved to TASK-132 (site not live).
- [x] TASK-134: Dependency plan for ffmpeg as a local clip tool. (S, 1) Approved and installed 2026-10-09.
- [x] TASK-135: Build brand-project clips from stills. (M, 2)
- [x] TASK-136: Video preview component for cards and heroes. (M, 2)
- [ ] TASK-137: Scrumtrulescent and sandala.dev pages. (M, 2)
- [ ] TASK-138: Cloudege page and product-suite block. (M, 2) *blocked on TASK-132*
- [ ] TASK-139: Revise the four brand pages to the new rules. (S, 1)
- [x] TASK-140: Rebuild the `/work` grid for seven projects and retire placeholders. (M, 2)
- [ ] TASK-141: Add the brand and web design capability. (M, 2)
- [x] TASK-142: Reconcile the spine. (S, 1)
- [x] TASK-143: tests: validate the work section. (M, 2)

Order: 130, then 131. After 131, tasks 133, 134 and 136 can run side by side;
135 follows 134; 137, 139 and 141 follow 131; 140 follows 136; 138 starts when
132 lands; 142 and 143 come last.

## Estimate

```yaml
estimated_weight: 23
risk_flags: [new-external-dependency, needs-elicitation]
risk_multiplier: 1.5
target_end: null
```

Flags: ffmpeg is a new external tool, and four tasks wait on owner-supplied
assets and a partner sign-off. No delivery rate is recorded for this project
(the delivery interview was never imported), so no date is forecast.

## Testing

- recommendation: dedicated TASK-143
- rationale: The project has no application test suite. The real risks are
  visual and editorial: a renderer that drops a block type, video payload or
  autoplay that ignores reduced motion, illegible artwork on dark surfaces,
  missing alt text, a self-commissioned project reading as client work.
  TASK-143 checks those deliberately; each implementing task runs lint,
  typecheck and build.

## Dependency / Architecture Evidence

- plan: planning/dependencies/DEP-20261009-ffmpeg-local-tool.md (installed; local tool only, no `package.json` change)

## Progress (2026-10-10)

Done: TASK-130, 131, 133, 134, 135, 136, 140, 142, 143. `/work` now shows
sandala.dev, The Flavour Grills Cafe and the three self-commissioned projects,
with credits, preview loops and capability links; the spine matches.

Built, waiting on owner approval of copy (`planning/content/page-copy/Work.md`):
TASK-137 (sandala.dev half), TASK-139, TASK-141.

Waiting on owner assets (TASK-132): Cloudege (TASK-138), Scrumtrulescent
(TASK-137's other half; scrumtrulescent.com is not live), the sandala.dev
recording, the regenerated OK Pharmacy cover.

Open owner decisions: Flavour Grills' phone numbers on `poster-pastry` (on the
page and in its clips); whether the sandala.dev card should keep the home-page
screenshot until its recording arrives.

Filed outside the epic: every page's heading is invisible under reduced motion
(a site-wide hydration defect in 22 components); the home page's four "What I
do" links point at anchors `/capabilities` does not have.
