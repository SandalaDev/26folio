"use client";

import * as React from "react";
import { ArrowDown, ArrowRight } from "@phosphor-icons/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Section } from "@/components/site/section";
import { partnershipPhases } from "@/lib/capabilities";

function PartnershipPath() {
  const rootRef = React.useRef<HTMLElement | null>(null);

  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add(
        {
          desktop: "(min-width: 900px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop, reduceMotion } = context.conditions as {
            desktop: boolean;
            reduceMotion: boolean;
          };

          if (reduceMotion) return;

          if (desktop) {
            const pin = root.querySelector<HTMLElement>("[data-partnership-pin]");
            const track = root.querySelector<HTMLElement>("[data-partnership-track]");
            if (!pin || !track) return;

            const travel = () => Math.max(0, track.scrollWidth - pin.clientWidth);

            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: pin,
                start: "top 12%",
                end: () => `+=${Math.max(1100, travel() * 1.15)}`,
                pin,
                scrub: 0.85,
                invalidateOnRefresh: true,
                anticipatePin: 1,
              },
            });

            timeline
              .to(
                track,
                {
                  x: () => -travel(),
                  ease: "none",
                },
                0,
              )
              .fromTo(
                "[data-partnership-meter]",
                { scaleX: 0 },
                {
                  scaleX: 1,
                  transformOrigin: "left",
                  ease: "none",
                },
                0,
              )
              .to(
                "[data-phase-glyph]",
                {
                  rotation: 90,
                  ease: "none",
                  stagger: 0.18,
                },
                0,
              );

            gsap.from("[data-phase-card]", {
              autoAlpha: 0,
              y: 28,
              duration: 0.65,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: pin,
                start: "top 72%",
                once: true,
              },
            });
          } else {
            gsap.from("[data-phase-card]", {
              autoAlpha: 0,
              y: 24,
              duration: 0.55,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: "[data-partnership-track]",
                start: "top 78%",
                once: true,
              },
            });
          }
        },
      );

      return () => media.revert();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <Section ref={rootRef}>
      <div className="border-border grid gap-12 border-b pb-16 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-20 md:pb-20">
        <div>
          <p className="eyebrow text-rose">Modern delivery, senior judgment</p>
          <h2 className="font-display text-heading text-ink mt-4">
            Faster production does not remove{" "}
            <span className="font-extralight">accountability.</span>
          </h2>
        </div>
        <div className="text-muted space-y-5">
          <p>
            AI-assisted engineering has reduced the time required for many production tasks. It has
            not removed the need for architecture, product judgment, testing, security, or
            accountability.
          </p>
          <p>
            I use modern tools to accelerate research, implementation, testing, and documentation. I
            remain responsible for what gets built, how the pieces fit together, how the system
            fails, and whether it solves the business problem.
          </p>
          <p className="text-ink font-medium">
            You work directly with the person making those decisions. There are no account-manager
            handoffs or ticket queues between the conversation and the code.
          </p>
        </div>
      </div>

      <div className="pt-16 md:pt-20">
        <p className="eyebrow text-caramel">How the partnership works</p>
        <h2 className="font-display text-heading text-ink mt-4 max-w-4xl">
          Useful change arrives in{" "}
          <span className="font-extralight">three connected movements.</span>
        </h2>

        <div
          data-partnership-pin
          className="border-border relative mt-12 overflow-hidden border-y py-6 md:min-h-[34rem] md:py-8"
        >
          <div className="mb-6 hidden items-center justify-between gap-8 md:flex">
            <p className="text-soft font-mono text-xs">Scroll to move through the engagement</p>
            <div className="flex min-w-64 items-center gap-3">
              <span className="text-soft font-mono text-[0.65rem]">01</span>
              <div className="bg-border h-px flex-1">
                <div data-partnership-meter className="bg-rose h-px w-full" />
              </div>
              <span className="text-soft font-mono text-[0.65rem]">03</span>
            </div>
          </div>

          <ol data-partnership-track className="flex flex-col gap-4 md:w-max md:flex-row md:gap-6">
            {partnershipPhases.map((phase, index) => (
              <li
                key={phase.index}
                data-phase-card
                className="group border-border bg-surface relative grid min-h-80 overflow-hidden border p-6 md:min-h-[24rem] md:w-[min(46rem,70vw)] md:grid-cols-[10rem_1fr] md:p-0"
              >
                <div className="border-border relative flex items-start justify-between border-b pb-6 md:flex-col md:border-r md:border-b-0 md:p-8">
                  <span className="font-display text-ink/12 text-7xl leading-none font-extralight md:text-8xl">
                    {phase.index}
                  </span>
                  <span
                    data-phase-glyph
                    className={`flex h-12 w-12 items-center justify-center border ${
                      index % 2 === 0 ? "border-rose text-rose" : "border-caramel text-caramel"
                    }`}
                  >
                    <ArrowRight
                      className="hidden md:block"
                      size={20}
                      weight="thin"
                      aria-hidden="true"
                    />
                    <ArrowDown className="md:hidden" size={20} weight="thin" aria-hidden="true" />
                  </span>
                </div>
                <div className="flex flex-col justify-end pt-7 md:p-10">
                  <p className="text-soft font-mono text-xs">movement / {phase.index}</p>
                  <h3 className="font-display text-ink mt-4 max-w-lg text-3xl font-semibold md:text-4xl">
                    {phase.title}
                  </h3>
                  <p className="text-muted mt-5 max-w-xl">{phase.body}</p>
                </div>
                <span
                  className="bg-rose pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                  aria-hidden="true"
                />
              </li>
            ))}
          </ol>
        </div>

        <p className="measure border-rose text-soft mt-12 border-l pl-5 text-sm">
          Engagements are structured month to month unless agreed otherwise. The fee, available
          capacity, communication rhythm, support expectations, and included work are agreed before
          development begins. Hosting and third-party services remain in your accounts and are
          billed directly to you.
        </p>
      </div>
    </Section>
  );
}

export { PartnershipPath };
