import Image from "next/image";

import { Section } from "@/components/site/section";
import { Eyebrow } from "@/components/site/eyebrow";
import { ArtefactPlate } from "@/components/work/artefact-plate";
import { BlockReveal, BlockRevealItem } from "@/components/work/blocks/block-reveal";
import type { Asset } from "@/lib/projects";

/**
 * LogoSuiteBlock — `kind: "logo-suite"` (EPIC-026 TASK-096).
 *
 * Lockups and colourways shown as a set. Two things make this block the least
 * templatable of the foundational four:
 *
 * 1. **The count varies 1 to 4.** Gardenfare has one mark, Provision one lockup,
 *    Flavour three colourways, OK four. A fixed grid would strand a lone mark in a
 *    four-column row or squash four into one. So the layout is chosen by count,
 *    and for four the primary is given its own full-width row — "two rows with the
 *    primary given more room", adapted to the real number.
 *
 * 2. **Each lockup needs its own mat.** Measured in TASK-093/095: Flavour Grills'
 *    navy lockup is unreadable on the warm-dark base and crisp on a `light` mat,
 *    while its white lockup is the exact inverse. One tone for the whole set is
 *    impossible, which is why `tone` lives on the asset.
 *
 * Artwork is presented faithfully — no filter, recolour, or crop. `SvgTreatment`
 * is never used here; this block is evidence, not ornament.
 */

export interface LogoSuiteBlockProps {
  lockups: Asset[];
  /** Section label. Defaults to the plain description of what this is. */
  label?: string;
}

/** Columns for the trailing group, once any primary has been pulled out. */
const GRID_BY_COUNT: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
};

function Lockup({ asset, inset }: { asset: Asset; inset: "sm" | "md" | "lg" }) {
  return (
    <ArtefactPlate tone={asset.tone ?? "neutral"} inset={inset} caption={asset.caption}>
      <Image
        src={asset.src}
        width={asset.width}
        height={asset.height}
        alt={asset.alt}
        sizes="(min-width: 768px) 30vw, 100vw"
        className="mx-auto h-auto w-full"
      />
    </ArtefactPlate>
  );
}

function LogoSuiteBlock({ lockups, label = "The marks" }: LogoSuiteBlockProps) {
  if (lockups.length === 0) return null;

  // With four or more, the first lockup leads on its own row at a larger inset
  // and the rest follow as a group. Below that, a single row reads correctly.
  const leadsAlone = lockups.length >= 4;
  const [primary, ...rest] = lockups;
  const group = leadsAlone ? rest : lockups;
  const cols = GRID_BY_COUNT[Math.min(group.length, 3)] ?? "md:grid-cols-3";

  return (
    <Section className="py-14 md:py-20">
      <BlockReveal stagger className="flex flex-col gap-8">
        <BlockRevealItem>
          <Eyebrow as="h2" tone="caramel">
            {label}
          </Eyebrow>
        </BlockRevealItem>

        {leadsAlone ? (
          <BlockRevealItem className="mx-auto w-full md:max-w-[46rem]">
            <Lockup asset={primary} inset="lg" />
          </BlockRevealItem>
        ) : null}

        <div className={`grid gap-6 ${cols}`}>
          {group.map((asset) => (
            <BlockRevealItem key={asset.src}>
              <Lockup asset={asset} inset={group.length === 1 ? "lg" : "md"} />
            </BlockRevealItem>
          ))}
        </div>
      </BlockReveal>
    </Section>
  );
}

export { LogoSuiteBlock };
