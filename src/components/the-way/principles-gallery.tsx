"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Section } from "@/components/site/section";
import { TiltCard } from "@/components/motion/tilt-card";
import { PRINCIPLES } from "@/lib/the-way";
import { fadeUp, staggerContainer } from "@/lib/motion";

/**
 * PrinciplesGallery - exhibit six (EPIC-016/TASK-064). Twelve editorial
 * cards where the typography does the work: an oversized display title, a
 * short body, generous padding. Rows alternate a 7/5 then 5/7 column split
 * so the gallery reads as hung pieces rather than a grid, and each card
 * tilts a few degrees toward the pointer via the shared door-tilt
 * primitive (disabled on coarse pointers and under reduced motion).
 */
const SPANS = [
  ["lg:col-span-7", "lg:col-span-5"],
  ["lg:col-span-5", "lg:col-span-7"],
] as const;

function PrinciplesGallery() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section
      id="principles"
      data-way-section="principles"
      className="border-t border-border"
    >
      <motion.div
        initial={shouldReduceMotion ? undefined : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "show"}
        viewport={{ once: true, amount: 0.05 }}
        variants={shouldReduceMotion ? undefined : staggerContainer}
      >
        <motion.h2
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="font-display text-heading text-ink"
        >
          Principles
        </motion.h2>

        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          {PRINCIPLES.map((principle, index) => {
            const span = SPANS[Math.floor(index / 2) % 2][index % 2];
            const hinge = index % 2 === 0 ? "left" : "right";
            return (
              <motion.div
                key={principle.title}
                variants={shouldReduceMotion ? undefined : fadeUp}
                className={span}
              >
                <TiltCard tiltY={4} hinge={hinge} className="h-full">
                  <div className="flex h-full flex-col justify-between gap-10 border border-border bg-surface p-8 md:p-10">
                    <h3 className="max-w-[16ch] font-display text-3xl font-semibold text-ink md:text-4xl">
                      {principle.title}
                    </h3>
                    <p className="measure text-muted">{principle.body}</p>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </Section>
  );
}

export { PrinciplesGallery };
