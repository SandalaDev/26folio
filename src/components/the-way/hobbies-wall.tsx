"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Camera,
  GameController,
  Hammer,
  MonitorPlay,
  PersonSimpleWalk,
  Waveform,
  type Icon,
} from "@phosphor-icons/react";

import { Section } from "@/components/site/section";
import { HOBBIES } from "@/lib/the-way";
import { fadeUp, staggerContainer } from "@/lib/motion";

/**
 * HobbiesWall - exhibit two (EPIC-016/TASK-064). Six museum wall plaques in
 * an offset grid instead of a stacked list: each hobby reads as a small
 * bordered label with its object icon, the way a gallery labels a piece.
 * Hover lifts the plaque and warms the icon to caramel; even rows sit lower
 * on desktop so the wall hangs loose rather than gridded.
 */
const HOBBY_ICONS: Record<(typeof HOBBIES)[number], Icon> = {
  "Photography & Video": Camera,
  "Music Production": Waveform,
  Walking: PersonSimpleWalk,
  "TV & Movies": MonitorPlay,
  Gaming: GameController,
  DIY: Hammer,
};

function HobbiesWall() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section id="hobbies" data-way-section="hobbies">
      <motion.div
        initial={shouldReduceMotion ? undefined : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "show"}
        viewport={{ once: true, amount: 0.3 }}
        variants={shouldReduceMotion ? undefined : staggerContainer}
        className="grid gap-12 md:grid-cols-12"
      >
        <motion.h2
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="font-display text-heading text-ink md:col-span-4"
        >
          Hobbies
        </motion.h2>
        <div className="grid grid-cols-2 gap-4 md:col-span-8 md:grid-cols-3">
          {HOBBIES.map((hobby, index) => {
            const HobbyIcon = HOBBY_ICONS[hobby];
            return (
              <motion.div
                key={hobby}
                variants={shouldReduceMotion ? undefined : fadeUp}
                className={`group flex flex-col gap-6 border border-border bg-surface p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-border-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                  index % 2 === 1 ? "md:translate-y-6" : ""
                }`}
              >
                <HobbyIcon
                  aria-hidden="true"
                  className="size-7 text-muted transition-colors duration-300 group-hover:text-caramel"
                />
                <span className="font-display font-semibold text-ink">
                  {hobby}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </Section>
  );
}

export { HobbiesWall };
