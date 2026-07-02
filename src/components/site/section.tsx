import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Section — shared layout primitive (12-ui-element-map.md §1). Enforces the
 * canonical section rhythm so every page composes the same spacing without
 * repeating utility classes. EPIC-010: no layout max-width — the site uses the
 * viewport; the padding rhythm scales up instead. Prose readability still comes
 * from `measure` (70ch) on body copy, not from a container cap.
 */
export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ as: Comp = "section", className, children, ...props }, ref) => {
    return (
      <Comp
        ref={ref}
        className={cn(
          "py-20 md:py-28 px-5 md:px-10 lg:px-16 xl:px-24",
          className,
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
Section.displayName = "Section";

export { Section };
