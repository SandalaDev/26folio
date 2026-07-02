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
  /** Optional blur radius in px for a soft wash. */
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
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 200"
      className={cn("pointer-events-none absolute select-none", className)}
      style={blur ? { filter: `blur(${blur}px)` } : undefined}
    >
      <path d={path ?? BLOB_PATHS[variant]} fill={fill} fillOpacity={opacity} />
    </svg>
  );
}

export { Blob };
