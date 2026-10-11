import { Section } from "@/components/site/section";
import { BlockReveal } from "@/components/work/blocks/block-reveal";

/**
 * ProjectNoteBlock — `kind: "note"` (EPIC-026 TASK-096).
 *
 * Prose, at a readable measure. This is where a thin asset set earns its page
 * length: The Flavour Grills Cafe ships six files, and honest description is what
 * makes its page feel considered rather than empty. Deliberately plain — the
 * artwork is the spectacle, the writing is the explanation.
 *
 * Copy is DRAFT until TASK-101 and owner approval. No metrics, outcomes,
 * testimonials or client quotes appear here or anywhere in the work section.
 */

export interface ProjectNoteBlockProps {
  heading?: string;
  body: string;
}

function ProjectNoteBlock({ heading, body }: ProjectNoteBlockProps) {
  return (
    <Section className="py-14 md:py-20">
      <BlockReveal className="flex flex-col gap-5">
        {heading ? <h2 className="font-display text-heading text-ink">{heading}</h2> : null}
        <p className="measure text-subhead text-soft">{body}</p>
      </BlockReveal>
    </Section>
  );
}

export { ProjectNoteBlock };
