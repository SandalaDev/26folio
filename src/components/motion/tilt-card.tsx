"use client";

import * as React from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * Door-opening card tilt (EPIC-012 TASK-054, owner 2026-07-05: "tilt like an
 * opening door on hover... smooth"). One primitive for every card surface so
 * the motion reads consistent site-wide, amplitude scaled per card size.
 *
 * Motion design: the card is hinged at a vertical EDGE (`transformOrigin`
 * left/right — a door swings from its hinge, not its center). On hover it
 * eases open by `tiltY` degrees on the hinge axis; the pointer adds a small
 * modulation on both axes so the door feels alive. Everything is driven by
 * soft springs — enter AND leave glide, no snap.
 *
 * Engineering rules (both learned the hard way — see TASK-054 root cause):
 * 1. Motion values are ALWAYS bound in `style` from first mount. framer-motion
 *    never subscribes to motion values that first appear in `style` on a
 *    re-render, so gating lives on the INPUT (an enabled ref checked in the
 *    handlers); disabled clients just keep an identity transform.
 * 2. The pointer is measured against the un-transformed FRAME (the perspective
 *    wrapper), never the rotated card — measuring the tilted element makes the
 *    math chase its own output (edge jitter, the owner's "abrupt").
 */

const SPRING = { stiffness: 110, damping: 20 };

export interface DoorTiltOptions {
  /** Door-open degrees on the hinge (rotateY) axis. Scale with card size. */
  tiltY?: number;
  /** Depth degrees (rotateX) from vertical pointer position. */
  tiltX?: number;
  /** Which vertical edge the door hinges on. */
  hinge?: "left" | "right";
}

export function useDoorTilt({
  tiltY = 8,
  tiltX = 2.5,
  hinge = "left",
}: DoorTiltOptions = {}) {
  const shouldReduceMotion = useReducedMotion();
  const frameRef = React.useRef<HTMLDivElement | null>(null);
  const enabledRef = React.useRef(false);

  React.useEffect(() => {
    enabledRef.current =
      !shouldReduceMotion && window.matchMedia("(pointer: fine)").matches;
  }, [shouldReduceMotion]);

  // Springs are driven imperatively — animate(value, target, spring) in the
  // handlers below; successive calls on the same value interrupt cleanly, so
  // enter, move, and leave all glide into each other without snapping.
  const hover = useMotionValue(0); // 0 closed … 1 open
  const pxs = useMotionValue(0); // smoothed pointer, -0.5 … 0.5
  const pys = useMotionValue(0);

  // Door open + pointer modulation (±25% of the base angle). Both axes are
  // scaled by the hover spring, so leave never snaps mid-tilt.
  const sign = hinge === "left" ? -1 : 1;
  const rotateY = useTransform(
    () => sign * tiltY * hover.get() + pxs.get() * tiltY * 0.5 * hover.get(),
  );
  const rotateX = useTransform(() => -pys.get() * tiltX * 2 * hover.get());

  function onMouseEnter() {
    if (!enabledRef.current) return;
    animate(hover, 1, { type: "spring", ...SPRING });
  }
  function onMouseMove(event: React.MouseEvent) {
    if (!enabledRef.current) return;
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    animate(pxs, (event.clientX - rect.left) / rect.width - 0.5, {
      type: "spring",
      ...SPRING,
    });
    animate(pys, (event.clientY - rect.top) / rect.height - 0.5, {
      type: "spring",
      ...SPRING,
    });
  }
  function onMouseLeave() {
    animate(hover, 0, { type: "spring", ...SPRING });
    animate(pxs, 0, { type: "spring", ...SPRING });
    animate(pys, 0, { type: "spring", ...SPRING });
  }

  return {
    frameRef,
    frameProps: {
      onMouseEnter,
      onMouseMove,
      onMouseLeave,
      style: { perspective: 1000 } as React.CSSProperties,
    },
    cardStyle: {
      rotateX,
      rotateY,
      transformOrigin: hinge === "left" ? "0% 50%" : "100% 50%",
    },
    /** 0→1 hover spring — drive synced effects (e.g. image zoom) off this. */
    hover: hover as MotionValue<number>,
  };
}

export interface TiltCardProps
  extends DoorTiltOptions,
    React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Extra classes for the inner rotated element (defaults to h-full). */
  cardClassName?: string;
}

/** Simple wrapper for consumers that don't need the hover spring. */
function TiltCard({
  children,
  tiltY,
  tiltX,
  hinge,
  className,
  cardClassName,
  ...rest
}: TiltCardProps) {
  const { frameRef, frameProps, cardStyle } = useDoorTilt({
    tiltY,
    tiltX,
    hinge,
  });
  return (
    <div
      ref={frameRef}
      {...rest}
      {...frameProps}
      className={className}
      style={{ ...frameProps.style, ...rest.style }}
    >
      <motion.div
        style={cardStyle}
        className={cn("h-full will-change-transform", cardClassName)}
      >
        {children}
      </motion.div>
    </div>
  );
}

export { TiltCard };
