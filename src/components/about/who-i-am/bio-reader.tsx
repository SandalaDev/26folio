import * as React from "react";

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
import { ChapterRail } from "./chapter-rail";

/**
 * BioReader — the chaptered reading layout inside the Who I Am modal
 * (EPIC-017). The wide shell buys structure, not longer lines: the chapter
 * rail sits on the left edge, the reading column keeps the site's 70ch
 * `measure`, and the surplus width becomes gutters where the oversized epoch
 * numerals live. Typography carries the redesign: a light masthead tagline
 * against the semibold title, subhead-weight ledes opening each chapter,
 * display-type pull quotes and emphasis lines in the chapter's epoch accent.
 */

const BODY_TEXT = "measure text-[15.5px] leading-[1.75] text-muted md:text-[17px]";

function ChapterSection({ chapter }: { chapter: BioChapter }) {
  const nodes: React.ReactNode[] = [];

  chapter.paragraphs.forEach((paragraph, index) => {
    if (paragraph.emphasis) {
      nodes.push(
        <p
          key={`p-${index}`}
          className={`measure mt-10 font-display text-2xl font-medium leading-snug md:mt-12 md:text-3xl ${chapter.accentText}`}
        >
          {paragraph.text}
        </p>,
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
        <figure key={`quote-${index}`} className="measure mb-2 mt-12 md:mt-16">
          <span
            aria-hidden="true"
            className={`mb-6 block h-px w-16 ${chapter.accentBar}`}
          />
          <blockquote className="font-display text-2xl font-medium leading-snug text-ink md:text-[2rem]">
            {chapter.pullQuote.text}
          </blockquote>
        </figure>,
      );
    }
  });

  return (
    <section
      id={`bio-${chapter.id}`}
      data-bio-chapter={chapter.id}
      className="relative mt-20 scroll-mt-10 md:mt-28"
    >
      {/* Oversized numeral in the right gutter — the chapter's room number. */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -top-8 right-0 select-none font-display text-[7rem] font-semibold leading-none opacity-[0.13] md:-top-12 md:text-[11rem] ${chapter.accentText}`}
      >
        {chapter.numeral}
      </span>
      <p className={`eyebrow ${chapter.accentText}`}>{chapter.label}</p>
      <h3 className="mt-2 font-display text-3xl font-semibold text-ink md:text-[2.6rem] md:leading-[1.1]">
        {chapter.title}
      </h3>
      {nodes}
    </section>
  );
}

function BioReader() {
  return (
    <div className="flex h-full min-h-0">
      <ChapterRail />
      <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
        <div className="mx-auto w-full max-w-[52rem] px-6 pb-24 pt-14 md:px-10 md:pt-20">
          {/* Opening — masthead plus the pre-epoch introduction. */}
          <section id="bio-opening" data-bio-chapter="opening" className="scroll-mt-10">
            <DialogHeader>
              <DialogTitle className="font-display text-4xl font-semibold tracking-[-0.02em] text-ink md:text-5xl">
                {BIO_TITLE}
              </DialogTitle>
              <DialogDescription className="mt-1 text-base font-light text-muted">
                {BIO_TAGLINE}
              </DialogDescription>
            </DialogHeader>
            <span aria-hidden="true" className="mt-8 block h-px w-16 bg-border-2" />
            {BIO_INTRO.map((text, index) => (
              <p
                key={index}
                className={
                  index === 0
                    ? "measure mt-8 text-subhead text-ink"
                    : index === BIO_INTRO.length - 1
                      ? "measure mt-6 text-[15.5px] font-medium leading-[1.75] text-ink md:text-[17px]"
                      : `mt-6 ${BODY_TEXT}`
                }
              >
                {text}
              </p>
            ))}
          </section>
          {BIO_CHAPTERS.map((chapter) => (
            <ChapterSection key={chapter.id} chapter={chapter} />
          ))}
        </div>
      </div>
    </div>
  );
}

export { BioReader };
