import { AboutIntro } from "@/components/about/about-intro";
import { StickyCard } from "@/components/about/sticky-card";
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
              other, with the epoch scroll indicator beneath them. When
              pinned, the column stretches to the viewport bottom (min-h
              matches the md:top-20 offset) so the socials sit at the bottom
              edge via mt-auto. */}
          <div className="flex flex-col gap-5 md:sticky md:top-20 md:min-h-[calc(100dvh-6.5rem)] md:self-start">
            <StickyCard
              title="Who I am"
              description="Learn more about my background, interests, values and the experiences that shaped who I am today."
              cta="Read my biography"
              imageSrc="/images/logo/logo_combo-peach.svg"
              imageFit="contain"
            >
              <BioModal />
            </StickyCard>
            {/* EPIC-016 TASK-065: the modal became a page — the card now
                walks visitors to /about/the-way-i-am. */}
            <StickyCard
              title="The way I am"
              description="My principles, inspirations, creative pursuits, and the things I care about outside of work."
              cta="Explore my interests"
              href="/about/the-way-i-am"
              imageSrc="/images/abe-about.png"
              imageAlt="Abe Sandala, off the clock"
            />
            <div className="mt-6">
              <EpochNav />
            </div>
            {/* Owner tweak (2026-07-10): socials live under the epoch
                indicators, pushed to the viewport bottom while the column
                is pinned. */}
            <div className="mt-10 md:mt-auto">
              <SocialLinks />
            </div>
          </div>
        </div>
      </Section>

      <MagazineSection />

      <DualCtaBand />
    </>
  );
}
