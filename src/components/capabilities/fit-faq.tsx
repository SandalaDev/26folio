"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Minus, Plus, X } from "@phosphor-icons/react";

import { Section } from "@/components/site/section";
import { capabilityFaqs, fitGuidance } from "@/lib/capabilities";
import { DURATION, EASE_OUT } from "@/lib/motion";

function FitAndFaq() {
  const shouldReduceMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <>
      <Section className="border-y border-border bg-surface/30">
        <div className="max-w-4xl">
          <p className="eyebrow text-rose">Who this is for</p>
          <h2 className="mt-4 font-display text-heading text-ink">
            A fit check before{" "}
            <span className="font-extralight">a sales conversation.</span>
          </h2>
          <p className="measure mt-6 text-muted">
            Custom software is useful when it changes a real operation and the
            people responsible are ready to shape it. It is expensive
            distraction when the underlying need is still unproven.
          </p>
        </div>

        <div className="mt-12 grid gap-px border border-border bg-border lg:grid-cols-2">
          <motion.article
            initial={shouldReduceMotion ? false : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: DURATION.page, ease: EASE_OUT }}
            className="bg-background p-7 md:p-10"
          >
            <div className="flex items-center gap-4">
              <Check
                size={26}
                weight="bold"
                className="text-rose"
                aria-hidden="true"
              />
              <h3 className="font-display text-2xl font-semibold text-ink">
                Strong fit
              </h3>
            </div>
            <ul className="mt-7 flex flex-col gap-5">
              {fitGuidance.strong.map((item) => (
                <li key={item} className="border-l border-rose/60 pl-4 text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </motion.article>

          <motion.article
            initial={shouldReduceMotion ? false : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: DURATION.page, ease: EASE_OUT }}
            className="bg-background p-7 md:p-10"
          >
            <div className="flex items-center gap-4">
              <X
                size={26}
                weight="bold"
                className="text-caramel"
                aria-hidden="true"
              />
              <h3 className="font-display text-2xl font-semibold text-ink">
                Probably not the right fit
              </h3>
            </div>
            <ul className="mt-7 flex flex-col gap-5">
              {fitGuidance.weak.map((item) => (
                <li
                  key={item}
                  className="border-l border-caramel/60 pl-4 text-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          </motion.article>
        </div>

        <p className="measure mt-8 text-sm text-soft">
          I provide product and software engineering. Specialist research,
          copywriting, course production, legal advice, accounting decisions,
          or large-scale content entry must be supplied by the client or scoped
          separately with the appropriate specialist.
        </p>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(16rem,0.65fr)_minmax(0,1.35fr)] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow text-caramel">Frequently asked questions</p>
            <h2 className="mt-4 font-display text-heading text-ink">
              Before we{" "}
              <span className="font-extralight">start with the problem.</span>
            </h2>
          </div>

          <div className="border-b border-border">
            {capabilityFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              const panelId = `capabilities-faq-${index}`;
              const triggerId = `${panelId}-trigger`;
              return (
                <div key={faq.question} className="border-t border-border">
                  <button
                    id={triggerId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="group grid w-full grid-cols-[1fr_auto] items-center gap-6 py-6 text-left md:py-8"
                  >
                    <span className="font-display text-xl font-semibold text-ink transition-colors group-hover:text-rose md:text-2xl">
                      {faq.question}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center border border-border-2 text-soft transition-colors group-hover:border-rose group-hover:text-rose">
                      {isOpen ? (
                        <Minus size={18} aria-hidden="true" />
                      ) : (
                        <Plus size={18} aria-hidden="true" />
                      )}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={triggerId}
                        initial={
                          shouldReduceMotion
                            ? false
                            : { height: 0, opacity: 0, y: -8 }
                        }
                        animate={{ height: "auto", opacity: 1, y: 0 }}
                        exit={
                          shouldReduceMotion
                            ? undefined
                            : { height: 0, opacity: 0, y: -8 }
                        }
                        transition={{
                          duration: DURATION.component,
                          ease: EASE_OUT,
                        }}
                        className="overflow-hidden"
                      >
                        <p className="measure pb-7 pr-14 text-muted md:pb-9">
                          {faq.answer}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </Section>
    </>
  );
}

export { FitAndFaq };
