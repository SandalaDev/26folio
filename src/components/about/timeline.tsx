"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { prefersReducedMotion } from "@/lib/motion";

/**
 * Timeline — GSAP ScrollTrigger reveal-on-scroll (12-ui-element-map.md §3
 * About #2b). Restructured (EPIC-014/TASK-057) around the owner's content
 * blueprint (2026-07-06): a three-epoch career narrative, not a flat
 * milestone list. Every card stays in normal document flow so reduced-motion
 * / pre-hydration renders the full content immediately; only the entrance
 * animation is gated.
 */

interface FoundationCard {
  marker: string;
  title: string;
  description: string;
  skills: string[];
  seed: string;
}

interface ConvergenceCard {
  marker: string;
  primary: string;
  parallel: string;
  converging: string;
}

interface AwakeningCard {
  marker: string;
  milestone: string;
  description: string;
  pointsTo: string;
  current?: boolean;
}

const FOUNDATION_CARDS: FoundationCard[] = [
  {
    marker: "2002",
    title: "First design tool",
    description: "A teenager discovers Macromedia Fireworks and digital craft.",
    skills: ["Visual composition", "Layout", "Obsessive pixel care"],
    seed: "The design eye.",
  },
  {
    marker: "Telecom entry",
    title: "Hands-on artisan",
    description: "Enters the industry with tools, not titles.",
    skills: ["Electrical and RF fundamentals", "Field discipline"],
    seed: "Respect for physical systems.",
  },
  {
    marker: "Field Operations Engineer",
    title: "RAN, microwave, and fiber",
    description:
      "Radio access networks, microwave links, fiber backhaul, hybrid DC, solar, and generator power.",
    skills: ["Fault diagnosis under pressure", "Redundancy thinking"],
    seed: "Uptime instincts: the knowledge of what failure actually costs.",
  },
];

const CONVERGENCE_CARDS: ConvergenceCard[] = [
  {
    marker: "Early years",
    primary: "QA Engineer, largest telecom infrastructure provider in the country.",
    parallel: "Graphic design side hustle: brands, print, client work.",
    converging: "Quality as discipline meets craft as instinct.",
  },
  {
    marker: "Scale",
    primary: "Huawei QA Engineer, 1,000-tower turnkey off-grid solar project (state-backed).",
    parallel: "The website-builder years: Adobe Muse, Elementor, Webflow client sites.",
    converging: "Shipping at national scale by day, hitting no-code ceilings by night.",
  },
  {
    marker: "Promotion",
    primary: "Implementation Manager, delivers the remaining 500+ towers.",
    parallel: "Every builder tool eventually says no.",
    converging:
      "Leading mission-critical delivery while realizing the bottleneck in the creative work was never the ideas. It was the tools.",
  },
];

const AWAKENING_CARDS: AwakeningCard[] = [
  {
    marker: "2021",
    milestone: "Self-taught, from scratch",
    description:
      "No bootcamp cohort, no safety net: the decision to stop being limited by other people's tools.",
    pointsTo: "Everything after.",
  },
  {
    marker: "The vindication",
    milestone: "Payload CMS",
    description:
      "The framework that proves the thesis: custom, content-first applications, the kind of software builders could never quite deliver.",
    pointsTo: "Code as the medium, not the obstacle.",
  },
  {
    marker: "Professional practice",
    milestone: "Full product ownership",
    description:
      "From full-stack work to full product ownership: strategy, business logic, UI/UX, architecture, deployment, delivered end to end for real clients.",
    pointsTo: "The one-person product team.",
  },
  {
    marker: "Now",
    milestone: "Web Systems Developer",
    description:
      "Building AI-augmented, agentic development systems; studying what comes after SaaS and which business model replaces it.",
    pointsTo: "Open. Deliberately.",
    current: true,
  },
];

function EpochHeader({
  numeral,
  title,
  tagline,
  epigraph,
}: {
  numeral: string;
  title: string;
  tagline: string;
  epigraph: string;
}) {
  return (
    <div className="sticky top-24 z-10 mb-8 bg-background/85 py-3 backdrop-blur-sm">
      <span className="eyebrow text-rose">
        Epoch {numeral} — {title}
      </span>
      <h3 className="mt-1 font-display text-2xl font-semibold text-ink">{tagline}</h3>
      <p className="mt-2 text-sm text-muted italic">{epigraph}</p>
    </div>
  );
}

