"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { Section } from "@/components/site/section";
import { TheTens } from "@/components/the-way/the-tens";
import { ALBUMS } from "@/lib/the-way";
import type { TensPlaylist } from "@/lib/spotify";
import { fadeUp, staggerContainer } from "@/lib/motion";

/**
 * MusicHall - exhibit three (EPIC-016/TASK-064; recomposed in EPIC-018).
 * Two movements: the 10s playlist kiosk (TheTens, replacing the old
 * favorite-artist chips), then the desert-island wall, a hard-cornered
 * grid of real sleeves. Hovering a sleeve lifts it off the wall and slides
 * the title/artist caption up over the artwork's lower edge. Playlist data
 * arrives from the page's server component (build-time Spotify fetch).
 */

function MusicHall({ playlist }: { playlist: TensPlaylist }) {
  const shouldReduceMotion = useReducedMotion();

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

        {/* Movement one - the 10s playlist kiosk. */}
        <motion.div variants={shouldReduceMotion ? undefined : fadeUp} className="mt-14">
          <TheTens playlist={playlist} />
        </motion.div>

        <motion.div variants={shouldReduceMotion ? undefined : fadeUp} className="mt-16">
          <h3 className="font-display text-ink text-xl font-semibold">Desert-island albums</h3>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {ALBUMS.map((album) => (
              <li
                key={`${album.artist}-${album.title}`}
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
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </Section>
  );
}

export { MusicHall };
