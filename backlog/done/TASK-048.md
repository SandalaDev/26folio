---
id: TASK-048
title: "Contact page — inquiry form + confirmation state + contact details"
status: done
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-011
slice: EPIC-011-SLICE-3
depends_on: []
design_refs: [10-design-system.md, 12-ui-element-map.md]
content_refs: [11-content-strategy.md]
skill_refs: [design-taste-frontend, framer-motion]

verification_required:
  lint: true
  typecheck: true
  unit: false
  integration: false
  e2e: false
  accessibility: false

public_text: true
handoff_required: false
handoff_type: []
handoff_file: ""
review_waiver: "Solo dev (reviewer: human). Cross-model review reassigned to the human at the PR into dev, per OS degraded mode."
protected_paths_touched: []
files_allowed:
  - src/app/(site)/contact/page.tsx
  - src/components/site/contact-form.tsx
  - src/components/about/social-links.tsx
  - backlog/tasks/TASK-048.md
---

# Task: Contact page — inquiry form + confirmation + contact details

> Owner note 6. The contact page is a bare `<h1>Contact</h1>` stub. The spine
> (11-content-strategy §4, 12-ui-element-map §3 `/contact`) wants an inquiry form
> (name, email, message, optional project-type selector) + a confirmation state +
> contact details/socials. Delivery is Resend, no stored submissions (charter) —
> but `api/contact/route.ts` is a 501 stub, so this form validates on the client
> and POSTs to the route, showing a clear state per outcome; real Resend wiring is
> a separate epic.

## Scope
- New `src/components/site/contact-form.tsx` ("use client"): a plain `<form>` (no
  shadcn Form dep — the design system deliberately stays lean) using the existing
  `Input`/`Textarea`/`Label` primitives, plus a native `<select>` (styled to match:
  hard corners, `surface` field, hairline border, rose focus ring) for the optional
  "type of project" selector. Fields: name, email, message, optional project type.
  Submit uses `MagneticButton` (button variant) so the CTA matches the hero.
  Client-side validation (required name/email/message, valid email) with inline
  error text below each field (design lane §4.6: label above input, error below).
  States: idle / submitting / success / unavailable. On submit, POST to
  `/api/contact`; a 501 (the current stub) maps to the "unavailable" state with a
  neutral message (no invented delivery promise), a success-ish 2xx to "success".
- `src/app/(site)/contact/page.tsx`: compose a page head (display h1 + subhead in
  the established page-head pattern, with a quiet blob accent) + the form + a
  contact-details block (the `SocialLinks` set; no LinkedIn per §7). The spine does
  not specify a contact email, so the details block uses the socials plus a neutral
  line; a real email is flagged in STATE for the owner to supply.
- `src/components/about/social-links.tsx`: only touched if it needs a small prop to
  render in the contact context (e.g. a variant/className). If it already composes,
  leave it.
- Copy is neutral and functional, passes stop-slop (no em-dashes, no banned verbs).

## Acceptance criteria
- [x] Contact page renders a display h1 + subhead, the inquiry form, and a
      contact-details/socials block (no LinkedIn).
- [x] Form has name, email, message, and an optional project-type selector; labels
      above inputs; inline validation errors below; the submit CTA uses the magnetic
      hover and is keyboard-focusable.
- [x] Form posts to `/api/contact` and shows idle / submitting / success /
      unavailable states without throwing on the 501 stub.
- [x] Inputs/placeholders/labels/errors pass WCAG AA contrast against the section.
- [x] lint / typecheck / build green; slop artifact >= 35/50 for each changed
      public-text file (`page.tsx`, `contact-form.tsx`).
