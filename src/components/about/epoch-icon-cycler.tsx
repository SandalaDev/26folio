"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { DURATION, EASE_OUT } from "@/lib/motion";

/**
 * EpochIconCycler — the "most impactful tools of the era" slot on each
 * timeline beat card (EPIC-015). Shows exactly one tool at a time: a glyph in
 * a small bordered square with its name underneath, crossfading to the next
 * every few seconds. Reduced motion (and single-tool sets) renders the first
 * tool statically. The rotation is skipped while the tab is hidden so a
 * backgrounded page doesn't churn through timers.
 *
 * Screen readers get the full tool list once (sr-only); the animated visual
 * is aria-hidden so the cycling never re-announces.
 */

interface EpochTool {
  /** Visible name, also the AnimatePresence key — unique within one set. */
  label: string;
  icon: React.ReactNode;
}

const CYCLE_MS = 2400;

function EpochIconCycler({ tools, className = "" }: { tools: EpochTool[]; className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (shouldReduceMotion || tools.length < 2) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setIndex((current) => (current + 1) % tools.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [shouldReduceMotion, tools.length]);

  const tool = tools[index] ?? tools[0];
  if (!tool) return null;

  return (
    <span className={`flex shrink-0 flex-col items-end gap-1.5 ${className}`}>
      <span className="sr-only">Tools of this era: {tools.map((t) => t.label).join(", ")}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={tool.label}
          aria-hidden="true"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: DURATION.micro, ease: EASE_OUT }}
          className="flex flex-col items-end gap-1.5"
        >
          <span className="flex size-9 items-center justify-center border border-border bg-surface-2/60">
            {tool.icon}
          </span>
          <span className="max-w-28 text-right text-[11px] leading-tight text-muted">
            {tool.label}
          </span>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/**
 * Monochrome brand glyph from `public/icons/` (owner-supplied single-path
 * SVGs with no fill). Rendered as a CSS mask over `currentColor` so every
 * brand mark takes its epoch's accent and sits in the same visual family as
 * the Phosphor glyphs beside it.
 */
function IconGlyph({ src }: { src: string }) {
  const mask: React.CSSProperties = {
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
  };
  return <span aria-hidden="true" className="inline-block size-5 bg-current" style={mask} />;
}

export { EpochIconCycler, IconGlyph };
export type { EpochTool };
