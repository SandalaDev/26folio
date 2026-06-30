import type { Config } from "tailwindcss";

/**
 * Tailwind v4 is CSS-first. The canonical design tokens (colour, radius, and in
 * TASK-008 the type scale) live in the `@theme` block of `src/app/globals.css`
 * — see EPIC-002 decision 1. This reconciles 10-design-system.md §12, which was
 * written before the project landed on v4: the v4 `@theme` layer is now the
 * canonical token home, and this file is a thin companion only.
 *
 * It intentionally declares NO palette or token values, so the tokens can never
 * disagree between here and the CSS. v4 auto-detects content, so no `content`
 * globbing is required either. Kept as the documented anchor referenced by §12.
 */
export default {} satisfies Config;
