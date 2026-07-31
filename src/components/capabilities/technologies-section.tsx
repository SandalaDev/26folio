import { StackFlow } from "@/components/capabilities/stack-flow";
import { TechGrid } from "@/components/capabilities/tech-grid";
import { Section } from "@/components/site/section";

function TechnologiesSection() {
  return (
    <Section id="technology" className="scroll-mt-20">
      <div className="border-border grid gap-10 border-b pb-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-20">
        <div>
          <p className="eyebrow text-caramel">The technology behind the work</p>
          <h2 className="font-display text-heading text-ink mt-4">
            Logos are not the point. <span className="font-extralight">Responsibility is.</span>
          </h2>
        </div>
        <div className="text-muted space-y-5">
          <p>
            The point is choosing a stack that fits the system, operating it responsibly, and
            knowing what to do when something breaks.
          </p>
          <p>
            For technical teams and hiring managers, independent delivery includes clarifying
            ambiguous requirements, writing specifications, modelling data, building interfaces and
            APIs, integrating external services, deploying, monitoring, and debugging production
            systems. I can carry that work end to end and collaborate with specialists when the
            problem benefits from a broader team.
          </p>
        </div>
      </div>

      <div className="mt-12">
        <TechGrid />
      </div>

      <StackFlow />
    </Section>
  );
}

export { TechnologiesSection };
