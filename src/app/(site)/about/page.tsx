import { AboutIntro } from "@/components/about/about-intro";
import { StickyCard } from "@/components/about/sticky-card";
import { InterestsModal } from "@/components/about/interests-modal";
import { BioModal } from "@/components/about/bio-modal";
import { Timeline } from "@/components/about/timeline";
import { MagazineSection } from "@/components/about/magazine-section";
import { SocialLinks } from "@/components/about/social-links";
import { DualCtaBand } from "@/components/about/dual-cta-band";
import { EpochNav } from "@/components/about/epoch-nav";
import { Section } from "@/components/site/section";

export const dynamic = "force-static";

export default function AboutPage() {
  return (
    <>
      <AboutIntro />

      <Section>
        <div className="grid gap-12 md:grid-cols-2">
          <Timeline />
          {/* The whole column pins as one unit (EPIC-014 follow-up): both
              cards stay visible together instead of staggering past each
              other, with the epoch scroll indicator beneath them. */}
          <div className="flex flex-col gap-5 md:sticky md:top-20 md:self-start">
            <StickyCard
              title="Who I am"
              description="From cell towers to codebases: the full story of why I build software the way I do."
              cta="Read the full story"
              imageSrc="/images/logo/logo_combo-peach.svg"
              imageFit="contain"
            >
              <BioModal />
            </StickyCard>
            <StickyCard
              title="The way I am"
              description="The nerdiness, the design obsession, and everything I do when I'm not shipping."
              cta="Poke around"
              imageSrc="/images/abe-about.png"
              imageAlt="Abe Sandala, off the clock"
            >
              <InterestsModal />
            </StickyCard>
            <EpochNav />
          </div>
        </div>
      </Section>

      <MagazineSection />

      <Section className="flex flex-col gap-6">
        <SocialLinks />
      </Section>

      <DualCtaBand />
    </>
  );
}
