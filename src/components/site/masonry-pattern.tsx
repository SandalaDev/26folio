import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * MasonryPattern - irregular offset-rectangle texture (EPIC-010, §Blob
 * backgrounds; EPIC-011 lowered its contrast). Filled, very-low-opacity blocks
 * in the surface tone, with a faint border hairline: the angular counterpart to
 * the blob, keeping the 90° system present inside decorated areas without
 * competing with foreground content. Decorative: aria-hidden, behind content.
 */
export interface MasonryPatternProps {
  className?: string;
  /** Fill opacity (0–1). Keep whisper-quiet so it never competes with content. */
  opacity?: number;
}

/* One hand-set irregular arrangement (not a uniform grid): column seams shift
   per row, block sizes vary, and two cells are intentionally missing - the
   irregular-masonry read the brief asked for. */
const BLOCKS: Array<[x: number, y: number, w: number, h: number]> = [
  [0, 0, 120, 72],
  [128, 0, 72, 44],
  [208, 0, 112, 96],
  [328, 0, 72, 60],
  [128, 52, 72, 44],
  [0, 80, 76, 64],
  [84, 104, 116, 40],
  [208, 104, 54, 40],
  [328, 68, 72, 76],
  [270, 104, 50, 40],
  [0, 152, 120, 48],
  [208, 152, 112, 48],
  [328, 152, 72, 48],
];

function MasonryPattern({ className, opacity = 0.5 }: MasonryPatternProps) {
  // Low-contrast fill (a quiet wash of the border tone) plus a faint matching
  // stroke so each block reads as a filled tile, not an outline.
  const fill = `color-mix(in srgb, var(--color-border) ${Math.round(opacity * 100)}%, transparent)`;
  const stroke = "color-mix(in srgb, var(--color-border-2) 22%, transparent)";
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 200"
      preserveAspectRatio="xMidYMid slice"
      className={cn("pointer-events-none absolute select-none", className)}
    >
      {BLOCKS.map(([x, y, w, h], i) => (
        <rect
          key={i}
          x={x + 0.5}
          y={y + 0.5}
          width={w - 1}
          height={h - 1}
          fill={fill}
          stroke={stroke}
        />
      ))}
    </svg>
  );
}

export { MasonryPattern };
