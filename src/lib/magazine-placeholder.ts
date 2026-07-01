import type { MagazineArticle } from "@/lib/magazine";

/**
 * Placeholder data shaped exactly like the real Scrumtrulescent (Payload)
 * REST response — `Article` is `MagazineArticle` itself (EPIC-007), not a
 * separate shape to keep in sync.
 */
export type Article = MagazineArticle;

export const placeholderArticles: Article[] = [
  {
    id: "placeholder-one",
    slug: "placeholder-one",
    title: "Article one",
    excerpt: "A short excerpt pulled from the magazine post.",
    cover_image: "",
    published_at: new Date().toISOString(),
    category: "General",
    url: "https://scrumtrulescent.com",
  },
  {
    id: "placeholder-two",
    slug: "placeholder-two",
    title: "Article two",
    excerpt: "A short excerpt pulled from the magazine post.",
    cover_image: "",
    published_at: new Date().toISOString(),
    category: "General",
    url: "https://scrumtrulescent.com",
  },
  {
    id: "placeholder-three",
    slug: "placeholder-three",
    title: "Article three",
    excerpt: "A short excerpt pulled from the magazine post.",
    cover_image: "",
    published_at: new Date().toISOString(),
    category: "General",
    url: "https://scrumtrulescent.com",
  },
];
