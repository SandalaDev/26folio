import { Section } from "@/components/site/section";
import { Eyebrow } from "@/components/site/eyebrow";
import { WorkGrid } from "@/components/work/work-grid";
import { CTACallout } from "@/components/site/cta-callout";

export const dynamic = "force-static";

export default function WorkPage() {
  return (
    <>
      <Section>
        <Eyebrow>Work</Eyebrow>
        <h1 className="mt-3 text-display font-display text-ink">
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
