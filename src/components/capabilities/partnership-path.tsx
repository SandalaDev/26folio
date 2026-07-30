"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Section } from "@/components/site/section";
import { partnershipPhases } from "@/lib/capabilities";
import { prefersReducedMotion } from "@/lib/motion";

function PartnershipPath() {
  const rootRef = React.useRef<HTMLElement | null>(null);

  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-partnership-line]",
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left",
          ease: "none",
          scrollTrigger: {
            trigger: "[data-partnership-track]",
            start: "top 72%",
            end: "bottom 48%",
            scrub: 1,
          },
        },
      );

      gsap.from("[data-phase-card]", {
        autoAlpha: 0,
        y: 28,
        duration: 0.65,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-partnership-track]",
          start: "top 72%",
          once: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <Section ref={rootRef}>
      <div className="grid gap-12 border-b border-border pb-16 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-20 md:pb-20">
        <div>
          <p className="eyebrow text-rose">Modern delivery, senior judgment</p>
          <h2 className="mt-4 font-display text-heading text-ink">
            Faster production does not remove{" "}
            <span className="font-extralight">accountability.</span>
          </h2>
        </div>
        <div className="space-y-5 text-muted">
          <p>
            AI-assisted engineering has reduced the time required for many
            production tasks. It has not removed the need for architecture,
            product judgment, testing, security, or accountability.
          </p>
          <p>
            I use modern tools to accelerate research, implementation, testing,
            and documentation. I remain responsible for what gets built, how
            the pieces fit together, how the system fails, and whether it
            solves the business problem.
          </p>
          <p className="font-medium text-ink">
            You work directly with the person making those decisions. There are
            no account-manager handoffs or ticket queues between the
            conversation and the code.
          </p>
        </div>
      </div>

      <div className="pt-16 md:pt-20">
        <p className="eyebrow text-caramel">How the partnership works</p>
        <h2 className="mt-4 max-w-4xl font-display text-heading text-ink">
          Useful change arrives in{" "}
          <span className="font-extralight">three connected movements.</span>
        </h2>

        <div data-partnership-track className="relative mt-12">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-border md:block">
            <div
              data-partnership-line
              className="h-px bg-gradient-to-r from-rose via-peach to-caramel"
            />
          </div>
          <ol className="grid gap-8 md:grid-cols-3">
            {partnershipPhases.map((phase, index) => (
              <li
                key={phase.index}
                data-phase-card
                className="relative border-t border-border bg-background pt-7 md:border-t-0 md:pt-16"
              >
                <span
                  className={`absolute left-0 top-0 flex h-14 w-14 items-center justify-center border bg-background font-mono text-xs md:top-0 ${
                    index % 2 === 0
                      ? "border-rose text-rose"
                      : "border-caramel text-caramel"
                  }`}
                >
                  {phase.index}
                </span>
                <h3 className="font-display text-2xl font-semibold text-ink">
                  {phase.title}
                </h3>
                <p className="mt-4 text-muted">{phase.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <p className="measure mt-12 border-l border-rose pl-5 text-sm text-soft">
          Engagements are structured month to month unless agreed otherwise.
          The fee, available capacity, communication rhythm, support
          expectations, and included work are agreed before development begins.
          Hosting and third-party services remain in your accounts and are
          billed directly to you.
        </p>
      </div>
    </Section>
  );
}

export { PartnershipPath };
