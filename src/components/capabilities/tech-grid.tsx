"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { technologyGroups } from "@/lib/capabilities";
import { DURATION, EASE_OUT } from "@/lib/motion";

const SWAP_INTERVAL_MS = 6500;

function TypedDescription({
  text,
  shouldReduceMotion,
}: {
  text: string;
  shouldReduceMotion: boolean | null;
}) {
  if (shouldReduceMotion) {
    return <p className="text-sm leading-relaxed">{text}</p>;
  }

  return (
    <p className="text-sm leading-relaxed">
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              delayChildren: 0.16,
              staggerChildren: 0.008,
            },
          },
        }}
      >
        {Array.from(text).map((character, index) => (
          <motion.span
            key={`${character}-${index}`}
            className="inline"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            transition={{ duration: 0.01 }}
          >
            {character}
          </motion.span>
        ))}
      </motion.span>
      <motion.span
        aria-hidden="true"
        className="bg-rose ml-0.5 inline-block h-[1.05em] w-px translate-y-0.5"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.78, repeat: Infinity, ease: "linear" }}
      />
    </p>
  );
}

function TechGrid() {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [activeTechIndex, setActiveTechIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (shouldReduceMotion || paused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % technologyGroups.length);
      setActiveTechIndex(0);
    }, SWAP_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [paused, shouldReduceMotion]);

  const group = technologyGroups[activeIndex];
  const activeTech = group.technologies[activeTechIndex] ?? group.technologies[0];
  const activeDescription = `${activeTech.name} sits within ${group.title.toLowerCase()}. ${group.description}`;

  const selectGroup = (index: number) => {
    setActiveIndex(index);
    setActiveTechIndex(0);
  };

  return (
    <div
      className="grid gap-8 lg:grid-cols-[minmax(15rem,0.55fr)_minmax(0,1.45fr)] lg:gap-12"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div>
        <div role="tablist" aria-label="Technology categories" className="border-border border-b">
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
                onClick={() => selectGroup(index)}
                className="border-border text-muted hover:text-ink relative flex w-full items-center justify-between gap-4 border-t py-3 text-left text-sm transition-colors"
              >
                <span className={isActive ? "text-ink" : undefined}>{item.title}</span>
                <span className="text-soft font-mono text-xs">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {isActive ? (
                  <motion.span
                    layoutId="technology-category"
                    className="bg-rose absolute top-0 bottom-0 left-0 w-px"
                    transition={{ duration: DURATION.component, ease: EASE_OUT }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>
        <p className="text-soft mt-5 text-xs">
          Categories advance automatically. Hover, focus, or tap a mark to read its role.
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={group.id}
          role="tabpanel"
          id={`${group.id}-panel`}
          aria-labelledby={`${group.id}-tab`}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18, clipPath: "inset(0 0 12% 0)" }}
          animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
          exit={
            shouldReduceMotion ? undefined : { opacity: 0, y: -12, clipPath: "inset(12% 0 0 0)" }
          }
          transition={{ duration: DURATION.page, ease: EASE_OUT }}
          className="border-border bg-surface min-h-[38rem] overflow-hidden border p-5 md:p-8"
        >
          <div className="border-border border-b pb-6">
            <div>
              <p className="text-caramel font-mono text-xs">
                stack / {String(activeIndex + 1).padStart(2, "0")}
              </p>
              <h3 className="font-display text-ink mt-2 text-3xl font-semibold">{group.title}</h3>
            </div>
          </div>
          <p className="measure text-muted mt-6">{group.description}</p>

          <div className="bg-border mt-8 grid grid-cols-2 gap-px sm:grid-cols-3 xl:grid-cols-4">
            {group.technologies.map((tech, index) => {
              const isActive = index === activeTechIndex;
              const iconFrame =
                tech.iconShape === "wide"
                  ? "h-16 w-28 md:h-[4.5rem] md:w-32"
                  : "h-16 w-16 md:h-[4.5rem] md:w-[4.5rem]";

              return (
                <motion.button
                  key={tech.name}
                  type="button"
                  aria-pressed={isActive}
                  aria-describedby={`${group.id}-technology-description`}
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                  transition={{
                    duration: DURATION.component,
                    ease: EASE_OUT,
                    delay: shouldReduceMotion ? 0 : Math.min(index * 0.035, 0.28),
                  }}
                  onPointerEnter={() => setActiveTechIndex(index)}
                  onFocus={() => setActiveTechIndex(index)}
                  onClick={() => setActiveTechIndex(index)}
                  className={`group bg-background relative flex min-h-44 flex-col items-center justify-center gap-4 overflow-hidden p-4 text-center transition-colors focus-visible:z-10 ${
                    isActive ? "bg-surface-2" : "hover:bg-surface-2"
                  }`}
                >
                  <span
                    className={`bg-rose pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left transition-transform duration-300 ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                    aria-hidden="true"
                  />
                  {tech.icon ? (
                    <span className={`relative block ${iconFrame}`}>
                      <Image
                        src={tech.icon}
                        alt=""
                        fill
                        sizes="128px"
                        className={`object-contain transition-transform duration-500 group-hover:scale-110 ${
                          tech.iconTone === "white" ? "brightness-0 invert" : ""
                        }`}
                      />
                    </span>
                  ) : (
                    <span className="border-caramel text-caramel flex h-16 w-16 items-center justify-center border border-dashed font-mono text-sm">
                      {tech.name.slice(0, 2)}
                    </span>
                  )}
                  <span className="text-ink max-w-36 text-sm font-medium">{tech.name}</span>
                  {!tech.icon ? (
                    <span className="text-soft font-mono text-[0.68rem] leading-tight">
                      owner mark needed
                    </span>
                  ) : null}
                </motion.button>
              );
            })}
          </div>

          <div
            id={`${group.id}-technology-description`}
            className="relative mt-7 min-h-32 overflow-hidden p-3 md:p-5"
            aria-live="polite"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${group.id}-${activeTech.name}`}
                initial={
                  shouldReduceMotion
                    ? false
                    : {
                        opacity: 0,
                        x: 72,
                        y: 18,
                        rotate: 3.5,
                        clipPath: "polygon(16% 0, 100% 0, 92% 100%, 0 100%)",
                      }
                }
                animate={{
                  opacity: 1,
                  x: 0,
                  y: 0,
                  rotate: -0.7,
                  clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0 100%)",
                }}
                exit={
                  shouldReduceMotion
                    ? undefined
                    : {
                        opacity: 0,
                        x: -46,
                        y: -10,
                        rotate: -2.5,
                        clipPath: "polygon(0 0, 88% 0, 100% 100%, 7% 100%)",
                      }
                }
                transition={{ duration: 0.5, ease: EASE_OUT }}
                className="border-rose/50 bg-peach text-background relative border px-8 py-6 shadow-[10px_10px_0_rgba(229,112,105,0.16)] md:px-12"
              >
                <span
                  className="bg-rose absolute top-1/2 -left-3 hidden h-px w-8 -translate-y-1/2 md:block"
                  aria-hidden="true"
                />
                <p className="text-background/75 mb-2 font-mono text-sm font-medium">
                  {activeTech.name}
                </p>
                <TypedDescription
                  text={activeDescription}
                  shouldReduceMotion={shouldReduceMotion}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export { TechGrid };
