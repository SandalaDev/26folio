"use client";

import { motion, useReducedMotion } from "framer-motion";

import { PRACTICE } from "@/lib/the-way";
import { fadeUp, staggerContainer } from "@/lib/motion";

/**
 * PracticeLine - exhibit four (EPIC-016/TASK-064; renamed Creative Pursuits
 * and given Music Production in EPIC-018/TASK-068). One flowing line of
 * display words with hairline separators, a deliberate counterpoint to the
 * album grid around it. Full-bleed band on surface so the room changes tone
 * without flipping theme. Hovering a word inks it in; the italic shift is
 * the only flourish.
 */
function PracticeLine() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="practice"
      data-way-section="practice"
      className="border-y border-border bg-surface px-5 py-20 md:px-10 md:py-28 lg:px-16 xl:px-24"
    >
      <motion.div
        initial={shouldReduceMotion ? undefined : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "show"}
        viewport={{ once: true, amount: 0.4 }}
        variants={shouldReduceMotion ? undefined : staggerContainer}
      >
        <motion.h2
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="font-display text-heading text-ink"
        >
          Creative Pursuits
        </motion.h2>
        <motion.ul
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="mt-12 flex flex-wrap items-baseline gap-x-8 gap-y-4"
        >
          {PRACTICE.map((practice, index) => (
            <li key={practice} className="flex items-baseline gap-x-8">
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className="inline-block h-8 w-px self-center bg-border-2"
                />
              ) : null}
              <span className="font-display text-3xl font-semibold text-muted transition-colors duration-300 hover:italic hover:text-ink md:text-5xl">
                {practice}
              </span>
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}

export { PracticeLine };
