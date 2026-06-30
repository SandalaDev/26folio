import { Section } from "@/components/site/section";
import { Eyebrow } from "@/components/site/eyebrow";
import { ServiceTabs } from "@/components/capabilities/service-tabs";
import { TechnologiesSection } from "@/components/capabilities/technologies-section";
import { ProcessSteps } from "@/components/capabilities/process-steps";
import { CTACallout } from "@/components/site/cta-callout";

export const dynamic = "force-static";

export default function CapabilitiesPage() {
  return (
    <>
      <Section className="pb-0 md:pb-0">
        <Eyebrow>Capabilities</Eyebrow>
        <h1 className="mt-3 text-display font-display text-ink">
          What I can do for you
        </h1>
      </Section>

      <Section>
        <ServiceTabs />
      </Section>

      <TechnologiesSection />

      <Section>
        <Eyebrow>How I work</Eyebrow>
        <h2 className="mt-3 text-3xl font-display font-semibold text-ink">
          What working with me looks like
        </h2>
        <div className="mt-10">
          <ProcessSteps />
        </div>
      </Section>

      <CTACallout
        heading="Ready to get specific?"
        body="Tell me what you're trying to build and I'll tell you straight whether I'm the right fit."
        ctaLabel="Request a proposal & quote"
        href="/contact"
      />
    </>
  );
}
