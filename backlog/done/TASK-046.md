---
id: TASK-046
title: "Unify CTA hover — every page's primary CTA uses the magnetic button treatment"
status: done
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-011
slice: EPIC-011-SLICE-2
depends_on: []
design_refs: [10-design-system.md, 12-ui-element-map.md]
skill_refs: [design-taste-frontend, framer-motion]

verification_required:
  lint: true
  typecheck: true
  unit: false
  integration: false
  e2e: false
  accessibility: false

public_text: false
handoff_required: false
handoff_type: []
handoff_file: ""
review_waiver: "Solo dev (reviewer: human). Cross-model review reassigned to the human at the PR into dev, per OS degraded mode."
protected_paths_touched: []
files_allowed:
  - src/components/site/cta-callout.tsx
  - src/components/motion/magnetic-button.tsx
  - backlog/tasks/TASK-046.md
---

# Task: Unify CTA hover site-wide (magnetic button)

> Owner note 4. Every page's primary CTA should behave like the hero's button:
> magnetic pull + peach fill sweep + text-mask reveal (the EPIC-009 signature
> interaction §7 #4). The only other primary CTA is the conversion band on every
> page (`CTACallout`), which currently uses the plain `Button`.

## Scope
- `cta-callout.tsx`: render `MagneticButton` (href variant, `size="lg"`) instead of
  the plain `Button asChild` `<Link>`, so the end-of-page CTA shares the hero's
  hover. Keep the heading/body/ctaLabel prop API and the `/contact` default href.
- `MagneticButton`: if needed, accept the CTA's existing usage cleanly (it already
  takes `href`, `size`, `variant`, `children`). Only extend if the CTA needs a
  prop it doesn't expose — otherwise leave the component as-is.
- Do not change the `Button` primitive's variants (the magnetic hover is layered
  on top, exactly as it is in the hero). Reduced-motion / coarse-pointer degrade is
  already handled inside `MagneticButton`.
- Note: secondary/tertiary buttons (ghost, link, icon) are not CTAs and keep their
  own simple hover. This task unifies the *primary call-to-action* hover only.

## Acceptance criteria
- [x] Every page's conversion-band CTA shows the magnetic hover (pull + fill sweep
      + text reveal), matching the hero button.
- [x] Reduced-motion / coarse-pointer clients still get a clean, styled, focusable
      button with no broken animation.
- [x] `CTACallout` prop API unchanged; the `Button` primitive's variants unchanged.
- [x] lint / typecheck / build green.
