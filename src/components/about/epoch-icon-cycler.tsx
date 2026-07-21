"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { DURATION, EASE_OUT } from "@/lib/motion";

/**
 * Epoch header icon treatment for the timeline (EPIC-015; reworked into a
 * large watermark in EPIC-019/TASK-076). Each epoch header cycles through
 * the era's most significant tools one at a time. The current tool's glyph
 * fills the header height as a low-opacity watermark behind the copy (the
 * glyph may overlap the text; that's the intent), while the tool's name
 * rides in the top-right corner, small and clear of the content.
 *
 * Reduced motion (and single-tool sets) renders the first tool statically.
 * The rotation is skipped while the tab is hidden so a backgrounded page
 * doesn't churn through timers. Screen readers get the full tool list once
 * (sr-only); the animated visual is aria-hidden so cycling never
 * re-announces.
 */

interface EpochTool {
  /** Visible name, also the AnimatePresence key — unique within one set. */
  label: string;
  /** Single-path SVG under public/icons, rendered as a mask so it takes the
   *  epoch accent color and scales cleanly to any size. */
  src?: string;
  /** Fallback glyph (a Phosphor icon) for tools without an owner SVG mark. */
  node?: React.ReactNode;
}

const CYCLE_MS = 2400;

/** Drives the shared cycling index for an epoch's tool set. */
function useToolCycle(length: number): number {
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (shouldReduceMotion || length < 2) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setIndex((current) => (current + 1) % length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [shouldReduceMotion, length]);

  return index;
}

/** The current tool's glyph, sized to fill its container (watermark scale). */
function ToolGlyph({ tool }: { tool: EpochTool }) {
  if (tool.src) {
    return <IconGlyph src={tool.src} className="h-full w-full" />;
  }
  // Phosphor node: force the child svg to fill the box (CSS wins over the
  // icon's baked-in size attributes).
  return (
    <span className="flex h-full w-full items-center justify-center [&>svg]:h-full [&>svg]:w-auto">
      {tool.node}
    </span>
  );
}

/**
 * The epoch header watermark. Place inside a `relative overflow-hidden`
 * header whose real content sits in a `relative z-10` wrapper. Renders two
 * synchronized layers: the big glyph behind the content, and the tool name
 * in the corner above it.
 */
function EpochWatermark({ tools, accentClassName = "" }: { tools: EpochTool[]; accentClassName?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const index = useToolCycle(tools.length);
  const tool = tools[index] ?? tools[0];
  if (!tool) return null;

  return (
    <>
      <span className="sr-only">Tools of this era: {tools.map((t) => t.label).join(", ")}</span>

      {/* Watermark glyph: full header height, right-anchored, behind content. */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 right-0 z-0 flex w-3/5 items-center justify-end overflow-hidden py-4 pr-4 opacity-[0.08] ${accentClassName}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={tool.label}
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
            transition={{ duration: DURATION.component, ease: EASE_OUT }}
            className="flex aspect-square h-full items-center justify-center"
          >
            <ToolGlyph tool={tool} />
          </motion.span>
        </AnimatePresence>
      </span>

      {/* Tool name: top-right, small, clear of the left-aligned copy. */}
      <span
        aria-hidden="true"
        className={`absolute top-6 right-6 z-10 flex justify-end ${accentClassName}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={tool.label}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: DURATION.micro, ease: EASE_OUT }}
            className="max-w-32 text-right text-[11px] leading-tight font-medium tracking-wide"
          >
            {tool.label}
          </motion.span>
        </AnimatePresence>
      </span>
    </>
  );
}

/**
 * Monochrome brand glyph from `public/icons/` (owner-supplied single-path
 * SVGs with no fill). Rendered as a CSS mask over `currentColor` so every
 * brand mark takes its epoch's accent and sits in the same visual family as
 * the Phosphor glyphs beside it. `className` sizes it (default 1.25rem).
 */
function IconGlyph({ src, className = "size-5" }: { src: string; className?: string }) {
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
  return <span aria-hidden="true" className={`inline-block bg-current ${className}`} style={mask} />;
}

export { EpochWatermark, IconGlyph };
export type { EpochTool };
