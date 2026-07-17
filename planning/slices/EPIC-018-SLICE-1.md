# EPIC-018 SLICE-1 — real imagery, wishlists, Spotify

Owner brief 2026-07-17 (root `prompt.md` + chat clarifications). The museum
walk from EPIC-016 keeps its bones; the exhibits get real artifacts. Design
system locked: warm espresso dark, rose primary with caramel/peach/amber
support, Clash Display display type, hard corners, blob motif for masks.

## Design read

The page graduates from typographic stand-ins to a real collection: photos
of records, books, watches, gear. One line: **the museum gets its objects.**
Imagery must sit inside the existing editorial calm; grids stay hard-edged,
washes stay quiet, hover reveals carry the personal voice.

1. **Hero** — the rose blob wash moves from the right edge to the page
   center and becomes a mask for `abe2.jpg` (same technique as the home
   hero's blob portrait). Type stays dominant; the portrait is an artifact,
   not a header image.
2. **Music** — "Recently listening" and "In the studio" cards deleted.
   The desert-island wall renders real sleeves from
   `public/images/about/albums/` (the folder IS the list, ~53 covers);
   tiles keep the hard-cornered grid, artwork replaces the palette washes,
   title/artist move to an overlay or caption treatment.
3. **10s playlist** — replaces Favorite Artists. Spotify Web API
   (client-credentials, public playlist), fetched server-side at build in
   the page's server component, mirroring `magazine.ts`'s graceful-fallback
   pattern; a committed JSON snapshot renders when env is absent so the
   static build never breaks. Interactive concept: the playlist as a
   listening constellation the visitor can explore (sort/scrub by era,
   tempo of rotation, links out to Spotify per track). Exact interaction
   chosen at implementation inside the motion contract.
4. **Creative Pursuits** — renamed from Creative Practice; Music Production
   joins the display-word line.
5. **Hobbies** — section deleted; TOC, anchors and pager stay consistent.
6. **Wishlists** — Collections rebuilt: intro paragraph, then five
   image-backed sub-collections from `public/images/about/wishlist/`:
   audiophile gear, dream home music studio build, planned video equipment,
   watch wishlist, nostalgic/want-to-try colognes. Each gets a one-line
   description. Per-item hover reveals: watches = why he likes it,
   audio/video gear = what it is for, colognes = why he wants it.
   Personal-voice lines are agent drafts flagged for owner review.
7. **Bookshelf** — rebuilt around real covers from
   `public/images/about/books/`. Cover-forward layout; hover reveals the
   "why I like it" takeaway on desktop; mobile uses tap-to-reveal
   (aria-expanded, one open at a time). Smooth height/opacity motion,
   reduced-motion collapses to instant swap.

## Navigation & motion contract

- WAY_SECTIONS updates: hobbies removed, practice relabeled, music intact,
  playlist either inside Music or its own anchor (implementation call).
- All motion transform/opacity on EASE_OUT from `src/lib/motion`, gated by
  `useReducedMotion` / motion-reduce. Hover reveals must also work with
  keyboard focus.
- Images via `next/image` with explicit sizes; no layout shift on the wall.

## Spotify contract (TASK-071)

- Env (names only; values live in `.env.local` / prod env):
  `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_PLAYLIST_ID`.
- Client-credentials token -> `GET /v1/playlists/{id}` (+ paged tracks).
  Public playlist required. No secrets committed, ever.
- Snapshot fallback: `src/lib/spotify-snapshot.json` (or placeholder module
  mirroring `magazine-placeholder.ts`) committed so builds without env
  render the section from the last known data; empty snapshot renders an
  honest "playlist loading soon" state, never a fake.
- Owner still owes: playlist URL + creds in `.env.local`.

## Files

- `src/app/(site)/about/the-way-i-am/page.tsx`
- `src/lib/the-way.ts`, `src/lib/spotify.ts` (+ snapshot), `src/lib/env.ts`
- `src/components/the-way/*` (hero, music hall, playlist, wishlists,
  bookshelf, practice line, nav; hobbies-wall deleted)
- `env.example`, `public/images/abe2.jpg`, `public/images/about/**`
