"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import type { Asset } from "@/lib/projects";

/**
 * ScreensFrame — the scroll-linked reveal inside `ScreensBlock` (EPIC-026
 * TASK-098).
 *
 * Presents a very tall page design at readable width without spending six screens
 * of vertical scroll on it. Provision's homepage is 1920×1620 and its products page
 * 1729×2000; OK Pharmacy's storefront is 2000×1913.
 *
 * Two hard constraints, both about not taking control away from the reader:
 *
 * 1. **Page scroll is never captured.** The mechanism is `useScroll` on this
 *    element's own progress through the viewport, mapped to a `y` transform on the
 *    image inside a clipped frame. There is no inner scroll container, so there is
 *    nothing to swallow wheel, trackpad or touch scrolling at its boundaries. No
 *    scroll-jacking, no `overscroll` traps, no scroll locking.
 *
 * 2. **Reduced motion gets the complete design, statically.** With
 *    `prefers-reduced-motion: reduce` the frame is dropped entirely and the full
 *    image renders in flow at its natural height. Nothing about the artwork becomes
 *    unreachable because motion is off — it becomes MORE reachable.
 *
 * Keyboard users are served by the same fallback path rather than by making a div
 * focusable: the static full image is always available at the bottom of the block
 * on narrow viewports, and the framed version is decorative presentation of the
 * same asset. See `ScreensBlock`.
 */

export interface ScreensFrameProps {
  shot: Asset;
  /** Visible frame height as a viewport fraction. */
  frameClassName?: string;
}

function ScreensFrame({ shot, frameClassName }: ScreensFrameProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);

  // Progress of this element through the viewport: 0 as its top enters the
  // bottom, 1 as its bottom leaves the top. Never touches document scroll.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  /* The image is taller than the frame; pan it by the overflow amount. Expressed
     in percentages of the image's own height so it works for any aspect. */
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-55%"]);

  if (shouldReduceMotion) {
    // Static, complete, in flow. No frame, no clipping, no animation.
    return (
      <Image
        src={shot.src}
        width={shot.width}
        height={shot.height}
        alt={shot.alt}
        sizes="(min-width: 768px) 70vw, 100vw"
        className="h-auto w-full"
      />
    );
  }

  return (
    <div ref={ref} className={frameClassName ?? "relative h-[70vh] overflow-hidden"}>
      <motion.div style={{ y }} className="absolute inset-x-0 top-0 will-change-transform">
        <Image
          src={shot.src}
          width={shot.width}
          height={shot.height}
          alt={shot.alt}
          sizes="(min-width: 768px) 70vw, 100vw"
          className="h-auto w-full"
        />
      </motion.div>
    </div>
  );
}

export { ScreensFrame };
