---
name: writing-style
description: Create or revise clear, human, purpose-led prose while preserving facts, audience fit, and project voice. Use for documentation, READMEs, pull-request descriptions, UI copy, emails, proposals, release notes, error messages, and other writing where structure and tone matter; compose it with specialist writing rules and run stop-slop after the draft.
---

# Writing Style

Write for a specific reader and outcome. Prefer accurate, concrete language over
performance, filler, or imitation of a generic “professional” voice.

## Workflow

1. Establish the reader, intended action, channel, voice, length, and constraints.
   Infer low-risk gaps from the artifact and project context; ask only when a
   missing choice would materially change the result.
2. List facts, terminology, promises, quotations, and requirements that revision
   must preserve. Do not improve prose by changing meaning.
3. Choose the smallest structure that makes the argument or action obvious.
   Lead with the outcome, decision, or user need.
4. Draft with concrete nouns and verbs. Vary sentence length deliberately. Make
   headings and first sentences carry information. Remove repeated setup,
   unnecessary recap, empty intensifiers, and canned transitions.
5. Read for audience fit and voice. Use an approved project example when one
   exists; otherwise default to direct, calm, specific prose.
6. Apply the composition order below, then return the finished artifact and call
   out any factual uncertainty or required human approval.

## Compose With Other Writing Skills

Use this order:

1. Facts, safety, law, explicit human constraints, and quoted source material.
2. Project voice and domain-specific skills such as UX, accessibility, legal,
   compliance, or brand guidance.
3. This skill for structure, drafting, clarity, rhythm, and revision.
4. `stop-slop` as a deterministic final scan:
   `node pack-frontend/skills/stop-slop/score.mjs <files>`.
5. Factual/domain review, then human approval where required.

Treat detector output as evidence, not authority. Never damage a necessary term,
true statement, accessibility requirement, or deliberate voice choice merely to
raise a score.

## Human Approval

Require a human decision before publishing legal or compliance copy, pricing,
public promises, security disclosures, regulated claims, brand campaigns,
irreversible customer messages, or claims whose truth cannot be verified.

## Delivery Standard

A finished pass should make the intended reader and action obvious, preserve the
source facts, scan cleanly at heading and paragraph level, sound consistent
rather than templated, and disclose unresolved uncertainty. When revising, do not
quietly expand scope or invent supporting evidence.

## Anti-patterns

- Polishing before the facts and purpose are stable.
- Treating one voice as universally “good writing.”
- Replacing precise domain language with vague synonyms.
- Adding throat-clearing, fake quotations, invented metrics, or unearned claims.
- Obeying an anti-slop score blindly.
- Declaring sensitive copy approved because an agent revised it.
