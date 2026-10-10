# Project asset manifest

Written by **TASK-093** (EPIC-026). Maps every owner-supplied original to its
committed derivative, records what each image actually shows, and assigns the
presentation block role that `TASK-094` authors compositions from and `TASK-101`
writes alt text from.

Generated **2026-08-15**. If assets change, update this file in the same commit.

## Provenance and a real risk

Originals live in `public/projects/`, which is **gitignored** (`.gitignore`:
"Owner-supplied project originals"). They are the owner's local masters at print
scale with non-web-safe filenames, and they are **not in version control**.

**Nothing in this repository backs them up.** If that directory is lost, the
committed derivatives here are all that remain — resized, re-encoded, and in
several cases rasterized from vector. Re-deriving a larger or differently cropped
version would be impossible. This is flagged for the owner rather than assumed
handled; it is not mitigated by anything in this epic.

## Processing applied

Resize and re-encode only. **No crop, no recolour, no retouch, no composite** —
altering artwork would misrepresent the work (EPIC-026 non-goal).

- Raster → WebP, quality 82, effort 6. Never upscaled (`withoutEnlargement`).
- Long-edge caps by role: 2000px screens and boards, 1600px in-situ / flatlay /
  posters, 1200px packaging / social / logo raster, native where already smaller.
- Large **illustrative** SVGs rasterized (`svgo` is not resolvable in this repo, so
  they cannot be minified). True-vector **marks** kept as SVG.
- Filenames are lowercase ascii kebab-case. Next's image optimizer rejects
  anything else outright rather than degrading.
- Converted with `sharp@0.34.5` from `tmp/assets.mjs`, a throwaway script in the
  gitignored scratch directory. `package.json` was not touched.

**Correction to the task spec:** TASK-093 originally called for `@2x` variants
alongside each asset. That is wrong for this stack — `next/image` generates its own
`srcset` by resizing the committed source on demand, so a second hand-made variant
would be dead weight. One generously-capped derivative per asset is correct.

### Totals

| | |
|---|---|
| Originals | 22MB, 43 files |
| Committed | **2.84MB, 38 files** |
| Largest single file | `provision-finance/screen-homepage.webp`, 306KB |
| Budget (TASK-093) | under 6MB total, no raster over 400KB — **both met** |

Verified by fetching all 38 URLs through the running dev server: **38 files, 0
failures**, every one a 200 with an image content-type. Fetching is the check that
matters here; `naturalWidth` is not reliable for this.

### Alpha caveat

`flavour-grills-cafe/logo-{primary,navy,white}.webp` carry real transparency
(verified: 4 channels, `isOpaque: false`). Next's optimizer negotiates on `Accept`
— browsers get WebP with alpha intact; a client sending no `Accept` header gets
JPEG with the alpha flattened. Every real browser sends it, so this is recorded as
a known property rather than treated as a defect.

---

## `ok-pharmacy` — 12 files, 672KB

Self-initiated. Teal-to-green identity; the `O` of the wordmark is a hand making
an "OK" gesture. Tagline "For Your Wellness". The deepest application set of the
four.

| File | Dimensions | Size | Role | What it shows | From |
|---|---|---|---|---|---|
| `cover.webp` | 830×830 | 116KB | `hero` | A woman holding a small child close, both smiling, on white, with the OK monogram overlaid in translucent teal | `cover.jpg` |
| `logo-full.svg` | 665×667 | 10KB | `logo-suite` | Primary lockup: monogram, "Pharmacy" in green, "For Your Wellness" | `full-logo-svg.svg` |
| `logo-symbol.svg` | 533×320 | 2KB | `logo-suite` | Monogram alone, blue-teal | `logo-symbol-svg.svg` |
| `logo-wordmark.svg` | 827×453 | 11KB | `logo-suite` | Monogram plus "Pharmacy", no tagline | `symbol-name-svg.svg` |
| `logo-square.webp` | 1200×1077 | 26KB | `logo-suite` | Full lockup on a white square, tagline set lowercase | `square-logo-png.png` |
| `signage.webp` | 1500×1000 | 91KB | `in-situ` | Illuminated double-sided sign hung from a mall ceiling, reading "OPEN 24 HOURS" below the logo | `signage-mockup.jpg` |
| `bag.webp` | 1600×1113 | 21KB | `in-situ` | White paper retail bag with rope handles carrying the logo, on a teal ground | `bag-mockup.jpg` |
| `poster.webp` | 1439×830 | 73KB | `poster` | Logo beside the mother-and-child photograph, on white | `poster.jpg` |
| `social-banner.webp` | 1100×417 | 21KB | `social` | Wide teal banner: monogram over photographs of smiling people | `social-banner.jpg` |
| `social-facebook.webp` | 1600×965 | 52KB | `social` | Facebook page mockup with branded cover and a "SPECIAL OFFER! 30% OFF" post | `FB Page Mockup.jpg` |
| `social-linkedin.webp` | 816×1200 | 57KB | `social` | LinkedIn company page mockup | `LinkedIn-mockup.jpg` |
| `screen-storefront.webp` | 2000×1913 | 190KB | `screens` | Full e-commerce site design: "New Arrivals" hero, stocked-brand row, branch locator map, pharmacist portrait, teal sections | `website.svg` (rasterized) |

