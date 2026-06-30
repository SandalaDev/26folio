import { Hero } from "@/components/home/hero";
import { FeaturedWork } from "@/components/home/featured-work";
import { CapabilityRail } from "@/components/home/capability-rail";
import { MagazineTeaser } from "@/components/home/magazine-teaser";
import { CTACallout } from "@/components/site/cta-callout";

export const dynamic = "force-static";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedWork />
      <CapabilityRail />
      <MagazineTeaser />
      <CTACallout
        heading="Want to work together?"
        body="Tell me what you're trying to build and I'll tell you straight whether I'm the right fit."
        ctaLabel="Let's talk"
        href="/contact"
      />
    </>
  );
}
