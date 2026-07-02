import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * MeshBg — static CSS mesh-gradient wash (EPIC-010, §Blob backgrounds). Layered
 * warm radial gradients, no WebGL: the cheap sibling of the hero's shader for
 * ordinary sections. Long, low-contrast transitions only (§3: no harsh ramps).
 * Decorative: aria-hidden, behind content, pointer-events-none.
 */
export interface MeshBgProps {
  /** Wash intensity. Subtle by default; "warm" leans caramel for variety. */
  tone?: "rose" | "warm";
  className?: string;
}

const TONES: Record<NonNullable<MeshBgProps["tone"]>, string> = {
  rose: [
    "radial-gradient(90% 70% at 12% 18%, color-mix(in srgb, var(--color-rose) 9%, transparent) 0%, transparent 62%)",
    "radial-gradient(80% 90% at 88% 78%, color-mix(in srgb, var(--color-caramel) 8%, transparent) 0%, transparent 58%)",
    "radial-gradient(60% 55% at 55% 42%, color-mix(in srgb, var(--color-peach) 5%, transparent) 0%, transparent 65%)",
  ].join(", "),
  warm: [
    "radial-gradient(85% 75% at 82% 16%, color-mix(in srgb, var(--color-caramel) 10%, transparent) 0%, transparent 60%)",
    "radial-gradient(75% 85% at 14% 84%, color-mix(in srgb, var(--color-rose) 7%, transparent) 0%, transparent 58%)",
    "radial-gradient(55% 60% at 48% 55%, color-mix(in srgb, var(--color-peach) 5%, transparent) 0%, transparent 66%)",
  ].join(", "),
};

function MeshBg({ tone = "rose", className }: MeshBgProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{ background: TONES[tone] }}
    />
  );
}

export { MeshBg };
