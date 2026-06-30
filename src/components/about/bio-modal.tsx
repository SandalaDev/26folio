import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/** BioModal — "Who I am" (12-ui-element-map.md §3 About #2a-ii). */
function BioModal() {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Who I am</DialogTitle>
        <DialogDescription>
          Draft layout — the real biography is an owner-confirmed follow-up,
          not guessed here.
        </DialogDescription>
      </DialogHeader>
      <p className="text-muted">
        This is where the detailed biography goes: background, how Abe got
        into this work, and what shapes how he approaches a project. Structure
        is in place; the words are not final.
      </p>
    </DialogContent>
  );
}

export { BioModal };
