import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Placeholder categories — real interests are an owner-confirmed follow-up
// (epic decision #1).
const INTEREST_CATEGORIES = [
  { label: "Category one", items: ["Item", "Item", "Item"] },
  { label: "Category two", items: ["Item", "Item"] },
  { label: "Category three", items: ["Item", "Item", "Item"] },
];

/** InterestsModal — "The way I am" (12-ui-element-map.md §3 About #2a-i). */
function InterestsModal() {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>The way I am</DialogTitle>
        <DialogDescription>
          Draft layout — real interests/categories pending.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-6 sm:grid-cols-2">
        {INTEREST_CATEGORIES.map((category) => (
          <div key={category.label} className="flex flex-col gap-2">
            <span className="eyebrow text-rose">{category.label}</span>
            <div className="aspect-video border border-border bg-background" />
            <ul className="text-sm text-muted">
              {category.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </DialogContent>
  );
}

export { InterestsModal };
