"use client";

import * as React from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  DeviceMobile,
  Globe,
  Robot,
  Storefront,
  Wrench,
  type Icon,
} from "@phosphor-icons/react";

import { Section } from "@/components/site/section";
import { Blob, type BlobVariant } from "@/components/site/blob";
import { MeshBg } from "@/components/site/mesh-bg";
import { services, type ServiceIcon } from "@/lib/services";
import { prefersReducedMotion } from "@/lib/motion";

/* Phosphor is the project's one icon family (design lane §3.C); weight is
   standardized here so every card reads the same. */
const ICONS: Record<ServiceIcon, Icon> = {
  globe: Globe,
  wrench: Wrench,
  robot: Robot,
  device: DeviceMobile,
  storefront: Storefront,
};

/**
 * CapabilityRail — GSAP ScrollTrigger pinned horizontal scroll
 * (12-ui-element-map.md §3 Home #3). EPIC-010: five enlarged cards from the
 * shared services source, each with an icon, a background wash + blob accent,
 * and an anchored link into /capabilities. The card nearest the viewport
 * center is emphasized (scale/opacity via the scrub) so the focused card takes
 * more of the viewport. Defaults to a stacked vertical list; pin/scrub/focus
 * only engage client-side on fine pointers with motion allowed.
 */
function CapabilityRail() {
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const trackRef = React.useRef<HTMLDivElement | null>(null);

  // useLayoutEffect (not useEffect): GSAP's `pin: true` reparents this
  // section into a pin-spacer wrapper, changing the DOM structure React
  // isn't aware of. The cleanup (ctx.revert(), which un-wraps the spacer)
  // must run synchronously during React's commit/unmount phase — useEffect's
  // cleanup fires after React has already tried (and failed) to remove the
  // node from its now-stale expected parent, throwing
  // "Failed to execute 'removeChild' on 'Node'" on client-side navigation.
  React.useLayoutEffect(() => {
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

      const cards = gsap.utils.toArray<HTMLElement>("[data-rail-card]", track);

      // Focus emphasis: the card nearest the viewport center is full-size and
      // full-opacity; neighbours recede. Driven by the same scrub, not state.
      const emphasize = () => {
        const mid = window.innerWidth / 2;
        for (const card of cards) {
          const rect = card.getBoundingClientRect();
          const distance = Math.min(
            1,
            Math.abs(rect.left + rect.width / 2 - mid) / mid,
          );
          gsap.set(card, {
            scale: 1 - 0.06 * distance,
            opacity: 1 - 0.45 * distance,
          });
        }
      };

      gsap.to(track, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${scrollDistance}`,
          scrub: true,
          pin: true,
          onUpdate: emphasize,
          onRefresh: emphasize,
        },
      });
      emphasize();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <Section
      ref={sectionRef}
      // Pin target needs overflow control; harmless when the pin never engages.
      className="overflow-hidden"
    >
      <h2 className="text-heading font-display text-ink">What I do</h2>
      <div
        ref={trackRef}
        className="mt-12 flex flex-col items-center gap-6 md:gap-8"
      >
        {services.map((service, index) => {
          const IconGlyph = ICONS[service.icon];
          return (
            <Link
              key={service.id}
              href={`/capabilities#${service.id}`}
              data-rail-card
              className="group relative flex min-h-[22rem] w-full shrink-0 flex-col justify-between overflow-hidden border border-border bg-surface p-8 transition-colors will-change-transform hover:border-border-2 md:min-h-[26rem] md:w-[min(78vw,44rem)] md:p-10"
            >
              <MeshBg tone={index % 2 === 0 ? "rose" : "warm"} />
              <Blob
                variant={((index % 4) + 1) as BlobVariant}
                fill={index % 2 === 0 ? "var(--color-rose)" : "var(--color-caramel)"}
                opacity={0.09}
                className="-right-16 -top-16 w-56"
              />
              {/* Icon tone follows the card's wash (rose/caramel alternation,
                  §2) — rose stops being the only accent voice on the rail. */}
              <IconGlyph
                size={40}
                weight="light"
                className={`relative ${index % 2 === 0 ? "text-rose" : "text-caramel"}`}
                aria-hidden="true"
              />
              <div className="relative mt-10">
                <h3 className="font-display text-2xl font-semibold text-ink md:text-3xl">
                  {service.title}
                </h3>
                <p className="measure mt-3 text-base text-muted md:text-lg">
                  {service.description}
                </p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-rose transition-transform group-hover:translate-x-1">
                  See how
                  <ArrowRight size={16} weight="bold" aria-hidden="true" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}

export { CapabilityRail };
