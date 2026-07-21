"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

import { Section } from "@/components/site/section";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * PageHero — the shared centered editorial-manifesto opener (EPIC-020).
 * Mirrors the /about/the-way-i-am hero (WayHero) so every page's first
 * screen reads as one family: a centered `display-gradient` display h1 over
 * a centered, measured supporting column. The decorative backdrop
 * (Blob / MeshBg) is passed in by the page so each keeps its own accent
 * while the composition stays identical. Motion is the shared fadeUp /
 * stagger, gated by reduced motion. One component so the pattern can't
 * drift page-by-page again.
 */
export interface PageHeroProps {
  title: React.ReactNode;
  /** Decorative accent rendered behind the copy (Blob / MeshBg). */
  backdrop?: React.ReactNode;
  /** Supporting content under the title (intro paragraph, lead line, etc.). */
  children?: React.ReactNode;
  /** Extra classes on the Section (e.g. `pb-0` where a section follows). */
  className?: string;
}

function PageHero({ title, backdrop, children, className }: PageHeroProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section className={cn("relative overflow-hidden text-center", className)}>
      {backdrop}
      <motion.div
        initial={shouldReduceMotion ? undefined : "hidden"}
        animate={shouldReduceMotion ? undefined : "show"}
        variants={shouldReduceMotion ? undefined : staggerContainer}
        className="relative z-10 mx-auto flex max-w-2xl flex-col items-center"
      >
        <motion.h1
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="display-gradient font-display text-display"
        >
          {title}
        </motion.h1>
        {children ? (
          <motion.div
            variants={shouldReduceMotion ? undefined : fadeUp}
            className="mt-6 flex flex-col items-center"
          >
            {children}
          </motion.div>
        ) : null}
      </motion.div>
    </Section>
  );
}

export { PageHero };
