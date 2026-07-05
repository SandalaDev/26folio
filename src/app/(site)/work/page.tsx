import { Section } from "@/components/site/section";
import { MeshBg } from "@/components/site/mesh-bg";
import { WorkGrid } from "@/components/work/work-grid";
import { CTACallout } from "@/components/site/cta-callout";

export const dynamic = "force-static";

export default function WorkPage() {
  return (
    <>
      <Section className="relative overflow-hidden">
        <MeshBg tone="rose" className="-z-10" />
        {/* Single-weight display h1 (owner note 1 → EPIC-012 TASK-053) with
            the preview's ink→soft gradient fill. Copy unchanged. */}
        <h1 className="text-display font-display display-gradient">
          A few things I&apos;ve shipped
        </h1>
      </Section>

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
