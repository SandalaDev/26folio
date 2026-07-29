---
name: shadcn-ui-builder
description: Set up and compose accessible shadcn/ui primitives into project-owned frontend components. Use when a UI task requires shadcn installation, component selection, adaptation, or composition.
metadata:
  layer: frontend
  risk: low
---
# Skill: shadcn/ui builder

## When to use
When building UI primitives and composed components in a React project that uses
shadcn/ui. This governs primitive composition and accessible owned components.
It supports the active lane (Impeccable) — it is not a design authority.

## The principle
shadcn/ui gives you owned, accessible primitives (you copy the code in, you own
it). Compose them rather than hand-rolling; style with the design tokens, never
hardcoded values. Prefer Radix-backed primitives for anything interactive.

## Procedure
1. Check if the primitive exists: `npx shadcn@latest add <component>`.
2. Compose: a Dialog + Form + Input + Button beats a custom modal.
3. Style with tokens (`bg-background`, `text-foreground`, not `#fff`/`#000`).
4. Wire Radix states (open/onOpenChange) — never reimplement accessibility.
5. For forms: react-hook-form + zod + the shadcn Form wrapper.

## Composition patterns
- **Dialog**: trigger + content; controlled via `open`.
- **DropdownMenu**: items with `onSelect`; group with `DropdownMenuGroup`.
- **Toast**: `sonner` or the shadcn toast; never `alert()`.

## Anti-patterns
- Hand-rolling a modal/dropdown when Radix provides an accessible one.
- Hardcoding colours/sizes that exist as tokens.
- Using `alert()`/`confirm()`/`prompt()` in shipped UI.
- Adding a primitive the project won't use (cargo-cult `add`).
