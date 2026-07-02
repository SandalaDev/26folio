"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Section } from "@/components/site/section";
import { Eyebrow } from "@/components/site/eyebrow";
import { Blob } from "@/components/site/blob";
import { ArticleCard } from "@/components/home/article-card";
import { placeholderArticles, type Article } from "@/lib/magazine-placeholder";
import { fadeUp, staggerContainer } from "@/lib/motion";

/**
 * MagazineTeaser — "From Scrumtrulescent" (12-ui-element-map.md §3 Home #4).
 * Accepts `articles` so EPIC-007 wires in the real `lib/magazine.ts` fetch
 * without touching this component's contract (epic decision #2).
 */
function MagazineTeaser({
  articles = placeholderArticles,
}: {
  articles?: Article[];
}) {
  const shouldReduceMotion = useReducedMotion();

  if (articles.length === 0) return null;

  return (
    <Section className="relative overflow-hidden">
      {/* Blob cluster — quiet wash behind the card grid (§Blob motif). */}
      <Blob
        variant={2}
        fill="var(--color-rose)"
        opacity={0.05}
        blur={4}
        className="-z-10 -right-24 top-8 w-96"
      />
      <Blob
        variant={4}
        fill="var(--color-caramel)"
        opacity={0.05}
        blur={6}
        className="-z-10 -left-28 bottom-0 w-80"
      />
      <Eyebrow>From Scrumtrulescent</Eyebrow>
      <h2 className="mt-3 text-heading font-display text-ink">
        Recent <span className="font-extralight">from the magazine</span>
      </h2>
      <motion.div
        initial={shouldReduceMotion ? undefined : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "show"}
        viewport={{ once: true }}
        variants={shouldReduceMotion ? undefined : staggerContainer}
        className="mt-10 grid gap-6 md:grid-cols-3"
      >
        {articles.map((article) => (
          <motion.div
            key={article.slug}
            variants={shouldReduceMotion ? undefined : fadeUp}
          >
            <ArticleCard article={article} />
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

export { MagazineTeaser };
