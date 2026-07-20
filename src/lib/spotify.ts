import fs from "node:fs";
import path from "node:path";

import { env } from "@/lib/env";
import snapshot from "@/lib/spotify-snapshot.json";

/**
 * Spotify integration for "The 10s" playlist on /about/the-way-i-am
 * (EPIC-018/TASK-071; per-request freshness in TASK-073; snapshot_id
 * change detection + full-playlist reads in TASK-074). Server-only: the
 * page's server component calls getTensPlaylist() on every request (the
 * route is dynamic), mirroring magazine.ts's graceful-degradation
 * contract:
 *
 * - Missing env or any fetch failure NEVER throws the build or a request.
 *   The last good playlist (module cache, seeded from the committed
 *   spotify-snapshot.json) renders instead, and an empty snapshot renders
 *   the section's honest placeholder state.
 * - Each request costs one playlist-metadata call (bearer token cached
 *   until expiry). The playlist's snapshot_id changes on ANY edit, so
 *   track detail is only re-pulled when the playlist really changed.
 * - When a full fetch succeeds, the snapshot is rewritten best-effort so
 *   the repo carries the last known data for env-less builds. A read-only
 *   filesystem (CI, some hosts) skips the write without complaint.
 *
 * Two read paths for the track list (probed 2026-07-20):
 *
 * 1. SPOTIFY_REFRESH_TOKEN set (owner ran scripts/spotify-authorize.mjs
 *    once): the refresh-token grant yields a user token that CAN page
 *    /playlists/<id>/tracks, so the whole playlist arrives in one or two
 *    requests with no row cap.
 * 2. No refresh token: client-credentials only. Spotify strips playlist
 *    tracks from client-credentials responses for development-mode apps
 *    (the /tracks sub-endpoint 403s; re-verified 2026-07-20), so the
 *    track IDs come from the public embed page's __NEXT_DATA__ JSON
 *    (open.spotify.com/embed/playlist/<id>, no auth, HARD-CAPPED at 100
 *    rows) and per-track /v1/tracks/<id> calls fill in the detail. Songs
 *    beyond row 100 are invisible on this path.
 */

export interface TensTrack {
  title: string;
  artists: string;
  album: string;
  /** Album art URL from Spotify's CDN (may be empty). */
  cover: string;
  releaseYear: number;
  durationMs: number;
  /** open.spotify.com link for the track. */
  url: string;
}

export interface TensPlaylist {
  name: string;
  url: string;
  fetchedAt: string | null;
  /** Spotify's playlist version marker; changes on any edit. Absent on
   *  snapshots written before TASK-074 (forces one refetch, then sticks). */
  snapshotId?: string;
  tracks: TensTrack[];
}

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API_BASE = "https://api.spotify.com/v1";

interface SpotifyTrack {
  name?: string;
  duration_ms?: number;
  external_urls?: { spotify?: string };
  artists?: { name?: string }[];
  album?: {
    name?: string;
    release_date?: string;
    images?: { url?: string; width?: number }[];
  };
  is_local?: boolean;
}

/** fetch with one retry on transient network failure (connect timeouts
 *  to api.spotify.com show up in practice); HTTP error statuses are the
 *  caller's problem and are not retried. */
async function fetchOnceRetried(url: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch {
    return fetch(url, init);
  }
}

/** Bearer token cached until shortly before expiry, so the per-request
 *  cost is normally just the metadata call. */
let token: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (token && Date.now() < token.expiresAt - 60_000) return token.value;
  const basic = Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString(
    "base64",
  );
  // A refresh token (one-time owner authorization) buys playlist-tracks
  // access that plain client credentials are denied; see module comment.
  const body = env.SPOTIFY_REFRESH_TOKEN
    ? `grant_type=refresh_token&refresh_token=${encodeURIComponent(env.SPOTIFY_REFRESH_TOKEN)}`
    : "grant_type=client_credentials";
  const res = await fetchOnceRetried(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`spotify token: ${res.status}`);
  const json = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!json.access_token) throw new Error("spotify token: empty");
  token = {
    value: json.access_token,
    expiresAt: Date.now() + (json.expires_in ?? 3600) * 1000,
  };
  return token.value;
}

function mapTrack(track: SpotifyTrack | null | undefined): TensTrack | null {
  if (!track || track.is_local || !track.name) return null;
  const releaseDate = track.album?.release_date ?? "";
  const year = Number.parseInt(releaseDate.slice(0, 4), 10);
  // Smallest image that still covers a 96px thumbnail; Spotify sorts wide
  // to narrow, so the middle (300px) entry is the sweet spot.
  const images = track.album?.images ?? [];
  const cover = images[1]?.url ?? images[0]?.url ?? "";
  return {
    title: track.name,
    artists: (track.artists ?? [])
      .map((artist) => artist.name)
      .filter(Boolean)
      .join(", "),
    album: track.album?.name ?? "",
    cover,
    releaseYear: Number.isNaN(year) ? 0 : year,
    durationMs: track.duration_ms ?? 0,
    url: track.external_urls?.spotify ?? "",
  };
}

interface PlaylistMeta {
  name: string;
  url: string;
  snapshotId: string;
}

