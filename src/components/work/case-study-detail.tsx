import Link from "next/link";

import { Section } from "@/components/site/section";
import { Eyebrow } from "@/components/site/eyebrow";
import type { Project } from "@/lib/projects";

/**
 * CaseStudyDetail — minimal per-project page (12-ui-element-map.md §3
 * `/work`). Deliberately not a multi-section deep dive (epic non-goal) — a
 * single block giving the grid card's problem/outcome framing room to breathe.
 */
function CaseStudyDetail({ project }: { project: Project }) {
  return (
    <Section className="flex flex-col gap-10">
      <Link
        href="/work"
        className="eyebrow text-rose transition-colors hover:text-peach"
      >
        ← Back to work
      </Link>

      <div className="flex flex-col gap-4">
        <Eyebrow>Project</Eyebrow>
        <h1 className="text-display font-display text-ink">{project.title}</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <span className="eyebrow text-muted">The problem</span>
          <p className="measure text-ink">{project.problem}</p>
        </div>
        <div className="flex flex-col gap-2">
          <span className="eyebrow text-muted">The outcome</span>
          <p className="measure text-ink">{project.outcome}</p>
        </div>
      </div>
    </Section>
  );
}

export { CaseStudyDetail };
