import { env } from "@/lib/env";

/**
 * Real, documented response shape from the Scrumtrulescent Magazine's
 * Payload REST API (06-project-technical-plan.md "Magazine API client").
 * sandala.dev is a read-only consumer — no Payload code lives here.
 */
export interface MagazineArticle {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  cover_image: string;
  published_at: string;
  category: string;
  url: string;
}

/**
 * getFeaturedMagazineArticles — fetches articles flagged
 * `featured_on_portfolio: true`. 1-hour ISR revalidate. Never throws, never
 * blocks the build: any missing config, network error, non-2xx response, or
 * malformed payload resolves to `[]` rather than rejecting.
 */
export async function getFeaturedMagazineArticles(): Promise<MagazineArticle[]> {
  if (!env.MAGAZINE_API_URL) return [];

  try {
    const response = await fetch(
      `${env.MAGAZINE_API_URL}/api/articles?where[featured_on_portfolio][equals]=true`,
      {
        headers: env.MAGAZINE_API_KEY
          ? { Authorization: `Bearer ${env.MAGAZINE_API_KEY}` }
          : undefined,
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) return [];

    const data: unknown = await response.json();
    const docs = (data as { docs?: unknown })?.docs;
    if (!Array.isArray(docs)) return [];

    return docs as MagazineArticle[];
  } catch {
    return [];
  }
}
