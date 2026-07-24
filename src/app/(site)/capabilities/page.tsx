import { Section } from "@/components/site/section";
import { PageHero } from "@/components/site/page-hero";
import { Eyebrow } from "@/components/site/eyebrow";
import { Blob } from "@/components/site/blob";
import { CapabilityExplorer } from "@/components/capabilities/capability-explorer";
import { EngagementModel } from "@/components/capabilities/engagement-model";
import { TechnologiesSection } from "@/components/capabilities/technologies-section";
import { CTACallout } from "@/components/site/cta-callout";

export const dynamic = "force-static";

/**
 * Capabilities (EPIC-021): repositioned from a service list to the
 * engineering-partner narrative. Order: hero, four-pillar explorer, the
 * one-engineer economics strip, the Build/Evolve model, technologies as the
 * proof layer, conversion band. Strategy source:
 * planning/content/page-copy/Capabilities.md.
 */
export default function CapabilitiesPage() {
  return (
    <>
      {/* EPIC-020: shared centered manifesto opener. */}
      <PageHero
        title="Systems your business runs on"
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
      >
        <p className="measure text-muted">
          Designed and built in weeks, improved every month, owned by you
          from day one.
        </p>
      </PageHero>

      <Section>
        <h2 className="text-heading font-display text-ink">
          What I build, <span className="font-extralight">and who it&apos;s for</span>
        </h2>
        <p className="measure mt-6 text-muted">
          Four pillars. Open the one that sounds like your problem.
        </p>
        <div className="mt-10">
          <CapabilityExplorer />
        </div>
      </Section>

      <Section>
        <h2 className="text-heading font-display text-ink">
          Why one engineer <span className="font-extralight">is enough</span>
        </h2>
        <p className="measure mt-6 text-muted">
          AI collapsed the cost of writing code. Judgment is what you hire
          now: what to build, what to skip, what breaks at 2am. One senior
          engineer carries discovery, build, and operation without a handoff
          chain.
        </p>
        <p className="measure mt-4 text-muted">
          Agencies bill for coordination. Platforms bill for rent. Here, the
          person you talk to is the person who ships.
        </p>
      </Section>

      <Section>
        <Eyebrow>How we work</Eyebrow>
        <h2 className="mt-3 text-heading font-display text-ink">
          What working with me <span className="font-extralight">looks like</span>
        </h2>
        <div className="mt-10">
          <EngagementModel />
        </div>
      </Section>

      <TechnologiesSection />

      <CTACallout
        heading="Ready to get specific?"
        body="Tell me what you're trying to build and I'll tell you straight whether I'm the right fit."
        ctaLabel="Request a proposal & quote"
        href="/contact"
      />
    </>
  );
}
