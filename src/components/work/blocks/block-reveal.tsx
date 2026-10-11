"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

import { fadeUp, staggerContainer } from "@/lib/motion";

/**
 * BlockReveal / BlockRevealItem — the one client boundary the project blocks need
 * (EPIC-026 TASK-096).
 *
 * Every block is otherwise a server component. Rather than marking each one
 * `"use client"` just to reach `useReducedMotion`, they compose this wrapper. It
 * uses the existing shared presets from `src/lib/motion.ts` (§6) — no new motion
 * vocabulary is introduced by this epic.
 *
 * `className` passes straight through and the wrapper IS the layout element (the
 * grid or flex container), so it can also be a grid child without inserting a div
 * that would strand `col-span-*` classes on the wrong node.
 *
 * Reduced motion drops every variant rather than shortening it, so content renders
 * in its final state with no transform (§6, §10).
 *
 * The prop surface is deliberately narrow — `className` and `children` only.
 * Spreading `React.HTMLAttributes<HTMLDivElement>` onto a `motion.div` collides on
 * `onDrag`, whose framer-motion signature differs from React's, and none of these
 * blocks needs arbitrary DOM props.
 */

export interface BlockRevealProps {
  /** Stagger direct `BlockRevealItem` children instead of fading as one unit. */
  stagger?: boolean;
  className?: string;
  children: React.ReactNode;
}

function BlockReveal({ stagger = false, className, children }: BlockRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={stagger ? staggerContainer : fadeUp}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function BlockRevealItem({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div variants={fadeUp} className={className}>
      {children}
    </motion.div>
  );
}

export { BlockReveal, BlockRevealItem };
