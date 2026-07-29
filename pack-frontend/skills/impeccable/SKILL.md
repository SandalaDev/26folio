---
name: impeccable
description: Implement and refine distinctive, accessible frontend interfaces with visual QA and anti-generic review. Use as the active design authority for UI construction, polish, responsiveness, and final presentation.
metadata:
  layer: frontend
  risk: low
---
# Skill: Impeccable (active design lane)

## When to use
This is the DEFAULT active design authority for UI implementation, polish, and
visual QA. Load it for any task that touches UI rendering. frontend-design is a
fallback/exploration lane — do NOT run both as active authorities in one pass.

## The principle
Implementation should be invisible: correct spacing, real type scale, honest
states (loading/empty/error), and no AI-generic tells (centered hero trios,
gradient text, emoji icons, "trusted by" logo strips). Design taste is a budget,
not a licence to improvise.

## Procedure
1. Read the task's `design_refs` and the design-system tokens first.
2. Implement using shadcn/ui primitives (see shadcn-ui-builder); check free/public
   21st.dev blocks before hand-building (see 21st-dev-components).
3. Honour the tokens — never hardcode a colour/size that exists as a token.
4. Build every state a user can reach: loading, empty, error, success, disabled.
5. Visual QA against the design reference; flag drift, don't silently "improve".
6. Respect motion tokens (prefers-reduced-motion must work).

## Anti-generic checklist (reject these)
- Centered hero + 3 feature cards + logo strip (the default AI landing page).
- Gradient text, emoji-as-icons, blur-with-no-purpose.
- `rounded-2xl` on everything; shadow stacks that imply depth that isn't there.
- Lorem ipsum or placeholder copy in shipped UI.

## Anti-patterns
- Running frontend-design as a co-active authority (dual design authority = drift).
- Hand-building a component that exists free/public on 21st.dev.
- Skipping error/empty states because "the happy path works".
