import { PageHero } from "@/components/site/page-hero";
import { Blob } from "@/components/site/blob";

/**
 * AboutIntro — hybrid business/personal opening (12-ui-element-map.md §3
 * About #1). Copy is Variation C from the owner's content blueprint
 * (EPIC-014, 2026-07-06). EPIC-020: recomposed onto the shared centered
 * PageHero so the About opener matches the /about/the-way-i-am hero. Copy
 * unchanged.
 */
function AboutIntro() {
  return (
    <PageHero
      title="Engineer. Designer. Builder."
      backdrop={
        <Blob
          variant={2}
          fill="var(--color-rose)"
          opacity={0.07}
          blur={14}
          className="-right-20 -top-12 w-[28rem]"
        />
      }
    >
      <p className="measure text-subhead text-muted">
        I&apos;m Abraham Sandala, a self-taught software engineer and designer based in Lusaka,
        Zambia. I build custom web systems for businesses that have outgrown templates,
        subscriptions and one-size-fits-all software. My goal isn&apos;t simply to deliver an
        application, but to create software that reflects how a business actually operates, remains
        understandable years later, and can be owned, extended and maintained without being locked
        into someone else&apos;s platform.
      </p>
    </PageHero>
  );
}

export { AboutIntro };
