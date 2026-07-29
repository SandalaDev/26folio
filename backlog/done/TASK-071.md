---
id: TASK-071
title: "Spotify 10s playlist section replaces Favorite Artists (Web API, build-time fetch, snapshot fallback)"
status: done
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-018
epic_ref: backlog/epics/EPIC-018-the-way-content-overhaul.md
slice: EPIC-018-SLICE-1
depends_on: [TASK-068]
design_refs: [10-design-system.md, 12-ui-element-map.md]
skill_refs: [design-taste-frontend, framer-motion, stop-slop]

verification_required:
  lint: true
  typecheck: true
  unit: false
  integration: false
  e2e: false
  accessibility: false

public_text: true
handoff_required: false
handoff_type: []
handoff_file: ""
review_waiver: "Solo dev (reviewer: human). Cross-model review reassigned to the human at the PR into dev, per OS degraded mode."
protected_paths_touched: []
files_allowed:
  - src/app/(site)/about/the-way-i-am/
  - src/components/the-way/
  - src/lib/the-way.ts
  - src/lib/spotify.ts
  - src/lib/spotify-snapshot.json
  - src/lib/env.ts
  - env.example
  - next.config.ts
  - planning/content/.slop/
  - planning/slices/EPIC-018-SLICE-1.md
  - backlog/tasks/TASK-071.md
progress_weight: 1
---

# Task: The 10s playlist

> Owner (2026-07-17, prompt item 4 + chat): replace Favorite Artists with
> his "10s" Spotify playlist: the songs he rates 10 out of 10 and plays
> frequently. Use the Spotify Web API; do something clever and interactive.
> Owner puts `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` in `.env.local`
> and supplies the playlist URL (must be public for client-credentials).

## Scope

1. `src/lib/spotify.ts`: client-credentials token + playlist fetch (paged
   tracks; track name, artists, album, album art URL, release date,
   duration, external URL). Runs server-side at build in the page's server
   component, mirroring `magazine.ts`'s graceful-degradation pattern.
   Never throws the build: on missing env or fetch failure it falls back
   to the committed `spotify-snapshot.json`.
2. `src/lib/spotify-snapshot.json`: committed last-known playlist data
   (starts minimal; refreshed whenever a build runs with env present).
   Empty snapshot renders an honest placeholder state, never fake tracks.
3. `env.ts` + `env.example`: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`,
   `SPOTIFY_PLAYLIST_ID` (names only; values stay in `.env.local`).
4. New `the-way` section component replacing the Favorite Artists block:
   an interactive presentation of the playlist consistent with the museum
   language (hard corners, editorial type, EASE_OUT motion, reduced-motion
   safe); every track links out to Spotify. Exact interaction concept is
   the implementer's call per the slice's design read.

## Blockers owed by the owner
- Playlist URL/ID (not yet supplied at authoring time).
- Creds in `.env.local`; same names in the production environment.

## Acceptance criteria
- [ ] With env present: real playlist data fetched at build and rendered.
- [ ] Without env: build stays green and the section renders the snapshot
      or placeholder state.
- [ ] No secret values in the repo; only env names.
- [ ] Section is interactive, keyboard accessible, reduced-motion safe.
- [ ] lint / typecheck / build green; slop >= 35/50 on changed src files.

## Verified (2026-07-17)
Fallback path proven: with no env the build stays green (14 routes) and the
section renders the honest placeholder from the empty committed snapshot;
no secret values in the repo (env names only in env.example/env.ts).
Live path (client-credentials fetch, kiosk with shuffle + decade filters)
is implemented but NOT yet exercised: the owner still owes
SPOTIFY_CLIENT_ID/SECRET in .env.local plus SPOTIFY_PLAYLIST_ID for the
public 10s playlist. next.config.ts gained i.scdn.co/mosaic.scdn.co image
remotePatterns. lint/typecheck/build green; slop 50/50.
