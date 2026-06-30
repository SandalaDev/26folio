import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Eyebrow — uppercase tracked label above section headings (12-ui-element-map.md
 * §1). Thin wrapper over the `eyebrow` CSS utility (globals.css) — the visual
 * treatment lives in CSS, this just standardises the markup + default colour.
 */
export interface EyebrowProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: React.ElementType;
}

const Eyebrow = React.forwardRef<HTMLParagraphElement, EyebrowProps>(
  ({ as: Comp = "p", className, children, ...props }, ref) => {
    return (
      <Comp ref={ref} className={cn("eyebrow text-rose", className)} {...props}>
        {children}
      </Comp>
    );
  },
);
Eyebrow.displayName = "Eyebrow";

export { Eyebrow };
