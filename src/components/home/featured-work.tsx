import { Section } from "@/components/site/section";
import { Eyebrow } from "@/components/site/eyebrow";
import { WorkCard } from "@/components/home/work-card";
import { projects } from "@/lib/projects";

/** FeaturedWork — home page block #2 (12-ui-element-map.md §3). */
function FeaturedWork() {
  return (
    <Section>
      <Eyebrow>Featured work</Eyebrow>
      <h2 className="mt-3 text-3xl font-display font-semibold text-ink">
        A couple of things I&apos;ve shipped
      </h2>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {projects.slice(0, 2).map((project) => (
          <WorkCard key={project.slug} project={project} />
        ))}
      </div>
    </Section>
  );
}

export { FeaturedWork };
