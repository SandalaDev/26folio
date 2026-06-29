export const dynamic = "force-static";
// No project entries yet (EPIC-005 supplies them). Empty params + dynamicParams:false
// keeps this route fully static — unknown slugs 404 rather than render on demand.
export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return [];
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <h1>Work: {slug}</h1>;
}
