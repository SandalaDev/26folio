import Link from "next/link";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Article } from "@/lib/magazine-placeholder";

/** ArticleCard — one magazine teaser card (12-ui-element-map.md §3 Home #4). */
function ArticleCard({ article }: { article: Article }) {
  return (
    <Card>
      <Link
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <CardHeader>
          <CardTitle>{article.title}</CardTitle>
          <CardDescription>{article.excerpt}</CardDescription>
        </CardHeader>
      </Link>
    </Card>
  );
}

export { ArticleCard };
