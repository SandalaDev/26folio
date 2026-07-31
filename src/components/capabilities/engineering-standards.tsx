"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Archive,
  Fingerprint,
  Key,
  Pulse,
  ShieldCheck,
  type Icon,
} from "@phosphor-icons/react";
import { GitBranch } from "@phosphor-icons/react";

import { Section } from "@/components/site/section";
import { engineeringStandards } from "@/lib/capabilities";
import { fadeUp, staggerContainer } from "@/lib/motion";

const STANDARD_ICONS: Icon[] = [
  Key,
  GitBranch,
  ShieldCheck,
  Pulse,
  Fingerprint,
  Archive,
];

function EngineeringStandards() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section className="border-y border-border bg-surface/30">
      <div className="grid gap-14 lg:grid-cols-[minmax(18rem,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow text-rose">Ownership &amp; engineering standards</p>
          <h2 className="mt-4 font-display text-heading text-ink">
            The handover is designed{" "}
            <span className="font-extralight">before it is needed.</span>
          </h2>
          <p className="measure mt-6 text-muted">
            If our engagement ends, the system should not disappear with me.
            Ownership, understandability, testing, observability, access, and
            recovery are part of the product.
          </p>

          <div className="relative mt-10 aspect-square max-w-sm" aria-hidden="true">
            <div className="absolute inset-8 border border-border" />
            <div className="absolute inset-16 border border-border-2" />
            <div className="absolute inset-24 flex items-center justify-center border border-rose bg-background text-center font-display text-xl font-semibold text-ink">
              Your
              <br />
              system
            </div>
            <div className="absolute left-1/2 top-0 h-8 w-px -translate-x-1/2 bg-caramel" />
            <div className="absolute bottom-0 left-1/2 h-8 w-px -translate-x-1/2 bg-rose" />
            <div className="absolute left-0 top-1/2 h-px w-8 -translate-y-1/2 bg-rose" />
            <div className="absolute right-0 top-1/2 h-px w-8 -translate-y-1/2 bg-caramel" />
          </div>
        </div>

        <motion.div
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          variants={shouldReduceMotion ? undefined : staggerContainer}
          className="border-b border-border"
        >
          {engineeringStandards.map((standard, index) => {
            const IconGlyph = STANDARD_ICONS[index];
            return (
              <motion.article
                key={standard.title}
                variants={shouldReduceMotion ? undefined : fadeUp}
                whileHover={shouldReduceMotion ? undefined : { x: 8 }}
                transition={{ duration: 0.3 }}
                className="group grid gap-5 border-t border-border py-7 md:grid-cols-[3rem_minmax(12rem,0.65fr)_minmax(0,1.35fr)] md:items-start md:gap-8 md:py-9"
              >
                <IconGlyph
                  size={28}
                  weight="light"
                  className={index % 2 === 0 ? "text-rose" : "text-caramel"}
                  aria-hidden="true"
                />
                <h3 className="font-display text-xl font-semibold text-ink md:text-2xl">
                  {standard.title}
                </h3>
                <p className="text-muted transition-colors group-hover:text-soft">
                  {standard.body}
                </p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </Section>
  );
}

export { EngineeringStandards };
