"use client";

import * as React from "react";

import { prefersReducedMotion } from "@/lib/motion";

/**
 * EpochNav — scroll indicator for the three timeline epochs (EPIC-014
 * follow-up). Inspired by brittanychiang.com's section nav, deliberately
 * differentiated: instead of a growing horizontal line, each epoch gets a
 * numeral in a hard-cornered square that rotates into a filled, epoch-colored
 * diamond while its section is in view. Clicking a row scrolls to the epoch.
 * Tracks the active section with an IntersectionObserver on `[data-epoch]`,
 * so it needs no shared state with the Timeline component.
 */
const EPOCHS = [
  {
    id: "foundation",
    numeral: "I",
    title: "Foundation",
    tagline: "Seeds, planted early",
    activeBox: "rotate-45 border-caramel bg-caramel text-background",
    activeTagline: "text-caramel",
  },
  {
    id: "convergence",
    numeral: "II",
    title: "Convergence",
    tagline: "Two crafts, one person",
    activeBox: "rotate-45 border-peach bg-peach text-background",
    activeTagline: "text-peach",
  },
  {
    id: "awakening",
    numeral: "III",
    title: "Awakening",
    tagline: "The path that demands all of it",
    activeBox: "rotate-45 border-rose bg-rose text-background",
    activeTagline: "text-rose",
  },
] as const;

function EpochNav() {
  const [active, setActive] = React.useState<string>(EPOCHS[0].id);

  React.useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-epoch]");
    if (!sections.length) return;

    // A narrow band around 40% viewport height decides the active epoch, so
    // exactly one section "owns" the indicator at a time while scrolling.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-epoch");
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
    document
      .querySelector(`[data-epoch="${id}"]`)
      ?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
  };

  return (
    <nav aria-label="Timeline epochs" className="hidden flex-col md:flex">
      {EPOCHS.map((epoch) => {
        const isActive = active === epoch.id;
        return (
          <button
            key={epoch.id}
            type="button"
            onClick={() => scrollTo(epoch.id)}
            aria-current={isActive ? "true" : undefined}
            className="group flex items-center gap-4 py-1.5 text-left"
          >
            <span
              className={`flex size-8 shrink-0 items-center justify-center border font-display text-xs font-semibold transition-all duration-300 ${
                isActive
                  ? epoch.activeBox
                  : "border-border text-muted group-hover:border-border-2 group-hover:text-ink"
              }`}
            >
              <span
                className={`transition-transform duration-300 ${isActive ? "-rotate-45" : ""}`}
              >
                {epoch.numeral}
              </span>
            </span>
            <span className="flex min-w-0 flex-col">
              <span
                className={`font-display font-semibold transition-colors duration-300 ${
                  isActive ? "text-ink" : "text-muted group-hover:text-ink"
                }`}
              >
                {epoch.title}
              </span>
              {/* Tagline expands only on the active epoch — the indicator
                  grows downward instead of brittanychiang's sideways line. */}
              <span
                className={`overflow-hidden text-xs transition-all duration-300 ${
                  isActive
                    ? `max-h-6 opacity-100 ${epoch.activeTagline}`
                    : "max-h-0 opacity-0 text-muted/60"
                }`}
              >
                {epoch.tagline}
              </span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export { EpochNav };
