"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";

import { usePointerMotion } from "@/lib/use-pointer";

/**
 * Cursor — the §7 #2 signature interaction (baunfire): a custom pointer companion.
 * A hard-cornered rose ring (§3: angular, not round) trails the native cursor with a
 * spring lag and grows over interactive elements. It is decorative and additive:
 *
 * - Pointer-fine only (disabled on touch/coarse) and disabled under prefers-reduced-
 *   motion (§6, §10).
 * - The native cursor is **kept** — the ring augments it, so nothing is hidden and
 *   the keyboard focus path is untouched (§10).
 * - Reads the single shared pointer stream via `usePointerMotion` (no second
 *   mousemove listener, no per-frame re-render).
 */
const INTERACTIVE = "a, button, [role='button'], input, textarea, select, label, summary";

export function Cursor() {
  const shouldReduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const { x, y } = usePointerMotion();
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    if (shouldReduceMotion) {
      setEnabled(false);
      return;
    }
    setEnabled(
      typeof window !== "undefined" &&
        window.matchMedia("(pointer: fine)").matches,
    );
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (!enabled) return;
    function onOver(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      setHovering(Boolean(target?.closest(INTERACTIVE)));
    }
    window.addEventListener("mouseover", onOver);
    return () => window.removeEventListener("mouseover", onOver);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
      style={{ x: springX, y: springY }}
    >
      <motion.span
        className="block border border-rose"
        style={{ translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: hovering ? 48 : 24,
          height: hovering ? 48 : 24,
          opacity: hovering ? 1 : 0.6,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28, mass: 0.5 }}
      />
    </motion.div>
  );
}
