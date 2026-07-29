---
name: stop-slop
description: Scan public or client-facing prose for recurring AI-writing tells after the draft is factually stable. Use after writing-style and any project/domain voice guidance; treat the score as advisory evidence, not a publishing gate or substitute for human review.
metadata:
  layer: frontend
  risk: low
---
# Skill: stop-slop (advisory final scan)

## When to use
After drafting public-facing or client-facing text: landing copy, marketing
blocks, UX microcopy, READMEs, release notes, emails, and proposals. Use it after
`writing-style` and domain-specific writing guidance.

## The principle
The slop score is not self-reported. `score.mjs` writes a
`.slop/<file>.score.json` artifact. The score is diagnostic: inspect the hits and
revise genuine problems, but do not distort meaning or voice to satisfy it.

## Order of operations
Project/domain constraints → `writing-style` draft or revision → `score.mjs` →
factual/brand review → human approval when the copy is sensitive or public.

## How it scores (5 real dimensions, 10 pts each = 50)
`score.mjs` reads its rule data from `references/tells.json` (externalised, so you
extend by editing data — not code). Each dimension penalises a class of AI tell:
1. **Opener** — throat-clearing openers ("It turns out", "Here's the thing").
2. **Jargon** — business-vague verbs (unlock, elevate, leverage, seamless).
3. **Contrast** — binary contrast framing ("Not X. But Y.").
4. **Agency** — false agency ("the data tells us", "the complaint becomes a fix").
5. **Emphasis** — em-dashes, adverb crutches, dramatic fragmentation.

The diagnostic threshold is 35/50. Run
`node pack-frontend/skills/stop-slop/score.mjs --help` to see options;
`--verify <files>` exits non-zero below 35 for callers that want a signal. Agent
OS itself remains non-blocking.

## Anti-patterns
- Self-reporting a score instead of running the scorer.
- "De-slopping" by removing content rather than rewriting it plainly.
- Forgetting that one em-dash costs 4 points — budget for it.
- Treating detector output as more important than facts, accessibility, domain
  terminology, approved voice, or human judgment.
