---
name: ds-epic-estimator
description: Estimate roadmap epic scope from decomposed weighted task skeletons, record explicit risk multipliers, derive target dates from the current delivery-rate rung, and present scope-versus-date choices for human negotiation. Use during lean-context hydration, when adding an unstarted roadmap epic, or when filed task weight breaches an epic estimate by 25 percent.
---

# Estimate roadmap epics from structure

Produce a reviewable scope estimate. Estimate task structure and weight, never
hours or days. Let the delivery-rate model convert weight into calendar dates.

## Procedure

1. Decompose each roadmap epic into a task skeleton before estimating it. Record
   task names and size classes, not full task files. Split any unit larger than
   weight 3.
2. Size each skeleton item against these anchors:

   | Class | Weight | Anchor |
   |---|---:|---|
   | S | 1 | One file or one behavior; acceptance is obvious; no new concepts. |
   | M | 2 | Multi-file feature; needs a test; touches one existing subsystem. |
   | L | 3 | New subsystem, cross-cutting change, or external integration. |

   Justify every L by naming what makes it cross-cutting. Do not record hour or
   day estimates.
3. Check each epic for five uncertainty flags: a new external dependency; an
   unfamiliar domain; a required design or elicitation phase; integration with
   something unmeasured; vague acceptance criteria. Name every flag and apply:

   - 0 flags: `risk_multiplier: 1.0`
   - 1 flag: `risk_multiplier: 1.25`
   - 2 flags: `risk_multiplier: 1.5`
   - 3 or more flags: `risk_multiplier: 2.0`

4. Sum the skeleton weights into `estimated_weight`. Order epics by dependency
   and priority. Convert cumulative `estimated_weight * risk_multiplier` at the
   dashboard's current rate rung, starting from the charter's `hydrated` date,
   to derive each `target_end` and the computed RC date.
5. Present scope-versus-date choices to the human. State the computed RC date,
   the largest scope contributors, and how removing or deferring each changes
   the date. The human accepts the date, cuts scope, or records a deliberate gap
   by editing `project-spine/03-roadmap.md`. Do not add an approval command.
6. Re-estimate only when an epic's filed task weight reaches at least 125% of
   `estimated_weight`. Apply the observed discovery rate to unstarted epics.
   Never restate completed epics; their original estimates are calibration data.

## Required output

For each roadmap item, write or propose:

```yaml
estimated_weight: 9
risk_flags: [needs-elicitation]
risk_multiplier: 1.25
target_end: 2026-08-28
```

For the release, show the estimate rung and evidence used to derive dates:

- rung 3: measured from at least five completions across at least three days;
- rung 2: observed/prior blend for one to four completions;
- rung 1: explicit `expected_weight_per_day` planning assumption;
- rung 0: no rate; report only the rate required to hit the human target.

Keep raw weight, risk multiplier, filed weight, and done weight separate so later
calibration can identify scope discovery and risk-model error.
