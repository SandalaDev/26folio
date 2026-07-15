import * as React from "react";

import { BIO_CHAPTERS, BIO_TITLE } from "@/lib/who-i-am";

/**
 * ChapterRail — the story's spine on the left edge of the bio reader (lg+).
 * Speaks the EpochNav marker language: hard-cornered numeral boxes that will
 * rotate into filled epoch-colored diamonds while their chapter is in view
 * (active tracking arrives with TASK-067; this task ships the layout). The
 * opening row is marked with the logo symbol instead of a numeral: the story
 * starts with the person, the epochs follow.
 */

/** Logo symbol tinted via CSS mask over currentColor (timeline IconGlyph technique). */
const logoMask: React.CSSProperties = {
  WebkitMaskImage: "url(/images/logo/logo_ink.svg)",
  maskImage: "url(/images/logo/logo_ink.svg)",
  WebkitMaskSize: "contain",
  maskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
};

const RAIL_ITEMS = [
  { id: "opening", name: BIO_TITLE, glyph: "logo" as const },
  ...BIO_CHAPTERS.map((chapter) => ({
    id: chapter.id,
    name: chapter.title,
    glyph: chapter.numeral,
  })),
];

function ChapterRail() {
  return (
    <aside className="hidden shrink-0 flex-col justify-center border-r border-border p-8 lg:flex lg:w-56 xl:w-64">
      <nav aria-label="Story chapters" className="flex flex-col gap-1.5">
        {RAIL_ITEMS.map((item) => (
          <div key={item.id} className="flex items-center gap-4 py-1.5">
            <span className="flex size-8 shrink-0 items-center justify-center border border-border font-display text-xs font-semibold text-muted">
              {item.glyph === "logo" ? (
                <span
                  aria-hidden="true"
                  className="size-3.5 bg-current"
                  style={logoMask}
                />
              ) : (
                item.glyph
              )}
            </span>
            <span className="font-display font-semibold text-muted">
              {item.name}
            </span>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export { ChapterRail, RAIL_ITEMS, logoMask };
