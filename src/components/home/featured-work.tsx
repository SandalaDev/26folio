import { Section } from "@/components/site/section";
import { WorkCard } from "@/components/home/work-card";
import { featuredOnHome, projects, type Project } from "@/lib/projects";

/**
 * FeaturedWork — home page block #2 (12-ui-element-map.md §3). EPIC-010: two
 * REAL projects as enlarged image cards in a staggered asymmetric two-column
 * layout (the full-viewport width finally gives them room). Which two is named
 * by `featuredOnHome`, not by the grid order (EPIC-029).
 */
function FeaturedWork() {
  const [first, second] = featuredOnHome.map((slug): Project => {
    const project = projects.find((p) => p.slug === slug);
    // Static page: a stale slug fails the build instead of shipping an empty card.
    if (!project) throw new Error(`featuredOnHome names unknown project "${slug}"`);
    return project;
  });

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
