"use client";

import * as React from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowDown, ArrowRight } from "@phosphor-icons/react";

import { Blob } from "@/components/site/blob";
import { Section } from "@/components/site/section";
import { prefersReducedMotion } from "@/lib/motion";

function CapabilitiesHero() {
  const rootRef = React.useRef<HTMLElement | null>(null);

  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { duration: 0.7, ease: "power3.out" },
      });

      timeline
        .from("[data-hero-copy]", {
          autoAlpha: 0,
          y: 32,
          stagger: 0.09,
        })
        .from(
          "[data-system-node]",
          {
            autoAlpha: 0,
            scale: 0.82,
            stagger: { amount: 0.35, from: "center" },
          },
          0.18,
        )
        .from(
          "[data-system-line]",
          {
            strokeDashoffset: 180,
            duration: 1.1,
            stagger: 0.07,
          },
          0.28,
        );

      gsap.to("[data-system-orbit]", {
        rotation: 360,
        duration: 36,
        ease: "none",
        repeat: -1,
        transformOrigin: "50% 50%",
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <Section
      ref={rootRef}
      className="relative min-h-screen overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40"
    >
      <Blob
        variant={2}
        fill="var(--color-rose)"
        opacity={0.07}
        blur={16}
        className="-z-10 -left-32 top-12 w-[32rem]"
      />
      <Blob
        variant={4}
        fill="var(--color-caramel)"
        opacity={0.08}
        blur={18}
        className="-z-10 -right-20 bottom-0 w-[28rem]"
      />

      <div className="grid min-h-[calc(100vh-10rem)] items-center gap-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)]">
        <div className="relative z-10">
          <p data-hero-copy className="eyebrow text-rose">
            Capabilities &amp; services
          </p>
          <h1
            data-hero-copy
            className="mt-5 max-w-5xl font-display text-display text-ink"
          >
            Custom software for businesses that have{" "}
            <span className="font-extralight text-soft">
              outgrown manual work.
            </span>
          </h1>
          <p data-hero-copy className="measure mt-8 text-subhead text-muted">
            I design, build, and continuously improve systems that help
            businesses collect payments, serve customers, connect operations,
            and remove repetitive work.
          </p>
          <p data-hero-copy className="measure mt-6 text-muted">
            You do not need a software specification. Bring the delayed
            payments, repeated data entry, customer complaints, unreliable
            reports, or the process held together with WhatsApp and
            spreadsheets. We will work out what technology can—and should—do.
          </p>

          <div
            data-hero-copy
            className="mt-9 flex flex-col gap-4 border-l border-rose pl-5 text-sm text-soft sm:flex-row sm:items-center sm:gap-8"
          >
            <span>One senior engineer.</span>
            <span>Direct collaboration.</span>
            <span>Systems you own.</span>
          </div>

          <div data-hero-copy className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="group inline-flex min-h-12 items-center gap-3 border border-rose bg-rose px-6 font-medium text-background transition-colors hover:bg-peach"
            >
              Describe what is not working
              <ArrowRight
                size={18}
                weight="bold"
                className="transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="#services"
              className="group inline-flex min-h-12 items-center gap-3 border border-border-2 px-6 font-medium text-ink transition-colors hover:border-caramel hover:text-caramel"
            >
              See what I build
              <ArrowDown
                size={18}
                weight="bold"
                className="transition-transform group-hover:translate-y-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>

        <div
          className="relative mx-auto aspect-square w-full max-w-xl"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 600 600"
            className="absolute inset-0 h-full w-full overflow-visible"
          >
            <g
              data-system-orbit
              fill="none"
              stroke="var(--color-border-2)"
              strokeWidth="1"
            >
              <circle cx="300" cy="300" r="232" strokeDasharray="5 12" />
              <circle cx="300" cy="300" r="162" strokeDasharray="2 10" />
            </g>
            {[
              [300, 300, 300, 92],
              [300, 300, 492, 235],
              [300, 300, 418, 480],
              [300, 300, 152, 456],
              [300, 300, 112, 210],
            ].map(([x1, y1, x2, y2], index) => (
              <line
                key={index}
                data-system-line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={index % 2 === 0 ? "var(--color-rose)" : "var(--color-caramel)"}
                strokeWidth="1.5"
                strokeDasharray="180"
                strokeDashoffset="0"
                opacity="0.7"
              />
            ))}
          </svg>

          <div
            data-system-node
            className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-rose bg-surface text-center font-display text-lg font-semibold text-ink"
          >
            Useful
            <br />
            system
          </div>
          <div
            data-system-node
            className="absolute left-1/2 top-4 -translate-x-1/2 border border-border-2 bg-background px-4 py-3 text-sm text-soft"
          >
            Payments
          </div>
          <div
            data-system-node
            className="absolute right-0 top-1/3 border border-border-2 bg-background px-4 py-3 text-sm text-soft"
          >
            Customers
          </div>
          <div
            data-system-node
            className="absolute bottom-4 right-16 border border-border-2 bg-background px-4 py-3 text-sm text-soft"
          >
            Operations
          </div>
          <div
            data-system-node
            className="absolute bottom-10 left-8 border border-border-2 bg-background px-4 py-3 text-sm text-soft"
          >
            Reporting
          </div>
          <div
            data-system-node
            className="absolute left-0 top-1/3 border border-border-2 bg-background px-4 py-3 text-sm text-soft"
          >
            Automation
          </div>
        </div>
      </div>
    </Section>
  );
}

export { CapabilitiesHero };
