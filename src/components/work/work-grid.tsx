import { WorkCard } from "@/components/home/work-card";
import { projects } from "@/lib/projects";

/**
 * WorkGrid — full project list (12-ui-element-map.md §3 `/work` #1).
 *
 * EPIC-029: with an odd count the lead project spans both columns, so the grid
 * never ends on a lone card. The count changes as projects join, so this is
 * decided from the data rather than fixed.
 */
function WorkGrid() {
  const leadSpans = projects.length % 2 === 1;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {projects.map((project, i) =>
        leadSpans && i === 0 ? (
          <div key={project.slug} className="md:col-span-2">
            <WorkCard project={project} featured />
          </div>
        ) : (
          <WorkCard key={project.slug} project={project} />
        ),
      )}
    </div>
  );
}

export { WorkGrid };
