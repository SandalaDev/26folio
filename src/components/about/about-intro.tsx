"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Section } from "@/components/site/section";
import { FlashlightCursor } from "@/components/site/flashlight-cursor";
import { fadeUp, staggerContainer } from "@/lib/motion";

/**
 * AboutIntro — hybrid business/personal opening (12-ui-element-map.md §3
 * About #1). Copy here is a structural placeholder, not invented biography
 * (epic decision #1) — owner-confirmed real copy is a follow-up.
 */
function AboutIntro() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section className="relative">
      <FlashlightCursor />
      <motion.div
        initial={shouldReduceMotion ? undefined : "hidden"}
        animate={shouldReduceMotion ? undefined : "show"}
        variants={shouldReduceMotion ? undefined : staggerContainer}
        className="relative z-10 flex max-w-3xl flex-col gap-6"
      >
        <motion.h1
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="text-display font-display text-ink"
        >
          I&apos;m Abe. I build things, and I care how they turn out.
        </motion.h1>
        <motion.p
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="measure text-lg text-muted"
        >
          Draft copy: the line that goes here has to work two ways at once, as
          a reason to hire me and a reason to like me. That&apos;s a
          deliberate piece of writing, not a paragraph I should guess at on
          your behalf.
        </motion.p>
      </motion.div>
    </Section>
  );
}

export { AboutIntro };
