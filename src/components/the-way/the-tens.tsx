"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowSquareOut, CaretDown, Shuffle } from "@phosphor-icons/react";

import { DURATION, EASE_OUT } from "@/lib/motion";
import { TENS_INTRO } from "@/lib/the-way";
import type { TensPlaylist, TensTrack } from "@/lib/spotify";

/**
 * TheTens - the 10s playlist listening kiosk (EPIC-018/TASK-071), replacing
 * the favorite-artist chips inside the Music exhibit. The owner's framing:
 * every song on the playlist is a 10 out of 10 and in heavy rotation.
 *
 * Interaction: a featured track sits on the kiosk with its art and a link
 * out to Spotify; the shuffle control deals a new one (AnimatePresence
 * crossfade, transform/opacity only). Era chips filter the wall of tracks
 * below, since a list spanning eras reads better as eras; every era is
 * derived per track from the live playlist data, with everything released
 * before 2000 pooled into one Classics era (owner, 2026-07-20). With an
 * empty snapshot and no env the section renders an honest placeholder.
 */

/** A decade (2000, 2010, ...) or the pre-2000 pool. */
type Era = number | "classics";

/** The era a track files under; null when Spotify gave no release year. */
function eraOf(track: TensTrack): Era | null {
  if (!track.releaseYear) return null;
  if (track.releaseYear < 2000) return "classics";
  return Math.floor(track.releaseYear / 10) * 10;
}

function eraLabel(era: Era): string {
  return era === "classics" ? "Classics" : `${era}s`;
}

function formatTrackLength(ms: number): string {
  const seconds = Math.round(ms / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function FeaturedTrack({ track, onShuffle }: { track: TensTrack; onShuffle: () => void }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    // Centered kiosk (owner, 2026-07-20): the platter sits mid-page as a
    // column with the art on top. Width flexes with the content so the
    // full title shows (owner, 2026-07-21): it hugs the title up to a
    // readable cap, never overflowing the section.
    <div className="border-border bg-surface mx-auto w-fit max-w-2xl border p-6 md:p-8">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={track.url || track.title}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: -12 }}
          transition={{ duration: DURATION.component, ease: EASE_OUT }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <p className="eyebrow text-rose">On the platter</p>
          <div className="border-border-2 bg-surface-2 relative size-40 shrink-0 overflow-hidden border md:size-48">
            {track.cover ? (
              <Image
                src={track.cover}
                alt={`${track.album} cover art`}
                fill
                sizes="12rem"
                className="object-cover"
              />
            ) : null}
          </div>
          <div className="w-full min-w-0">
            <p className="font-display text-ink text-2xl font-semibold text-balance md:text-3xl">
              {track.title}
            </p>
            <p className="text-muted mt-1">{track.artists}</p>
            <p className="text-muted mt-1 text-sm">
              {track.album}
              {track.releaseYear ? `, ${track.releaseYear}` : ""}
            </p>
            {track.url ? (
              <a
                href={track.url}
                target="_blank"
                rel="noreferrer"
                className="border-border text-soft hover:border-border-2 hover:text-ink mt-4 inline-flex items-center gap-2 border px-3 py-1.5 text-sm transition-colors"
              >
                Play on Spotify
                <ArrowSquareOut aria-hidden="true" className="size-3.5" />
              </a>
            ) : null}
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        onClick={onShuffle}
        className="border-border text-muted hover:border-border-2 hover:text-ink mx-auto mt-6 flex items-center gap-2 border px-3 py-1.5 text-sm transition-colors"
      >
        <Shuffle aria-hidden="true" className="size-3.5" />
        Deal me another
      </button>
      <p className="text-muted mx-auto mt-5 max-w-sm text-center text-xs leading-relaxed">
        These songs are pulled live from my 10s playlist on Spotify. Whatever I add over there
        shows up here.
      </p>
    </div>
  );
}

/** Rows shown before the wall caps and offers "show all". */
const WALL_PREVIEW = 30;

