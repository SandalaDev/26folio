"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

import { Section } from "@/components/site/section";
import { BOOKSHELF, type Book } from "@/lib/the-way";
import { fadeUp, prefersReducedMotion, staggerContainer } from "@/lib/motion";

/**
 * Bookshelf - exhibit seven (EPIC-016/TASK-064, rebuilt cover-forward in
 * EPIC-018/TASK-069; laid on its side in TASK-072). Each shelf is a single
 * horizontal row paged by paddle arrows in the shelf header (scroll-snap
 * with the scrollbar hidden, so touch swiping still works): the third
 * hiding technique on the walk, next to the album wall's capped preview
 * and the wishlist accordion. Hovering or focusing a book slides its
 * takeaway up over the cover; on touch screens a tap toggles the same
 * drawer (one open per shelf, aria-expanded). All motion is transform/
 * opacity and collapses to an instant swap under prefers-reduced-motion.
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
          isOpen
            ? "-translate-y-1.5 border-rose"
            : "border-border group-hover:border-border-2"
        }`}
      >
        <Image
          src={book.cover}
          alt={`${book.title} by ${book.author}`}
          fill
          sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 45vw"
          className="object-cover"
        />
        {/* Takeaway drawer: rises over the cover on hover, focus or tap. */}
        <span
          className={`absolute inset-0 flex flex-col justify-end overflow-y-auto bg-background/90 p-4 backdrop-blur-sm transition-all duration-300 ease-out motion-reduce:transition-none ${
            isOpen
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-3 opacity-0 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
          }`}
        >
          <span className="text-sm leading-relaxed text-soft">
            {book.takeaway}
          </span>
        </span>
      </span>
      <span className="mt-3 block truncate font-display text-sm font-semibold text-ink">
        {book.title}
      </span>
      <span className="mt-0.5 block truncate text-xs text-muted">
        {book.author}
      </span>
    </button>
  );
}

function ShelfRow({ label, books }: { label: string; books: Book[] }) {
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

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-display text-xl font-semibold text-ink">{label}</h3>
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
        className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto border-b-2 border-border-2 pb-8 md:gap-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
