import Image from "next/image";

import { Section } from "@/components/site/section";
import { MeshBg } from "@/components/site/mesh-bg";
import { ArtefactPlate } from "@/components/work/artefact-plate";
import { SvgTreatment } from "@/components/work/svg-treatment";
import { BlockReveal } from "@/components/work/blocks/block-reveal";
import type { Asset, Project } from "@/lib/projects";

/**
 * ProjectHeroBlock — `kind: "hero"` (EPIC-026 TASK-096).
 *
 * Reuses the `PageHero` family's voice — `font-display` `text-display` with
 * `display-gradient` — so a project page's first screen reads as part of this
 * site, then diverges below. Built entirely from site tokens: no project colour
 * touches any surface here.
 *
 * The layout is a two-column split rather than full-bleed artwork behind a title,
 * and that is a deliberate response to the assets. Covers arrive square (OK
 * 830×830, Provision 898×898), landscape (Gardenfare 1280×800) and portrait
 * (Flavour 633×948), and two of the four are LIGHT artwork — a white photographic
 * ground and a pale green field. A full-bleed cover with a warm scrim, which is
 * what `WorkCard` does, cannot hold AA text over either of those. Containing the
 * cover on its own plate handles every proportion and both ink directions without
 * cropping or recolouring anything.
 *
 * The credit sits in the same meta row as the disciplines, at the same weight.
 * Most of the brand projects are self-commissioned, and a visitor must never
 * have to guess which.
 */

export interface ProjectHeroBlockProps {
  cover: Asset;
  project: Project;
  /**
   * Optional mark treatment behind the copy, where the project has an asset that
   * supports one. Measured in TASK-095: only `ok-pharmacy/logo-symbol.svg` yields
   * a recognizable silhouette — Gardenfare's mark masks to a featureless blob and
   * Provision's to a solid square. Projects without one get `MeshBg`, the same
   * backdrop every other page on the site uses.
   */
  markSrc?: string;
}

function ProjectHeroBlock({ cover, project, markSrc }: ProjectHeroBlockProps) {
  return (
    <Section className="relative overflow-hidden">
      <MeshBg tone="rose" className="-z-10" />
      {markSrc ? (
        <SvgTreatment
          src={markSrc}
          treatment="mask"
          tone="rose"
          opacity={0.07}
          className="absolute -top-10 -right-16 -z-10 hidden h-[28rem] w-[28rem] md:block"
        />
      ) : null}

      <BlockReveal className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
        <div className="flex flex-col gap-6 md:col-span-6">
          <h1 className="display-gradient font-display text-display">{project.title}</h1>

          {project.tagline ? (
            <p className="text-subhead measure text-soft">{project.tagline}</p>
          ) : null}

          {/* Meta row. `credit` and `disciplines` carry equal weight; the
              honest credit is not small print. */}
          <dl className="border-border flex flex-wrap gap-x-10 gap-y-4 border-t pt-6">
            <div className="flex flex-col gap-1">
              <dt className="eyebrow text-muted">Credit</dt>
              <dd className="text-ink">{project.credit}</dd>
            </div>
            {project.role && (
              <div className="flex flex-col gap-1">
                <dt className="eyebrow text-muted">Role</dt>
                <dd className="text-ink">{project.role}</dd>
              </div>
            )}
            {project.disciplines.length > 0 && (
              <div className="flex flex-col gap-1">
                <dt className="eyebrow text-muted">Disciplines</dt>
                <dd className="text-ink">{project.disciplines.join(" · ")}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="md:col-span-6">
          <ArtefactPlate tone={cover.tone ?? "neutral"} inset="md">
            <Image
              src={cover.src}
              width={cover.width}
              height={cover.height}
              alt={cover.alt}
              priority
              sizes="(min-width: 768px) 45vw, 100vw"
              className="h-auto w-full"
            />
          </ArtefactPlate>
        </div>
      </BlockReveal>
    </Section>
  );
}

export { ProjectHeroBlock };
