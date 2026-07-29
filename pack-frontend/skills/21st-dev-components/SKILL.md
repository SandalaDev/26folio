---
name: 21st-dev-components
description: Find, assess, and adapt suitable free public 21st.dev components for frontend marketing surfaces. Use when a UI task could reuse an existing block before building a custom component.
metadata:
  layer: frontend
  risk: low
---
# Skill: 21st.dev components

## When to use
Before hand-building any marketing block, section, or UI pattern. Check whether a
free, public 21st.dev component exists that fits the design reference. This
supports the active lane (Impeccable) — it saves you from hand-building what
already exists.

## The principle
Don't hand-build what the community has already built and published free. Find,
evaluate, adapt. But: the component must match the design tokens and the design
read — never paste a 21st.dev block in unchanged if it clashes with the system.

## Procedure
1. Search 21st.dev for the pattern (hero, pricing, testimonials, FAQ, CTA, footer).
2. Evaluate: free + public license? Accessible? Does it match the design read?
3. Add it (`npx twenty-first@latest add <component>` or copy the source).
4. Adapt to the project's tokens (colours, type, radius, motion) — do not ship it
   with the author's default look if it conflicts.
5. Record the source in the task so the reviewer can verify provenance + license.

## Provenance + license
- Only use free/public components. Record the source URL + license in the task.
- If a component requires attribution, surface it — never silently strip it.

## Anti-patterns
- Hand-building a pricing/FAQ/CTA block that exists free on 21st.dev.
- Pasting a component unchanged when it clashes with the design tokens.
- Using a paid/restricted component without checking the license.
