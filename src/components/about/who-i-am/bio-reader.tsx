"use client";

import * as React from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BIO_CHAPTERS,
  BIO_INTRO,
  BIO_TAGLINE,
  BIO_TITLE,
  type BioChapter,
} from "@/lib/who-i-am";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { ChapterRail } from "./chapter-rail";

/**
 * BioReader — the chaptered reading layout inside the Who I Am modal
 * (EPIC-017). The wide shell buys structure, not longer lines: the chapter
 * rail sits on the left edge, the reading column keeps the site's 70ch
 * `measure`, and the surplus width becomes gutters where the oversized epoch
 * numerals live. Typography carries the redesign; the motion layer stays
 * recessive (TASK-067): scroll progress on the rail and the mobile hairline,
 * slow parallax on the gutter numerals and the logo watermark, and reveal
 * choreography on chapter openings and quote moments only. Body paragraphs
 * never animate, so the long read stays calm. Everything is transform and
 * opacity on the shared EASE_OUT curve and collapses under reduced motion.
 */

const BODY_TEXT = "measure text-[15.5px] leading-[1.75] text-muted md:text-[17px]";

/** Logo symbol as a low-opacity watermark, tinted via CSS mask (timeline IconGlyph technique). */
const watermarkMask: React.CSSProperties = {
  WebkitMaskImage: "url(/images/logo/logo_ink.svg)",
  maskImage: "url(/images/logo/logo_ink.svg)",
  WebkitMaskSize: "contain",
  maskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
};

function ChapterSection({
  chapter,
  containerRef,
}: {
  chapter: BioChapter;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const reduceMotion = useReducedMotion();
  const sectionRef = React.useRef<HTMLElement | null>(null);

  // The numeral drifts slower than the text while its chapter crosses the
  // modal's scroll region: parallax depth measured in tens of px, not vh.
  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const numeralY = useTransform(scrollYProgress, [0, 1], [56, -56]);

  const nodes: React.ReactNode[] = [];
  chapter.paragraphs.forEach((paragraph, index) => {
    if (paragraph.emphasis) {
      nodes.push(
        <motion.p
          key={`p-${index}`}
          initial={reduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          variants={fadeUp}
          className={`measure mt-10 font-display text-2xl font-medium leading-snug md:mt-12 md:text-3xl ${chapter.accentText}`}
        >
          {paragraph.text}
        </motion.p>,
      );
    } else if (index === 0) {
      nodes.push(
        <p key={`p-${index}`} className="measure mt-8 text-subhead text-ink">
          {paragraph.text}
        </p>,
      );
    } else {
      nodes.push(
        <p key={`p-${index}`} className={`mt-6 ${BODY_TEXT}`}>
          {paragraph.text}
        </p>,
      );
    }

    if (chapter.pullQuote && chapter.pullQuote.after === index) {
      nodes.push(
        <motion.figure
          key={`quote-${index}`}
          initial={reduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          variants={fadeUp}
          className="measure mb-2 mt-12 md:mt-16"
        >
          <span
            aria-hidden="true"
            className={`mb-6 block h-px w-16 ${chapter.accentBar}`}
          />
          <blockquote className="font-display text-2xl font-medium leading-snug text-ink md:text-[2rem]">
            {chapter.pullQuote.text}
          </blockquote>
        </motion.figure>,
      );
    }
  });

  return (
    <section
      ref={sectionRef}
      id={`bio-${chapter.id}`}
      data-bio-chapter={chapter.id}
      className="relative mt-20 scroll-mt-10 md:mt-28"
    >
      {/* Oversized numeral in the right gutter: the chapter's room number. */}
      <motion.span
        aria-hidden="true"
        style={reduceMotion ? undefined : { y: numeralY }}
        className={`pointer-events-none absolute -top-8 right-0 select-none font-display text-[7rem] font-semibold leading-none opacity-[0.13] md:-top-12 md:text-[11rem] ${chapter.accentText}`}
      >
        {chapter.numeral}
      </motion.span>
      <motion.div
        initial={reduceMotion ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        variants={staggerContainer}
      >
        <motion.p variants={fadeUp} className={`eyebrow ${chapter.accentText}`}>
          {chapter.label}
        </motion.p>
        <motion.h3
          variants={fadeUp}
          className="mt-2 font-display text-3xl font-semibold text-ink md:text-[2.6rem] md:leading-[1.1]"
        >
          {chapter.title}
        </motion.h3>
      </motion.div>
      {nodes}
    </section>
  );
}

function BioReader() {
  const reduceMotion = useReducedMotion();
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const watermarkY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <div className="relative flex h-full min-h-0 overflow-hidden">
      <ChapterRail containerRef={scrollRef} progress={scrollYProgress} />
      {/* Logo symbol watermark, pinned to the modal frame behind the text and
          drifting slower than the scroll. Wash-level opacity only (§3b). */}
      <motion.div
        aria-hidden="true"
        style={{
          ...watermarkMask,
          y: reduceMotion ? undefined : watermarkY,
        }}
        className="pointer-events-none absolute -right-24 top-1/2 z-0 size-[26rem] -translate-y-1/2 bg-caramel opacity-[0.05] md:-right-16 md:size-[34rem]"
      />
      {/* Mobile scroll progress: the rail collapses to this hairline. */}
      <motion.span
        aria-hidden="true"
        style={{ scaleX: scrollYProgress }}
        className="absolute inset-x-0 top-0 z-20 h-px origin-left bg-rose lg:hidden"
      />
      <div
        ref={scrollRef}
        className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain"
      >
        <div className="mx-auto w-full max-w-[52rem] px-6 pb-24 pt-14 md:px-10 md:pt-20">
          {/* Opening: masthead plus the pre-epoch introduction. Entrance
              choreography plays on each open (Radix mounts the content). */}
          <section id="bio-opening" data-bio-chapter="opening" className="scroll-mt-10">
            <motion.div
              initial={reduceMotion ? false : "hidden"}
              animate="show"
              variants={staggerContainer}
            >
              <DialogHeader>
                <motion.div variants={fadeUp}>
                  <DialogTitle className="font-display text-4xl font-semibold tracking-[-0.02em] text-ink md:text-5xl">
                    {BIO_TITLE}
                  </DialogTitle>
                </motion.div>
                <motion.div variants={fadeUp}>
                  <DialogDescription className="mt-1 text-base font-light text-muted">
                    {BIO_TAGLINE}
                  </DialogDescription>
                </motion.div>
              </DialogHeader>
              <motion.span
                variants={fadeUp}
                aria-hidden="true"
                className="mt-8 block h-px w-16 bg-border-2"
              />
              <motion.p variants={fadeUp} className="measure mt-8 text-subhead text-ink">
                {BIO_INTRO[0]}
              </motion.p>
            </motion.div>
            {BIO_INTRO.slice(1).map((text, index) => (
              <p
                key={index}
                className={
                  index === BIO_INTRO.length - 2
                    ? "measure mt-6 text-[15.5px] font-medium leading-[1.75] text-ink md:text-[17px]"
                    : `mt-6 ${BODY_TEXT}`
                }
              >
                {text}
              </p>
            ))}
          </section>
          {BIO_CHAPTERS.map((chapter) => (
            <ChapterSection
              key={chapter.id}
              chapter={chapter}
              containerRef={scrollRef}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export { BioReader };
