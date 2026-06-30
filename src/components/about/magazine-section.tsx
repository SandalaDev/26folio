import Link from "next/link";

import { Section } from "@/components/site/section";
import { Eyebrow } from "@/components/site/eyebrow";

/** MagazineSection — what/why Scrumtrulescent (12-ui-element-map.md §3 About #3). */
function MagazineSection() {
  return (
    <Section>
      <Eyebrow>Scrumtrulescent Magazine</Eyebrow>
      <h2 className="mt-3 max-w-2xl text-3xl font-display font-semibold text-ink">
        A side project that earns its keep
      </h2>
      <p className="measure mt-6 text-muted">
        Scrumtrulescent is a publication I run on the side, covering tech,
        economics, sports, sci-fi, film and TV, and online culture. It is
        genuinely fun to make, and it builds an audience of people who think
        about the same things I do, some of whom turn out to need the kind of
        work I do here.
      </p>
      <Link
        href="https://scrumtrulescent.com"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block eyebrow text-rose transition-colors hover:text-peach"
      >
        Read Scrumtrulescent
      </Link>
    </Section>
  );
}

export { MagazineSection };
