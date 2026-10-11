import { Section } from "@/components/site/section";
import { PageHero } from "@/components/site/page-hero";
import { MeshBg } from "@/components/site/mesh-bg";
import { WorkGrid } from "@/components/work/work-grid";
import { CTACallout } from "@/components/site/cta-callout";

export const dynamic = "force-static";

export default function WorkPage() {
  return (
    <>
      {/* EPIC-020: shared centered manifesto opener. The supporting line states
          the three kinds of credit up front (EPIC-029), so a visitor never has to
          infer them card by card. No count: projects join as their assets land. */}
      <PageHero
        title="A few things I've shipped"
        backdrop={<MeshBg tone="rose" className="-z-10" />}
      >
        <p className="measure text-subhead text-soft">
          My own ventures, a brand identity for a client, and brand work I set
          myself. Each card says which is which.
        </p>
      </PageHero>

      <Section className="pt-0 md:pt-0">
        <WorkGrid />
      </Section>

      <CTACallout
        heading="Got a project in mind?"
        body="Tell me what you're trying to build and I'll tell you straight whether I'm the right fit."
        ctaLabel="Start a project"
        href="/contact"
      />
    </>
  );
}
