import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Label — base form primitive (§8). Kept as a plain styled `<label>` (no
 * `@radix-ui/react-label`) so the design system stays at the two deps TASK-010
 * declares (cva + react-slot). The peer-disabled dimming covers the common
 * shadcn behaviour without the extra dependency.
 */
const Label = React.forwardRef<HTMLLabelElement, React.ComponentProps<"label">>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium text-ink select-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    />
  ),
);
Label.displayName = "Label";

export { Label };
