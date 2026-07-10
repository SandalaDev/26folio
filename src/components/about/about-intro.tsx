"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Section } from "@/components/site/section";
import { Blob } from "@/components/site/blob";
import { fadeUp, staggerContainer } from "@/lib/motion";

/**
 * AboutIntro — hybrid business/personal opening (12-ui-element-map.md §3
 * About #1). Copy is Variation C from the owner's content blueprint
 * (EPIC-014, 2026-07-06): balanced infrastructure + design intro, ending
 * with the hand-off line that only reads correctly once the timeline sits
 * in the left column (TASK-057).
 */
function AboutIntro() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section className="relative overflow-hidden">
      {/* Flashlight is global chrome since EPIC-012 TASK-049 (site layout). */}
      {/* Blob accent behind the flashlight area (§Blob motif). */}
      <Blob
        variant={2}
        fill="var(--color-rose)"
        opacity={0.07}
        blur={14}
        className="-right-20 -top-12 w-[28rem]"
      />
      <motion.div
        initial={shouldReduceMotion ? undefined : "hidden"}
        animate={shouldReduceMotion ? undefined : "show"}
        variants={shouldReduceMotion ? undefined : staggerContainer}
        className="relative z-10 flex flex-col gap-6"
      >
        {/* Single-weight display h1 (owner note 1 → EPIC-012 TASK-053) with
            the preview's ink→soft gradient fill. Copy unchanged. */}
        {/* EPIC-014 copy with EPIC-012 TASK-053's ink→soft display gradient. */}
        <motion.h1
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="text-display font-display display-gradient"
        >
          Engineer. Designer. Builder.
        </motion.h1>
        <motion.p
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="measure text-subhead text-muted"
        >
          I&apos;m Abraham Sandala, a self-taught software engineer and designer based in Lusaka, Zambia. I build custom web systems for businesses that have outgrown templates, subscriptions and one-size-fits-all software. My goal isn&apos;t simply to deliver an application, but to create software that reflects how a business actually operates, remains understandable years later, and can be owned, extended and maintained without being locked into someone else&apos;s platform.
        </motion.p>
      </motion.div>
    </Section>
  );
}

export { AboutIntro };
