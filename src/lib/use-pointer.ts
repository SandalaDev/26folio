"use client";

import * as React from "react";
import { useMotionValue, type MotionValue } from "framer-motion";

export interface PointerPosition {
  x: number;
  y: number;
}

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
 * State-based reader (re-renders on move). Kept as the original API for
 * `FlashlightCursor`, now backed by the shared listener instead of its own.
 */
export function usePointer(): PointerPosition | null {
  const [position, setPosition] = React.useState<PointerPosition | null>(null);

  React.useEffect(() => subscribe((x, y) => setPosition({ x, y })), []);

  return position;
}

/**
 * MotionValue-based reader — updates `x`/`y` imperatively with **no React
 * re-render**, so a per-frame consumer (the custom cursor, magnetic buttons) stays
 * smooth. Same single listener as `usePointer`.
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
