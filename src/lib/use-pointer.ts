"use client";

import * as React from "react";
import { useMotionValue, type MotionValue } from "framer-motion";

/**
 * usePointer — single `mousemove` source (12-ui-element-map.md §1, 10-design-system.md
 * §7). The flashlight spotlight and the custom cursor "both hang off a single shared
 * pointer tracker to avoid two competing mousemove listeners." That guarantee lives
 * here: one module-level listener fans out to every subscriber, attached lazily on the
 * first subscribe and detached when the last unsubscribes.
 */
type Subscriber = (x: number, y: number) => void;

const subscribers = new Set<Subscriber>();
let attached = false;
let lastX = -100;
let lastY = -100;

function handleMove(event: MouseEvent) {
  lastX = event.clientX;
  lastY = event.clientY;
  for (const fn of subscribers) fn(lastX, lastY);
}

/** Subscribe to the single shared pointer stream. Returns an unsubscribe fn. */
function subscribe(fn: Subscriber): () => void {
  subscribers.add(fn);
  if (!attached && typeof window !== "undefined") {
    window.addEventListener("mousemove", handleMove);
    attached = true;
  }
  return () => {
    subscribers.delete(fn);
    if (subscribers.size === 0 && attached && typeof window !== "undefined") {
      window.removeEventListener("mousemove", handleMove);
      attached = false;
    }
  };
}

/**
 * MotionValue-based reader — updates `x`/`y` imperatively with **no React
 * re-render**, so a per-frame consumer (the custom cursor, the flashlight,
 * magnetic buttons) stays smooth. The state-based `usePointer` reader was
 * removed in EPIC-012 TASK-049 when its last consumer (FlashlightCursor)
 * moved to MotionValues.
 */
export function usePointerMotion(): {
  x: MotionValue<number>;
  y: MotionValue<number>;
} {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  React.useEffect(
    () =>
      subscribe((px, py) => {
        x.set(px);
        y.set(py);
      }),
    [x, y],
  );

  return { x, y };
}
