"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { technologyGroups } from "@/lib/capabilities";
import { DURATION, EASE_OUT } from "@/lib/motion";

const SWAP_INTERVAL_MS = 6500;

function TechGrid() {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (shouldReduceMotion || paused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % technologyGroups.length);
    }, SWAP_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [paused, shouldReduceMotion]);

  const group = technologyGroups[activeIndex];
  const suppliedCount = group.technologies.filter((tech) => tech.icon).length;

  return (
    <div
      className="grid gap-8 lg:grid-cols-[minmax(15rem,0.55fr)_minmax(0,1.45fr)] lg:gap-12"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div>
        <div
          role="tablist"
          aria-label="Technology categories"
          className="border-b border-border"
        >
          {technologyGroups.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`${item.id}-tab`}
                aria-selected={isActive}
                aria-controls={`${item.id}-panel`}
                onClick={() => setActiveIndex(index)}
                className="relative flex w-full items-center justify-between gap-4 border-t border-border py-3 text-left text-sm text-muted transition-colors hover:text-ink"
              >
                <span className={isActive ? "text-ink" : undefined}>
                  {item.title}
                </span>
                <span className="font-mono text-xs text-soft">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {isActive ? (
                  <motion.span
                    layoutId="technology-category"
                    className="absolute bottom-0 left-0 top-0 w-px bg-rose"
                    transition={{ duration: DURATION.component, ease: EASE_OUT }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>
        <p className="mt-5 text-xs text-soft">
          Categories advance automatically. Hover, focus, or choose one to
          pause.
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={group.id}
          role="tabpanel"
          id={`${group.id}-panel`}
          aria-labelledby={`${group.id}-tab`}
          initial={
            shouldReduceMotion ? false : { opacity: 0, y: 18, clipPath: "inset(0 0 12% 0)" }
          }
          animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
          exit={
            shouldReduceMotion
              ? undefined
              : { opacity: 0, y: -12, clipPath: "inset(12% 0 0 0)" }
          }
          transition={{ duration: DURATION.page, ease: EASE_OUT }}
          className="min-h-[34rem] border border-border bg-surface p-6 md:p-8"
        >
          <div className="flex flex-col justify-between gap-6 border-b border-border pb-6 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-xs text-caramel">
                stack / {String(activeIndex + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-display text-3xl font-semibold text-ink">
                {group.title}
              </h3>
            </div>
            <p className="font-mono text-xs text-soft">
              {suppliedCount}/{group.technologies.length} supplied marks
            </p>
          </div>
          <p className="measure mt-6 text-muted">{group.description}</p>

          <div className="mt-8 grid grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {group.technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: DURATION.component,
                  ease: EASE_OUT,
                  delay: shouldReduceMotion ? 0 : Math.min(index * 0.035, 0.28),
                }}
                className="bg-background"
              >
                <HoverCard openDelay={120} closeDelay={80}>
                  <HoverCardTrigger asChild>
                    <button
                      type="button"
                      className="group flex min-h-32 w-full flex-col items-center justify-center gap-3 p-4 text-center transition-colors hover:bg-surface-2"
                    >
                      {tech.icon ? (
                        <Image
                          src={tech.icon}
                          alt=""
                          width={42}
                          height={42}
                          className="h-10 w-10 object-contain transition-transform duration-300 group-hover:-translate-y-1"
                        />
                      ) : (
                        <span className="flex h-10 w-10 items-center justify-center border border-dashed border-caramel font-mono text-xs text-caramel">
                          {tech.name.slice(0, 2)}
                        </span>
                      )}
                      <span className="text-sm font-medium text-ink">
                        {tech.name}
                      </span>
                      {!tech.icon ? (
                        <span className="font-mono text-xs text-soft">
                          text-only / mark not supplied
                        </span>
                      ) : null}
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent side="top" className="w-72">
                    <p className="eyebrow text-caramel">{tech.name}</p>
                    <p className="mt-2 text-sm text-muted">
                      Used within {group.title.toLowerCase()}. {group.description}
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export { TechGrid };