**Excluded**

| File | Reason |
|---|---|
| `full-logo-svg.png` | Raster duplicate of `logo-full.svg` — same lockup, and the vector is authoritative |
| `logo-symbol-png.png` | Raster duplicate of `logo-symbol.svg` |
| `symbol-name- png.png` | Raster duplicate of `logo-wordmark.svg` (note the stray space before the extension in the original) |

**Ruled out (EPIC-029, 2026-10-09).** `dispensary-scene.webp` was AI-generated
(original `Gemini_Generated_Image_…`). The owner allows AI-generated scenes when no
watermark is visible, but this one garbles text and misdraws the OK mark, so it was
removed in TASK-130. The owner is regenerating a clean scene (TASK-132); it will be
added here when it arrives.

---

## `provision-finance` — 11 files, 1.2MB

Self-initiated. Financial services identity in navy and red with a three-bar mark,
plus the most substantial interface design in the epic. Mockup content carries
"© 2018" and a `05/05/18` timestamp.

| File | Dimensions | Size | Role | What it shows | From |
|---|---|---|---|---|---|
| `cover.webp` | 898×898 | 58KB | `hero` | Brushed-steel "PROVISION FINANCE" letters on a dark glass shopfront, warm interior light below | `cover.jpg` |
| `logo.svg` | 1440×1440 | 81KB | `logo-suite` | Navy wordmark with the red three-bar mark, on a pale topographic-contour ground | `logosvg.svg` |
| `concept-board.webp` | 2000×2000 | 57KB | `board` | Logo rationale board: a brass telescope, the attribute list "Professional · Visionary · Precise · Proficient", and the three-bar mark on golden-ratio construction geometry | `concept.png` |
| `brand-board.webp` | 2000×2000 | 140KB | `board` | Four-up brand board: the shopfront photograph, both logo reversals (white-on-navy, navy-on-white), and the two patterns | `treatment.png` |
| `pattern.webp` | 1200×1200 | 59KB | `board` support | The two brand patterns: a blue pixel mosaic and a red topographic contour field | `bg svg.svg` (rasterized) |
| `screen-homepage.webp` | 1920×1620 | 306KB | `screens` | Homepage design: red login bar, navy nav, sunflower-field hero reading "Hello. How can we help?", three circular Borrow / Transact / Save actions, a seven-currency exchange-rate strip, customer-stories row, navy footer | `homepage.png` |
| `screen-products.webp` | 1729×2000 | 225KB | `screens` | A **second, different** page — Loans and Accounts products, with rate cards and a Visa card render | `scroll.jpg` |
| `device-laptop.webp` | 849×849 | 118KB | `devices` | Open laptop and a floating phone, both showing the homepage | `laptopmock.png` |
| `device-phone.webp` | 274×573 | 34KB | `devices` | Phone showing the mobile homepage. **Native size — must never be upscaled** | `phonemock.png` |
| `device-desktop.webp` | 1026×768 | 59KB | `devices` | Desktop monitor and phone on a white surface showing the site | `ProvSiteMockJPG.jpg` |
| `card.webp` | 1500×1200 | 57KB | `in-situ` | Two red Visa debit cards, dramatically lit on navy | `card mock.jpg` |

**Excluded**

| File | Reason |
|---|---|
| `logopng.png` | 4501×4501, 1016KB raster of the same lockup as `logo.svg`; the vector is authoritative and 12× smaller |

**Note for TASK-101.** `screen-homepage.webp`'s own footer reads "A Bank of Zambia
accredited financial institution". That text is *content inside a self-initiated
concept mockup*, not a fact about a real institution or a client relationship. The
page copy must make that impossible to misread.

---

## `gardenfare-foods` — 7 files, 677KB

