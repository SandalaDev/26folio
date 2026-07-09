"use client";

import * as React from "react";
import { motion, useMotionTemplate, useSpring } from "framer-motion";

import { usePointerMotion } from "@/lib/use-pointer";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * FlashlightCursor — warm ambient light following the pointer, global chrome
 * (10-design-system.html `.flashlight`, 12-ui-element-map.md §1, §7 #2/#6).
 * EPIC-012 TASK-049: mounted once in the (site) layout, 520px peach-led
 * recipe, MotionValue-driven — pointer moves cause zero React re-renders
 * (design lane §3.B). Springs on x/y reproduce the preview's soft glide.
 * Pointer-fine + motion-allowed only; purely decorative (`aria-hidden`,
 * `pointer-events-none`, beneath page content).
 */
function FlashlightCursor() {
  const [enabled, setEnabled] = React.useState(false);
  const { x, y } = usePointerMotion();
  // Soft glide: the light trails the cursor slightly (the preview's 300ms
  // eased background transition), without ever feeling laggy.
  const sx = useSpring(x, { stiffness: 160, damping: 26, mass: 0.9 });
  const sy = useSpring(y, { stiffness: 160, damping: 26, mass: 0.9 });
  // Preview recipe: 520px circle, peach 10% → rose 5% @ 38% → transparent 70%.
  // Alphas via color-mix on the tokens — no raw hexes.
  const background = useMotionTemplate`radial-gradient(520px circle at ${sx}px ${sy}px, color-mix(in srgb, var(--color-peach) 10%, transparent), color-mix(in srgb, var(--color-rose) 5%, transparent) 38%, transparent 70%)`;

  React.useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (prefersReducedMotion()) return;
    // Rest position before the first pointer move — the preview's 50% / 20%.
    if (x.get() < 0) {
      x.jump(window.innerWidth * 0.5);
      y.jump(window.innerHeight * 0.2);
      sx.jump(window.innerWidth * 0.5);
      sy.jump(window.innerHeight * 0.2);
    }
    setEnabled(true);
  }, [x, y, sx, sy]);

  // Conditional RENDER is safe (the motion values are in `style` from this
  // element's first mount). Never conditionally add motion values to `style`
  // after mount — framer-motion won't bind them (see TASK-054 root cause).
  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background }}
    />
  );
}

export { FlashlightCursor };
