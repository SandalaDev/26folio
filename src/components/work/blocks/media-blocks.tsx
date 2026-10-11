import { Section } from "@/components/site/section";
import { Eyebrow } from "@/components/site/eyebrow";
import { ArtefactFigure } from "@/components/work/blocks/artefact-figure";
import { BlockReveal, BlockRevealItem } from "@/components/work/blocks/block-reveal";
import type { Asset } from "@/lib/projects";

/**
 * The print and object blocks (EPIC-026 TASK-097): flatlay, poster, packaging,
 * in-situ, social and board. Grouped in one module because each is a thin layout
 * decision over the shared `ArtefactFigure`, and keeping them together makes the
 * differences between them legible.
 *
 * Every one of these shows the work as EVIDENCE: colours, proportions and framing
 * exactly as supplied — no filter, no recolour, no crop, and no brand tint on the
 * surrounding chrome. `SvgTreatment` is never used in these blocks.
 */

/* ------------------------------------------------------------------ flatlay */

/**
 * FlatlayBlock — `kind: "flatlay"`. One tall image, given real room.
 *
 * Flavour Grills' `flatlay.webp` is 633×948 and is the single strongest artefact
 * in that project — the reason a six-file project can carry a full page. Shown
 * `bare`, because the photograph brings its own slate-and-wood environment and a
 * mat would fight it.
 *
 * Capped at its 633px intrinsic width (via ArtefactFigure) so it stays crisp, and
 * centred rather than stretched. That also keeps a portrait image from turning
 * into three screens of desktop scroll.
 */
function FlatlayBlock({ image, label = "Collateral" }: { image: Asset; label?: string }) {
  return (
    <Section className="py-14 md:py-20">
      <BlockReveal className="mx-auto flex w-full flex-col gap-6 md:max-w-[40rem]">
        <Eyebrow as="h2" tone="caramel">
          {label}
        </Eyebrow>
        <ArtefactFigure
          asset={image}
          fallbackTone="bare"
          inset="sm"
          sizes="(min-width: 768px) 40rem, 100vw"
        />
      </BlockReveal>
    </Section>
  );
}

/* ------------------------------------------------------------------- poster */

/**
 * PosterBlock — `kind: "poster"`. Print-proportion artwork, one or two up.
 *
 * Must handle both shapes present in the assets without a hardcoded aspect: a
 * portrait pair (Flavour's 634×950 and 408×612) and a lone landscape (OK's
 * 1439×830). Portraits pair side by side on desktop and stack on mobile; a single
 * poster gets its own centred column at its natural size.
 *
 * `neutral` fallback — these are prints, and a mat is exactly right for a print.
 */
function PosterBlock({ posters }: { posters: Asset[] }) {
  if (posters.length === 0) return null;
  const single = posters.length === 1;

  return (
    <Section className="py-14 md:py-20">
      <BlockReveal stagger className="flex flex-col gap-8">
        <BlockRevealItem>
          <Eyebrow as="h2" tone="caramel">
            Print
          </Eyebrow>
        </BlockRevealItem>
        <div className={single ? "mx-auto w-full md:max-w-[44rem]" : "grid gap-6 md:grid-cols-2"}>
          {posters.map((asset) => (
            <BlockRevealItem key={asset.src}>
              <ArtefactFigure
                asset={asset}
                fallbackTone="neutral"
                inset="md"
                sizes={
                  single ? "(min-width: 768px) 44rem, 100vw" : "(min-width: 768px) 42vw, 100vw"
                }
              />
            </BlockRevealItem>
          ))}
        </div>
      </BlockReveal>
    </Section>
  );
}

/* ---------------------------------------------------------------- packaging */

/**
 * PackagingBlock — `kind: "packaging"`. Product renders shown as a set.
 *
 * Gardenfare's four SKUs are the whole point of that project — a *range*, not four
 * unrelated images — so they must read as a family despite arriving at four
 * different sizes (694², 793², 750², 600²). Equal `aspect-square` frames with the
 * artwork contained gives one consistent frame, an aligned baseline and even gaps.
 *
 * TASK-093 corrected this block's original assumption: these are NOT cut-outs on
 * white. Each render sits on its own bright coloured gradient (lime, orange, mint,
 * peach), so they already read as framed objects. `bare` lets those grounds do the
 * separating themselves, which is also the only honest option — the grounds are
 * part of the artwork.
 *
 * The grid absorbs a fifth SKU without changes.
 */
function PackagingBlock({ items }: { items: Asset[] }) {
  if (items.length === 0) return null;

  return (
    <Section className="py-14 md:py-20">
      <BlockReveal stagger className="flex flex-col gap-8">
        <BlockRevealItem>
          <Eyebrow as="h2" tone="caramel">
            The range
          </Eyebrow>
        </BlockRevealItem>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((asset) => (
            <BlockRevealItem key={asset.src} className="flex flex-col">
              <ArtefactFigure
                asset={asset}
                fallbackTone="bare"
                inset="sm"
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                className="[&>div:first-child]:flex [&>div:first-child]:aspect-square [&>div:first-child]:items-center"
                fit="contain"
              />
            </BlockRevealItem>
          ))}
        </div>
      </BlockReveal>
    </Section>
  );
}

/* ------------------------------------------------------------------ in-situ */

