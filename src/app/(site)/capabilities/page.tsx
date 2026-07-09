import { Section } from "@/components/site/section";
import { Eyebrow } from "@/components/site/eyebrow";
import { Blob } from "@/components/site/blob";
import { ServiceTabs } from "@/components/capabilities/service-tabs";
import { TechnologiesSection } from "@/components/capabilities/technologies-section";
import { ProcessSteps } from "@/components/capabilities/process-steps";
import { CTACallout } from "@/components/site/cta-callout";

export const dynamic = "force-static";

export default function CapabilitiesPage() {
  return (
    <>
      <Section className="relative overflow-hidden pb-0 md:pb-0">
        <Blob
          variant={4}
          fill="var(--color-caramel)"
          opacity={0.08}
          blur={14}
          className="-z-10 -right-16 -top-20 w-[26rem]"
        />
        {/* Single-weight display h1 (owner note 1 → EPIC-012 TASK-053) with
            the preview's ink→soft gradient fill. Copy unchanged. */}
        <h1 className="text-display font-display display-gradient">
          What I can do for you
        </h1>
      </Section>

      <Section>
        <ServiceTabs />
      </Section>

      <TechnologiesSection />

      <Section>
        <Eyebrow>How I work</Eyebrow>
        <h2 className="mt-3 text-heading font-display text-ink">
          What working with me <span className="font-extralight">looks like</span>
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
