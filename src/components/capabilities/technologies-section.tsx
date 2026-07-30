import { TechGrid } from "@/components/capabilities/tech-grid";
import { Section } from "@/components/site/section";
import { stackFlow } from "@/lib/capabilities";

function TechnologiesSection() {
  return (
    <Section id="technology" className="scroll-mt-20">
      <div className="grid gap-10 border-b border-border pb-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-20">
        <div>
          <p className="eyebrow text-caramel">The technology behind the work</p>
          <h2 className="mt-4 font-display text-heading text-ink">
            Logos are not the point.{" "}
            <span className="font-extralight">Responsibility is.</span>
          </h2>
        </div>
        <div className="space-y-5 text-muted">
          <p>
            The point is choosing a stack that fits the system, operating it
            responsibly, and knowing what to do when something breaks.
          </p>
          <p>
            For technical teams and hiring managers, independent delivery
            includes clarifying ambiguous requirements, writing specifications,
            modelling data, building interfaces and APIs, integrating external
            services, deploying, monitoring, and debugging production systems.
            I can carry that work end to end and collaborate with specialists
            when the problem benefits from a broader team.
          </p>
        </div>
      </div>

      <div className="mt-12">
        <TechGrid />
      </div>

      <div className="mt-12 border border-border bg-surface p-6 md:p-8">
        <p className="eyebrow text-rose">How the pieces fit together</p>
        <ol className="mt-6 grid gap-px bg-border md:grid-cols-4">
          {stackFlow.map((step, index) => (
            <li
              key={step}
              className="relative flex min-h-28 flex-col justify-between bg-background p-4"
            >
              <span className="font-mono text-xs text-soft">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="mt-4 text-sm font-medium text-ink">{step}</span>
              {index < stackFlow.length - 1 ? (
                <span
                  className="absolute -right-px bottom-0 top-0 hidden w-px bg-rose md:block"
                  aria-hidden="true"
                />
              ) : null}
            </li>
          ))}
        </ol>
        <p className="measure mt-6 text-sm text-muted">
          The stack changes. The responsibilities do not: sound data models,
          controlled access, reliable integrations, tested workflows,
          observable production, and client ownership.
        </p>
      </div>
    </Section>
  );
}

export { TechnologiesSection };
