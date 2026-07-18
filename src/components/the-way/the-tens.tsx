"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowSquareOut, Shuffle } from "@phosphor-icons/react";

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
 * crossfade, transform/opacity only). Decade chips filter the wall of
 * tracks below, since a list spanning eras reads better as eras. With an
 * empty snapshot and no env the section renders an honest placeholder.
 */

function formatRuntime(totalMs: number): string {
  const minutes = Math.round(totalMs / 60000);
  const hours = Math.floor(minutes / 60);
  return hours > 0 ? `${hours} hr ${minutes % 60} min` : `${minutes} min`;
}

function formatTrackLength(ms: number): string {
  const seconds = Math.round(ms / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function FeaturedTrack({ track, onShuffle }: { track: TensTrack; onShuffle: () => void }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="border-border bg-surface border p-6 md:p-8">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={track.url || track.title}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: -12 }}
          transition={{ duration: DURATION.component, ease: EASE_OUT }}
          className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8"
        >
          <div className="border-border-2 bg-surface-2 relative size-32 shrink-0 overflow-hidden border md:size-40">
            {track.cover ? (
              <Image
                src={track.cover}
                alt={`${track.album} cover art`}
                fill
                sizes="10rem"
                className="object-cover"
              />
            ) : null}
          </div>
          <div className="min-w-0">
            <p className="eyebrow text-rose">On the platter</p>
            <p className="font-display text-ink mt-3 truncate text-2xl font-semibold md:text-3xl">
              {track.title}
            </p>
            <p className="text-muted mt-1 truncate">{track.artists}</p>
            <p className="text-muted mt-1 truncate text-sm">
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
        className="border-border text-muted hover:border-border-2 hover:text-ink mt-6 inline-flex items-center gap-2 border px-3 py-1.5 text-sm transition-colors"
      >
        <Shuffle aria-hidden="true" className="size-3.5" />
        Deal me another
      </button>
    </div>
  );
}

function TheTens({ playlist }: { playlist: TensPlaylist }) {
  const [featured, setFeatured] = React.useState(0);
  const [decade, setDecade] = React.useState<number | null>(null);

  const decades = React.useMemo(() => {
    const set = new Set<number>();
    for (const track of playlist.tracks) {
      if (track.releaseYear) set.add(Math.floor(track.releaseYear / 10) * 10);
    }
    return [...set].sort((a, b) => a - b);
  }, [playlist.tracks]);

  const visible = React.useMemo(
    () =>
      decade === null
        ? playlist.tracks
        : playlist.tracks.filter((track) => Math.floor(track.releaseYear / 10) * 10 === decade),
    [playlist.tracks, decade],
  );

  const shuffle = () => {
    if (playlist.tracks.length < 2) return;
    let next = featured;
    while (next === featured) {
      next = Math.floor(Math.random() * playlist.tracks.length);
    }
    setFeatured(next);
  };

  const totalMs = playlist.tracks.reduce((sum, track) => sum + track.durationMs, 0);

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
          <p className="text-muted mt-2 text-sm">
            {playlist.tracks.length} songs, {formatRuntime(totalMs)}
          </p>

          <div className="mt-8">
            <FeaturedTrack track={playlist.tracks[featured]} onShuffle={shuffle} />
          </div>

          {decades.length > 1 ? (
            <div className="mt-10 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setDecade(null)}
                aria-pressed={decade === null}
                className={`border px-3 py-1.5 text-sm transition-colors ${
                  decade === null
                    ? "border-rose text-ink"
                    : "border-border text-muted hover:border-border-2 hover:text-ink"
                }`}
              >
                All eras
              </button>
              {decades.map((era) => (
                <button
                  key={era}
                  type="button"
                  onClick={() => setDecade(era)}
                  aria-pressed={decade === era}
                  className={`border px-3 py-1.5 text-sm transition-colors ${
                    decade === era
                      ? "border-rose text-ink"
                      : "border-border text-muted hover:border-border-2 hover:text-ink"
                  }`}
                >
                  {era}s
                </button>
              ))}
            </div>
          ) : null}

          <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((track) => (
              <li key={`${track.title}-${track.artists}`}>
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
        </>
      )}
    </div>
  );
}

export { TheTens };
