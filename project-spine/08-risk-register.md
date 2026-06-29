---
id: RISK-REGISTER
status: draft
created: 2026-06-28
source: hydrated from 00-original-intent.md + INTAKE-INTERVIEW.md
---

# Risk Register — sandala.dev

## Format

Each risk has: likelihood (L: low/med/high), impact (I: low/med/high),
mitigation, and a human gate if one is required.

---

## R01 — Animation performance degradation

**L:** med | **I:** high

Rich animations (GSAP, Framer Motion, Lottie) degrade CLS and LCP on
lower-powered devices, undermining the "world-class UI" promise.

**Mitigation:**
- Animate only properties that do not trigger layout (transform, opacity).
- Test on mid-range Android device, not just M-series Mac.
- Implement `prefers-reduced-motion` fallbacks from day one.
- Run Lighthouse in CI as a build check.

**Human gate:** None — caught by CI.

---

## R02 — Resend contact form deliverability

**L:** low | **I:** med

Contact form emails land in spam or fail silently, breaking the primary
conversion path.

**Mitigation:**
- Verify sender domain in Resend before launch.
- Set SPF, DKIM, and DMARC records on the sending domain.
- Test form end-to-end in staging before go-live.
- Show a clear success/error state to the user on submit.

**Human gate:** Domain DNS records — owner action.

---

## R03 — Cloudflare R2 public URL misconfiguration

**L:** low | **I:** med

Media assets return 403 or are served from the wrong URL pattern, breaking
images and video on the live site.

**Mitigation:**
- Configure R2 bucket public access and custom domain in Dokploy env.
- Validate R2 URLs in staging before deploying to production.
- Use a single `NEXT_PUBLIC_R2_URL` env var — no hardcoded paths in components.

**Human gate:** R2 bucket configuration — owner action.

---

## R04 — Scope creep from CMS desire

**L:** high | **I:** med

During implementation the agent or owner is tempted to add Payload CMS or
a database "just to make content editing easier," pulling in significant
complexity not approved for this phase.

**Mitigation:**
- `05-data-model.md` and CODEOWNERS gate any `src/db/` changes.
- Phase 1 is explicitly static; content editing is done via Markdown files and
  a `git push`.
- CMS work is tracked as a named future phase in the roadmap.

**Human gate:** Any task touching `src/db/` or an ORM config — required.

---

## R05 — Design inconsistency across pages

**L:** med | **I:** med

With multiple UI libraries in play (shadcn/ui, 21st.dev, custom components),
visual consistency breaks down across pages as implementation progresses.

**Mitigation:**
- All design tokens are defined in `tailwind.config.ts` first.
- `11-design-system.md` is the authoritative component and token reference.
- Every task referencing UI must cite `11-design-system.md` in `skill_refs`.

**Human gate:** Design system token changes require owner review.

---

## R06 — VPS / Dokploy single point of failure

**L:** low | **I:** high

Self-hosted single VPS has no redundancy. Hardware failure or misconfiguration
takes the site offline.

**Mitigation:**
- Daily automated VPS snapshots via hosting provider.
- Deployment is fully reproducible from the repo + env vars (Docker).
- DNS TTL set low enough to allow rapid failover if needed.

**Human gate:** Hosting provider selection and snapshot schedule — owner action.

---

## R07 — Brand photography not yet available

**L:** med | **I:** low

About page and case studies require personal photography that may not be
ready when the site launches.

**Mitigation:**
- Components are built with placeholder-ready slots; real images slot in
  without layout changes.
- Launch is not blocked by photography — placeholder imagery is acceptable
  for a soft launch.

**Human gate:** None — design handles this gracefully.
