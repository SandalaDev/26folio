"use client";

import * as React from "react";
import { motion, type MotionValue } from "framer-motion";

import { prefersReducedMotion } from "@/lib/motion";
import { BIO_CHAPTERS, BIO_TITLE } from "@/lib/who-i-am";

/**
 * ChapterRail — the story's spine on the left edge of the bio reader (lg+).
 * Speaks the EpochNav marker language: hard-cornered boxes that rotate into
 * filled epoch-colored diamonds while their chapter is in view, threaded on
 * a vertical hairline whose rose fill tracks scroll progress through the
 * modal (TASK-067). The opening row is marked with the logo symbol instead
 * of a numeral: the story starts with the person, the epochs follow. Active
 * tracking is an IntersectionObserver rooted in the modal's scroll region,
 * so the rail needs no shared state with the chapters.
 */

/** Logo symbol tinted via CSS mask over currentColor (timeline IconGlyph technique). */
const logoMask: React.CSSProperties = {
  WebkitMaskImage: "url(/images/logo/logo_ink.svg)",
  maskImage: "url(/images/logo/logo_ink.svg)",
  WebkitMaskSize: "contain",
  maskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
};

const RAIL_ITEMS = [
  {
    id: "opening",
    name: BIO_TITLE,
    glyph: "logo" as const,
    activeBox: "rotate-45 border-ink bg-ink text-background",
    activeName: "text-ink",
  },
  ...BIO_CHAPTERS.map((chapter) => ({
    id: chapter.id,
    name: chapter.title,
    glyph: chapter.numeral,
    activeBox: `rotate-45 ${chapter.accentBox}`,
    activeName: chapter.accentText,
  })),
];

function ChapterRail({
  containerRef,
  progress,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  progress: MotionValue<number>;
}) {
  const [active, setActive] = React.useState<string>(RAIL_ITEMS[0].id);

  React.useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const sections = root.querySelectorAll<HTMLElement>("[data-bio-chapter]");
    if (!sections.length) return;

    // A band around 40% of the scroll region decides the active chapter, so
    // exactly one section owns the marker at a time (EpochNav's approach,
    // rooted in the modal instead of the viewport).
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-bio-chapter");
            if (id) setActive(id);
          }
        }
      },
      { root, rootMargin: "-35% 0px -55% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [containerRef]);

  const scrollTo = (id: string) => {
    containerRef.current
      ?.querySelector(`[data-bio-chapter="${id}"]`)
      ?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
  };

  return (
    <aside className="hidden shrink-0 flex-col justify-center border-r border-border p-8 lg:flex lg:w-56 xl:w-64">
      <nav aria-label="Story chapters" className="relative flex flex-col gap-1.5">
        {/* The thread: a hairline through the markers; rose fill = progress. */}
        <span
          aria-hidden="true"
          className="absolute bottom-4 left-4 top-4 w-px bg-border"
        />
        <motion.span
          aria-hidden="true"
          style={{ scaleY: progress }}
          className="absolute bottom-4 left-4 top-4 w-px origin-top bg-rose"
        />
        {RAIL_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollTo(item.id)}
              aria-current={isActive ? "true" : undefined}
              className="group relative flex items-center gap-4 py-1.5 text-left"
            >
              <span
                className={`flex size-8 shrink-0 items-center justify-center border font-display text-xs font-semibold transition-all duration-300 ${
                  isActive
                    ? item.activeBox
                    : "border-border bg-surface text-muted group-hover:border-border-2 group-hover:text-ink"
                }`}
              >
                <span
                  className={`transition-transform duration-300 ${isActive ? "-rotate-45" : ""}`}
                >
                  {item.glyph === "logo" ? (
                    <span
                      aria-hidden="true"
                      className="block size-3.5 bg-current"
                      style={logoMask}
                    />
                  ) : (
                    item.glyph
                  )}
                </span>
              </span>
              <span
                className={`font-display font-semibold transition-colors duration-300 ${
                  isActive
                    ? item.activeName
                    : "text-muted group-hover:text-ink"
                }`}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export { ChapterRail };
