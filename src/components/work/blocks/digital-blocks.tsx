import { Section } from "@/components/site/section";
import { Eyebrow } from "@/components/site/eyebrow";
import { ArtefactPlate } from "@/components/work/artefact-plate";
import { ArtefactFigure } from "@/components/work/blocks/artefact-figure";
import { BlockReveal, BlockRevealItem } from "@/components/work/blocks/block-reveal";
import { ScreensFrame } from "@/components/work/blocks/screens-frame";
import type { Asset } from "@/lib/projects";

/**
 * The digital blocks (EPIC-026 TASK-098): `screens` and `devices`. These present
 * web design work, and they carry more risk than the print blocks because both
 * involve motion and large images.
 */

/* ------------------------------------------------------------------ screens */

/**
 * ScreensBlock — `kind: "screens"`. A long page design inside a clipped frame.
 *
 * The scroll-linked panning lives in `ScreensFrame` (client); see that file for the
 * two hard constraints — page scroll is never captured, and reduced motion gets the
 * complete design as a static image in flow.
 *
 * **Full-artwork access without a focus trap.** Rather than making the frame
 * focusable and reimplementing arrow-key scrolling, the caption carries a plain
 * link to the image itself. Every reader — keyboard, screen reader, or anyone who
 * simply wants a closer look — can open the design at full size, and no custom
 * key handling or `tabindex` on a div is introduced. The frame stays presentation.
 */
function ScreensBlock({ shot, label = "Interface" }: { shot: Asset; label?: string }) {
  return (
    <Section className="py-14 md:py-20">
      <BlockReveal className="flex flex-col gap-6">
        <Eyebrow as="h2" tone="caramel">
          {label}
        </Eyebrow>

        <ArtefactPlate tone={shot.tone ?? "neutral"} inset="sm">
          <ScreensFrame shot={shot} />
        </ArtefactPlate>

        <p className="text-soft flex flex-wrap items-baseline gap-x-3 text-sm">
          {shot.caption ? <span>{shot.caption}</span> : null}
          <a
            href={shot.src}
            className="text-rose decoration-border hover:text-peach underline underline-offset-4 transition-colors"
          >
            View the full design
          </a>
        </p>
      </BlockReveal>
    </Section>
  );
}

/* ------------------------------------------------------------------ devices */

/**
 * DevicesBlock — `kind: "devices"`. Laptop and phone mocks composed as a row.
 *
 * Provision Finance only: `device-laptop` 849×849, `device-phone` 274×573 and
 * `device-desktop` 1026×768. The phone is small at source and must never be
 * upscaled past its intrinsic width or it will look soft beside the laptop, which
 * `ArtefactFigure` enforces.
 *
 * `bare` tone throughout: device mockups carry their own shadow and framing, so a
 * mat would be a frame around a frame.
 *
 * The arrangement is deliberate rather than a plain grid — the widest mock leads and
 * the narrower ones sit beside it — and it stacks below `md`, where an overlap or a
 * three-across row becomes a mess.
 */
function DevicesBlock({ mocks }: { mocks: Asset[] }) {
  if (mocks.length === 0) return null;

  // Widest-aspect mock leads; portrait mocks follow at smaller scale.
  const sorted = [...mocks].sort((a, b) => b.width / b.height - a.width / a.height);
  const [lead, ...rest] = sorted;

  return (
    <Section className="py-14 md:py-20">
      <BlockReveal stagger className="flex flex-col gap-8">
        <BlockRevealItem>
          <Eyebrow as="h2" tone="caramel">
            On device
          </Eyebrow>
        </BlockRevealItem>

        <div className="grid items-end gap-6 md:grid-cols-12">
          <BlockRevealItem className="md:col-span-7">
            <ArtefactFigure
              asset={lead}
              fallbackTone="bare"
              inset="sm"
              sizes="(min-width: 768px) 55vw, 100vw"
              allowUpscale
            />
          </BlockRevealItem>

          {rest.length > 0 && (
            /* Stacked, not a 2-up grid. With Provision's three mocks a nested
               two-column grid inside the 5-of-12 column rendered the laptop at
               205px beside a 616px lead — measured, and visibly weak. Stacking
               gives each trailing mock the full column width. */
            <div className="grid gap-6 md:col-span-5">
              {rest.map((asset) => (
                <BlockRevealItem key={asset.src} className="flex items-end">
                  <ArtefactFigure
                    asset={asset}
                    fallbackTone="bare"
                    inset="sm"
                    sizes="(min-width: 768px) 22vw, 45vw"
                  />
                </BlockRevealItem>
              ))}
            </div>
          )}
        </div>
      </BlockReveal>
    </Section>
  );
}

export { ScreensBlock, DevicesBlock };
