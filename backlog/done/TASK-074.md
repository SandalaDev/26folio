---
id: TASK-074
title: "Spotify list fixes: snapshot_id change detection, full playlist via one-time OAuth refresh token, Classics era, platter provenance note"
status: done
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-018
epic_ref: backlog/epics/EPIC-018-the-way-content-overhaul.md
slice: EPIC-018-SLICE-1
depends_on: [TASK-073]
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
  - src/lib/spotify.ts
  - src/lib/spotify-snapshot.json
  - src/lib/env.ts
  - src/components/the-way/the-tens.tsx
  - scripts/spotify-authorize.mjs
  - env.example
  - planning/content/.slop/
  - planning/slices/EPIC-018-SLICE-1.md
  - backlog/tasks/TASK-074.md
progress_weight: 1
---

# Task: The 10s playlist actually tracks the source playlist

> Owner (2026-07-20, chat): playlist edits aren't reflected in the era
> categorization; the site shows the list from the first fetch. New songs
> must land in their era dynamically. Add a "Classics" era for everything
> before the 2000s. Add a note on the platter kiosk explaining the songs
> are pulled live from the 10s playlist on Spotify.

## Findings (probed 2026-07-20)

- The public embed page hard-caps trackList at 100 rows with no total
  field, so edits beyond row 100 are invisible to the old flow, and a
  same-first-100 edit kept the cache. The playlist sits at/over the cap.
- Client-credentials CAN read playlist metadata incl. snapshot_id (change
  marker for any edit) but /playlists/{id}/tracks still 403s (dev-mode
  app restriction, re-verified). The embed page's anonymous token can hit
  /tracks but answers 429 with a ~19h Retry-After: not dependable.
- A user-authorized token (one-time owner OAuth, no scopes needed for a
  public playlist) reads the paged /tracks endpoint without the cap.

## Changes

- spotify.ts: snapshot_id-based change detection every load (metadata
  fetch + cached bearer token); full paged /tracks read when
  SPOTIFY_REFRESH_TOKEN is set; capped embed + per-track fallback
  otherwise; snapshot carries snapshotId.
- scripts/spotify-authorize.mjs: one-time localhost OAuth helper that
  captures the refresh token into .env.local (owner runs it; secret never
  committed).
- the-tens.tsx: era chips computed per track with everything pre-2000
  pooled into Classics; provenance note on the platter kiosk.
- env.ts/env.example: SPOTIFY_REFRESH_TOKEN name (value stays local).

## Follow-up: full playlist without the sanctioned API (2026-07-21)

The refresh-token path 403s for this dev-mode app (not grandfathered),
and per-track /v1/tracks year lookups hit the api.spotify.com rate limit
when seeding the whole list. Fix, owner-approved (keep year eras over
genre; genre needs the same throttled per-artist calls and messy buckets):

- Web-player path (SPOTIFY_SP_DC cookie): a session token from the embed
  page + the web player's `fetchPlaylistContents` persisted query pages
  the entire playlist off api-partner (not rate-limited, no 100 cap).
- Release years resolved per distinct album via the web player's
  `getAlbum` query (also api-partner), cached by album uri. No calls to
  the throttled api.spotify.com. Verified: 326 tracks, 269 albums, 0
  missing years; module rebuild ~44s, cache-hit ~4s.
- Persisted-query hashes harvested from live JS bundles and re-harvested
  if a query rejects a rotated hash. Path order: web-player -> refresh
  token -> capped embed -> snapshot.
- Committed spotify-snapshot.json regenerated to the full 326-track list
  with complete years so env-less/prod-cold builds render everything.
- env.ts/env.example: SPOTIFY_SP_DC. Owner set the cookie value locally.