function BeatMarker({ accent = false }: { accent?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute -left-[2.3rem] top-1.5 size-3 rounded-full ${
        accent ? "bg-rose" : "bg-border-2"
      } ${accent ? "animate-pulse" : ""}`}
    />
  );
}

function Timeline() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

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
    <div ref={containerRef} className="flex flex-col gap-16">
      <div className="flex flex-col gap-4">
        <h2 className="font-display text-heading text-ink">How I Became a Web Systems Developer</h2>
        <p className="measure text-muted">
          Every career has a shape. Mine has three movements. It starts with
          curiosity: a kid opening Macromedia Fireworks in 2002, a young man
          climbing his first tower, collecting skills with no master plan
          connecting them. It deepens into a long stretch of divided years,
          building national telecom infrastructure by day and designing
          brands and websites in every spare hour, capable in both worlds and
          quietly restless in each, increasingly certain that neither half
          was the whole answer. And it resolves in 2021, when I taught myself
          to code and found the one discipline that demands everything I had
          been accumulating: the systems thinking, the design eye, the need
          to be genuinely, relentlessly challenged. Three epochs. One
          direction. Here is how it happened.
        </p>
      </div>

      <section>
        <EpochHeader
          numeral="I"
          title="Foundation"
          tagline="Seeds, planted early"
          epigraph="Every skill in this era looked unrelated at the time. None of them were."
        />
        <ol className="flex flex-col gap-10 border-l border-border pl-8">
          {FOUNDATION_CARDS.map((card) => (
            <li key={card.marker} data-beat className="relative">
              <BeatMarker />
              <span className="eyebrow text-caramel">{card.marker}</span>
              <h4 className="mt-1 font-display text-xl font-semibold text-ink">{card.title}</h4>
              <p className="mt-2 text-muted">{card.description}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {card.skills.map((skill) => (
                  <li
                    key={skill}
                    className="border border-border px-2.5 py-1 text-xs text-soft"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-rose">Seed planted: {card.seed}</p>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <EpochHeader
          numeral="II"
          title="Convergence"
          tagline="Two crafts, one person"
          epigraph="Infrastructure by day, design by night: two full practices running in parallel, and a growing suspicion that neither one alone was the point."
        />
        <ol className="flex flex-col gap-10 border-l border-border pl-8">
          {CONVERGENCE_CARDS.map((card) => (
            <li key={card.marker} data-beat className="relative">
              <BeatMarker />
              <span className="eyebrow text-caramel">{card.marker}</span>
              <div className="mt-2 grid gap-4 sm:grid-cols-2">
                <div className="border-l-2 border-border-2 pl-4">
                  <span className="eyebrow text-muted">Telecom</span>
                  <p className="mt-1 text-ink">{card.primary}</p>
                </div>
                <div className="border-l-2 border-rose/40 pl-4">
                  <span className="eyebrow text-muted">Design</span>
                  <p className="mt-1 text-ink">{card.parallel}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-rose">Converging: {card.converging}</p>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <EpochHeader
          numeral="III"
          title="Awakening"
          tagline="The path that demands all of it"
          epigraph="In 2021 I stopped negotiating with my tools and taught myself to code. It's the most intellectually alive I've ever been."
        />
        <ol className="flex flex-col gap-10 border-l border-border pl-8">
          {AWAKENING_CARDS.map((card) => (
            <li
              key={card.marker}
              data-beat
              className={`relative ${card.current ? "bg-surface p-5" : ""}`}
            >
              <BeatMarker accent={card.current} />
              <span className="eyebrow text-caramel">{card.marker}</span>
              <h4 className="mt-1 font-display text-xl font-semibold text-ink">{card.milestone}</h4>
              <p className="mt-2 text-muted">{card.description}</p>
              <p className="mt-3 text-sm text-rose">Points to: {card.pointsTo}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

export { Timeline };
