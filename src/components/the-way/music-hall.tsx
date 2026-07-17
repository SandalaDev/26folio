"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { Section } from "@/components/site/section";
import { MUSIC } from "@/lib/the-way";
import { fadeUp, staggerContainer } from "@/lib/motion";

/**
 * MusicHall - exhibit three (EPIC-016/TASK-064; EPIC-018 removed the
 * now-playing and studio cards and gave the wall real artwork). Two
 * movements: favorite-artist chips, then the desert-island wall, a hard-
 * cornered grid of real sleeves. Hovering a sleeve lifts it off the wall
 * and slides the title/artist caption up over the artwork's lower edge.
 */

function MusicHall() {
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

        {/* Movement one - the people. */}
        <motion.div
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="mt-14"
        >
          <h3 className="font-display text-xl font-semibold text-ink">
            Favorite artists
          </h3>
          <ul className="mt-6 flex flex-wrap gap-2">
            {MUSIC.artists.map((artist) => (
              <li
                key={artist}
                className="border border-border px-3 py-1.5 text-sm text-muted transition-colors duration-300 hover:border-border-2 hover:text-ink"
              >
                {artist}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="mt-16"
        >
          <h3 className="font-display text-xl font-semibold text-ink">
            Desert-island albums
          </h3>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {MUSIC.albums.map((album) => (
              <li
                key={`${album.artist}-${album.title}`}
                className="group relative aspect-square overflow-hidden border border-border transition-all duration-300 ease-out hover:-translate-y-1 hover:border-border-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <Image
                  src={album.cover}
                  alt={`${album.title} by ${album.artist}`}
                  fill
                  sizes="(min-width: 1280px) 15vw, (min-width: 768px) 22vw, 45vw"
                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                {/* Caption drawer: rides up over the sleeve's lower edge. */}
                <span className="absolute inset-x-0 bottom-0 flex translate-y-2 flex-col gap-0.5 bg-background/85 p-3 opacity-0 backdrop-blur-sm transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                  <span className="truncate font-display text-sm font-semibold leading-snug text-ink">
                    {album.title}
                  </span>
                  <span className="truncate text-xs text-muted">
                    {album.artist}
                  </span>
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
