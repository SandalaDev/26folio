"use client";

import * as React from "react";

import { usePointer } from "@/lib/use-pointer";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * FlashlightCursor — warm radial spotlight following the pointer
 * (12-ui-element-map.md §1, §7 #2/#6). Pointer-fine only; never removes the
 * native focus ring; purely decorative (`pointer-events-none`).
 */
function FlashlightCursor() {
  const position = usePointer();
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    setEnabled(!isCoarsePointer && !prefersReducedMotion());
  }, []);

  if (!enabled || !position) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background: `radial-gradient(280px circle at ${position.x}px ${position.y}px, color-mix(in srgb, var(--color-rose) 12%, transparent), color-mix(in srgb, var(--color-peach) 6%, transparent) 60%, transparent 80%)`,
      }}
    />
  );
}

export { FlashlightCursor };
