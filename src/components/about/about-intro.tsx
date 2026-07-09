"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Section } from "@/components/site/section";
import { Blob } from "@/components/site/blob";
import { FlashlightCursor } from "@/components/site/flashlight-cursor";
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
      <FlashlightCursor />
      {/* Blob accent behind the flashlight area (§Blob motif). */}
      <Blob
        variant={2}
        fill="var(--color-rose)"
        opacity={0.06}
        blur={6}
        className="-right-20 -top-12 w-[28rem]"
      />
      <motion.div
        initial={shouldReduceMotion ? undefined : "hidden"}
        animate={shouldReduceMotion ? undefined : "show"}
        variants={shouldReduceMotion ? undefined : staggerContainer}
        className="relative z-10 flex flex-col gap-6"
      >
        <motion.h1
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="text-display font-display text-ink"
        >
          Before I built software, I built networks.
        </motion.h1>
        <motion.p
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="measure text-subhead text-muted"
        >
          The physical kind. Cell towers, fiber backhaul, solar power systems
          in places the grid doesn&apos;t reach. I worked my way up from
          hands-on field artisan to Implementation Manager at Huawei,
          delivering a national rollout of more than 1,500 towers. That
          career taught me what redundancy, quality assurance, and
          mission-critical actually mean: not slide-deck words, but things
          you answer for.
        </motion.p>
        <motion.p
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="measure text-subhead text-muted"
        >
          Running alongside that, quietly, was a second life: design.
          I&apos;ve been making things look right since Macromedia Fireworks
          in 2002, building sites and brands as a long-running side practice.
          When every no-code tool eventually hit its ceiling, I learned to
          code, and found the one craft that uses everything I have: the
          systems thinking, the design eye, the stubborn attention to what
          happens when things break.
        </motion.p>
        <motion.p
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="measure text-subhead text-muted"
        >
          Today I operate as a one-person product team. Strategy, business
          logic, UI/UX, architecture, development, deployment: one
          accountable human, end to end, with no handoffs to lose your idea
          in.
        </motion.p>
        <motion.p
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="measure text-subhead text-soft"
        >
          The short version of how I got here is on the left. The longer,
          more human version is on the right.
        </motion.p>
      </motion.div>
    </Section>
  );
}

export { AboutIntro };
