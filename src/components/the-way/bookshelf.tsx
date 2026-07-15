"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "@phosphor-icons/react";

import { Section } from "@/components/site/section";
import { BOOKSHELF, type Book } from "@/lib/the-way";
import { DURATION, EASE_OUT, fadeUp, staggerContainer } from "@/lib/motion";

/**
 * Bookshelf - exhibit seven (EPIC-016/TASK-064). Sources of inspiration as
 * physical books: spines stand upright on a shelf board, heights and accent
 * bands varied so the shelf reads collected rather than manufactured.
 * Clicking a spine opens an editorial spread under the shelf (cover, title,
 * author, personal takeaway; never a review) with an animated height reveal
 * that collapses to an instant swap under prefers-reduced-motion.
 */

const SPINE_HEIGHTS = ["h-44", "h-52", "h-48", "h-56", "h-40"] as const;
const SPINE_BANDS = [
  "bg-rose/50",
  "bg-caramel/50",
  "bg-peach/50",
  "bg-amber/50",
] as const;
const COVER_WASHES = [
  "bg-rose/10",
  "bg-caramel/10",
  "bg-peach/10",
  "bg-amber/10",
] as const;

function Spread({
  book,
  washClass,
  onClose,
}: {
  book: Book;
  washClass: string;
  onClose: () => void;
}) {
  return (
    <div className="relative grid gap-8 border border-t-0 border-border bg-surface p-8 md:grid-cols-12 md:p-10">
      <button
        type="button"
        onClick={onClose}
        aria-label={`Close ${book.title}`}
        className="absolute right-4 top-4 p-2 text-muted transition-colors hover:text-ink"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
      <div className="md:col-span-3">
        <div
          className={`flex aspect-[2/3] max-w-44 flex-col justify-between border border-border-2 p-5 ${washClass}`}
        >
          <span className="font-display text-lg font-semibold leading-snug text-ink">
            {book.title}
          </span>
          <span className="text-xs text-muted">{book.author}</span>
        </div>
      </div>
      <div className="md:col-span-8 md:col-start-5">
        <h4 className="font-display text-2xl font-semibold text-ink md:text-3xl">
          {book.title}
        </h4>
        <p className="mt-2 text-muted">{book.author}</p>
        <p className="measure mt-8 text-lg text-soft">{book.takeaway}</p>
      </div>
    </div>
  );
}

function ShelfRow({ label, books }: { label: string; books: Book[] }) {
  const shouldReduceMotion = useReducedMotion();
  const [open, setOpen] = React.useState<number | null>(null);
  const spreadId = `${label.toLowerCase().replace(/\W+/g, "-")}-spread`;

  return (
    <div>
      <h3 className="font-display text-xl font-semibold text-ink">{label}</h3>
      <ul className="mt-8 flex flex-wrap items-end gap-1.5 border-b-2 border-border-2">
        {books.map((book, index) => {
          const isOpen = open === index;
          return (
            <li key={book.title}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={spreadId}
                className={`flex w-11 flex-col items-stretch border transition-all duration-300 ease-out hover:-translate-y-2 md:w-12 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                  SPINE_HEIGHTS[index % SPINE_HEIGHTS.length]
                } ${
                  isOpen
                    ? "-translate-y-2 border-rose bg-surface-2"
                    : "border-border bg-surface-2 hover:border-border-2"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-5 w-full shrink-0 ${SPINE_BANDS[index % SPINE_BANDS.length]}`}
                />
                <span className="flex min-h-0 flex-1 items-center justify-center overflow-hidden px-1 py-3">
                  <span className="truncate font-display text-sm font-semibold text-ink [writing-mode:vertical-rl]">
                    {book.title}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div id={spreadId}>
        <AnimatePresence initial={false}>
          {open !== null ? (
            <motion.div
              key={books[open].title}
              initial={
                shouldReduceMotion ? undefined : { height: 0, opacity: 0 }
              }
              animate={
                shouldReduceMotion ? undefined : { height: "auto", opacity: 1 }
              }
              exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: DURATION.component, ease: EASE_OUT }}
              className="overflow-hidden"
            >
              <Spread
                book={books[open]}
                washClass={COVER_WASHES[open % COVER_WASHES.length]}
                onClose={() => setOpen(null)}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Bookshelf() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section id="inspiration" data-way-section="inspiration">
      <motion.div
        initial={shouldReduceMotion ? undefined : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "show"}
        viewport={{ once: true, amount: 0.1 }}
        variants={shouldReduceMotion ? undefined : staggerContainer}
      >
        <motion.h2
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="font-display text-heading text-ink"
        >
          Sources of Inspiration
        </motion.h2>
        <motion.p
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="measure mt-4 text-muted"
        >
          Pull a book off the shelf. Each one gets the reason it mattered, not
          a review.
        </motion.p>
        <motion.div
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="mt-14 flex flex-col gap-16"
        >
          {BOOKSHELF.map((shelf) => (
            <ShelfRow key={shelf.label} label={shelf.label} books={shelf.books} />
          ))}
        </motion.div>
      </motion.div>
    </Section>
  );
}

export { Bookshelf };