function TheTens({ playlist }: { playlist: TensPlaylist }) {
  const [featured, setFeatured] = React.useState(0);
  const [era, setEra] = React.useState<Era | null>(null);
  const [showAllTracks, setShowAllTracks] = React.useState(false);

  // Deal a random opener on mount (owner, 2026-07-21). The server always
  // renders index 0, so this runs client-side after hydration to avoid a
  // mismatch, then swaps in the AnimatePresence crossfade.
  React.useEffect(() => {
    if (playlist.tracks.length > 1) {
      setFeatured(Math.floor(Math.random() * playlist.tracks.length));
    }
  }, [playlist.tracks.length]);

  // Collapse the wall back to a preview whenever the era filter changes.
  React.useEffect(() => {
    setShowAllTracks(false);
  }, [era]);

  // Eras recomputed from whatever the playlist holds right now: Classics
  // first when any pre-2000 track exists, then the decades ascending.
  const eras = React.useMemo<Era[]>(() => {
    const decades = new Set<number>();
    let hasClassics = false;
    for (const track of playlist.tracks) {
      const trackEra = eraOf(track);
      if (trackEra === "classics") hasClassics = true;
      else if (trackEra !== null) decades.add(trackEra);
    }
    const sorted = [...decades].sort((a, b) => a - b);
    return hasClassics ? ["classics", ...sorted] : sorted;
  }, [playlist.tracks]);

  const visible = React.useMemo(
    () => (era === null ? playlist.tracks : playlist.tracks.filter((track) => eraOf(track) === era)),
    [playlist.tracks, era],
  );
  const shown = showAllTracks ? visible : visible.slice(0, WALL_PREVIEW);

  const shuffle = () => {
    if (playlist.tracks.length < 2) return;
    let next = featured;
    while (next === featured) {
      next = Math.floor(Math.random() * playlist.tracks.length);
    }
    setFeatured(next);
  };

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h3 className="font-display text-ink text-xl font-semibold">The 10s</h3>
        {playlist.url ? (
          <a
            href={playlist.url}
            target="_blank"
            rel="noreferrer"
            className="text-muted hover:text-ink inline-flex items-center gap-2 text-sm transition-colors"
          >
            Open the playlist
            <ArrowSquareOut aria-hidden="true" className="size-3.5" />
          </a>
        ) : null}
      </div>
      {TENS_INTRO.map((paragraph) => (
        <p key={paragraph.slice(0, 24)} className="measure text-muted mt-3">
          {paragraph}
        </p>
      ))}

      {playlist.tracks.length === 0 ? (
        <div className="border-border bg-surface mt-8 border p-8">
          <p className="text-soft">
            This wall is being wired to Spotify. The playlist lands here once the connection is
            live.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-8">
            <FeaturedTrack track={playlist.tracks[featured]} onShuffle={shuffle} />
          </div>

          {eras.length > 1 ? (
            <div className="mt-10 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setEra(null)}
                aria-pressed={era === null}
                className={`border px-3 py-1.5 text-sm transition-colors ${
                  era === null
                    ? "border-rose text-ink"
                    : "border-border text-muted hover:border-border-2 hover:text-ink"
                }`}
              >
                All eras
              </button>
              {eras.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setEra(chip)}
                  aria-pressed={era === chip}
                  className={`border px-3 py-1.5 text-sm transition-colors ${
                    era === chip
                      ? "border-rose text-ink"
                      : "border-border text-muted hover:border-border-2 hover:text-ink"
                  }`}
                >
                  {eraLabel(chip)}
                </button>
              ))}
            </div>
          ) : null}

          <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2 xl:grid-cols-3">
            {/* Index in the key: the playlist can hold the same track twice. */}
            {shown.map((track, index) => (
              <li key={`${index}-${track.url || track.title}`}>
                <a
                  href={track.url || playlist.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group border-border hover:border-border-2 flex items-center gap-4 border-b py-3 transition-colors"
                >
                  <span className="border-border bg-surface-2 relative size-10 shrink-0 overflow-hidden border">
                    {track.cover ? (
                      <Image
                        src={track.cover}
                        alt=""
                        fill
                        sizes="2.5rem"
                        className="object-cover"
                      />
                    ) : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-soft group-hover:text-ink block truncate text-sm transition-colors">
                      {track.title}
                    </span>
                    <span className="text-muted block truncate text-xs">{track.artists}</span>
                  </span>
                  <span className="text-muted shrink-0 text-xs">{track.releaseYear || ""}</span>
                  <span className="text-muted w-10 shrink-0 text-right text-xs">
                    {formatTrackLength(track.durationMs)}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          {visible.length > WALL_PREVIEW ? (
            <button
              type="button"
              onClick={() => setShowAllTracks((open) => !open)}
              aria-expanded={showAllTracks}
              className="border-border text-muted hover:border-border-2 hover:text-ink mx-auto mt-8 flex items-center gap-2 border px-4 py-2 text-sm transition-colors"
            >
              {showAllTracks ? "Show fewer" : `Show all ${visible.length} songs`}
              <CaretDown
                aria-hidden="true"
                className={`size-3.5 transition-transform duration-300 motion-reduce:transition-none ${
                  showAllTracks ? "rotate-180" : ""
                }`}
              />
            </button>
          ) : null}
        </>
      )}
    </div>
  );
}

export { TheTens };
