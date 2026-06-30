"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/section";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * CTACallout — shared end-of-page conversion band (12-ui-element-map.md §1).
 * Every page passes its own heading/body/CTA copy; the destination is always a
 * qualified inquiry (11-content-strategy.md §1), usually `/contact`.
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
    <Section className={cn("text-center", className)}>
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
          <Button asChild size="lg">
            <Link href={href}>{ctaLabel}</Link>
          </Button>
        </motion.div>
      </motion.div>
    </Section>
  );
}

export { CTACallout };
