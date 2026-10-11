import { Section } from "@/components/site/section";
import { Eyebrow } from "@/components/site/eyebrow";
import { BlockReveal, BlockRevealItem } from "@/components/work/blocks/block-reveal";

/**
 * PaletteBlock — `kind: "palette"` (EPIC-026 TASK-096).
 *
 * The brand's actual colours as labelled swatches. Quietly the most useful proof
 * on the page: it says the identity was designed rather than assembled.
 *
 * **This is the only place a project's brand colour is used as a fill anywhere on
 * the site**, and it is legitimate because the colour is the *subject* — a labelled
 * swatch is a specimen, not a theme. Everything around it stays in site tokens: the
 * label, the hex, the gaps, the container, the eyebrow.
 *
 * Labels sit BELOW each swatch rather than on it. Same reasoning as ArtefactPlate's
 * captions: text on an arbitrary brand colour would need a contrast check per
 * swatch per project, and several of these (Provision's `#201f71` navy, Gardenfare's
 * `#590f09` russet) would fail with light text while others fail with dark. Below
 * the swatch, every label is `text-soft` on the page background — one known-good
 * AAA pairing regardless of the palette.
 *
 * Hard 90° corners: §3 names swatches explicitly.
 */

export interface PaletteBlockProps {
  swatches: { hex: string; name: string }[];
  label?: string;
}

function PaletteBlock({ swatches, label = "Palette" }: PaletteBlockProps) {
  if (swatches.length === 0) return null;

  return (
    <Section className="py-14 md:py-20">
      <BlockReveal stagger className="flex flex-col gap-8">
        <BlockRevealItem>
          <Eyebrow as="h2" tone="caramel">
            {label}
          </Eyebrow>
        </BlockRevealItem>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {swatches.map((swatch) => (
            <BlockRevealItem key={swatch.hex} className="flex flex-col gap-3">
              {/* The swatch itself: the one sanctioned brand-colour fill. A thin
                  border keeps a near-black or near-white swatch from dissolving
                  into the page. */}
              <div
                className="border-border h-24 w-full border md:h-28"
                style={{ backgroundColor: swatch.hex }}
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-ink">{swatch.name}</span>
                <span className="text-soft font-mono text-sm">{swatch.hex}</span>
              </div>
            </BlockRevealItem>
          ))}
        </div>
      </BlockReveal>
    </Section>
  );
}

export { PaletteBlock };
