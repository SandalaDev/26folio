"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CaretDown } from "@phosphor-icons/react";

import { Section } from "@/components/site/section";
import { TheTens } from "@/components/the-way/the-tens";
import { ALBUM_WALL, ALBUMS_INTRO, MUSIC_INTRO, type Album } from "@/lib/the-way";
import type { TensPlaylist } from "@/lib/spotify";
import { DURATION, EASE_OUT, fadeUp, staggerContainer } from "@/lib/motion";

/**
 * MusicHall - exhibit three (EPIC-016/TASK-064; recomposed in EPIC-018).
 * Two movements: the 10s playlist kiosk (TheTens), then the desert-island
 * wall, a hard-cornered grid of real sleeves in a fixed artist-spread
 * order. The wall opens as a capped preview: the first dozen sleeves show
 * under a gradient fade, and one control reveals or re-hides the rest
 * (height auto animation, static jump under reduced motion). Hovering a
 * sleeve lifts it off the wall and slides the title/artist caption up over
 * the artwork's lower edge. Playlist data arrives from the page's server
 * component (build-time Spotify fetch).
 */

const WALL_PREVIEW_COUNT = 12;

function AlbumTile({ album }: { album: Album }) {
  return (
    <li
      className="group border-border hover:border-border-2 relative aspect-square overflow-hidden border transition-all duration-300 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <Image
        src={album.cover}
        alt={`${album.title} by ${album.artist}`}
        fill
        sizes="(min-width: 1280px) 15vw, (min-width: 768px) 22vw, 45vw"
        className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
      {/* Caption drawer: rides up over the sleeve's lower edge. */}
      <span className="bg-background/85 absolute inset-x-0 bottom-0 flex translate-y-2 flex-col gap-0.5 p-3 opacity-0 backdrop-blur-sm transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
        <span className="font-display text-ink truncate text-sm leading-snug font-semibold">
          {album.title}
        </span>
        <span className="text-muted truncate text-xs">{album.artist}</span>
      </span>
    </li>
  );
}

function MusicHall({ playlist }: { playlist: TensPlaylist }) {
  const shouldReduceMotion = useReducedMotion();
  const [wallOpen, setWallOpen] = React.useState(false);

  const preview = ALBUM_WALL.slice(0, WALL_PREVIEW_COUNT);
  const rest = ALBUM_WALL.slice(WALL_PREVIEW_COUNT);

  return (
    <Section id="music" data-way-section="music">
      <motion.div
        initial={shouldReduceMotion ? undefined : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "show"}
        viewport={{ once: true, amount: 0.1 }}
        variants={shouldReduceMotion ? undefined : staggerContainer}
      >
        <motion.h2
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="font-display text-heading text-ink"
        >
          Music
        </motion.h2>
        <motion.p
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="measure text-muted mt-4"
        >
          {MUSIC_INTRO}
        </motion.p>

        {/* Movement one - the 10s playlist kiosk. */}
        <motion.div variants={shouldReduceMotion ? undefined : fadeUp} className="mt-14">
          <TheTens playlist={playlist} />
        </motion.div>

        <motion.div variants={shouldReduceMotion ? undefined : fadeUp} className="mt-16">
          <h3 className="font-display text-ink text-xl font-semibold">Desert-island albums</h3>
          {ALBUMS_INTRO.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="measure text-muted mt-3">
              {paragraph}
            </p>
          ))}

          <div className="relative mt-6">
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {preview.map((album) => (
                <AlbumTile key={`${album.artist}-${album.title}`} album={album} />
              ))}
            </ul>
            {/* The rest of the wall reveals in place; the fade below hints
                that the preview is a cut, not the collection. */}
            <AnimatePresence initial={false}>
              {wallOpen ? (
                <motion.div
                  key="wall-rest"
                  initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: DURATION.page, ease: EASE_OUT }}
                  className="overflow-hidden"
                >
                  <ul className="grid grid-cols-2 gap-3 pt-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {rest.map((album) => (
                      <AlbumTile key={`${album.artist}-${album.title}`} album={album} />
                    ))}
                  </ul>
                </motion.div>
              ) : null}
            </AnimatePresence>
            {!wallOpen ? (
              <div
                aria-hidden="true"
                className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t to-transparent"
              />
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setWallOpen((open) => !open)}
            aria-expanded={wallOpen}
            className="border-border text-muted hover:border-border-2 hover:text-ink mx-auto mt-8 flex items-center gap-2 border px-4 py-2 text-sm transition-colors"
          >
            {wallOpen ? "Show fewer" : `Show all ${ALBUM_WALL.length} sleeves`}
            <CaretDown
              aria-hidden="true"
              className={`size-3.5 transition-transform duration-300 motion-reduce:transition-none ${
                wallOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </motion.div>
      </motion.div>
    </Section>
  );
}

export { MusicHall };
