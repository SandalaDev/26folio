import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectComposition } from "@/components/work/project-composition";
import { CTACallout } from "@/components/site/cta-callout";
import { projects } from "@/lib/projects";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  /* These pages are the most likely thing on the site to be shared as evidence of
     the work, and they previously carried no metadata at all. */
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      images: project.image ? [{ url: project.image }] : undefined,
    },
  };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];

  if (!project) notFound();

  /* Previous/next walk the same order the grid uses, and stop at the ends rather
     than wrapping — with four projects, wrapping would quietly imply a longer list
     than exists. */
  const previous = index > 0 ? projects[index - 1] : undefined;
  const next = index < projects.length - 1 ? projects[index + 1] : undefined;

  return (
    <>
      <ProjectComposition
        project={project}
        previous={previous && { slug: previous.slug, title: previous.title }}
        next={next && { slug: next.slug, title: next.title }}
      />
      <CTACallout
        heading="Got something like this in mind?"
        body="Tell me what you're trying to build and I'll tell you straight whether I'm the right fit."
        ctaLabel="Start a project"
        href="/contact"
      />
    </>
  );
}
