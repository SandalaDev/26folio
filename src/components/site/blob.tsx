import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Blob: the brand's organic motif (10-design-system.md §Blob, EPIC-010): a
 * vitiligo reference, two tones coexisting on one surface as irregular but
 * intentional shapes. Strictly decorative: always `aria-hidden`, warm tokens
 * only, low opacity, positioned behind content, never behind long-form text.
 *
 * Preset paths are generated (owner-approved); the `path` prop accepts a custom
 * SVG path so the owner's own exported shapes can drop in without touching
 * consumers. UI chrome keeps hard 90° corners (§3): blobs are the one
 * sanctioned organic exception, as masks and washes.
 */
const BLOB_PATHS = {
  1: "M100 16C136 12 170 36 180 72C190 108 178 150 148 172C118 194 72 192 44 168C16 144 8 102 24 68C38 38 68 20 100 16Z",
  2: "M108 12C144 18 176 46 182 84C188 122 166 158 132 176C98 194 54 186 32 156C10 126 12 80 36 52C58 26 76 8 108 12Z",
  3: "M92 20C126 8 168 24 182 58C196 92 184 134 158 160C132 186 88 196 58 176C28 156 12 114 24 78C34 48 62 30 92 20Z",
  4: "M104 24C132 20 162 34 174 62C188 94 186 136 162 162C138 188 96 190 64 174C32 158 14 122 22 88C30 54 74 28 104 24Z",
} as const;

export type BlobVariant = keyof typeof BLOB_PATHS;

export interface BlobProps {
  /** Preset shape (1–4). Ignored when `path` is given. */
  variant?: BlobVariant;
  /** Custom SVG path (200×200 viewBox): for owner-supplied shapes. */
  path?: string;
  /** Fill: a warm token CSS value. Default is a soft rose. */
  fill?: string;
  /** 0–1. Keep low: blobs season, they don't shout (§3). */
  opacity?: number;
  /**
   * Soft-wash strength in the 200×200 viewBox's user space (EPIC-012
   * TASK-051): an SVG-space feGaussianBlur stdDeviation, so the blur scales
   * with the rendered blob. (Previously a CSS px blur, which stayed 2–8px on
   * blobs scaled to 26rem+ — §3's "large blur radii" rendered as stepped
   * edges.) Washes want ~12–16; omit for a crisp intentional shape.
   */
  blur?: number;
  className?: string;
}

function Blob({
  variant = 1,
  path,
  fill = "var(--color-rose)",
  opacity = 0.08,
  blur,
  className,
}: BlobProps) {
  // Deterministic filter id — Blob renders in Server Components too, so no
  // useId. Identical props produce identical ids AND identical filter
  // definitions, so a document-wide duplicate resolves to an equivalent
  // filter; SSR and client markup always agree.
  const filterId = blur
    ? `blob-blur-${variant}-${String(blur).replace(/\W/g, "_")}`
    : undefined;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 200"
      // overflow-visible: the blur spills past the 200×200 viewport; without
      // it the wash clips to a hard square at the SVG edge.
      className={cn(
        "pointer-events-none absolute select-none overflow-visible",
        className,
      )}
    >
      {filterId && (
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={blur} />
        </filter>
      )}
      <path
        d={path ?? BLOB_PATHS[variant]}
        fill={fill}
        fillOpacity={opacity}
        filter={filterId ? `url(#${filterId})` : undefined}
      />
    </svg>
  );
}

export { Blob };
