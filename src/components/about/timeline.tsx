"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion } from "framer-motion";
import { Globe, Sparkle } from "@phosphor-icons/react";

import { prefersReducedMotion } from "@/lib/motion";
import { EpochWatermark, type EpochTool } from "@/components/about/epoch-icon-cycler";

/**
 * Timeline: three-epoch career narrative (12-ui-element-map.md §3 About #2b).
 * EPIC-015 redesign: the timeline mirrors the biography's actual slicing
 * instead of one card per employer. Eight beats across three epochs, each beat
 * carrying its period, its primary and parallel focus (Convergence keeps the
 * explicit two-track telecom/design split because living two careers at once
 * IS that epoch's point), a one-line takeaway saying why the period matters,
 * and a "What stayed with me" list of capabilities kept (owner review round 2:
 * the Technical/Human split was false categorization, and chips should read
 * as gains, not a tool inventory). One shared hairline spans all three epochs.
 * Each epoch's sticky header card names the epoch, its circa range, and cycles
 * through the era's most significant tools one icon at a time. Epoch accents:
 * Foundation amber, Convergence peach, Awakening rose; amber (owner tweak,
 * 2026-07-10) because caramel sat too close to peach to tell the first two
 * epochs apart. Every card stays in normal document flow so reduced-motion /
 * pre-hydration renders full content immediately; `data-epoch` attributes
 * drive the EpochNav scroll indicator.
 */

const ACCENTS = {
  amber: {
    eyebrow: "text-amber",
    edge: "bg-amber/70",
    marker: "bg-amber",
    rail: "bg-amber/50",
    icon: "text-amber",
    humanPill: "border-amber/40 text-amber",
    dualityBorder: "border-amber/50",
  },
  peach: {
    eyebrow: "text-peach",
    edge: "bg-peach/70",
    marker: "bg-peach",
    rail: "bg-peach/50",
    icon: "text-peach",
    humanPill: "border-peach/40 text-peach",
    dualityBorder: "border-peach/50",
  },
  rose: {
    eyebrow: "text-rose",
    edge: "bg-rose/70",
    marker: "bg-rose",
    rail: "bg-rose/50",
    icon: "text-rose",
    humanPill: "border-rose/40 text-rose",
    dualityBorder: "border-rose/50",
  },
} as const;

type Accent = (typeof ACCENTS)[keyof typeof ACCENTS];

interface ChainStep {
  name: string;
  /** A tool that hit its ceiling and was left behind. */
  dead?: boolean;
  /** Where the chain resolved. */
  now?: boolean;
}

interface Beat {
  period: string;
  /** Primary focus. Duality beats use the two-track fields instead. */
  title?: string;
  /** Parallel focus, one line, for single-track beats. */
  meanwhile?: string;
  /** Convergence duality: the day-job track. */
  telecom?: string;
  /** Convergence duality: the nights-and-weekends track. */
  design?: string;
  /** Why this period matters: one accent-colored sentence per card. */
  takeaway: string;
  /** What stayed: capabilities gained, not a tool inventory. */
  kept: string[];
  chain?: ChainStep[];
  current?: boolean;
}

const ICON = { size: 20, weight: "regular" } as const;

/**
 * Most significant tools per epoch, shown one at a time in the epoch header
 * card. Restricted to software/design tooling that traces a direct line to
 * today's skillset (owner note, 2026-07-10): telecom hardware and domain
 * knowledge (GSM, microwave, 48V DC, solar) lived in that era but isn't
 * tooling he still reaches for, so it stays out of the cycler (the epoch
 * narrative still covers that era's domain work). Owner-supplied brand marks
 * from `public/icons/` where they exist; Phosphor stand-ins where they don't
 * yet (tracked as a follow-up list in EPIC-015). EPIC-019/TASK-076: the
 * owner supplied the Foundation set (wordpress/elementor/electronics plus
 * Fireworks — the era's origin tool — standing in for the "muse.svg" the
 * brief named, which isn't in public/icons), added Webflow to Convergence,
 * and asked for a tasteful platform/devops pair on Awakening (Docker +
 * Prometheus).
 */
const FOUNDATION_TOOLS: EpochTool[] = [
  { label: "WordPress", src: "/icons/wordpress.svg" },
  { label: "Elementor", src: "/icons/elementor.svg" },
  { label: "Fireworks", src: "/icons/fireworks.svg" },
  { label: "Electronics", src: "/icons/electronics.svg" },
];

