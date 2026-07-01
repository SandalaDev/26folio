import { Hero } from "@/components/home/hero";
import { FeaturedWork } from "@/components/home/featured-work";
import { CapabilityRail } from "@/components/home/capability-rail";
import { MagazineTeaser } from "@/components/home/magazine-teaser";
import { CTACallout } from "@/components/site/cta-callout";
import { getFeaturedMagazineArticles } from "@/lib/magazine";

export const dynamic = "force-static";

export default async function HomePage() {
  const articles = await getFeaturedMagazineArticles();

  return (
    <>
      <Hero />
      <FeaturedWork />
      <CapabilityRail />
      <MagazineTeaser articles={articles} />
      <CTACallout
        heading="Want to work together?"
        body="Tell me what you're trying to build and I'll tell you straight whether I'm the right fit."
        ctaLabel="Let's talk"
        href="/contact"
      />
    </>
  );
}
