import { Section } from "@/components/site/section";
import { Eyebrow } from "@/components/site/eyebrow";
import { TechGrid } from "@/components/capabilities/tech-grid";

/** TechnologiesSection — intro + TechGrid (12-ui-element-map.md §3 Capabilities #2). */
function TechnologiesSection() {
  return (
    <Section>
      <Eyebrow>Technologies</Eyebrow>
      <h2 className="mt-3 max-w-2xl text-3xl font-display font-semibold text-ink">
        Tools I reach for, and why
      </h2>
      <p className="measure mt-6 text-muted">
        I pick boring, well-supported tools for the parts that need to be
        reliable, and modern ones where they earn their place. Hover (or
        focus) any item below for what it&apos;s actually doing here.
      </p>
      <div className="mt-10">
        <TechGrid />
      </div>
    </Section>
  );
}

export { TechnologiesSection };
