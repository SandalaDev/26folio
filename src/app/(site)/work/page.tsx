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
        <h1 className="text-display font-display font-extralight text-ink">
          A few things <span className="font-semibold">I&apos;ve shipped</span>
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
