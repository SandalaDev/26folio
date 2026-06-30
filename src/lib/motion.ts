import type { Variants } from "framer-motion";

/**
 * Shared motion constants — the single source for the project's "subtle and
 * smooth" motion appetite (10-design-system.md §6). Values are ported verbatim
 * from 10-design-system.html (`--ease`, `--dur-*`): same numbers, expressed as
 * typed Framer primitives for React.
 *
 * One library per job (§6): this module owns Framer presets only. GSAP/Lottie
 * helpers arrive with the components that use them, in later epics.
 */

/** Durations in **seconds** (Framer's unit). micro 150ms · component 300ms · page 500ms. */
export const DURATION = {
  micro: 0.15,
  component: 0.3,
  page: 0.5,
} as const;

/** Custom ease-out cubic-bézier (§6). Smooth, no overshoot — never a spring. */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Stagger step for lists/grids (§6: `staggerChildren: .08`). */
export const STAGGER = 0.08;

/**
 * Element viewport-entry preset (§6): `opacity 0→1`, `y 20→0`, ease-out.
 * Drive with `initial="hidden" whileInView="show"` (or `animate`).
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.component, ease: EASE_OUT },
  },
};

/**
 * Container for staggered children (§6). Pair with `fadeUp` children; the
 * container itself stays invisible structurally and orchestrates the stagger.
 */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: STAGGER },
  },
};

/**
 * SSR-safe reduced-motion check (§6, §10). Returns `false` on the server and
 * where `matchMedia` is unavailable, so callers can disable choreography without
 * touching `window` at module scope. For React, prefer Framer's `useReducedMotion()`;
 * this helper is for imperative (e.g. GSAP) call sites.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
