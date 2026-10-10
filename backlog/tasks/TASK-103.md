---
id: TASK-103
title: "Card hover video previews (HoverVideo) — owner input required"
status: superseded
priority: P2
risk_level: medium
epic_ref: backlog/epics/EPIC-026.md
progress_weight: 1
files_allowed:
  - src/components/motion/hover-video.tsx
  - src/components/home/work-card.tsx
  - src/lib/projects.ts
  - public/video/projects/
skill_refs: [framer-motion]
---

# Task: Card hover video previews (HoverVideo) — owner input required

## Scope

Give each `/work` card a moving preview on hover. The owner asked for this and
expected to be consulted, so this task is scaffolded and **blocked on one
decision** rather than started.

The pattern is already in the design system, unbuilt: `10-design-system.md` §7 #8
lists "Video-on-hover on cards → `HoverVideo`" traced to ramotion.com, and
`12-ui-element-map.md` §3 `/work` already says "optional `HoverVideo` (§7 #8)
**where a clip exists**". So the vocabulary anticipated this. Nothing has been
built and no clip exists.

## The decision the owner needs to make

These are four static design and branding projects. There is no screen recording
or motion work to show — which means "video preview" has to be *made*, and there
are three genuinely different ways to make it.

### Option A — an asset reel, no video files (recommended)

On hover, the card cross-fades or slides through three or four of that project's
own artefacts: signage, then bag, then poster. Built with `framer-motion`, which is
already a dependency.

- No video files, no encoding, no `ffmpeg`, nothing new to host.
- Reuses the optimized images `TASK-093` already commits, so the added payload is
  close to zero — and only on hover, so nothing costs the initial load.
- Trivially reduced-motion safe: show the static cover instead.
- Never goes stale — it is generated from the composition, so a project that gains
  an artefact gains it in the reel automatically.
- The honest limit: it is a slideshow, not motion design. If the goal is for the
  cards to feel like a motion-design showreel, this will not deliver that.

### Option B — the owner supplies finished clips

Short silent loops (roughly 2–4 seconds), recorded and edited outside this repo,
supplied as `webm` plus `mp4` at a card-sized resolution.

- Full creative control, and genuinely capable of feeling like a reel.
- **`ffmpeg` is not installed here**, so encoding cannot happen in this repo. The
  clips must arrive already encoded in both formats, already sized, already
  compressed.
- Real cost to watch: four clips at even 500KB each is 2MB of media on a page whose
  whole point includes demonstrating performance (`GOAL-004`). Needs `preload="none"`,
  hover-triggered loading, and a poster frame.
- Ongoing cost: a new project means a new clip, by hand, forever.

### Option C — generate clips from the assets

Programmatically animate each project's artefacts into a real video file.

- Requires `ffmpeg` (not installed) or an encoding package (needs a dependency
  plan under `AGENTS.md` before install).
- Produces the payload cost of Option B and the creative ceiling of Option A.
- Recorded for completeness; hard to recommend over Option A.

**Recommendation: Option A.** It gets movement onto the cards at effectively no
performance or maintenance cost, using assets that already exist, and it is
reversible — if the owner later supplies real clips, `HoverVideo` can take a clip
when one exists and fall back to the reel when it does not, which is exactly what
the UI element map's "where a clip exists" wording already allows.

## Scope once decided

- Build `HoverVideo` in `src/components/motion/hover-video.tsx`.
- Wire it into `WorkCard` alongside the existing `useDoorTilt` treatment without
  disturbing it.
- Add whatever field the chosen option needs to `Project` (`reel` asset list, or
  `clip` sources).

Non-negotiable regardless of option:

- **Pointer-fine only.** Hover previews do not exist on touch; touch users get the
  static cover. `use-pointer.ts` already provides this gating and the site already
  applies it to the custom cursor and flashlight.
- **`prefers-reduced-motion` disables the preview entirely**, not merely slows it.
- **Nothing autoplays with sound.** Ever. Clips are silent and muted.
- **No layout shift** when the preview starts or stops.
- **The card stays a link.** Keyboard users tab to it and activate it; the preview
  is decorative enhancement and must never be the only way to understand the card.

## Acceptance Criteria

Written against the chosen option; these hold for all three:

- [ ] The owner has chosen an option and it is recorded in the Notes below.
- [ ] Previews appear on hover with a fine pointer only, on all four cards.
- [ ] `prefers-reduced-motion: reduce` disables previews completely.
- [ ] Touch devices show the static cover with no wasted download.
- [ ] No cumulative layout shift when a preview starts or ends.
- [ ] Cards remain fully keyboard-operable links, with the focus ring intact.
- [ ] Nothing produces sound.
- [ ] The initial page load of `/work` is not measurably heavier than before —
      measured in the network panel, before and after.
- [ ] `npm run typecheck` and `npm run lint` pass clean.

## Dependency Evidence

- plan: none for Option A (`framer-motion@12` is already present).

Option B needs no package either, but does need the owner to supply pre-encoded
`webm` and `mp4` because `ffmpeg` is not installed in this environment. Option C
needs an encoding dependency and therefore
`bash scripts/os.sh deps plan add ...` plus `opensrc-research` and human approval
**before** anything is installed.

## Testing

- recommendation: with-task
- rationale: Every genuine risk here is behavioural and environment-dependent
  rather than logical: a preview that fires on touch, one that ignores
  reduced-motion, one that shifts layout when it starts, or one that quietly adds
  megabytes to the initial load of the page meant to demonstrate performance. None
  is visible in source and all four are directly observable in the browser with
  pointer emulation, the reduced-motion setting, and the network panel — which is
  why they are acceptance criteria here. `TASK-105` re-measures the payload as part
  of the epic-wide performance budget.

## Notes

**Blocked.** Do not start until the owner picks an option; record the choice here
with the date.

If Option B is chosen, the clips are the long-lead item — ask for them early, and
specify format, resolution, duration, and target file size in the request rather
than accepting whatever arrives.

## Superseded by EPIC-029 (2026-10-09)

EPIC-029 replaces EPIC-026. Work built for this task on the unmerged local
branch `feature/EPIC-026` is salvaged by TASK-130; what remains is re-planned
in EPIC-029.
