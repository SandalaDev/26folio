"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowsClockwise,
  ChatsCircle,
  FileText,
  MapPin,
  type Icon,
} from "@phosphor-icons/react";

import { Section } from "@/components/site/section";
import { integrationGroups } from "@/lib/capabilities";
import { fadeUp, staggerContainer } from "@/lib/motion";

const GROUP_ICONS: Icon[] = [
  ChatsCircle,
  MapPin,
  FileText,
  ArrowsClockwise,
];

function IntegrationMap() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section className="relative overflow-hidden border-y border-border bg-surface/30">
      <div className="grid gap-14 lg:grid-cols-[minmax(18rem,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
        <div>
          <p className="eyebrow text-caramel">Connected systems</p>
          <h2 className="mt-4 font-display text-heading text-ink">
            The website does not have to{" "}
            <span className="font-extralight">sit and wait to be read.</span>
          </h2>
          <p className="measure mt-6 text-muted">
            It can send messages, collect payments, create invoices, schedule
            appointments, update records, generate documents, track deliveries,
            and trigger work elsewhere.
          </p>
          <div className="mt-8 border border-rose/40 bg-background p-6">
            <p className="font-display text-xl font-semibold text-ink">
              Reliability is part of the integration.
            </p>
            <p className="mt-3 text-sm text-muted">
              Authentication, validation, retries, duplicate prevention, rate
              limits, audit trails, and a clear human intervention path are
              designed in—not added after a service fails.
            </p>
          </div>
        </div>

        <motion.div
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.18 }}
          variants={shouldReduceMotion ? undefined : staggerContainer}
          className="grid gap-px border border-border bg-border md:grid-cols-2"
        >
          {integrationGroups.map((group, index) => {
            const IconGlyph = GROUP_ICONS[index];
            return (
              <motion.article
                key={group.title}
                variants={shouldReduceMotion ? undefined : fadeUp}
                whileHover={shouldReduceMotion ? undefined : { x: 6 }}
                transition={{ duration: 0.3 }}
                className="group bg-background p-7 md:p-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-display text-xl font-semibold text-ink">
                    {group.title}
                  </h3>
                  <IconGlyph
                    size={28}
                    weight="light"
                    className={index % 2 === 0 ? "text-rose" : "text-caramel"}
                    aria-hidden="true"
                  />
                </div>
                <ul className="mt-6 flex flex-col gap-4">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="border-l border-border pl-4 text-sm text-muted transition-colors group-hover:border-border-2 group-hover:text-soft"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </Section>
  );
}

export { IntegrationMap };
