/**
 * Placeholder data shaped exactly like the planned Scrumtrulescent (Payload)
 * REST response. EPIC-007 (`lib/magazine.ts`) swaps the data source in; this
 * shape is the contract, not a guess to be re-derived later.
 */
export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  url: string;
}

export const placeholderArticles: Article[] = [
  {
    slug: "placeholder-one",
    title: "Article one",
    excerpt: "A short excerpt pulled from the magazine post.",
    url: "https://scrumtrulescent.com",
  },
  {
    slug: "placeholder-two",
    title: "Article two",
    excerpt: "A short excerpt pulled from the magazine post.",
    url: "https://scrumtrulescent.com",
  },
  {
    slug: "placeholder-three",
    title: "Article three",
    excerpt: "A short excerpt pulled from the magazine post.",
    url: "https://scrumtrulescent.com",
  },
];
