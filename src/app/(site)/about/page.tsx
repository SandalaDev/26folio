import { AboutIntro } from "@/components/about/about-intro";
import { StickyCard } from "@/components/about/sticky-card";
import { InterestsModal } from "@/components/about/interests-modal";
import { BioModal } from "@/components/about/bio-modal";
import { Timeline } from "@/components/about/timeline";
import { MagazineSection } from "@/components/about/magazine-section";
import { SocialLinks } from "@/components/about/social-links";
import { Section } from "@/components/site/section";
import { CTACallout } from "@/components/site/cta-callout";

export const dynamic = "force-static";

export default function AboutPage() {
  return (
    <>
      <AboutIntro />

      <Section>
        <div className="grid gap-12 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <StickyCard
              title="The way I am"
              description="Interests, presented by category."
            >
              <InterestsModal />
            </StickyCard>
            <StickyCard title="Who I am" description="The detailed biography.">
              <BioModal />
            </StickyCard>
          </div>
          <Timeline />
        </div>
      </Section>

      <MagazineSection />

      <Section className="flex flex-col gap-6">
        <SocialLinks />
      </Section>

      <CTACallout
        heading="Like how I think?"
        body="If you've read this far, you already know more about how I work than most agencies will tell you. Let's talk about what you're building."
        ctaLabel="Want to work with me"
        href="/contact"
      />
    </>
  );
}
