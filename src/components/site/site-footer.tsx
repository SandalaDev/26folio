"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { Section } from "@/components/site/section";
import { MasonryPattern } from "@/components/site/masonry-pattern";
import { NAV_LINKS } from "@/components/site/mobile-nav";
import { fadeUp } from "@/lib/motion";

// Placeholder handles - real profile URLs are an owner-confirmed follow-up.
// Deliberately no LinkedIn (11-content-strategy.md §7 policy).
const SOCIAL_LINKS = [
  { label: "TikTok", href: "#" },
  { label: "YouTube", href: "#" },
  { label: "X", href: "#" },
  { label: "Bluesky", href: "#" },
  { label: "GitHub", href: "#" },
];

/**
 * SiteFooter - global footer (12-ui-element-map.md §2). Monochrome wordmark,
 * nav repeat, socials (no LinkedIn), link out to the Scrumtrulescent magazine.
 *
 * EPIC-011 (owner note 3, adjusted): text/links stay in the pink family (the
 * ink/soft tokens), hover to rose. The masonry texture behind the columns is a
 * filled wash at a very low opacity so it barely reads against the background
 * (see MasonryPattern).
 */
function SiteFooter() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.footer
      initial={shouldReduceMotion ? undefined : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "show"}
      viewport={{ once: true }}
      variants={shouldReduceMotion ? undefined : fadeUp}
      className="relative overflow-hidden border-t border-border"
    >
      {/* Irregular masonry texture - the angular counterpart to the blob
          motif, whisper-quiet behind the footer columns. */}
      <MasonryPattern className="-z-10 inset-0 h-full w-full" opacity={0.16} />
      <Section className="grid gap-10 py-12 md:grid-cols-3 md:py-16">
        <div className="flex flex-col gap-2">
          <Link href="/" aria-label="Sandala" className="w-fit">
            <Image
              src="/images/logo/logo_combo-muted.svg"
              alt=""
              width={44}
              height={44}
            />
          </Link>
          <Link
            href="https://scrumtrulescent.com"
            target="_blank"
            rel="noopener noreferrer"
            className="eyebrow text-muted transition-colors hover:text-rose"
          >
            Scrumtrulescent Magazine
          </Link>
        </div>

        <nav className="flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-ink/80 transition-colors hover:text-rose"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <nav aria-label="Social links" className="flex flex-col gap-2">
          {SOCIAL_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-ink/80 transition-colors hover:text-rose"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </Section>
    </motion.footer>
  );
}

export { SiteFooter };
