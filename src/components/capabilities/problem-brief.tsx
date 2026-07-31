"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Section } from "@/components/site/section";
import { problemSignals } from "@/lib/capabilities";
import { prefersReducedMotion } from "@/lib/motion";

function ProblemBrief() {
  const rootRef = React.useRef<HTMLElement | null>(null);

  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-problem-wire]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: {
            trigger: root,
            start: "top 70%",
            end: "bottom 70%",
            scrub: 1,
          },
        },
      );

      ScrollTrigger.batch("[data-problem-signal]", {
        start: "top 86%",
        once: true,
        interval: 0.08,
        batchMax: 3,
        onEnter: (items) => {
          gsap.from(items, {
            autoAlpha: 0,
            x: 28,
            duration: 0.55,
            ease: "power3.out",
            stagger: 0.08,
          });
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <Section ref={rootRef} className="border-y border-border bg-surface/30">
      <div className="grid gap-14 lg:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.2fr)] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow text-caramel">Start with the friction</p>
          <h2 className="mt-4 font-display text-heading text-ink">
            You do not need to know{" "}
            <span className="font-extralight">what software you need.</span>
          </h2>
          <p className="measure mt-6 text-muted">
            Most business owners know where the operation is slowing down, but
            not what today&apos;s technology makes possible. That is enough to
            begin.
          </p>
        </div>

        <div className="relative pl-8 md:pl-12">
          <div className="absolute bottom-0 left-0 top-0 w-px bg-border">
            <div
              data-problem-wire
              className="h-full w-px bg-gradient-to-b from-rose via-peach to-caramel"
            />
          </div>
          <ol className="flex flex-col">
            {problemSignals.map((signal, index) => (
              <li
                key={signal}
                data-problem-signal
                className="relative border-b border-border py-8 first:pt-0 last:border-b-0 last:pb-0"
              >
                <span className="absolute -left-10 top-9 h-3 w-3 border border-rose bg-background first:top-1 md:-left-14" />
                <span className="font-mono text-xs text-soft">
                  signal / {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 font-display text-2xl font-medium text-ink md:text-3xl">
                  {signal}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-12 border border-caramel/50 bg-surface p-6 md:p-8">
            <p className="font-display text-xl font-semibold text-caramel">
              The decision comes before the build.
            </p>
            <p className="mt-3 text-muted">
              I translate the business problem into the smallest useful system.
              If an existing product solves it cleanly, I will recommend it.
              Custom software earns its place when ownership, workflow fit,
              integration, or long-term control makes it worthwhile.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

export { ProblemBrief };
