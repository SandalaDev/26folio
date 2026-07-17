"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Section } from "@/components/site/section";
import { MUSIC } from "@/lib/the-way";
import { fadeUp, staggerContainer } from "@/lib/motion";

/**
 * MusicHall - exhibit three (EPIC-016/TASK-064, trimmed in
 * EPIC-018/TASK-068: the now-playing and studio cards are gone per the
 * owner's brief). Two movements remain: favorite-artist chips, then the
 * desert-island wall of typographic sleeves cycling the brand accents.
 */

/** Literal class strings so Tailwind's scanner keeps every tone. */
const SLEEVE_TONES = [
  "bg-rose/10 group-hover:bg-rose/15",
  "bg-caramel/10 group-hover:bg-caramel/15",
  "bg-peach/10 group-hover:bg-peach/15",
  "bg-amber/10 group-hover:bg-amber/15",
  "bg-soft/10 group-hover:bg-soft/15",
] as const;

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
            {MUSIC.albums.map((album, index) => (
              <li
                key={`${album.artist}-${album.title}`}
                className="group relative aspect-square border border-border transition-all duration-300 ease-out hover:-translate-y-1 hover:border-border-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-0 transition-colors duration-300 ${SLEEVE_TONES[index % SLEEVE_TONES.length]}`}
                />
                <span className="relative flex h-full flex-col justify-between p-4">
                  <span className="text-xs text-muted">{album.artist}</span>
                  <span className="font-display font-semibold leading-snug text-ink">
                    {album.title}
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
