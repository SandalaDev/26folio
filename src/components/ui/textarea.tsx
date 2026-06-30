import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Textarea — base form primitive (§8). Matches Input: hard corners (§3),
 * `surface` field, hairline `border`, muted placeholder, global rose focus ring.
 */
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-24 w-full rounded-none border border-border bg-surface px-3 py-2 text-sm text-ink transition-colors",
      "placeholder:text-muted hover:border-border-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
