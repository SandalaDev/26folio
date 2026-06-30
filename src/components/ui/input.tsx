import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Input — base form primitive (§8). Hard corners (§3), `surface` field on the
 * warm-dark base, `border` hairline, muted placeholder. Rose focus ring is the
 * global `:focus-visible` rule (§10) — not overridden here.
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-none border border-border bg-surface px-3 py-2 text-sm text-ink transition-colors",
        "placeholder:text-muted hover:border-border-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-ink",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
