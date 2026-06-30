import { notFound } from "next/navigation";

import { CaseStudyDetail } from "@/components/work/case-study-detail";
import { CTACallout } from "@/components/site/cta-callout";
import { projects } from "@/lib/projects";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  return (
    <>
      <CaseStudyDetail project={project} />
      <CTACallout
        heading="Got something like this in mind?"
        body="Tell me what you're trying to build and I'll tell you straight whether I'm the right fit."
        ctaLabel="Start a project"
        href="/contact"
      />
    </>
  );
}