const CONVERGENCE_TOOLS: EpochTool[] = [
  { label: "Photoshop", src: "/icons/photoshop.svg" },
  { label: "Illustrator", src: "/icons/illustrator.svg" },
  { label: "InDesign", src: "/icons/indesign.svg" },
  { label: "WordPress & Elementor", node: <Globe {...ICON} /> },
  { label: "Webflow", src: "/icons/webflow.svg" },
];

const AWAKENING_TOOLS: EpochTool[] = [
  { label: "JavaScript", src: "/icons/js.svg" },
  { label: "TypeScript", src: "/icons/ts.svg" },
  { label: "React", src: "/icons/react.svg" },
  { label: "Next.js", src: "/icons/next.svg" },
  { label: "Node.js", src: "/icons/node.svg" },
  { label: "Payload CMS", src: "/icons/payload.svg" },
  { label: "PostgreSQL", src: "/icons/postgres.svg" },
  { label: "Docker", src: "/icons/docker.svg" },
  { label: "Prometheus", src: "/icons/prometheus.svg" },
  { label: "AI-assisted development", node: <Sparkle {...ICON} /> },
];

const FOUNDATION_BEATS: Beat[] = [
  {
    period: "2002 - 2007",
    title: "Student and explorer",
    meanwhile: "Creative experimentation in every spare hour.",
    takeaway: "Creative experimentation became my default way of learning.",
    kept: ["Self-directed learning", "Visual composition", "Comfort with complex software"],
  },
  {
    period: "2007 - 2013",
    title: "Assistant technician to technician, Celtel (Airtel)",
    meanwhile:
      "Around-the-clock fault response, learned from engineers generous with their knowledge.",
    takeaway: "Fault response taught me to think in systems instead of components.",
    kept: [
      "Systems thinking",
      "Infrastructure engineering",
      "Diagnostic thinking",
      "Learning from mentors",
    ],
  },
];

const CONVERGENCE_BEATS: Beat[] = [
  {
    period: "2013 - 2017",
    telecom: "QA Engineer at IHS Towers, learning solar directly from the deployment teams.",
    design: "Founder of Dauntless Energy, the venture that forced me to become a designer.",
    takeaway: "Running my own venture turned design from a hobby into a craft I could sell.",
    kept: ["Typography", "Layout & hierarchy", "Identity design", "Design as a business tool"],
  },
  {
    period: "2014 - 2021",
    telecom: "Telecom engineer by day, the whole stretch.",
    design:
      "Freelance brand and web designer: brands, company profiles and websites for clients across the country.",
    takeaway:
      "Webflow showed me the code underneath and shattered the belief that programming was out of reach.",
    kept: ["UX/UI design", "Client discovery", "CMS thinking"],
    chain: [
      { name: "Adobe Muse", dead: true },
      { name: "WordPress", dead: true },
      { name: "Webflow" },
      { name: "Elementor", dead: true },
      { name: "code itself", now: true },
    ],
  },
  {
    period: "2017 - 2019",
    telecom:
      "QA Engineer to Project Implementation Manager at Huawei: solar on more than 1,500 Zamtel towers.",
    design: "Freelancing on hiatus while the rollout took me across the country.",
    takeaway: "Delivering 1,500 towers taught me what quality means at national scale.",
    kept: ["Project management", "QA at scale", "Multidisciplinary teams"],
  },
  {
    period: "2019 - 2024",
    telecom: "Field operations engineer, mobile network maintenance.",
    design: "Freelance web designer again, meeting the same WordPress problems with new eyes.",
    takeaway: "The same ceilings, met one more time, settled it: I would learn to code.",
    kept: ["Modern front-end instincts", "The limits of no-code"],
  },
];

const AWAKENING_BEATS: Beat[] = [
  {
    period: "2021 - Present",
    title: "Software engineer, self-taught",
    meanwhile: "Full-stack JavaScript studied between around-the-clock telecom shifts.",
    takeaway:
      "Payload CMS answered a question I'd carried since Dauntless: how to build complex software without taking ownership away from the client.",
    kept: [
      "JavaScript & TypeScript",
      "React & Next.js",
      "Database design",
      "Software architecture",
    ],
  },
  {
    period: "Now",
    title: "Founder, Cassandra OS",
    meanwhile: "Writing at Scrumtrulescent when I want to think out loud.",
    takeaway:
      "Cassandra OS is the first project where I put my own opinions about where software is going into something real.",
    kept: ["AI integration", "Agentic software", "Product strategy", "Software ownership"],
    current: true,
  },
];

