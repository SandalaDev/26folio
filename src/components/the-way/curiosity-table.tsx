"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Section } from "@/components/site/section";
import { CURIOSITY } from "@/lib/the-way";
import { fadeUp, staggerContainer } from "@/lib/motion";

/**
 * CuriosityTable - exhibit one (EPIC-016/TASK-064): the knowledge table.
 * Two columns per row (discipline / what keeps pulling him back), separated
 * by a single hairline per row. Hovering a row grows a rose accent bar in
 * from the left edge, tints the discipline and nudges the row right, so the
 * depth cue is transform/color only (60fps, no layout work).
 */
function CuriosityTable() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section id="curiosity" data-way-section="curiosity">
      <motion.div
        initial={shouldReduceMotion ? undefined : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "show"}
        viewport={{ once: true, amount: 0.2 }}
        variants={shouldReduceMotion ? undefined : staggerContainer}
      >
        <motion.h2
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="font-display text-heading text-ink"
        >
          Curiosity
        </motion.h2>
        <motion.p
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="measure mt-4 text-muted"
        >
          Disciplines I keep returning to because I enjoy understanding how
          they work.
        </motion.p>

        <motion.dl
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="mt-14 border-t border-border"
        >
          {CURIOSITY.map((row) => (
            <div
              key={row.field}
              className="group relative grid gap-2 border-b border-border py-6 transition-transform duration-300 ease-out hover:translate-x-2 md:grid-cols-12 md:gap-8 motion-reduce:transition-none motion-reduce:hover:translate-x-0"
            >
              {/* Accent bar - grows in from the left hairline on hover. */}
              <span
                aria-hidden="true"
                className="absolute -left-4 top-1/2 h-8 w-0.5 -translate-y-1/2 scale-y-0 bg-rose transition-transform duration-300 ease-out group-hover:scale-y-100 motion-reduce:transition-none"
              />
              <dt className="font-display text-xl font-semibold text-ink transition-colors duration-300 group-hover:text-rose md:col-span-4">
                {row.field}
              </dt>
              <dd className="measure text-muted transition-colors duration-300 group-hover:text-soft md:col-span-8">
                {row.pull}
              </dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>
    </Section>
  );
}

export { CuriosityTable };
