"use client";

import { motion, useReducedMotion } from "framer-motion";

import { MagneticButton } from "@/components/motion/magnetic-button";
import { Section } from "@/components/site/section";
import { MeshBg } from "@/components/site/mesh-bg";
import { fadeUp, staggerContainer } from "@/lib/motion";

/**
 * DualCtaBand — closing conversion band (EPIC-014/TASK-060). The owner's
 * content blueprint (2026-07-06) flagged the page as missing a landing zone
 * after the depth content: two paths, one per audience, both ending on a
 * next step. No CV/resume asset exists in the repo, so the teams/employer
 * path points at `/work` instead of a download until the owner supplies one
 * (flagged in STATE.json).
 */
function DualCtaBand() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section className="relative overflow-hidden">
      <MeshBg tone="warm" className="-z-10" />
      <motion.div
        initial={shouldReduceMotion ? undefined : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "show"}
        viewport={{ once: true }}
        variants={shouldReduceMotion ? undefined : staggerContainer}
        className="grid gap-10 md:grid-cols-2"
      >
        <motion.div
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="flex flex-col items-start gap-4 border border-border bg-surface p-8"
        >
          <h3 className="font-display text-xl font-semibold text-ink">
            Have a product in mind?
          </h3>
          <p className="text-muted">
            Tell me what you&apos;re building. I&apos;ll tell you how I&apos;d
            build it.
          </p>
          <MagneticButton href="/contact">Start a conversation</MagneticButton>
        </motion.div>
        <motion.div
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="flex flex-col items-start gap-4 border border-border bg-surface p-8"
        >
          <h3 className="font-display text-xl font-semibold text-ink">
            Looking for the formal version?
          </h3>
          <p className="text-muted">
            See the range in the work itself, projects delivered end to end.
          </p>
          <MagneticButton href="/work" variant="outline">
            View my work
          </MagneticButton>
        </motion.div>
      </motion.div>
    </Section>
  );
}

export { DualCtaBand };
