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
 * Track-list read paths, tried in order of completeness (probed
 * 2026-07-20; the sanctioned Web API refuses the full read for this
 * dev-mode app):
 *
 * 1. SPOTIFY_SP_DC set (owner's Spotify web-session cookie): the full
 *    playlist, no row cap. A session token is lifted from the embed page
 *    (the cookie makes it a real user session), the web player's
 *    `fetchPlaylistContents` persisted-query hash is harvested from the
 *    live JS bundles, and api-partner's GraphQL is paged for every track.
 *    That response carries no release year, so the year is filled per
 *    track from /v1/tracks/<id> (client credentials) and cached by track
 *    id, so only newly added songs ever cost a lookup. Unofficial surface:
 *    it can break when Spotify rotates internals, and the cookie expires
 *    roughly yearly; both failure modes fall through to the paths below.
 * 2. SPOTIFY_REFRESH_TOKEN set (owner ran scripts/spotify-authorize.mjs):
 *    a user token that, for apps grandfathered into playlist-tracks
 *    access, pages /playlists/<id>/tracks with no cap. Newer dev-mode apps
 *    get 403 here even with a scoped token (this app does), so it falls
 *    through.
 * 3. Client credentials only: Spotify strips playlist tracks from
 *    client-credentials responses for development-mode apps (the /tracks
 *    sub-endpoint 403s), so the track IDs come from the public embed
 *    page's __NEXT_DATA__ JSON (no auth, HARD-CAPPED at 100 rows) and
 *    per-track /v1/tracks/<id> calls fill in the detail. Songs beyond row
 *    100 are invisible on this path.
 *
 * Every path is gated by snapshot_id: the metadata call (cheap, client
 * credentials) runs each request, and the expensive rebuild only happens
 * when the playlist actually changed.
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

/** fetch that retries transient network failures (Spotify's edges drop
 *  connections intermittently); HTTP error statuses are the caller's
 *  problem and are returned as-is, not retried. */
async function fetchOnceRetried(url: string, init: RequestInit): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      return await fetch(url, init);
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
    }
  }
  throw lastError;
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

// ---- Web-player path (SPOTIFY_SP_DC): the full playlist ----

const WEB_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const PATHFINDER = "https://api-partner.spotify.com/pathfinder/v1/query";

/** Extract a track id from a spotify: URI or open.spotify.com URL. */
function trackIdOf(uriOrUrl: string): string {
  const m = uriOrUrl.match(/(?:spotify:track:|\/track\/)([A-Za-z0-9]{22})/);
  return m ? m[1] : "";
}

/** A real (non-anonymous) session token from the embed page, which the
 *  sp_dc cookie upgrades to the owner's session. */
async function webSessionToken(id: string): Promise<string> {
  const res = await fetchOnceRetried(`https://open.spotify.com/embed/playlist/${id}`, {
    headers: { Cookie: `sp_dc=${env.SPOTIFY_SP_DC}`, "User-Agent": WEB_UA },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`spotify embed: ${res.status}`);
  const html = await res.text();
  const match = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/,
  );
  if (!match) throw new Error("spotify embed: no __NEXT_DATA__");
  const data = JSON.parse(match[1]) as {
    props?: { pageProps?: { state?: { settings?: { session?: { accessToken?: string } } } } };
  };
  const value = data.props?.pageProps?.state?.settings?.session?.accessToken;
  if (!value) throw new Error("spotify embed: no session token");
  return value;
}

/** The web player's persisted-query hashes (fetchPlaylistContents to page
 *  the playlist, getAlbum to resolve release years), scraped from its JS
 *  bundles. Cached in memory; cleared and re-harvested when a query
 *  rejects a hash (Spotify rotates bundles). */
let queryHashes: { contents: string; album: string } | null = null;

