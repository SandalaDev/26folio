"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { Section } from "@/components/site/section";
import { BOOKSHELF, type Book } from "@/lib/the-way";
import { fadeUp, staggerContainer } from "@/lib/motion";

/**
 * Bookshelf - exhibit seven (EPIC-016/TASK-064, rebuilt cover-forward in
 * EPIC-018/TASK-069). Real covers stand on the shelf board in a hard-
 * cornered grid. Hovering or focusing a book slides its takeaway up over
 * the cover; on touch screens a tap toggles the same drawer (one open per
 * shelf, aria-expanded). All motion is transform/opacity and collapses to
 * an instant swap under prefers-reduced-motion.
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

  return (
    <div>
      <h3 className="font-display text-xl font-semibold text-ink">{label}</h3>
      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 border-b-2 border-border-2 pb-8 sm:grid-cols-3 md:gap-x-5 lg:grid-cols-5">
        {books.map((book, index) => (
          <li key={book.title}>
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
