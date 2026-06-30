import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Button — base primitive (10-design-system.md §8). Token-styled, hard corners
 * (§3, `rounded-none`). Accent variants fill with rose/caramel and put text in
 * `background` for strong dark-on-light contrast (§2). The rose focus ring comes
 * from the global `:focus-visible` rule (globals.css §10) — components don't set
 * `outline-none`, so the ring is never removed.
 *
 * NOTE: this is the plain primitive. The §7 "signature" button (magnetic pull,
 * cursor-origin fill sweep, text-mask reveal) is a separate motion component a
 * page epic builds on top of this + src/lib/motion.ts — intentionally not here.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none font-sans text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4",
  {
    variants: {
      variant: {
        default: "bg-rose text-background hover:bg-peach",
        secondary: "bg-caramel text-background hover:bg-peach",
        outline:
          "border border-rose text-rose hover:bg-rose hover:text-background",
        ghost: "text-ink hover:bg-surface",
        link: "text-rose underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        default: "h-11 px-6",
        lg: "h-12 px-8 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
