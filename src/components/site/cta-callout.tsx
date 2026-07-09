"use client";

import { motion, useReducedMotion } from "framer-motion";

import { MagneticButton } from "@/components/motion/magnetic-button";
import { Section } from "@/components/site/section";
import { Blob } from "@/components/site/blob";
import { MeshBg } from "@/components/site/mesh-bg";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * CTACallout - shared end-of-page conversion band (12-ui-element-map.md §1).
 * Every page passes its own heading/body/CTA copy; the destination is always a
 * qualified inquiry (11-content-strategy.md §1), usually `/contact`.
 *
 * EPIC-011 (owner note 4): the CTA uses `MagneticButton`, so every page's
 * conversion button shares the hero's magnetic hover (pull + fill sweep + text
 * reveal). `MagneticButton` degrades to a plain styled button under
 * reduced-motion / coarse pointers, so the band is never motion-gated.
 */
export interface CTACalloutProps {
  heading: string;
  body: string;
  ctaLabel: string;
  href?: string;
  className?: string;
}

function CTACallout({
  heading,
  body,
  ctaLabel,
  href = "/contact",
  className,
}: CTACalloutProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section className={cn("relative overflow-hidden text-center", className)}>
      {/* Conversion band gets the loudest (still quiet) wash on the page:
          mesh + one large blob behind the centered copy (§Blob motif). */}
      <MeshBg tone="warm" className="-z-10" />
      <Blob
        variant={1}
        fill="var(--color-rose)"
        opacity={0.08}
        blur={16}
        className="-z-10 left-1/2 top-1/2 w-[36rem] -translate-x-1/2 -translate-y-1/2"
      />
      <motion.div
        initial={shouldReduceMotion ? undefined : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "show"}
        viewport={{ once: true }}
        variants={shouldReduceMotion ? undefined : staggerContainer}
        className="mx-auto flex max-w-2xl flex-col items-center gap-6"
      >
        <motion.h2
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="text-display font-display"
        >
          {heading}
        </motion.h2>
        <motion.p
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="measure text-muted"
        >
          {body}
        </motion.p>
        <motion.div variants={shouldReduceMotion ? undefined : fadeUp}>
          <MagneticButton href={href} size="lg">
            {ctaLabel}
          </MagneticButton>
        </motion.div>
      </motion.div>
    </Section>
  );
}

export { CTACallout };
