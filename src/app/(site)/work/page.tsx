import { Section } from "@/components/site/section";
import { PageHero } from "@/components/site/page-hero";
import { MeshBg } from "@/components/site/mesh-bg";
import { WorkGrid } from "@/components/work/work-grid";
import { CTACallout } from "@/components/site/cta-callout";

export const dynamic = "force-static";

export default function WorkPage() {
  return (
    <>
      {/* EPIC-020: shared centered manifesto opener. EPIC-026 TASK-101 fills the
          supporting line: it states the client-versus-self split up front, so a
          visitor never has to infer it card by card. */}
      <PageHero
        title="A few things I've shipped"
        backdrop={<MeshBg tone="rose" className="-z-10" />}
      >
        <p className="measure text-subhead text-soft">
          Four design and branding projects: identity, packaging, print and
          interface. One was commissioned; the other three I set myself, and each
          says so.
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
