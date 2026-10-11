import fs from "node:fs";
import path from "node:path";

import { cn } from "@/lib/utils";
import { SvgStroke } from "@/components/work/svg-stroke";

/**
 * SvgTreatment — decorative chrome derived from a project's vector assets
 * (EPIC-026 TASK-095). The owner granted creative license on the SVGs: they may
 * be inlined, masked, outlined, and animated rather than only placed as flat
 * images.
 *
 * The bound is what makes the license safe, and it is not negotiable:
 *
 *  1. A treatment is filled with SITE TOKENS ONLY (`ink`, `soft`, `border`, or a
 *     rose wash) via `currentColor`. Never the subject's brand colours.
 *  2. A treatment must be unmistakably a treatment. If a viewer could read it as
 *     "that is the logo, rendered wrong", it does not ship. The faithful mark
 *     lives in `logo-suite`; this must visibly not be pretending to be that.
 *
 * Never used inside an artefact block (`logo-suite`, `poster`, `packaging`,
 * `in-situ`, `screens`, `social`) — there the artwork is evidence and is shown
 * exactly as supplied.
 *
 * `mask` and `texture` are pure CSS and work with any asset URL. `outline` and
 * `draw` need path geometry, so this server component reads the file at build
 * time and hands it to `SvgStroke`; that avoids an SVG loader package (which
 * would need a dependency plan) at the cost of only working for assets whose
 * marks are a small number of clean `<path>` elements.
 *
 * Asset support, MEASURED by rendering each one (TASK-095) rather than inferred
 * from path counts. Only one of the four projects has an asset that yields a
 * recognizable treatment:
 *
 *   ok-pharmacy/logo-symbol.svg    3 clean paths, transparent ground.
 *                                  mask ✓ (crisp monogram silhouette)
 *                                  outline ✓ (reads clearly as line art)
 *                                  draw ✓ (same geometry, animated)
 *
 *   gardenfare-foods/logo.svg      Renders, but the mark is a solid scalloped ring
 *                                  around a filled disc, so its alpha channel is
 *                                  featureless: masking yields a blank scalloped
 *                                  blob with no tree, wheat or lettering. Usable
 *                                  only as an abstract shape, never as a
 *                                  silhouette of the mark. Also contains <text>,
 *                                  so outline/draw depend on a font being present.
 *
 *   provision-finance/logo.svg     Has a full-bleed background rect, so its alpha
 *                                  is fully opaque and a mask yields a SOLID
 *                                  SQUARE. Not a candidate for any treatment.
 *
 *   provision-finance/pattern.webp texture ✓ (it is a pattern, which is the point)
 *
 * Consequence for TASK-096: only OK Pharmacy's hero can carry a mark treatment.
 * The other three heroes use the site's existing MeshBg / Blob backdrops, the same
 * as every other page — which is correct anyway, since the visual language is ours.
 * A treatment is a bonus where an asset supports one, not a requirement.
 */

export type Treatment = "mask" | "texture" | "outline" | "draw";

export interface SvgTreatmentProps {
  /** Public path of the asset, e.g. `/images/projects/ok-pharmacy/logo-symbol.svg`. */
  src: string;
  treatment: Treatment;
  /**
   * Site-token colour for the treatment. Applied as `currentColor` / mask fill.
   * Constrained to the tokens that are legitimate here.
   */
  tone?: "ink" | "soft" | "border" | "rose";
  /** Decorative opacity. Kept low: §3 keeps accents as seasoning. */
  opacity?: number;
  className?: string;
}

const TONE_BG: Record<NonNullable<SvgTreatmentProps["tone"]>, string> = {
  ink: "bg-ink",
  soft: "bg-soft",
  border: "bg-border",
  rose: "bg-rose",
};

const TONE_TEXT: Record<NonNullable<SvgTreatmentProps["tone"]>, string> = {
  ink: "text-ink",
  soft: "text-soft",
  border: "text-border",
  rose: "text-rose",
};

interface Geometry {
  viewBox: string;
  paths: string[];
}

/**
 * Read an SVG's viewBox and path geometry at build time. Returns null rather
 * than throwing so a missing or unparsable asset degrades to no decoration
 * instead of failing the page — this is ornament, never content.
 */
function readGeometry(src: string): Geometry | null {
  try {
    const file = path.join(process.cwd(), "public", src);
    const svg = fs.readFileSync(file, "utf8");
    const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1];
    if (!viewBox) return null;
    const paths = [...svg.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]);
    return paths.length ? { viewBox, paths } : null;
  } catch {
    return null;
  }
}

function SvgTreatment({
  src,
  treatment,
  tone = "border",
  opacity = 0.12,
  className,
}: SvgTreatmentProps) {
  if (treatment === "mask") {
    /* The mark's silhouette punched out of a site-token fill: the shape reads,
       the brand colour does not survive. */
    return (
      <div
        aria-hidden="true"
        className={cn("pointer-events-none", TONE_BG[tone], className)}
        style={{
          opacity,
          maskImage: `url("${src}")`,
          WebkitMaskImage: `url("${src}")`,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
          maskSize: "contain",
          WebkitMaskSize: "contain",
        }}
      />
    );
  }

  if (treatment === "texture") {
    /* A pattern asset as a very low-contrast ground. Must stay far enough down
       that body copy over it keeps its AA margin (§3: no busy large surfaces). */
    return (
      <div
        aria-hidden="true"
        className={cn("pointer-events-none", className)}
        style={{
          opacity,
          backgroundImage: `url("${src}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    );
  }

  const geometry = readGeometry(src);
  if (!geometry) return null; // ornament degrades to nothing, never to an error

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none", TONE_TEXT[tone], className)}
      style={{ opacity }}
    >
      <SvgStroke
        viewBox={geometry.viewBox}
        paths={geometry.paths}
        animate={treatment === "draw"}
        className="h-full w-full"
      />
    </div>
  );
}

export { SvgTreatment };
