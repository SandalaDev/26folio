"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Books,
  Cpu,
  Drop,
  Faders,
  Headphones,
  Microphone,
  SpeakerHigh,
  Watch,
  type Icon,
} from "@phosphor-icons/react";

import { Section } from "@/components/site/section";
import { COLLECTIONS } from "@/lib/the-way";
import { fadeUp, staggerContainer } from "@/lib/motion";

/**
 * CollectionShelves - exhibit five (EPIC-016/TASK-064). Collections shown as
 * display shelves, not lists: each object is a bordered case standing on a
 * shelf board (the thick bottom hairline). Hover lifts a case off the board
 * a touch. Audiophile gear gets the long top shelf; watches, colognes and
 * books share the lower one.
 */
const CASE_ICONS: Record<string, Icon> = {
  Headphones: Headphones,
  DACs: Cpu,
  Amplifiers: Faders,
  Microphones: Microphone,
  Speakers: SpeakerHigh,
  Watches: Watch,
  Colognes: Drop,
  Books: Books,
};

function Shelf({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-display text-xl font-semibold text-ink">{label}</h3>
      <ul className="mt-8 flex flex-wrap items-end gap-3 border-b-2 border-border-2 md:gap-4">
        {items.map((item) => {
          const CaseIcon = CASE_ICONS[item];
          return (
            <li key={item} className="group">
              <div className="flex flex-col items-center gap-4 border border-border bg-surface px-6 py-5 transition-transform duration-300 ease-out group-hover:-translate-y-1.5 md:px-8 md:py-6 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                {CaseIcon ? (
                  <CaseIcon
                    aria-hidden="true"
                    className="size-7 text-muted transition-colors duration-300 group-hover:text-peach md:size-8"
                  />
                ) : null}
                <span className="text-sm text-soft">{item}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CollectionShelves() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section id="collections" data-way-section="collections">
      <motion.div
        initial={shouldReduceMotion ? undefined : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "show"}
        viewport={{ once: true, amount: 0.2 }}
        variants={shouldReduceMotion ? undefined : staggerContainer}
      >
        <motion.h2
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="font-display text-heading text-ink"
        >
          Collections
        </motion.h2>
        <motion.div
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="mt-14 flex flex-col gap-16"
        >
          <Shelf label="Audiophile equipment" items={COLLECTIONS.audiophile} />
          <Shelf label="Other collections" items={COLLECTIONS.other} />
        </motion.div>
      </motion.div>
    </Section>
  );
}

export { CollectionShelves };
