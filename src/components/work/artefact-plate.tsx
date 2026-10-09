import * as React from "react";

import { cn } from "@/lib/utils";
import type { PlateTone } from "@/lib/projects";

/**
 * ArtefactPlate — the seam between a project's artwork and the warm-dark canvas
 * (EPIC-026 TASK-095).
 *
 * 10-design-system.md §9 bans cold, blue-cast imagery on the warm base. The four
 * projects in the work section are navy/red, teal/green, orange/green and
 * navy/coral, and recolouring any of it to suit the palette would misrepresent
 * the work — a worse outcome than a palette clash. So artwork is presented
 * faithfully and *matted*: the mat is built from site tokens, the print stays the
 * designer's. Same idea as matting a print, and the reason no per-project accent
 * channel exists.
 *
 * The tone is chosen per artefact by what its ink needs, never per project — a
 * single logo suite can need three different tones (see `light` below).
 */

export interface ArtefactPlateProps {
  tone?: PlateTone;
  /** Mat width around the artwork. */
  inset?: "sm" | "md" | "lg";
  /** Rendered below the plate, never over the artwork. */
  caption?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/* Every tone is composed from tokens that already exist in @theme — this epic
   adds no colour values. 90° corners throughout (§3: rounding is the audited
   exception, and a mat is not one). */
const TONES: Record<PlateTone, string> = {
  /** Default. Also the right home for light-ink artwork (white reversals). */
  neutral: "bg-surface border border-border",
  /** Recessed. Contains artwork that needs separating without a full mat. */
  sunken: "bg-surface-2 border border-border shadow-[inset_0_2px_10px_rgba(0,0,0,0.35)]",
  /**
   * Warm pale mat, using --color-ink as a *fill*. Required, not decorative:
   * measured in TASK-093, Flavour Grills' navy lockup on the #1a1411 base loses
   * its pot and its "Restaurant × Bar × Special Events" line almost entirely,
   * and reads crisply on this. Any dark ink supplied on transparency needs it.
   */
  light: "bg-ink border border-ink",
  /** No mat, for artwork that fills its own frame (photography, device mocks). */
  bare: "",
};

const INSETS: Record<NonNullable<ArtefactPlateProps["inset"]>, string> = {
  sm: "p-3 md:p-4",
  md: "p-5 md:p-8",
  lg: "p-8 md:p-12",
};

function ArtefactPlate({
  tone = "neutral",
  inset = "md",
  caption,
  className,
  children,
}: ArtefactPlateProps) {
  /* `w-full` below is load-bearing, not cosmetic. Without a definite width the
     figure collapses to 0x0 whenever its parent is a flex container that does not
     stretch it — the inner wrapper's `w-full` then resolves against an
     indeterminate main size. That is exactly what happened to two of the three
     device mockups at mobile width (0x0 inside a 335px grid cell) before this was
     added. A plate is always meant to fill its container. */
  return (
    <figure className={cn("flex w-full flex-col gap-3", className)}>
      <div className={cn(TONES[tone], tone !== "bare" && INSETS[inset])}>{children}</div>
      {caption ? (
        /* Deliberately outside the plate. A caption inside a `light` mat would
           need its own colour and its own contrast check per tone; on the page
           background it is text-soft on #1a1411, one known-good AAA pairing for
           every tone. */
        <figcaption className="text-soft text-sm">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

export { ArtefactPlate };
