import { StackFlow } from "@/components/capabilities/stack-flow";
import { TechGrid } from "@/components/capabilities/tech-grid";
import { Section } from "@/components/site/section";

function TechnologiesSection() {
  return (
    <Section id="technology" className="scroll-mt-20">
      <div className="border-border grid gap-10 border-b pb-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-20">
        <div>
          <h2 className="font-display text-heading text-ink">My tech stack</h2>
          <p className="text-soft mt-4 text-lg font-extralight">
            The technologies I use and how/why I use them
          </p>
        </div>
        <div className="text-muted space-y-5">
          <p>
            My stack is constantly evolving. I choose technologies based on the problem, the
            product, and the outcome I am trying to achieve rather than forcing every project into
            a stack I happen to know. AI is accelerating that evolution, making it easier to
            evaluate unfamiliar tools, learn new technologies, and change direction when a better
            approach emerges. The technologies below represent what I use today, what I am actively
            exploring, and the tools I keep in my toolbox because they are useful to know.
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