function EpochHeader({
  numeral,
  title,
  circa,
  epigraph,
  tools,
  accent,
}: {
  numeral: string;
  title: string;
  circa: string;
  epigraph: string;
  tools: EpochTool[];
  accent: Accent;
}) {
  return (
    <div
      data-epoch-header
      className="border-border bg-background/90 sticky top-24 z-10 mb-8 overflow-hidden border p-6 backdrop-blur-sm"
    >
      {/* The era's tools cycle as a large glyph watermark behind the copy;
          the current tool's name rides top-right, clear of the text. */}
      <EpochWatermark tools={tools} accentClassName={accent.icon} />
      <div className="relative z-10">
        <span className={`eyebrow ${accent.eyebrow}`}>Epoch {numeral}</span>
        <h3 className="font-display text-ink mt-1 text-3xl font-bold">{title}</h3>
        <p className="text-soft mt-1 text-sm font-light tracking-wide">{circa}</p>
        <p className="text-muted mt-3 text-sm italic">{epigraph}</p>
      </div>
    </div>
  );
}

/** Diamond marker pinned to the epoch rail, one per card. */
function RailMarker({ accent, pulse = false }: { accent: Accent; pulse?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute top-8 -left-7 size-2 -translate-x-1/2 rotate-45 ${accent.marker} ${
        pulse ? "animate-pulse" : ""
      }`}
    />
  );
}

/**
 * Per-epoch color fill drawn over the shared continuous hairline as the
 * reader scrolls through that epoch. The base hairline itself lives once on
 * the wrapper around all three epochs so the line never breaks between them.
 */
function EpochRail({ accent }: { accent: Accent }) {
  return (
    <span
      aria-hidden="true"
      data-rail-fill
      className={`absolute top-2 bottom-2 left-0 w-px origin-top ${accent.rail}`}
    />
  );
}

/** What a period contributed to the whole: capabilities kept, not tools used. */
function KeptList({ items }: { items: string[] }) {
  return (
    <div className="mt-4 flex flex-col gap-2">
      <span className="text-muted text-[10px] tracking-[0.14em] uppercase">
        What stayed with me
      </span>
      <ul className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <li key={item} className="border-border text-soft border px-2.5 py-1 text-xs">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The Convergence tool odyssey: each builder hit a ceiling until code didn't. */
function ToolChain({ steps, accent }: { steps: ChainStep[]; accent: Accent }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs">
      <span className="text-muted basis-full text-[10px] tracking-[0.14em] uppercase">
        The tool odyssey
      </span>
      {steps.map((step, i) => (
        <React.Fragment key={step.name}>
          {i > 0 ? (
            <span aria-hidden="true" className="text-muted/50">
              →
            </span>
          ) : null}
          <span
            className={`border px-2 py-0.5 ${
              step.now
                ? `${accent.humanPill} border`
                : step.dead
                  ? "border-border text-muted/70 decoration-muted/50 line-through"
                  : "border-border-2 text-soft"
            }`}
          >
            {step.name}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

function BeatCard({ beat, accent }: { beat: Beat; accent: Accent }) {
  const duality = Boolean(beat.telecom && beat.design);
  return (
    <li
      data-beat
      className={`bg-surface relative border p-6 ${beat.current ? "border-rose" : "border-border"}`}
    >
      <RailMarker accent={accent} pulse={beat.current} />
      {beat.current ? null : (
        <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-[3px] ${accent.edge}`} />
      )}

      <span className={`eyebrow ${accent.eyebrow}`}>{beat.period}</span>

      {duality ? (
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div className="border-border-2 border-l-2 pl-4">
            <span className="eyebrow text-muted">Telecom</span>
            <p className="text-ink mt-1">{beat.telecom}</p>
          </div>
          <div className={`border-l-2 pl-4 ${accent.dualityBorder}`}>
            <span className="eyebrow text-muted">Design</span>
            <p className="text-ink mt-1">{beat.design}</p>
          </div>
        </div>
      ) : (
        <>
          <h4 className="font-display text-ink mt-1 text-xl font-semibold">{beat.title}</h4>
          {beat.meanwhile ? <p className="text-muted mt-2 text-sm">{beat.meanwhile}</p> : null}
        </>
      )}

      <p className={`mt-4 text-sm ${accent.icon}`}>{beat.takeaway}</p>

      {beat.chain ? <ToolChain steps={beat.chain} accent={accent} /> : null}

      <KeptList items={beat.kept} />
    </li>
  );
}