Self-initiated. Circular stamp mark — tree and wheat ears inside a scalloped ring.
A packaging range across four SKUs.

| File | Dimensions | Size | Role | What it shows | From |
|---|---|---|---|---|---|
| `cover.webp` | 1280×800 | 136KB | `hero` | All four products lined up on a pale green-to-yellow field with the mark ghosted behind | `Banner.jpg` |
| `logo.svg` | 533×533 | 87KB | `logo-suite` | Primary mark: green scalloped ring, white lettering, yellow tree, wheat ears | `…_Artboard 12.svg` |
| `colourways.webp` | 1200×1200 | 225KB | `board` | Four-up colourway board: dark red, orange, black-on-white outline, and yellow versions of the mark | `…_Artboard 11.svg` (rasterized) |
| `logo-applications.webp` | 1225×1216 | 123KB | `board` | The green mark on white above three alternate colourways over a produce photograph | `logos.png` |
| `pack-fruit.webp` | 694×694 | 39KB | `packaging` | GardenFruit mixed fruit juice can, condensation-beaded, on a lime gradient | `GardenFruit jpg.jpg` |
| `pack-oats.webp` | 793×793 | 30KB | `packaging` | GardenOats gusseted pouch, "lightly sweetened with maple sugar", on an orange gradient | `GardenOats.jpg` |
| `pack-soy.webp` | 750×750 | 12KB | `packaging` | GardenSoy organic soy milk bottle, yellow cap, on a mint gradient | `GardenSoy.jpg` |
| `pack-spread.webp` | 600×600 | 26KB | `packaging` | GardenSpread creamy peanut butter jar, brown lid, on a peach gradient | `gardenspread.jpg` |

**Excluded**

| File | Reason |
|---|---|
| `60637b9834ed753fb04040a9_GF logo-01.svg` | Rendered side by side against `…Artboard 12.svg`: the **same mark**, differing only in canvas padding (1067×800 vs 533×533). Committing both would present one logo as two |

**Correction for TASK-097.** That task assumed these SKUs were "cut-outs on white
or near-white" needing a tinted plate to stop them reading as floating debris. They
are not: each render sits on its own bright coloured gradient (lime, orange, mint,
peach). They already read as framed objects. The four grounds are part of the
artwork and must not be replaced — but four saturated grounds in a 2×2 is a lot of
colour at once, so the block's job is even spacing and a consistent frame, letting
the grounds do the separating. `bare` or `neutral` is likelier correct than
`sunken`.

---

## `flavour-grills-cafe` — 6 files, 285KB

**The one real client engagement.** A restaurant, bar and special-events venue in
Zambia. Coral and navy identity; the mark is a lidded cooking pot. Smallest asset
set, so its page leans hardest on the flatlay and on written description.

| File | Dimensions | Size | Role | What it shows | From |
|---|---|---|---|---|---|
| `flatlay.webp` | 633×948 | 118KB | `flatlay`, and the `hero` cover | Overhead arrangement on slate and wood: navy menu folder, letterhead, business cards, three labelled spice jars, a branded coffee pouch with beans visible, leather tags, cinnamon, cardamom, star anise | `branding.jpg` |
| `logo-primary.webp` | 600×450 | 18KB | `logo-suite` | Coral wordmark with the navy pot. **Transparent** | `flavour_main.png` |
| `logo-navy.webp` | 600×450 | 18KB | `logo-suite` | All-navy single-colour version. **Transparent** | `flavour_blue.png` |
| `logo-white.webp` | 600×450 | 9KB | `logo-suite` | All-white reversed version. **Transparent** | `flavour_white.png` |
| `poster-duotone.webp` | 408×612 | 47KB | `poster` | Coral duotone food photograph with the white logo reversed over it | `flavour_posterwhite.png` |
| `poster-pastry.webp` | 634×878 | 74KB | `poster` | A stack of sliced spiced pastries on a plate with coffee, cinnamon and cardamom; logo at top. Cropped above the coral contact band (owner decision, EPIC-029) | `postr2.png` |

**Finding — the logo suite needs per-lockup plate tones.** Rendered against the
warm-dark background (`#1a1411`) and against a light plate (`--color-ink`,
`#f8dfe7`):

| Lockup | On warm dark | On light plate | Needs |
|---|---|---|---|
| `logo-navy` | **Fails.** Navy pot and "cafe" barely separate from the ground; the "Restaurant × Bar × Special Events" line is effectively invisible | Crisp | light plate |
| `logo-white` | Excellent | **Fails.** White on pale rose loses the tagline entirely | dark plate |
| `logo-primary` | Coral reads; navy pot is weak | Both read well | light plate |

