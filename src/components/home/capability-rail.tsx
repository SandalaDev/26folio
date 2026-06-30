"use client";

import * as React from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Section } from "@/components/site/section";
import { Eyebrow } from "@/components/site/eyebrow";
import { prefersReducedMotion } from "@/lib/motion";

const PANELS = [
  {
    id: "web-development",
    title: "Web development",
    description: "A site that loads fast, reads clearly, and actually converts.",
  },
  {
    id: "custom-software",
    title: "Custom software",
    description: "Internal tools built around how your team already works.",
  },
  {
    id: "ai-integration",
    title: "AI integration",
    description: "Automation that earns its place, not a chatbot bolted on.",
  },
] as const;

/**
 * CapabilityRail — GSAP ScrollTrigger pinned horizontal scroll
 * (12-ui-element-map.md §3 Home #3). Defaults to a normal stacked vertical
 * list; the pin/scrub is only wired up client-side, after mount, when motion
 * isn't reduced and the pointer is fine (architecture principle #3/#4).
 */
function CapabilityRail() {
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const trackRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReducedMotion() || isCoarsePointer) return;

    gsap.registerPlugin(ScrollTrigger);
    track.classList.remove("flex-col", "items-center");
    track.classList.add("flex-row", "items-stretch", "w-max");

    const ctx = gsap.context(() => {
      const scrollDistance = track.scrollWidth - section.clientWidth;
      if (scrollDistance <= 0) return;

      gsap.to(track, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${scrollDistance}`,
          scrub: true,
          pin: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <Section
      ref={sectionRef}
      // Pin target needs overflow control; harmless when the pin never engages.
      className="overflow-hidden"
    >
      <Eyebrow>What I do</Eyebrow>
      <h2 className="mt-3 text-3xl font-display font-semibold text-ink">
        Three ways I can help
      </h2>
      <div
        ref={trackRef}
        className="mt-10 flex flex-col items-center gap-6"
      >
        {PANELS.map((panel) => (
          <Link
            key={panel.id}
            href={`/capabilities#${panel.id}`}
            className="block w-[min(80vw,32rem)] shrink-0 border border-border bg-surface p-8"
          >
            <h3 className="font-display text-xl font-semibold text-ink">
              {panel.title}
            </h3>
            <p className="mt-3 text-muted">{panel.description}</p>
          </Link>
        ))}
      </div>
    </Section>
  );
}

export { CapabilityRail };
