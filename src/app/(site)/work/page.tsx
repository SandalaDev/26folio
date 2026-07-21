import { Section } from "@/components/site/section";
import { PageHero } from "@/components/site/page-hero";
import { MeshBg } from "@/components/site/mesh-bg";
import { WorkGrid } from "@/components/work/work-grid";
import { CTACallout } from "@/components/site/cta-callout";

export const dynamic = "force-static";

export default function WorkPage() {
  return (
    <>
      {/* EPIC-020: shared centered manifesto opener. */}
      <PageHero
        title="A few things I've shipped"
        backdrop={<MeshBg tone="rose" className="-z-10" />}
      />

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