/** Dashed closing card: the biography's last line, cursor still blinking. */
function NextEpoch() {
  const shouldReduceMotion = useReducedMotion();
  return (
    <section
      data-beat
      aria-label="The next epoch"
      className="border-border-2 border border-dashed p-8"
    >
      <span className="eyebrow text-muted">Epoch IV</span>
      <h3 className="font-display text-ink mt-2 text-2xl font-semibold">
        Everything before this was the training.
      </h3>
      <p className="text-muted mt-2">
        The next epoch is being written
        <motion.span
          aria-hidden="true"
          className="bg-rose ml-1.5 inline-block h-[1em] w-2 translate-y-[2px]"
          animate={shouldReduceMotion ? undefined : { opacity: [1, 1, 0, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
        />
      </p>
    </section>
  );
}

function Timeline() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (prefersReducedMotion()) return;

    const container = containerRef.current;
    if (!container) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Cards: blur-dissolve rise, once, on entry.
      container.querySelectorAll<HTMLElement>("[data-beat]").forEach((beat) => {
        gsap.fromTo(
          beat,
          { opacity: 0, y: 36, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: beat, start: "top 82%" },
          },
        );
      });

      // Epoch headers: quick settle as each movement begins.
      container.querySelectorAll<HTMLElement>("[data-epoch-header]").forEach((header) => {
        gsap.fromTo(
          header,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: { trigger: header, start: "top 88%" },
          },
        );
      });

      // Rail fills: drawn in sync with scroll through their epoch.
      container.querySelectorAll<HTMLElement>("[data-epoch]").forEach((section) => {
        const fill = section.querySelector<HTMLElement>("[data-rail-fill]");
        if (!fill) return;
        gsap.fromTo(
          fill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 65%",
              end: "bottom 70%",
              scrub: true,
            },
          },
        );
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="flex min-w-0 flex-col gap-16">
      <div className="flex flex-col gap-4">
        <h2 className="font-display text-heading text-ink">How I Became a Web Systems Developer</h2>
        <p className="measure text-muted">
          I think of my career in three distinct epochs, each naturally leading to what I do today.
          It begins with curiosity. In 2002, I stumbled upon Macromedia Fireworks and my love for
          design was born. It continues with the restlessness that characterised my time in
          telecoms. As much as I enjoyed learning how those technologies worked and fit together, I
          found myself constantly pulled back toward my creative side. I worked in telecom by day
          and designed brands and websites by night. It culminates with my decision to learn to code
          in 2021 after growing increasingly frustrated by the limitations of website builders. My
          exposure to the complex systems of telecom, combined with my background in design and my
          love for technology, turned out to be excellent preparation for navigating the fragmented,
          ever changing landscape of the modern web.
        </p>
      </div>

      {/* One shared hairline spans all three epochs so the timeline reads as
          a single continuous journey; each epoch's colored fill draws over it. */}
      <div className="relative flex flex-col gap-16">
        <span aria-hidden="true" className="bg-border absolute top-2 bottom-2 left-0 w-px" />

        <section data-epoch="foundation" className="scroll-mt-24">
          <EpochHeader
            numeral="I"
            title="Foundation"
            circa="Circa 2002 - 2013"
            epigraph="Every skill in this era looked unrelated at the time. None of them were."
            tools={FOUNDATION_TOOLS}
            accent={ACCENTS.amber}
          />
          <ol className="relative flex flex-col gap-6 pl-7">
            <EpochRail accent={ACCENTS.amber} />
            {FOUNDATION_BEATS.map((beat) => (
              <BeatCard key={beat.period} beat={beat} accent={ACCENTS.amber} />
            ))}
          </ol>
        </section>

        <section data-epoch="convergence" className="scroll-mt-24">
          <EpochHeader
            numeral="II"
            title="Convergence"
            circa="Circa 2013 - 2021"
            epigraph="Infrastructure by day, design by night: two full practices running in parallel, and a growing suspicion that neither one alone was the point."
            tools={CONVERGENCE_TOOLS}
            accent={ACCENTS.peach}
          />
          <ol className="relative flex flex-col gap-6 pl-7">
            <EpochRail accent={ACCENTS.peach} />
            {CONVERGENCE_BEATS.map((beat) => (
              <BeatCard key={beat.period} beat={beat} accent={ACCENTS.peach} />
            ))}
          </ol>
        </section>

        <section data-epoch="awakening" className="scroll-mt-24">
          <EpochHeader
            numeral="III"
            title="Awakening"
            circa="Circa 2021 - Present"
            epigraph="In 2021 I stopped negotiating with my tools and taught myself to code. It's the most intellectually alive I've ever been."
            tools={AWAKENING_TOOLS}
            accent={ACCENTS.rose}
          />
          <ol className="relative flex flex-col gap-6 pl-7">
            <EpochRail accent={ACCENTS.rose} />
            {AWAKENING_BEATS.map((beat) => (
              <BeatCard key={beat.period} beat={beat} accent={ACCENTS.rose} />
            ))}
          </ol>
        </section>
      </div>

      <NextEpoch />
    </div>
  );
}

export { Timeline };
