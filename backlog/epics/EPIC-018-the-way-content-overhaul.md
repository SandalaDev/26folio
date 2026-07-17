---
id: EPIC-018
title: The Way I Am — real imagery, wishlists, Spotify 10s playlist
status: in-progress   # ready -> in-progress -> done
phase: 5
priority: P1
risk_level: medium
roadmap_ref: 09-roadmap.md
depends_on: [EPIC-016]
blocks: []
references:
  - 10-design-system.md
  - 11-content-strategy.md
  - 12-ui-element-map.md
related:
  - EPIC-016-the-way-i-am-page.md
---

# EPIC-018 — "The Way I Am" content overhaul

Owner brief (2026-07-17, root `prompt.md`, clarified in chat): the page built
in EPIC-016 gets its real imagery and a content restructure. Eight items:

1. **Album wall artwork** — use `public/images/about/albums/`; the folder
   defines the list (owner confirmed): every cover becomes a tile, albums
   without a cover are dropped.
2. **Hero blob portrait** — move the hero blob to the center of the page and
   embed `public/images/abe2.jpg` in it (blob-masked portrait).
3. **Bookshelf redesign** — real covers from `public/images/about/books/`;
   redesign around cover imagery; on hover show a "why I like it" summary;
   an appropriate tap behavior on mobile; smooth motion both ways.
4. **Spotify 10s playlist** — replace Favorite Artists with the owner's
   "10s" playlist (songs he rates 10/10 and plays frequently) via the
   Spotify Web API; clever + interactive. Owner supplies client creds in
   `.env.local` and the playlist URL (confirmed in chat).
5. **Remove** the "Recently listening" and "In the studio" cards.
6. **Creative practice → Creative Pursuits**, adding Music Production.
7. **Collections → wishlists** — intro paragraph plus five sub-collections
   with brief descriptions: audiophile gear, dream home music studio build,
   planned video equipment, watch wishlist, and nostalgic/want-to-try
   colognes. Hover text per item: watches = why he likes it, audio/video
   gear = what the piece is for, colognes = why he wants it. Images in
   `public/images/about/wishlist/`. Personal-voice copy is drafted by the
   agent for owner review (owner confirmed).
8. **Remove the Hobbies section** entirely.

## Non-goals

- No changes to /about itself beyond what nav integrity requires.
- No new design tokens; hard corners, warm espresso palette, existing motion
  vocabulary (transform/opacity, EASE_OUT, reduced-motion gates) stay law.
- No secrets in the repo: Spotify creds live in `.env.local` only; the repo
  carries env names in `env.example` and a committed data snapshot fallback.

## Slices & tasks

### SLICE-1 — the whole brief (one page, one slice)
| Task | Title | risk | proof |
|---|---|---|---|
| **TASK-068** | Page recomposition: hero blob portrait, hobbies removed, music cards removed, Creative Pursuits, nav/TOC updates, image assets committed | medium | lint + typecheck + build + slop + in-browser |
| **TASK-069** | Imagery galleries: album wall from the folder, bookshelf rebuilt around covers with hover/tap summaries | medium | same |
| **TASK-070** | Wishlist section: five image-backed wishlists with intro, descriptions and per-item hover copy (drafts for owner review) | medium | same |
| **TASK-071** | Spotify 10s playlist section replacing Favorite Artists (Web API, build-time fetch, snapshot fallback, interactive presentation) | medium | same |

## Definition of done

- [ ] Album wall renders real artwork for every cover in the folder; no
      coverless albums remain.
- [ ] Hero blob sits centered with abe2.jpg masked inside it.
- [ ] Bookshelf uses real covers; hover (desktop) and tap (mobile) reveal
      the takeaway with smooth motion.
- [ ] Favorite Artists replaced by the interactive 10s playlist section;
      graceful fallback when env/creds are absent.
- [ ] Recently listening + In the studio cards gone; Hobbies section gone;
      TOC/anchors consistent.
- [ ] Creative Pursuits (renamed) includes Music Production.
- [ ] Wishlist section: intro + five described wishlists, imagery, hover
      copy per item (personal-voice lines flagged for owner review).
- [ ] lint / typecheck / build green; slop >= 35/50 on changed src files;
      in-browser verification at desktop and mobile widths.
