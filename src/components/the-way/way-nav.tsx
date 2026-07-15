"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll } from "framer-motion";
import { ArrowLeft } from "@phosphor-icons/react";

import { WAY_SECTIONS } from "@/lib/the-way";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Navigation layer for /about/the-way-i-am (EPIC-016/TASK-064):
 *
 * - WayProgress: a 2px rose hairline across the top of the viewport whose
 *   scaleX mirrors scroll position. Bound directly to the scroll motion
 *   value (no spring), so it scrubs rather than animates and stays honest
 *   under prefers-reduced-motion.
 * - WayToc: floating table of contents on the right edge (lg+). Follows the
 *   EpochNav interaction language: hard-cornered markers that rotate into a
 *   filled rose diamond while their section is in view. The back link to
 *   About sits on top of the rail so the exit stays visible the whole walk.
 *
 * Active-section tracking mirrors EpochNav: an IntersectionObserver over
 * `[data-way-section]` with a narrow band around 40% viewport height, so
 * exactly one section owns the rail at a time.
 */

function WayProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: scrollYProgress }}
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-rose"
    />
  );
}

function WayToc() {
  const [active, setActive] = React.useState<string>(WAY_SECTIONS[0].id);

  React.useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-way-section]");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-way-section");
            if (id) setActive(id);
          }
        }
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.querySelector(`[data-way-section="${id}"]`)?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <nav
      aria-label="Page sections"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-1 lg:flex xl:right-10"
    >
      <Link
        href="/about"
        className="group mb-4 flex items-center gap-2 text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft
          aria-hidden="true"
          className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5 motion-reduce:transition-none"
        />
        <span className="eyebrow">About</span>
      </Link>
      {WAY_SECTIONS.map((section) => {
        const isActive = active === section.id;
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => scrollTo(section.id)}
            aria-current={isActive ? "true" : undefined}
            className="group flex items-center gap-3 py-1"
          >
            <span
              className={`eyebrow transition-all duration-300 ${
                isActive
                  ? "translate-x-0 text-rose opacity-100"
                  : "translate-x-1 text-muted opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
              }`}
            >
              {section.label}
            </span>
            <span
              className={`size-2 shrink-0 border transition-all duration-300 ${
                isActive
                  ? "rotate-45 border-rose bg-rose"
                  : "border-border-2 group-hover:border-muted"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}

export { WayProgress, WayToc };
