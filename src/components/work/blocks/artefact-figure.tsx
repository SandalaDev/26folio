import Image from "next/image";

import { ArtefactPlate } from "@/components/work/artefact-plate";
import type { Asset, PlateTone } from "@/lib/projects";

/**
 * ArtefactFigure — one matted artefact, the unit the media blocks are built from
 * (EPIC-026 TASK-097).
 *
 * Exists to hold two rules in one place rather than repeating them across six
 * blocks:
 *
 * 1. **Never upscale.** Several supplied assets are small at source —
 *    `poster-duotone` is 408×612, `device-phone` is 274×573, the Flavour lockups
 *    are 600×450. Displaying them wider than their intrinsic width just softens
 *    them, so the figure caps at `asset.width` unless a block opts out.
 * 2. **Never distort.** Intrinsic `width`/`height` go to `next/image` and the
 *    image is `h-auto w-full`, so aspect ratio is preserved everywhere.
 *
 * The plate tone comes from the asset (what its ink needs), with a per-block
 * fallback for artefacts that never declared one.
 */

export interface ArtefactFigureProps {
  asset: Asset;
  /** Used when the asset does not declare its own tone. */
  fallbackTone?: PlateTone;
  inset?: "sm" | "md" | "lg";
  sizes?: string;
  /**
   * Allow display beyond the asset's intrinsic width. Only for artwork where
   * scale matters more than crispness (a full-bleed board), never for a lockup.
   */
  allowUpscale?: boolean;
  /** Extra classes on the figure wrapper. */
  className?: string;
  /** Fill its container's height instead of flowing (used inside fixed frames). */
  fit?: "flow" | "contain";
}

function ArtefactFigure({
  asset,
  fallbackTone = "neutral",
  inset = "md",
  sizes = "(min-width: 768px) 45vw, 100vw",
  allowUpscale = false,
  className,
  fit = "flow",
}: ArtefactFigureProps) {
  /**
   * When the figure is capped at the asset's intrinsic width, the `sizes` hint has
   * to know about that cap or the optimizer under-serves. Measured on
   * `poster-duotone` (408px source): a `42vw` hint made Next serve a 342px variant
   * that the capped wrapper then displayed at 408px — soft, for no reason. So the
   * hint becomes "100vw up to the cap, the cap beyond it", which never under-serves
   * and at worst over-serves slightly on narrow viewports where section padding
   * makes the real width a little under 100vw.
   */
  const effectiveSizes = allowUpscale
    ? sizes
    : `(max-width: ${asset.width}px) 100vw, ${asset.width}px`;

  return (
    <ArtefactPlate
      tone={asset.tone ?? fallbackTone}
      inset={inset}
      caption={asset.caption}
      className={className}
    >
      <div className="mx-auto w-full" style={allowUpscale ? undefined : { maxWidth: asset.width }}>
        <Image
          src={asset.src}
          width={asset.width}
          height={asset.height}
          alt={asset.alt}
          sizes={effectiveSizes}
          className={
            fit === "contain" ? "mx-auto h-full w-auto max-w-full object-contain" : "h-auto w-full"
          }
        />
      </div>
    </ArtefactPlate>
  );
}

export { ArtefactFigure };
