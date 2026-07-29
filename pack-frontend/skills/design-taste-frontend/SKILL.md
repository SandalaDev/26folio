---
name: design-taste-frontend
description: Infer a concrete frontend visual direction from project context and human taste inputs. Use before UI implementation when an active design lane needs layout, typography, density, motion, and reference constraints.
metadata:
  layer: frontend
  risk: low
---
# Skill: design-taste-frontend (taste / brief inference)

## When to use
For landing pages, portfolios, redesigns — BEFORE implementation. Infer a
one-line "Design Read" from the brief, set the taste dials, then hand direction
to Impeccable (the active lane). This skill is DIRECTION INPUT ONLY — it never
implements. It feeds Impeccable; it does not replace it.

## The principle
Taste is not arbitrary; it's a few load-bearing choices stated up front so the
whole build is coherent. State the read in one line, set three dials, then get
out of the way.

## The Design Read (one line, before any code)
"What is this trying to feel like?" — answer in one sentence. e.g. "An editorial
portfolio: high contrast, generous whitespace, motion used sparingly to reward
attention, not to perform."

## The three taste dials (baseline shown; tune per brief)
- **DESIGN_VARIANCE** (baseline 8/10): how far from the default template look.
- **MOTION_INTENSITY** (baseline 6/10): how much motion, how assertive.
- **VISUAL_DENSITY** (baseline 4/10): whitespace vs. information density.
Lower a dial only with a reason from the brief; never zero everything.

## AI Tells to forbid (coordinate with stop-slop)
Em-dash overuse, binary-contrast framing, "elevate/unlock/seamless", the
centered-hero trio. These are the same tells stop-slop penalises.

## Anti-patterns
- Implementing UI (this skill is direction only).
- Setting all dials to maximum (chaos, not taste).
- Inventing a design read the brief doesn't support.
