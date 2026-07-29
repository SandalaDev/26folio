## Writing: voice, clarity, anti-slop, and approval

Writing work uses a composed stack rather than one giant prompt:

```
project voice or specialist constraints
  -> writing-style draft/revision
  -> stop-slop deterministic scan
  -> factual and domain review
  -> human approval when required
```

The repo-scoped `writing-style` skill owns audience, purpose, structure, clarity, voice, and revision. `stop-slop` is a final lexical detector for suspicious phrase overlap; it does not decide whether writing is good. Specialist skills for product copy, UX, legal, accessibility, or brand rules take precedence within their domain.

:::agent Default writing workflow

Invoke `writing-style` for prose that matters: documentation, README files, pull-request descriptions, UI copy, release notes, proposals, emails, errors, and public explanations. After the draft is factually stable, run `stop-slop` on the relevant files and revise genuine hits without distorting meaning.
:::

### What to give the agent

Supply whatever is known:

- audience and what they need to do;
- desired voice or an approved example;
- facts and claims that must not change;
- format, channel, and length constraints;
- words or claims that are forbidden;
- whether the text is public, regulated, contractual, or brand-defining.

If no house style exists, the skill defaults to direct, concrete, calm prose with varied but controlled sentence rhythm.

:::human Approval is mandatory for

Legal or compliance copy, pricing, public promises, security disclosures, medical or financial claims, brand campaigns, irreversible customer messages, and any text whose factual correctness the agent cannot verify.
:::

### Conflict order

When instructions disagree, use this order:

1. Facts, safety, law, and explicit human constraints.
2. Approved project voice and domain-specific writing rules.
3. The requested surface or channel.
4. `writing-style` defaults.
5. `stop-slop` scoring.

Never change a true or necessary phrase solely to satisfy a detector.

:::check A finished writing pass

The intended reader and action are obvious; important facts survived revision; headings and paragraphs reveal the argument at a glance; empty intensifiers and canned transitions are gone; anti-slop output was reviewed rather than obeyed blindly; and required human approval is recorded outside the skill.
:::
