import { Section } from "@/components/site/section";
import { WorkCard } from "@/components/home/work-card";
import { projects } from "@/lib/projects";

/**
 * FeaturedWork — home page block #2 (12-ui-element-map.md §3). EPIC-010: the
 * first two REAL projects as enlarged image cards in a staggered asymmetric
 * two-column layout (the full-viewport width finally gives them room).
 */
function FeaturedWork() {
  const [first, second] = projects.slice(0, 2);

  return (
    <Section>
      <h2 className="text-heading font-display text-ink">
        A couple of things <span className="font-extralight">I&apos;ve shipped</span>
      </h2>
      <div className="mt-12 grid gap-8 md:grid-cols-12">
        <div className="md:col-span-7">
          <WorkCard project={first} featured />
        </div>
        <div className="md:col-span-5 md:mt-24">
          <WorkCard project={second} featured />
        </div>
      </div>
    </Section>
  );
}

export { FeaturedWork };
