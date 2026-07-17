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

interface SpotifyTrackItem {
  track: {
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
  } | null;
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

function mapTrack(item: SpotifyTrackItem): TensTrack | null {
  const track = item.track;
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

  const tracks: TensTrack[] = [];
  let next: string | null =
    `${API_BASE}/playlists/${id}/tracks?limit=100&fields=next,items(track(name,duration_ms,is_local,external_urls.spotify,artists(name),album(name,release_date,images)))`;
  while (next) {
    const pageRes: Response = await fetch(next, { headers, cache: "no-store" });
    if (!pageRes.ok) throw new Error(`spotify tracks: ${pageRes.status}`);
    const page = (await pageRes.json()) as {
      next: string | null;
      items?: SpotifyTrackItem[];
    };
    for (const item of page.items ?? []) {
      const track = mapTrack(item);
      if (track) tracks.push(track);
    }
    next = page.next;
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
