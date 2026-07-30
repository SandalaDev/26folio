import { CapabilitiesHero } from "@/components/capabilities/capabilities-hero";
import { EngineeringStandards } from "@/components/capabilities/engineering-standards";
import { FitAndFaq } from "@/components/capabilities/fit-faq";
import { IntegrationMap } from "@/components/capabilities/integration-map";
import { PartnershipPath } from "@/components/capabilities/partnership-path";
import { ProblemBrief } from "@/components/capabilities/problem-brief";
import { ServiceDossier } from "@/components/capabilities/service-dossier";
import { TechnologiesSection } from "@/components/capabilities/technologies-section";
import { CTACallout } from "@/components/site/cta-callout";

export const dynamic = "force-static";

export default function CapabilitiesPage() {
  return (
    <>
      <CapabilitiesHero />
      <ProblemBrief />
      <ServiceDossier />
      <IntegrationMap />
      <PartnershipPath />
      <EngineeringStandards />
      <TechnologiesSection />
      <FitAndFaq />
      <CTACallout
        heading="Start with the problem."
        body="Send three short answers: what is not working, who feels the pain, and what would meaningfully improve if it were solved. I will tell you whether the next step is a conversation, an existing product, or a little more clarification."
        ctaLabel="Send the three answers"
        href="/contact"
      />
    </>
  );
}
