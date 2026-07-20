"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CaretLeft, CaretRight, X } from "@phosphor-icons/react";

import { Section } from "@/components/site/section";
import { BOOKSHELF, BOOKSHELF_INTRO, type Book } from "@/lib/the-way";
import { DURATION, EASE_OUT, fadeUp, prefersReducedMotion, staggerContainer } from "@/lib/motion";

/**
 * Bookshelf - the Sources of Inspiration exhibit (EPIC-016/TASK-064,
 * cover-forward in TASK-069, laid on its side in TASK-072, rebuilt around
 * the owner's verbose mini reviews in TASK-073). Each shelf is a single
 * horizontal row paged by paddle arrows (scroll-snap, hidden scrollbar,
 * touch swipe still works). Clicking a cover opens a reading panel under
 * the shelf with the owner's full review and favourite quote; picking
 * another book collapses and re-expands the panel (height auto, static
 * swap under reduced motion). One panel per shelf, aria-expanded on the
 * covers. All motion is transform/opacity/height on the shared EASE_OUT.
 */

function BookCase({
  book,
  isOpen,
  onToggle,
}: {
  book: Book;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className="group flex w-full flex-col text-left"
    >
      <span
        className={`relative block aspect-[2/3] w-full overflow-hidden border transition-all duration-300 ease-out group-hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 ${
          isOpen ? "-translate-y-1.5 border-rose" : "border-border group-hover:border-border-2"
        }`}
      >
        <Image
          src={book.cover}
          alt={`${book.title} by ${book.author}`}
          fill
          sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 45vw"
          className="object-cover"
        />
        {/* Hint drawer: names the click affordance without hiding the cover. */}
        <span
          className={`bg-background/85 absolute inset-x-0 bottom-0 flex translate-y-2 p-3 text-xs backdrop-blur-sm transition-all duration-300 ease-out motion-reduce:transition-none ${
            isOpen
              ? "translate-y-0 opacity-100"
              : "opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
          }`}
        >
          <span className={isOpen ? "text-rose" : "text-soft"}>
            {isOpen ? "Close the review" : "Read the review"}
          </span>
        </span>
      </span>
      <span className="font-display text-ink mt-3 block truncate text-sm font-semibold">
        {book.title}
      </span>
      <span className="text-muted mt-0.5 block truncate text-xs">{book.author}</span>
    </button>
  );
}

/** The reading panel under a shelf: cover, review paragraphs, quote. */
function ReviewPanel({ book, onClose }: { book: Book; onClose: () => void }) {
  return (
    <div className="border-border bg-surface mt-6 border p-6 md:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:gap-10">
        <div className="border-border relative hidden aspect-[2/3] w-36 shrink-0 self-start overflow-hidden border md:block">
          <Image
            src={book.cover}
            alt=""
            fill
            sizes="9rem"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="font-display text-ink text-xl font-semibold">{book.title}</h4>
              <p className="text-muted mt-1 text-sm">{book.author}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={`Close the ${book.title} review`}
              className="border-border text-muted hover:border-border-2 hover:text-ink shrink-0 border p-2 transition-colors"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
          {book.review.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="measure text-soft mt-4 leading-relaxed">
              {paragraph}
            </p>
          ))}
          {book.quote ? (
            <figure className="border-rose mt-6 border-l-2 pl-4">
              <blockquote className="font-display text-ink whitespace-pre-line text-lg">
                &ldquo;{book.quote.text}&rdquo;
              </blockquote>
              {book.quote.source ? (
                <figcaption className="text-muted mt-2 text-sm">{book.quote.source}</figcaption>
              ) : null}
            </figure>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ShelfRow({ label, books }: { label: string; books: Book[] }) {
  const shouldReduceMotion = useReducedMotion();
  const [open, setOpen] = React.useState<number | null>(null);
  const railRef = React.useRef<HTMLUListElement>(null);
  const [canPageLeft, setCanPageLeft] = React.useState(false);
  const [canPageRight, setCanPageRight] = React.useState(true);

  const updatePaddles = React.useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    setCanPageLeft(rail.scrollLeft > 4);
    setCanPageRight(rail.scrollLeft < rail.scrollWidth - rail.clientWidth - 4);
  }, []);

  React.useEffect(() => {
    updatePaddles();
  }, [updatePaddles]);

  const page = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({
      left: direction * rail.clientWidth * 0.85,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  const openBook = open === null ? null : books[open];

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-display text-ink text-xl font-semibold">{label}</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => page(-1)}
            disabled={!canPageLeft}
            aria-label={`Slide the ${label} shelf back`}
            className="border-border text-muted enabled:hover:border-border-2 enabled:hover:text-ink border p-2 transition-colors disabled:opacity-30"
          >
            <CaretLeft aria-hidden="true" className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => page(1)}
            disabled={!canPageRight}
            aria-label={`Slide the ${label} shelf forward`}
            className="border-border text-muted enabled:hover:border-border-2 enabled:hover:text-ink border p-2 transition-colors disabled:opacity-30"
          >
            <CaretRight aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
      {/* One sliding row per shelf, paged by the paddles above; the cut-off
          cover at the edge is the affordance. The scrollbar stays hidden
          (touch swipe and the paddles cover the interaction). */}
      <ul
        ref={railRef}
        onScroll={updatePaddles}
        className="border-border-2 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto border-b-2 pb-8 md:gap-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {books.map((book, index) => (
          <li key={book.title} className="w-36 shrink-0 snap-start sm:w-40 lg:w-44">
            <BookCase
              book={book}
              isOpen={open === index}
              onToggle={() => setOpen(open === index ? null : index)}
            />
          </li>
        ))}
      </ul>
      {/* The reading panel. Keyed by title with mode="wait": switching
          books closes one review and opens the next, so the shelf reads
          as one desk rather than a flickering swap. */}
      <AnimatePresence initial={false} mode="wait">
        {openBook ? (
          <motion.div
            key={openBook.title}
            initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: DURATION.page, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <ReviewPanel book={openBook} onClose={() => setOpen(null)} />
          </motion.div>
        ) : null}
      </AnimatePresence>
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
          className="measure text-muted mt-4"
        >
          {BOOKSHELF_INTRO} Pull one off the shelf for the full story.
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