/** Playlist name, link and snapshot_id. Works with both token kinds. */
async function fetchMeta(headers: HeadersInit, id: string): Promise<PlaylistMeta> {
  const res = await fetchOnceRetried(
    `${API_BASE}/playlists/${id}?fields=name,snapshot_id,external_urls.spotify`,
    { headers, cache: "no-store" },
  );
  if (!res.ok) throw new Error(`spotify playlist: ${res.status}`);
  const json = (await res.json()) as {
    name?: string;
    snapshot_id?: string;
    external_urls?: { spotify?: string };
  };
  return {
    name: json.name ?? "The 10s",
    url: json.external_urls?.spotify ?? `https://open.spotify.com/playlist/${id}`,
    snapshotId: json.snapshot_id ?? "",
  };
}

/** Full playlist via the paged /tracks endpoint. Needs the user token
 *  (refresh-token path); client credentials get 403 here. */
async function fetchAllTracks(headers: HeadersInit, id: string): Promise<TensTrack[]> {
  const fields =
    "total,next,items(track(name,duration_ms,is_local,external_urls.spotify,artists(name),album(name,release_date,images)))";
  const tracks: TensTrack[] = [];
  for (let offset = 0; ; ) {
    const res = await fetchOnceRetried(
      `${API_BASE}/playlists/${id}/tracks?offset=${offset}&limit=100&fields=${encodeURIComponent(fields)}`,
      { headers, cache: "no-store" },
    );
    if (!res.ok) throw new Error(`spotify tracks: ${res.status}`);
    const json = (await res.json()) as { next?: string | null; items?: { track?: SpotifyTrack }[] };
    const items = json.items ?? [];
    for (const item of items) {
      const track = mapTrack(item.track);
      if (track) tracks.push(track);
    }
    offset += items.length;
    if (!json.next || items.length === 0) break;
  }
  if (tracks.length === 0) throw new Error("spotify tracks: empty");
  return tracks;
}

/** Track IDs in playlist order from the public embed page (fallback path;
 *  capped at 100 rows by Spotify, see the module comment). */
async function fetchTrackIds(playlistId: string): Promise<string[]> {
  const res = await fetchOnceRetried(`https://open.spotify.com/embed/playlist/${playlistId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`spotify embed: ${res.status}`);
  const html = await res.text();
  const match = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/,
  );
  if (!match) throw new Error("spotify embed: no __NEXT_DATA__");
  const data = JSON.parse(match[1]) as {
    props?: {
      pageProps?: { state?: { data?: { entity?: { trackList?: { uri?: string }[] } } } };
    };
  };
  const trackList = data.props?.pageProps?.state?.data?.entity?.trackList ?? [];
  const ids = trackList
    .map((row) => row.uri ?? "")
    .filter((uri) => uri.startsWith("spotify:track:"))
    .map((uri) => uri.slice("spotify:track:".length));
  if (!ids.length) throw new Error("spotify embed: empty track list");
  return ids;
}

/** Fallback track list: embed IDs + per-track detail calls. */
async function fetchCappedTracks(headers: HeadersInit, id: string): Promise<TensTrack[]> {
  const ids = await fetchTrackIds(id);
  const tracks: TensTrack[] = [];
  for (let start = 0; start < ids.length; start += 10) {
    const chunk = ids.slice(start, start + 10);
    const results = await Promise.all(
      chunk.map(async (trackId) => {
        const res = await fetchOnceRetried(`${API_BASE}/tracks/${trackId}`, {
          headers,
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`spotify track ${trackId}: ${res.status}`);
        return (await res.json()) as SpotifyTrack;
      }),
    );
    for (const item of results) {
      const track = mapTrack(item);
      if (track) tracks.push(track);
    }
  }
  return tracks;
}

function writeSnapshot(playlist: TensPlaylist): void {
  try {
    const file = path.join(process.cwd(), "src/lib/spotify-snapshot.json");
    fs.writeFileSync(file, JSON.stringify(playlist, null, 2) + "\n");
  } catch {
    // Read-only filesystem (CI, hosting): env-present builds still render
    // live data; only the committed fallback stays stale.
  }
}

/** Last good playlist, seeded from the committed snapshot. Reused while
 *  the playlist's snapshot_id is unchanged, and on any fetch failure. */
let cached = snapshot as TensPlaylist;

/** The playlist for the page: version-checked against Spotify on every
 *  request, re-fetched only when it changed, snapshot/cache when env or
 *  the network says no. */
export async function getTensPlaylist(): Promise<TensPlaylist> {
  const configured = env.SPOTIFY_CLIENT_ID && env.SPOTIFY_CLIENT_SECRET && env.SPOTIFY_PLAYLIST_ID;
  if (!configured) return cached;

  try {
    const headers = { Authorization: `Bearer ${await getAccessToken()}` };
    const id = env.SPOTIFY_PLAYLIST_ID;
    const meta = await fetchMeta(headers, id);
    if (meta.snapshotId && meta.snapshotId === cached.snapshotId) return cached;

    // The full read needs an app grandfathered into playlist-tracks access;
    // newer dev-mode apps 403 here even with a scoped user token (probed
    // 2026-07-20). Fall back to the capped path so playlist edits keep
    // flowing either way.
    const tracks = env.SPOTIFY_REFRESH_TOKEN
      ? await fetchAllTracks(headers, id).catch(() => fetchCappedTracks(headers, id))
      : await fetchCappedTracks(headers, id);
    const playlist: TensPlaylist = {
      name: meta.name,
      url: meta.url,
      fetchedAt: new Date().toISOString(),
      snapshotId: meta.snapshotId,
      tracks,
    };
    cached = playlist;
    writeSnapshot(playlist);
    return playlist;
  } catch {
    return cached;
  }
}
