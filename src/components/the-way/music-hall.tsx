"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Section } from "@/components/site/section";
import { TiltCard } from "@/components/motion/tilt-card";
import { MUSIC } from "@/lib/the-way";
import { fadeUp, staggerContainer } from "@/lib/motion";

/**
 * MusicHall - exhibit three (EPIC-016/TASK-064), in three movements:
 *
 * 1. Now playing: the recently-listening record on a pointer-reactive
 *    TiltCard with a slowly spinning vinyl (the one rounded element in the
 *    room; it is a record). Spin pauses under prefers-reduced-motion.
 * 2. The studio corner: DAW tenure plus instrument/plugin chips.
 * 3. Favorite artists as chips, then the desert-island wall: a responsive
 *    grid of typographic sleeves. No licensed artwork exists in the repo,
 *    so each sleeve gets a palette wash cycled from the brand accents;
 *    drop real art into public/images/albums/ in a later pass.
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

        <motion.div
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="mt-14 grid gap-5 lg:grid-cols-12"
        >
          {/* Movement one - the record on the platter right now. */}
          <TiltCard tiltY={5} className="lg:col-span-7">
            <div className="flex h-full items-center gap-8 border border-border bg-surface p-8">
              <div
                aria-hidden="true"
                className="relative size-24 shrink-0 animate-[spin_9s_linear_infinite] rounded-full border border-border-2 bg-background motion-reduce:animate-none md:size-32"
              >
                <span className="absolute inset-3 rounded-full border border-border" />
                <span className="absolute inset-6 rounded-full border border-border" />
                <span className="absolute left-1/2 top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose" />
              </div>
              <div className="min-w-0">
                <p className="eyebrow text-rose">Recently listening</p>
                <p className="mt-3 font-display text-2xl font-semibold text-ink md:text-3xl">
                  {MUSIC.recentlyListening.album}
                </p>
                <p className="mt-1 text-muted">
                  {MUSIC.recentlyListening.artist}
                </p>
              </div>
            </div>
          </TiltCard>

          {/* Movement two - the studio corner. */}
          <div className="flex flex-col justify-between gap-8 border border-border bg-surface p-8 lg:col-span-5">
            <div>
              <h3 className="font-display text-xl font-semibold text-ink">
                In the studio
              </h3>
              <p className="mt-3 text-muted">
                {MUSIC.production.daw},{" "}
                <span className="text-soft">{MUSIC.production.since}</span>
              </p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {MUSIC.production.plugins.map((plugin) => (
                <li
                  key={plugin}
                  className="border border-border px-3 py-1.5 text-sm text-muted"
                >
                  {plugin}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Movement three - the people, then the wall. */}
        <motion.div
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="mt-16"
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
