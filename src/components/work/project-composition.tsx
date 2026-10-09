import Link from "next/link";

import { Section } from "@/components/site/section";
import { ProjectHeroBlock } from "@/components/work/blocks/project-hero-block";
import { ProjectNoteBlock } from "@/components/work/blocks/project-note-block";
import { LogoSuiteBlock } from "@/components/work/blocks/logo-suite-block";
import { PaletteBlock } from "@/components/work/blocks/palette-block";
import {
  FlatlayBlock,
  PosterBlock,
  PackagingBlock,
  InSituBlock,
  SocialBlock,
  BoardBlock,
} from "@/components/work/blocks/media-blocks";
import { ScreensBlock, DevicesBlock } from "@/components/work/blocks/digital-blocks";
import type { Project, ProjectBlock } from "@/lib/projects";

/**
 * ProjectComposition — walks a project's ordered `blocks` and renders each variant
 * with its component (EPIC-026 TASK-099).
 *
 * This is the whole "no rigid template" mechanism in one file. A project with six
 * blocks and one with eleven both come through here; neither renders a block it has
 * no assets for, and adding a block to one project changes nothing about the others.
 *
 * There is deliberately NO theming wrapper. Per the owner's clarification the
 * renderer introduces per-project block *sequence* only — never per-project visual
 * context. The chrome is the site's, unconditionally.
 *
 * Vertical rhythm between blocks is owned here rather than by each block, so a
 * four-block page and an eleven-block page both breathe correctly. Blocks own their
 * internal spacing via `Section`.
 *
 * Blocks receive their own variant and only the project identity fields they need.
 * No block reaches back into `project` for arbitrary data — that is how a "flexible"
 * renderer quietly becomes a template again.
 */

/**
 * Marks that support a hero backdrop treatment. Measured in TASK-095: only OK
 * Pharmacy's monogram masks to a recognizable silhouette. Gardenfare's mark is a
 * solid ring around a filled disc (masks to a featureless blob) and Provision's
 * carries a full-bleed background rect (masks to a solid square). Projects absent
 * from this map get `MeshBg`, the same backdrop every other page uses.
 */
const HERO_MARKS: Record<string, string> = {
  "ok-pharmacy": "/images/projects/ok-pharmacy/logo-symbol.svg",
};

function renderBlock(block: ProjectBlock, project: Project, key: number): React.ReactNode {
  switch (block.kind) {
    case "hero":
      return (
        <ProjectHeroBlock
          key={key}
          cover={block.cover}
          project={project}
          markSrc={HERO_MARKS[project.slug]}
        />
      );
    case "note":
      return <ProjectNoteBlock key={key} heading={block.heading} body={block.body} />;
    case "logo-suite":
      return <LogoSuiteBlock key={key} lockups={block.lockups} />;
    case "palette":
      return <PaletteBlock key={key} swatches={block.swatches} />;
    case "board":
      return <BoardBlock key={key} sheet={block.sheet} label={block.label} />;
    case "flatlay":
      return <FlatlayBlock key={key} image={block.image} />;
    case "poster":
      return <PosterBlock key={key} posters={block.posters} />;
    case "packaging":
      return <PackagingBlock key={key} items={block.items} />;
    case "in-situ":
      return <InSituBlock key={key} scenes={block.scenes} />;
    case "screens":
      return <ScreensBlock key={key} shot={block.shot} label={block.label} />;
    case "devices":
      return <DevicesBlock key={key} mocks={block.mocks} />;
    case "social":
      return <SocialBlock key={key} items={block.items} />;
    default: {
      /* Exhaustiveness guard, and it is load-bearing: adding a thirteenth
         ProjectBlock variant without a renderer arm becomes a TypeScript error
         rather than a silently missing section. The epic's testing rationale
         relies on the compiler catching this class of bug, so this must stay. */
      const never: never = block;
      return never;
    }
  }
}

export interface ProjectCompositionProps {
  project: Project;
  /** Adjacent projects for the foot navigation. */
  previous?: Pick<Project, "slug" | "title">;
  next?: Pick<Project, "slug" | "title">;
}

function ProjectComposition({ project, previous, next }: ProjectCompositionProps) {
  return (
    <article className="flex flex-col">
      <Section className="pb-0 md:pb-0">
        <Link href="/work" className="eyebrow text-rose hover:text-peach transition-colors">
          ← Back to work
        </Link>
      </Section>

      {project.blocks.map((block, i) => renderBlock(block, project, i))}

      {(previous || next) && (
        <Section className="border-border border-t pt-12 md:pt-16">
          <nav
            aria-label="Other projects"
            className="flex flex-col gap-8 sm:flex-row sm:justify-between"
          >
            {previous ? (
              <Link href={`/work/${previous.slug}`} className="group flex flex-col gap-1">
                <span className="eyebrow text-muted">Previous</span>
                <span className="font-display text-ink group-hover:text-rose text-2xl transition-colors">
                  {previous.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/work/${next.slug}`} className="group flex flex-col gap-1 sm:text-right">
                <span className="eyebrow text-muted">Next</span>
                <span className="font-display text-ink group-hover:text-rose text-2xl transition-colors">
                  {next.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </Section>
      )}
    </article>
  );
}

export { ProjectComposition };