So `ArtefactPlate` needs a **`light` tone** — and `LogoSuiteBlock` cannot apply one
tone to a whole set; each lockup must carry its own. Both are recorded against
`TASK-095` and `TASK-094`. A light mat needs no new token: `--color-ink` is already
a warm pale rose and works as a mat fill.

**Contact band removed (EPIC-029, 2026-10-10).** The coral band at the foot of
`postr2.png` carried the client's phone numbers and web address. The owner chose to
crop it, so `poster-pastry.webp` is cut from the original at row 878, just above the
band. Also, `poster-duotone.webp` is only 408×612 —
the native ceiling, so it cannot be shown as large as the other poster.

---

## Role summary for TASK-094

| Role | Assets |
|---|---|
| `hero` | 4 (one per project; Flavour Grills shares its flatlay) |
| `logo-suite` | 11 |
| `board` | 5 — **new role, see below** |
| `packaging` | 4 |
| `in-situ` | 5 |
| `poster` | 3 |
| `social` | 3 |
| `screens` | 3 |
| `devices` | 3 |
| `flatlay` | 1 |

**A block the vocabulary does not have yet.** Five assets are themselves *designed
compositions* rather than single artefacts — Provision's logo-rationale board and
four-up brand board, its pattern pair, and Gardenfare's colourway board and
applications sheet. Forcing them into `logo-suite` would misrepresent them: they are
not lockups, they are boards, and the rationale board in particular is the best
evidence of design *thinking* in the whole epic. They need a `board` block that
presents one full-width composed sheet at generous size with a caption.

This is the composition model working as intended — a new asset kind surfaced a
missing block rather than being crammed into a template. Added to `EPIC-026`'s
vocabulary and to `TASK-094` / `TASK-097`.

---

## `sandala-dev` — 6 files, 251KB

Captured by the agent on 2026-10-10 (EPIC-029 TASK-133) from a local
production build of this site, through headless Chrome with device emulation.
Desktop at 1440×900 and 2x, phones at 390×844 and 3x, downscaled to the widths
below. No private data appears in any of them: the contact form is empty.
Recapture if the pages change materially before launch.

| File | Size | Weight | Role | Shows |
|---|---|---|---|---|
| `screen-home.webp` | 1600×1000 | 46KB | `screens` | Home hero: headline, portrait, positioning line, "Let's talk" |
| `screen-about.webp` | 1600×1000 | 50KB | `screens` | About hero: "Engineer. Designer. Builder." and the bio |
| `screen-capabilities.webp` | 1600×1000 | 41KB | `screens` | Capabilities hero with the "useful system" diagram |
| `screen-contact.webp` | 1600×1000 | 35KB | `screens` | Contact page: the inquiry form and direct channels |
| `phone-home.webp` | 780×1688 | 53KB | `devices` | Home hero at phone width |
| `phone-contact.webp` | 780×1688 | 26KB | `devices` | Contact form at phone width |

---

## `scrumtrulescent` — 9 files, 530KB

Captured by the agent on 2026-10-10 (EPIC-029, owner request) from the
magazine's own development server (`C:\_git\scrumtrulescent`, already running
on port 3000), through headless Chrome with device emulation; the Next.js dev
badge removed before capture. Nothing was written to that repository or its
database. The site has no published articles yet, so no article page exists to
capture; the Payload admin sits behind a login and is left to the owner. Logos
are copied unchanged from that repo's `public/`.

| File | Size | Role | Shows |
|---|---|---|---|
| `screen-home.webp` | 1600×1000 | `hero` | Home, light theme |
| `screen-home-dark.webp` | 1600×1000 | `screens` | Home, dark theme |
| `screen-topic.webp` | 1600×1000 | `screens` | The Tech topic page with its HOW THINGS WORK. collection |
| `phone-home.webp` | 780×1688 | `devices` | Home at phone width |
| `board-design-system.webp` | 1600×1111 | `board` | The `/design-system` page opening |
| `board-editorial.webp` | 1600×778 | `board` | Editorial patterns from the design system |
| `logo-lockup.svg` | 900×600 | `logo-suite` | `s_logo.svg`, light lockup |
| `logo-lockup-dark.svg` | 900×600 | `logo-suite` | `s_logo dark.svg`, dark lockup |
| `logo-mark.svg` | 500×500 | `logo-suite` | `s_head logo.svg`, head mark |
