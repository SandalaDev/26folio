import { Section } from "@/components/site/section";
import { PageHero } from "@/components/site/page-hero";
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
      {/* EPIC-020: shared centered manifesto opener. */}
      <PageHero
        title="What I can do for you"
        className="pb-0 md:pb-0"
        backdrop={
          <Blob
            variant={4}
            fill="var(--color-caramel)"
            opacity={0.08}
            blur={14}
            className="-z-10 -right-16 -top-20 w-[26rem]"
          />
        }
      />

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
