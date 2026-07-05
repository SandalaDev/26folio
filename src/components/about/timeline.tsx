"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { prefersReducedMotion } from "@/lib/motion";

// Placeholder beats — real career history is an owner-confirmed follow-up
// (epic decision #1).
const BEATS = [
  { id: "beat-1", title: "Milestone one", description: "A short description goes here." },
  { id: "beat-2", title: "Milestone two", description: "A short description goes here." },
  { id: "beat-3", title: "Milestone three", description: "A short description goes here." },
  { id: "beat-4", title: "Milestone four", description: "A short description goes here." },
] as const;

/**
 * Timeline — GSAP ScrollTrigger reveal-on-scroll (12-ui-element-map.md §3
 * About #2b). One trigger per beat; each beat stays in normal document flow
 * so reduced-motion / pre-hydration renders the full content immediately.
 */
function Timeline() {
  const containerRef = React.useRef<HTMLOListElement | null>(null);

  React.useEffect(() => {
    if (prefersReducedMotion()) return;

    const container = containerRef.current;
    if (!container) return;

    gsap.registerPlugin(ScrollTrigger);
    const beats = container.querySelectorAll<HTMLElement>("[data-beat]");

    const ctx = gsap.context(() => {
      beats.forEach((beat) => {
        gsap.fromTo(
          beat,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: beat,
              start: "top 80%",
            },
          },
        );
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <ol ref={containerRef} className="flex flex-col gap-10 border-l border-border pl-8">
      {BEATS.map((beat) => (
        <li key={beat.id} data-beat className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[2.3rem] top-1.5 size-3 rounded-full bg-rose"
          />
          <h3 className="font-display text-xl font-semibold text-ink">{beat.title}</h3>
          {/* soft = tertiary/meta text (§2) — timeline meta line. */}
          <p className="mt-2 text-soft">{beat.description}</p>
        </li>
      ))}
    </ol>
  );
}

export { Timeline };
