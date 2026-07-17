"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowLeft } from "@phosphor-icons/react";

import { Blob } from "@/components/site/blob";
import { fadeUp, staggerContainer } from "@/lib/motion";

/**
 * WayHero - the museum entrance (EPIC-016/TASK-064, recomposed in
 * EPIC-018/TASK-068). Editorial manifesto with the page's one artifact: the
 * blob motif moved from a right-edge wash to the center of the hero, now
 * masking the owner's portrait (abe2.jpg) with a soft rose echo behind it.
 * The heading block drifts up a touch slower than the scroll (soft parallax,
 * transform-only), disabled under prefers-reduced-motion. The staggered
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

        {/* The portrait sits dead-center; the two intro lines flank it at
            md+ and stack under it on mobile. */}
        <motion.div
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="mt-12 grid gap-10 md:grid-cols-12 md:items-center lg:mt-16"
        >
          <p className="order-2 text-subhead text-soft md:order-none md:col-span-3">
            The person behind the projects.
          </p>

          <div className="relative mx-auto w-56 sm:w-64 md:col-span-6 md:w-72 lg:w-80">
            <Blob
              variant={2}
              fill="var(--color-rose)"
              opacity={0.12}
              blur={8}
              className="-left-8 -top-8 w-[135%]"
            />
            <div className="blob-mask-2 blob-morph relative aspect-square overflow-hidden bg-surface-2">
              <Image
                src="/images/abe2.jpg"
                alt="Abe Sandala"
                fill
                sizes="(min-width: 1024px) 20rem, (min-width: 768px) 18rem, 14rem"
                priority
                className="object-cover object-[50%_30%]"
              />
            </div>
          </div>

          <p className="order-3 measure text-muted md:order-none md:col-span-3">
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
