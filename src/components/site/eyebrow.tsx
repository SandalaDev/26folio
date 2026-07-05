import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Eyebrow — uppercase tracked label above section headings (12-ui-element-map.md
 * §1). Thin wrapper over the `eyebrow` CSS utility (globals.css) — the visual
 * treatment lives in CSS, this just standardises the markup + default colour.
 * EPIC-012 TASK-052: `tone` lets sections alternate rose/caramel so rose stops
 * being the only label voice (§2 — caramel is the secondary/label accent, the
 * preview's `.num`/`.label` role).
 */
export interface EyebrowProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: React.ElementType;
  tone?: "rose" | "caramel";
}

const TONES: Record<NonNullable<EyebrowProps["tone"]>, string> = {
  rose: "text-rose",
  caramel: "text-caramel",
};

const Eyebrow = React.forwardRef<HTMLParagraphElement, EyebrowProps>(
  ({ as: Comp = "p", tone = "rose", className, children, ...props }, ref) => {
    return (
      <Comp ref={ref} className={cn("eyebrow", TONES[tone], className)} {...props}>
        {children}
      </Comp>
    );
  },
);
Eyebrow.displayName = "Eyebrow";

export { Eyebrow };
