"use client";

import * as React from "react";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowLeft } from "@phosphor-icons/react";

import { fadeUp, staggerContainer } from "@/lib/motion";

/**
 * WayHero - the museum entrance (EPIC-016/TASK-064). Editorial manifesto:
 * oversized display type, no portrait (the about page owns the photo; this
 * page opens with words). The heading block drifts up a touch slower than
 * the scroll (soft parallax, transform-only) and a blob wash breathes behind
 * the right edge, both disabled under prefers-reduced-motion. The staggered
 * entrance on mount doubles as the page transition from About.
 */
function WayHero() {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const drift = useTransform(scrollYProgress, [0, 1], [0, 56]);

  return (
    <section
      ref={sectionRef}
      id="intro"
      data-way-section="intro"
      className="relative overflow-hidden px-5 pb-24 pt-14 md:px-10 md:pb-32 lg:px-16 xl:px-24"
    >
      {/* Decorative wash behind the right edge - the brand blob motif. */}
      <div
        aria-hidden="true"
        className="blob-mask-2 blob-morph absolute -right-24 top-8 -z-10 size-72 bg-rose/10 md:size-96"
      />

      <motion.div
        initial={shouldReduceMotion ? undefined : "hidden"}
        animate={shouldReduceMotion ? undefined : "show"}
        variants={shouldReduceMotion ? undefined : staggerContainer}
        style={shouldReduceMotion ? undefined : { y: drift }}
      >
        <motion.div variants={shouldReduceMotion ? undefined : fadeUp}>
          <Link
            href="/about"
            className="group inline-flex items-center gap-2 text-muted transition-colors hover:text-ink lg:hidden"
          >
            <ArrowLeft
              aria-hidden="true"
              className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5 motion-reduce:transition-none"
            />
            <span className="eyebrow">Back to About</span>
          </Link>
        </motion.div>

        <motion.h1
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="display-gradient mt-10 max-w-[12ch] font-display text-display lg:mt-16"
        >
          The Way I Am
        </motion.h1>

        <motion.div
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="mt-12 grid gap-6 md:grid-cols-12 lg:mt-16"
        >
          <p className="text-subhead text-soft md:col-span-4">
            The person behind the projects.
          </p>
          <p className="measure text-muted md:col-span-6 md:col-start-6">
            This page isn&apos;t about what I do for work. It&apos;s about the
            things that shape how I think, what keeps me curious, and the ideas
            I keep coming back to.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}

export { WayHero };
