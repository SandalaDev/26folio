import { WorkCard } from "@/components/home/work-card";
import { projects } from "@/lib/projects";

/** WorkGrid — full project list (12-ui-element-map.md §3 `/work` #1). */
function WorkGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {projects.map((project) => (
        <WorkCard key={project.slug} project={project} />
      ))}
    </div>
  );
}

export { WorkGrid };
