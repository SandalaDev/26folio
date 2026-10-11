"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * SvgStroke — the client half of `SvgTreatment`'s `outline` and `draw`
 * treatments (EPIC-026 TASK-095). The server half reads the SVG at build time
 * and hands the extracted geometry down, so no SVG loader package is needed.
 *
 * Filled with site tokens via `currentColor` — never the subject's brand
 * colours. This is chrome derived from an asset, not a reproduction of it.
 */

export interface SvgStrokeProps {
  viewBox: string;
  paths: string[];
  /** Animate the stroke on as it enters view. */
  animate?: boolean;
  className?: string;
}

function SvgStroke({ viewBox, paths, animate = false, className }: SvgStrokeProps) {
  const shouldReduceMotion = useReducedMotion();
  // Reduced motion gets the finished outline, not a frozen partial path.
  const draw = animate && !shouldReduceMotion;

  return (
    <svg
      viewBox={viewBox}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      vectorEffect="non-scaling-stroke"
      className={className}
    >
      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          initial={draw ? { pathLength: 0, opacity: 0 } : false}
          whileInView={draw ? { pathLength: 1, opacity: 1 } : undefined}
          viewport={{ once: true, amount: 0.4 }}
          transition={
            draw ? { duration: 1.6, delay: i * 0.18, ease: [0.22, 1, 0.36, 1] } : undefined
          }
        />
      ))}
    </svg>
  );
}

export { SvgStroke };