async function getQueryHashes(): Promise<{ contents: string; album: string }> {
  if (queryHashes) return queryHashes;
  const pageRes = await fetchOnceRetried("https://open.spotify.com/", {
    headers: { "User-Agent": WEB_UA },
    cache: "no-store",
  });
  const pageHtml = await pageRes.text();
  const scripts = [...new Set([...pageHtml.matchAll(/https:\/\/[^"']+\.js/g)].map((m) => m[0]))];
  let contents = "";
  let album = "";
  for (const url of scripts) {
    if (contents && album) break;
    let js = "";
    try {
      js = await (await fetchOnceRetried(url, { headers: { "User-Agent": WEB_UA } })).text();
    } catch {
      continue;
    }
    contents ||= js.match(/"fetchPlaylistContents"\s*,\s*"query"\s*,\s*"([0-9a-f]{64})"/)?.[1] ?? "";
    album ||= js.match(/"getAlbum"\s*,\s*"query"\s*,\s*"([0-9a-f]{64})"/)?.[1] ?? "";
  }
  if (!contents || !album) throw new Error("spotify web: query hashes not found");
  queryHashes = { contents, album };
  return queryHashes;
}

/** Run a persisted GraphQL query against api-partner. Throws on transport
 *  or GraphQL errors, clearing the hash cache so the next call re-harvests
 *  (covers Spotify rotating its bundles). */
async function pathfinderQuery<T>(
  operationName: string,
  hash: string,
  variables: Record<string, unknown>,
  headers: HeadersInit,
): Promise<T> {
  const url =
    `${PATHFINDER}?operationName=${operationName}` +
    `&variables=${encodeURIComponent(JSON.stringify(variables))}` +
    `&extensions=${encodeURIComponent(JSON.stringify({ persistedQuery: { version: 1, sha256Hash: hash } }))}`;
  const res = await fetchOnceRetried(url, { headers, cache: "no-store" });
  if (!res.ok) throw new Error(`spotify pathfinder ${operationName}: ${res.status}`);
  const json = (await res.json()) as { errors?: unknown; data?: T };
  if (json.errors || !json.data) {
    queryHashes = null;
    throw new Error(`spotify pathfinder ${operationName}: query errors`);
  }
  return json.data;
}

interface PathfinderItem {
  itemV2?: {
    __typename?: string;
    data?: {
      name?: string;
      uri?: string;
      trackDuration?: { totalMilliseconds?: number };
      artists?: { items?: { profile?: { name?: string } }[] };
      albumOfTrack?: {
        uri?: string;
        name?: string;
        coverArt?: { sources?: { url?: string; width?: number }[] };
      };
    };
  };
}

/** A mapped track plus the album URI it came from, so years can be
 *  resolved once per album rather than once per track. */
interface WebTrack {
  track: TensTrack;
  albumUri: string;
}

/** One pathfinder track row -> a track with releaseYear left at 0 (the
 *  playlist query carries no date; resolveAlbumYears fills it). */
function mapPathfinderItem(item: PathfinderItem): WebTrack | null {
  const data = item.itemV2;
  if (data?.__typename !== "TrackResponseWrapper") return null;
  const track = data.data;
  const trackId = trackIdOf(track?.uri ?? "");
  if (!track?.name || !trackId) return null;
  const sources = track.albumOfTrack?.coverArt?.sources ?? [];
  const cover = sources.find((s) => s.width === 300)?.url ?? sources[0]?.url ?? "";
  return {
    albumUri: track.albumOfTrack?.uri ?? "",
    track: {
      title: track.name,
      artists: (track.artists?.items ?? [])
        .map((a) => a.profile?.name)
        .filter(Boolean)
        .join(", "),
      album: track.albumOfTrack?.name ?? "",
      cover,
      releaseYear: 0,
      durationMs: track.trackDuration?.totalMilliseconds ?? 0,
      url: `https://open.spotify.com/track/${trackId}`,
    },
  };
}

/** Album URI -> release year, cached across loads (album dates never
 *  change), so a rebuild only queries albums it hasn't seen. */
const albumYearCache = new Map<string, number>();

/** Fill releaseYear on every track by resolving its album's date through
 *  the web player's getAlbum query (api-partner, not rate-limited). One
 *  query per distinct album. Unresolved albums leave the year at 0; the
 *  track still renders under "All eras". */
async function resolveAlbumYears(items: WebTrack[], headers: HeadersInit, albumHash: string): Promise<void> {
  const unresolved = [...new Set(items.map((i) => i.albumUri).filter(Boolean))].filter(
    (uri) => !albumYearCache.has(uri),
  );

  for (let start = 0; start < unresolved.length; start += 6) {
    const chunk = unresolved.slice(start, start + 6);
    await Promise.all(
      chunk.map(async (albumUri) => {
        try {
          const data = await pathfinderQuery<{ albumUnion?: { date?: { isoString?: string } } }>(
            "getAlbum",
            albumHash,
            { uri: albumUri, locale: "", offset: 0, limit: 50 },
            headers,
          );
          const year = Number.parseInt((data.albumUnion?.date?.isoString ?? "").slice(0, 4), 10);
          if (!Number.isNaN(year)) albumYearCache.set(albumUri, year);
        } catch {
          // Leave unresolved; the track still renders under "All eras".
        }
      }),
    );
  }

  for (const { track, albumUri } of items) {
    const year = albumYearCache.get(albumUri);
    if (year) track.releaseYear = year;
  }
}

/** The full playlist via the web player: page every track, then resolve
 *  each track's year from its album. All api-partner, no rate limit. */
async function fetchViaWebPlayer(id: string): Promise<TensTrack[]> {
  const sessionToken = await webSessionToken(id);
  const { contents, album } = await getQueryHashes();
  const headers = {
    Authorization: `Bearer ${sessionToken}`,
    "app-platform": "WebPlayer",
    "User-Agent": WEB_UA,
  };

  const items: WebTrack[] = [];
  const limit = 100;
  for (let offset = 0; ; offset += limit) {
    const data = await pathfinderQuery<{
      playlistV2?: { content?: { totalCount?: number; items?: PathfinderItem[] } };
    }>("fetchPlaylistContents", contents, { uri: `spotify:playlist:${id}`, offset, limit }, headers);
    const content = data.playlistV2?.content;
    const rows = content?.items ?? [];
    for (const row of rows) {
      const mapped = mapPathfinderItem(row);
      if (mapped) items.push(mapped);
    }
    const total = content?.totalCount ?? items.length;
    if (rows.length === 0 || offset + limit >= total) break;
  }
  if (items.length === 0) throw new Error("spotify pathfinder: empty");

  await resolveAlbumYears(items, headers, album);
  return items.map((i) => i.track);
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

/** The whole track list, best source first, each falling through to the
 *  next on failure. Every path carries the release year (the web-player
 *  path resolves it per album; the API paths get it inline). */
async function fetchTracks(headers: HeadersInit, id: string): Promise<TensTrack[]> {
  if (env.SPOTIFY_SP_DC) {
    try {
      return await fetchViaWebPlayer(id);
    } catch {
      // Unofficial surface changed or cookie expired; try the rest.
    }
  }
  if (env.SPOTIFY_REFRESH_TOKEN) {
    try {
      return await fetchAllTracks(headers, id);
    } catch {
      // Dev-mode app without grandfathered access; fall through.
    }
  }
  return fetchCappedTracks(headers, id);
}

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

    const tracks = await fetchTracks(headers, id);
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
