"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, Check } from "@phosphor-icons/react";

import { Section } from "@/components/site/section";
import { capabilityServices } from "@/lib/capabilities";
import { EASE_OUT } from "@/lib/motion";

function ServiceDossier() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section id="services" className="scroll-mt-20">
      <div className="grid gap-16 xl:grid-cols-[16rem_minmax(0,1fr)] xl:gap-20">
        <aside className="hidden xl:block">
          <div className="sticky top-28">
            <p className="eyebrow text-rose">What I build</p>
            <nav aria-label="Capabilities on this page" className="mt-6">
              <ol className="border-l border-border">
                {capabilityServices.map((service) => (
                  <li key={service.id}>
                    <a
                      href={`#${service.id}`}
                      className="group flex items-start gap-3 border-b border-border py-3 pl-4 text-sm text-muted transition-colors hover:border-l-rose hover:text-ink"
                    >
                      <span className="font-mono text-xs text-soft">
                        {service.index}
                      </span>
                      <span>{service.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </aside>

        <div>
          <div className="mb-16 max-w-4xl">
            <p className="eyebrow text-rose xl:hidden">What I build</p>
            <h2 className="mt-4 font-display text-heading text-ink xl:mt-0">
              Systems shaped around{" "}
              <span className="font-extralight">the work as it really happens.</span>
            </h2>
            <p className="measure mt-6 text-muted">
              Each chapter begins with a recognizable operational problem,
              shows what the connected system can do, and ends with the
              information needed to start a useful conversation.
            </p>
          </div>

          <div className="flex flex-col">
            {capabilityServices.map((service, index) => (
              <motion.article
                key={service.id}
                id={service.id}
                initial={
                  shouldReduceMotion ? false : { opacity: 0, y: 30, x: 10 }
                }
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.55, ease: EASE_OUT }}
                className="scroll-mt-28 border-t border-border py-16 first:pt-0 md:py-20"
              >
                <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
                  <div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`font-mono text-xs ${
                          index % 2 === 0 ? "text-rose" : "text-caramel"
                        }`}
                      >
                        system / {service.index}
                      </span>
                      <span className="h-px flex-1 bg-border" />
                    </div>
                    <h3 className="mt-5 font-display text-3xl font-semibold text-ink md:text-4xl">
                      {service.title}
                    </h3>
                    <p className="mt-5 text-lg text-muted">{service.summary}</p>
                    {service.note ? (
                      <p className="mt-6 border-l border-caramel pl-5 text-sm text-soft">
                        {service.note}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <p className="eyebrow text-soft">A system can</p>
                    <ul className="mt-4 grid gap-x-8 gap-y-5 md:grid-cols-2">
                      {service.examples.map((example) => (
                        <li key={example} className="flex items-start gap-3">
                          <Check
                            size={17}
                            weight="bold"
                            className="mt-1 shrink-0 text-rose"
                            aria-hidden="true"
                          />
                          <span className="text-sm leading-relaxed text-ink/80">
                            {example}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-10 grid border border-border bg-surface md:grid-cols-[auto_1fr]">
                  <div className="flex items-center border-b border-border px-5 py-4 md:border-b-0 md:border-r">
                    <ArrowDownRight
                      size={24}
                      weight="light"
                      className={index % 2 === 0 ? "text-rose" : "text-caramel"}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-xs text-soft">Useful starting point</p>
                    <p className="mt-1 font-medium text-ink">
                      {service.startingPoint}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

export { ServiceDossier };
