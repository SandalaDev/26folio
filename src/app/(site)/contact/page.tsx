import { Section } from "@/components/site/section";
import { Blob } from "@/components/site/blob";
import { ContactForm } from "@/components/site/contact-form";
import { SocialLinks } from "@/components/about/social-links";

export const dynamic = "force-static";

export const metadata = {
  title: "Contact",
  description:
    "Tell me what you are trying to build. I reply to the inquiries that fit.",
};

export default function ContactPage() {
  return (
    <>
      {/* Page head: display h1 + subhead, with a quiet blob accent. */}
      <Section className="relative overflow-hidden pb-0 md:pb-0">
        <Blob
          variant={2}
          fill="var(--color-rose)"
          opacity={0.07}
          blur={14}
          className="-right-20 -top-12 w-[28rem]"
        />
        {/* ink→soft gradient fill — the preview h1 signature (TASK-053). */}
        <h1 className="text-display font-display display-gradient">
          Let&apos;s talk.
        </h1>
        <p className="measure mt-6 text-subhead text-muted">
          Tell me what you are trying to build and I will tell you straight
          whether I am the right fit. The more concrete the message, the faster
          the reply.
        </p>
      </Section>

      {/* Form + contact details. */}
      <Section className="grid gap-16 pt-10 md:grid-cols-12 md:pt-16">
        <div className="md:col-span-7">
          <ContactForm />
        </div>

        <aside className="flex flex-col gap-8 md:col-span-4 md:col-start-9">
          <div className="flex flex-col gap-3">
            <p className="eyebrow text-rose">Direct</p>
            <p className="text-muted">
              Prefer a channel you already use? Reach me through any of these and
              say hello.
            </p>
            <SocialLinks />
          </div>
          <div className="flex flex-col gap-3">
            <p className="eyebrow text-rose">What happens next</p>
            <p className="text-muted">
              I read every message and reply to the ones that fit. A first call
              is short and free: we scope the problem before anyone names a
              stack or a price.
            </p>
          </div>
        </aside>
      </Section>
    </>
  );
}
