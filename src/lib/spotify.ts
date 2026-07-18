import fs from "node:fs";
import path from "node:path";

import { env } from "@/lib/env";
import snapshot from "@/lib/spotify-snapshot.json";

/**
 * Spotify integration for "The 10s" playlist on /about/the-way-i-am
 * (EPIC-018/TASK-071). Server-only: the page's server component calls
 * getTensPlaylist() at build time, mirroring magazine.ts's
 * graceful-degradation contract:
 *
 * - Missing env or any fetch failure NEVER throws the build. The committed
 *   snapshot (spotify-snapshot.json) renders instead, and an empty snapshot
 *   renders the section's honest placeholder state.
 * - When a fetch succeeds, the snapshot is rewritten best-effort so the
 *   repo carries the last known data for env-less builds. A read-only
 *   filesystem (CI, some hosts) skips the write without complaint.
 *
 * Client-credentials flow: the playlist must be public. Secrets live in
 * .env.local / the production environment only.
 *
 * Track-list detour (2026-07-18): Spotify now strips playlist tracks from
 * client-credentials responses for development-mode apps (the /tracks
 * sub-endpoint 403s and the playlist object arrives without its tracks
 * field; batch /v1/tracks?ids= is closed too). Playlist metadata and
 * single-track lookups still work, so the track IDs come from the public
 * embed page's __NEXT_DATA__ JSON (open.spotify.com/embed/playlist/<id>,
 * no auth, capped at 100 rows) and per-track /v1/tracks/<id> calls fill in
 * album, art, year and links. If Spotify restores playlist reads for this
 * app, fetchTrackIds can collapse back into a /playlists/<id>/tracks walk.
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

async function getAccessToken(): Promise<string> {
  const basic = Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString(
    "base64",
  );
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`spotify token: ${res.status}`);
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new Error("spotify token: empty");
  return json.access_token;
}

function mapTrack(track: SpotifyTrack | null): TensTrack | null {
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

/** Track IDs in playlist order, harvested from the public embed page (see
 *  the module comment for why the API's own playlist reads are closed). */
async function fetchTrackIds(playlistId: string): Promise<string[]> {
  const res = await fetch(`https://open.spotify.com/embed/playlist/${playlistId}`, {
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

async function fetchPlaylist(): Promise<TensPlaylist> {
  const token = await getAccessToken();
  const headers = { Authorization: `Bearer ${token}` };
  const id = env.SPOTIFY_PLAYLIST_ID;

  const metaRes = await fetch(`${API_BASE}/playlists/${id}?fields=name,external_urls.spotify`, {
    headers,
    cache: "no-store",
  });
  if (!metaRes.ok) throw new Error(`spotify playlist: ${metaRes.status}`);
  const meta = (await metaRes.json()) as {
    name?: string;
    external_urls?: { spotify?: string };
  };

  const ids = await fetchTrackIds(id);
  const tracks: TensTrack[] = [];
  for (let start = 0; start < ids.length; start += 10) {
    const chunk = ids.slice(start, start + 10);
    const results = await Promise.all(
      chunk.map(async (trackId) => {
        const res = await fetch(`${API_BASE}/tracks/${trackId}`, { headers, cache: "no-store" });
        if (!res.ok) throw new Error(`spotify track ${trackId}: ${res.status}`);
        return (await res.json()) as SpotifyTrack;
      }),
    );
    for (const item of results) {
      const track = mapTrack(item);
      if (track) tracks.push(track);
    }
  }

  return {
    name: meta.name ?? "The 10s",
    url: meta.external_urls?.spotify ?? "",
    fetchedAt: new Date().toISOString(),
    tracks,
  };
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

/** The playlist for the page, live when env allows, snapshot otherwise. */
export async function getTensPlaylist(): Promise<TensPlaylist> {
  const configured = env.SPOTIFY_CLIENT_ID && env.SPOTIFY_CLIENT_SECRET && env.SPOTIFY_PLAYLIST_ID;
  if (!configured) return snapshot as TensPlaylist;

  try {
    const playlist = await fetchPlaylist();
    writeSnapshot(playlist);
    return playlist;
  } catch {
    return snapshot as TensPlaylist;
  }
}
