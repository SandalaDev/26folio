import { DialogContent } from "@/components/ui/dialog";
import { BioReader } from "./who-i-am/bio-reader";

/**
 * BioModal — "Who I am" (12-ui-element-map.md §3 About #2a-ii), rebuilt by
 * EPIC-017 as a chaptered reading experience. The shell widens to ~80vw on
 * desktop and hands its interior to BioReader: chapter rail on the left,
 * capped-measure reading column, oversized epoch numerals in the gutter.
 * The Radix Dialog contract (focus trap, Esc, overlay, close button) is
 * unchanged; only this instance overrides the primitive's width defaults.
 */
function BioModal() {
  return (
    <DialogContent className="h-[85vh] w-[min(92vw,80rem)] gap-0 overflow-y-hidden p-0 lg:w-[min(80vw,80rem)]">
      <BioReader />
    </DialogContent>
  );
}

export { BioModal };
