"use client";

import { motion, useReducedMotion } from "framer-motion";

import { MagneticButton } from "@/components/motion/magnetic-button";
import { Section } from "@/components/site/section";
import { fadeUp, staggerContainer } from "@/lib/motion";

/**
 * WayCta - the exit through the gift shop (EPIC-016/TASK-064). Owner-supplied
 * copy verbatim: title, body and the two paths out. A caramel blob wash
 * bookends the rose one behind the hero.
 */
function WayCta() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section
      id="build"
      data-way-section="build"
      className="relative overflow-hidden border-t border-border"
    >
      <div
        aria-hidden="true"
        className="blob-mask-3 blob-morph absolute -left-28 bottom-0 -z-10 size-72 bg-caramel/10 md:size-96"
      />
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
          Let&apos;s Build Something
        </motion.h2>
        <motion.p
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="measure mt-6 text-lg text-muted"
        >
          Everything on this page eventually finds its way into the software I
          design. If that way of thinking resonates with you, I&apos;d love to
          hear what you&apos;re building.
        </motion.p>
        <motion.div
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="mt-10 flex flex-wrap gap-4"
        >
          <MagneticButton href="/contact">Start a Project</MagneticButton>
          <MagneticButton href="/work" variant="outline">
            Explore My Work
          </MagneticButton>
        </motion.div>
      </motion.div>
    </Section>
  );
}

export { WayCta };