/**
 * InSituBlock — `kind: "in-situ"`. The artefact in the world.
 *
 * This block does the most persuasive work on a page: a logo on a white artboard
 * is a file, a logo on a lit sign in a mall is a business. So it gets generous
 * size and `bare` tone — these are photographs with their own environments.
 *
 * With two or three scenes the first leads at full width and the rest follow as a
 * row, which suits OK Pharmacy's signage-then-bag pairing without forcing the
 * signage down to thumbnail size.
 */
function InSituBlock({ scenes }: { scenes: Asset[] }) {
  if (scenes.length === 0) return null;
  const [lead, ...rest] = scenes;

  return (
    <Section className="py-14 md:py-20">
      <BlockReveal stagger className="flex flex-col gap-8">
        <BlockRevealItem>
          <Eyebrow as="h2" tone="caramel">
            In place
          </Eyebrow>
        </BlockRevealItem>

        <BlockRevealItem>
          <ArtefactFigure
            asset={lead}
            fallbackTone="bare"
            inset="sm"
            sizes="(min-width: 768px) 80vw, 100vw"
            allowUpscale
          />
        </BlockRevealItem>

        {rest.length > 0 && (
          <div className={`grid gap-6 ${rest.length > 1 ? "md:grid-cols-2" : ""}`}>
            {rest.map((asset) => (
              <BlockRevealItem key={asset.src}>
                <ArtefactFigure
                  asset={asset}
                  fallbackTone="bare"
                  inset="sm"
                  sizes="(min-width: 768px) 45vw, 100vw"
                  allowUpscale
                />
              </BlockRevealItem>
            ))}
          </div>
        )}
      </BlockReveal>
    </Section>
  );
}

/* ------------------------------------------------------------------- social */

/**
 * SocialBlock — `kind: "social"`. The identity applied to social platforms.
 *
 * Three assets in three completely different proportions (OK Pharmacy's Facebook
 * mockup 1600×965, LinkedIn 816×1200 portrait, banner 1100×417 wide), which rules
 * out a uniform grid. Composed instead: landscape and portrait share a row at a
 * 2:1 column split, and the wide banner runs underneath.
 *
 * Deliberately the quietest block on the page — smaller insets, no lead artefact.
 * Social mockups are the least interesting proof here and must not outweigh the
 * signage.
 */
function SocialBlock({ items }: { items: Asset[] }) {
  if (items.length === 0) return null;

  // Widest-aspect asset runs full width beneath the rest; banners are ~2.6:1.
  const banners = items.filter((a) => a.width / a.height >= 2);
  const rest = items.filter((a) => a.width / a.height < 2);

  return (
    <Section className="py-14 md:py-20">
      <BlockReveal stagger className="flex flex-col gap-6">
        <BlockRevealItem>
          <Eyebrow as="h2" tone="caramel">
            Social
          </Eyebrow>
        </BlockRevealItem>

        {rest.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3">
            {rest.map((asset, i) => (
              <BlockRevealItem
                key={asset.src}
                className={i === 0 && rest.length > 1 ? "md:col-span-2" : ""}
              >
                <ArtefactFigure
                  asset={asset}
                  fallbackTone="neutral"
                  inset="sm"
                  sizes="(min-width: 768px) 45vw, 100vw"
                  allowUpscale
                />
              </BlockRevealItem>
            ))}
          </div>
        )}

        {banners.map((asset) => (
          <BlockRevealItem key={asset.src}>
            <ArtefactFigure
              asset={asset}
              fallbackTone="neutral"
              inset="sm"
              sizes="100vw"
              allowUpscale
            />
          </BlockRevealItem>
        ))}
      </BlockReveal>
    </Section>
  );
}

/* -------------------------------------------------------------------- board */

/**
 * BoardBlock — `kind: "board"`. One designed sheet, whole.
 *
 * Added to the vocabulary by TASK-093, which found five assets that are composed
 * layouts rather than single artefacts: Provision's logo-rationale board (a brass
 * telescope, the attribute list, and the mark on golden-ratio construction) and its
 * four-up brand board, plus Gardenfare's colourway board and applications sheet.
 * `logo-suite` would have misrepresented them — they are not lockups.
 *
 * A board is already a composition, so this block must not re-compose it: no
 * grid-splitting, no cropping to a nicer ratio, nothing overlaid. It is presented
 * whole, on a `neutral` mat, with the caption carrying the explanation.
 *
 * These are square or near-square at 2000px, so the width is capped — a 2000px
 * square at full bleed would be an entire screen of scroll on its own.
 */
function BoardBlock({ sheet, label }: { sheet: Asset; label?: string }) {
  return (
    <Section className="py-14 md:py-20">
      <BlockReveal className="mx-auto flex w-full flex-col gap-6 md:max-w-[46rem]">
        {/* A heading matters here: Provision and Gardenfare each carry two boards,
            and two unlabelled sections give anyone navigating by heading nothing
            to distinguish them. */}
        {label ? (
          <Eyebrow as="h2" tone="caramel">
            {label}
          </Eyebrow>
        ) : null}
        <ArtefactFigure
          asset={sheet}
          fallbackTone="neutral"
          inset="md"
          sizes="(min-width: 768px) 46rem, 100vw"
        />
      </BlockReveal>
    </Section>
  );
}

export { FlatlayBlock, PosterBlock, PackagingBlock, InSituBlock, SocialBlock, BoardBlock };
