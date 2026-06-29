---
id: INTAKE-INTERVIEW
status: answered            # open -> answered (all questions resolved)
created_by: planning-agent
---
# Spine Hydration Interview
> A planning agent reads 00-original-intent.md and interrogates the GAPS here
> BEFORE drafting any spine file. The human answers inline. Hydration is blocked
> until status: answered. This prevents the agent papering over ambiguity with
> confident guesses that surface as contradictions three epics later.
>
> Agent: add questions ONLY where the brief is genuinely ambiguous or silent on
> something a spine file will need. Do not pad. "No questions" is a valid result
> for a thorough brief.

## Domain & data
- [x] Q: Does this phase need a database / data model, and if so what entities?
      A: No. This phase is a simple portfolio website — no database and no data
         model are needed.

## Compliance & integrations
- [x] Q: Which third-party integrations must exist in this phase?
      A: None. No integrations will be built in this phase.

## Architecture & constraints
- [x] Q: What is the framework and hosting/deploy target?
      A: A Next.js website with a rich, creative UI — motion graphics, video, and
         animations. Self-hosted on a VPS via Dokploy.

## Scope & sequencing
- [x] Q: What is the P1 must-ship for this phase, and what does "world-class" require?
      A: A portfolio website with world-class UI design built with Tailwind,
         shadcn/ui, 21st.dev elements, Lottie/SVG animations, Framer Motion, and
         GSAP. The skills for these tools must be installed.

## Open
- [x] Q: What is the confirmed technical stack?
      A: Next.js, Node, Cloudflare R2, Resend, GSAP, Framer Motion, Tailwind CSS.
