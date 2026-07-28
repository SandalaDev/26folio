"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Database,
  Gear,
  Plus,
  Robot,
  Storefront,
  type Icon,
} from "@phosphor-icons/react";

import { services, serviceIds, type ServiceIcon } from "@/lib/services";
import { DURATION, EASE_OUT } from "@/lib/motion";

/* Phosphor is the project's one icon family (design lane §3.C); the rail
   carries its own map because its sizes/weights differ. */
const ICONS: Record<ServiceIcon, Icon> = {
  storefront: Storefront,
  gear: Gear,
  robot: Robot,
  database: Database,
};

/* Rows alternate the site's two accent voices (§2: rose primary, caramel
   secondary), matching the home rail's wash alternation. */
const ACCENTS = ["text-rose", "text-caramel"] as const;

/**
 * CapabilityExplorer (EPIC-021 TASK-080): the four service pillars as
 * progressive-disclosure rows; replaces ServiceTabs. Each row is a real
 * button (aria-expanded / aria-controls) that height-reveals a structured
 * panel: audience, problem, systems built, what it replaces, closing
 * anchor. One row open at a time; /capabilities#<id> deep links open the
 * matching row and scroll to it (hash effect ported from ServiceTabs).
 * Reduced motion collapses the reveal to an instant swap.
 */
function CapabilityExplorer() {
  const shouldReduceMotion = useReducedMotion();
  const [openId, setOpenId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!serviceIds.includes(hash)) return;
    setOpenId(hash);
    // Anchors mount after hydration, so the browser's native hash jump has
    // already missed them; scroll explicitly once they exist.
    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ block: "start" });
    });
  }, []);

  return (
    <div className="border-b border-border">
      {services.map((service, index) => {
        const IconGlyph = ICONS[service.icon];
        const isOpen = openId === service.id;
        const accent = ACCENTS[index % 2];
        const panelId = `${service.id}-panel`;

        return (
          <div
            key={service.id}
            id={service.id}
            className="scroll-mt-24 border-t border-border"
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenId(isOpen ? null : service.id)}
              className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 py-6 text-left transition-colors hover:bg-surface/60 md:grid-cols-[3rem_minmax(0,22rem)_1fr_auto] md:gap-6 md:py-8"
            >
              <IconGlyph
                size={32}
                weight="light"
                className={`${accent} shrink-0`}
                aria-hidden="true"
              />
              <h3 className="font-display text-2xl font-semibold text-ink md:text-3xl">
                {service.title}
              </h3>
              <p className="col-span-3 text-base text-muted md:col-span-1 md:col-start-3 md:text-lg">
                {service.description}
              </p>
              <Plus
                size={22}
                weight="light"
                aria-hidden="true"
                className={`col-start-3 row-start-1 shrink-0 text-soft transition-transform duration-300 group-hover:text-ink md:col-start-4 ${
                  isOpen ? "rotate-45" : ""
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key={panelId}
                  id={panelId}
                  role="region"
                  aria-label={service.title}
                  initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: DURATION.page, ease: EASE_OUT }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-10 pb-10 pt-2 md:grid-cols-2 md:gap-16 md:pb-12 md:pl-[4.5rem]">
                    <div>
                      <p className="font-medium text-ink">{service.audience}</p>
                      <p className="measure mt-4 text-muted">{service.problem}</p>
                      <p className={`mt-6 font-display text-lg ${accent}`}>
                        {service.anchor}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-soft">What I build</p>
                      <ul className="mt-3 flex flex-col gap-2 text-ink/80">
                        {service.builds.map((item) => (
                          <li key={item} className="border-l border-border pl-4">
                            {item}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-6 text-sm text-soft">
                        Replaces {service.replaces.join(", ")}.
                      </p>
                      <Link
                        href="/contact"
                        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-rose transition-transform hover:translate-x-1"
                      >
                        Request a proposal &amp; quote
                        <ArrowRight size={16} weight="bold" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export { CapabilityExplorer };
