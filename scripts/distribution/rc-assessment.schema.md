# RC assessment schema — `agent-os.rc-assessment.v1`

Contract for `os rc assess [--json] [--write]` (implemented in TASK-603). This
document is the frozen shape; TASK-603 must not invent fields beyond it
without a schema bump. `project-spine/03-roadmap.md` remains the single
canonical human-readable release/roadmap contract — this artifact reports
facts and gaps about it, it never becomes a second source of truth.

## Envelope

```jsonc
{
  "schema": "agent-os.rc-assessment.v1",
  "generated_at": "2026-08-11T00:00:00.000Z",
  "generated_by": { "harness": "unknown", "model": "unknown" },
  "spine": {
    "hydrated": true,
    "roadmap_schema_detected": "agent-os.roadmap.v1" // or null if unhydrated / unrecognized
  },
  "inventory": {
    "epics_total": 0,
    "tasks_total": 0,
    "tasks_done": 0,
    "roadmap_items_total": 0
  },
  "linkage": {
    "roadmap_items_mapped": 0,
    "epics_mapped": 0,
    "tasks_mapped": 0,
    "unmapped_epic_ids": [],
    "unmapped_task_ids": []
  },
  "completion_dates": {
    "by_source": { "frontmatter": 0, "ledger": 0, "git": 0, "missing": 0 },
    "distinct_completion_days": 0,
    "completed_weight": 0
  },
  "rate_rung": {
    "rung": 0, // 0..3, see below
    "evidence": "no completions on record",
    "expected_weight_per_day": null, // set only for rung 1 (human assumption) or rung 2/3 (blended/observed)
    "required_weight_per_day": null  // set only when rung 0 and a human target date exists — the pace that WOULD be required, never invented as fact
  },
  "roadmap_items": [
    {
      "id": "ROAD-001",
      "task_skeleton_present": true,
      "raw_estimated_weight": 5,
      "risk_flags": ["integration"],
      "risk_multiplier": 1.2,
      "filed_weight": 6,
      "done_weight": 2,
      "target_end_status": "on-track" // on-track | at-risk | missed | unknown
    }
  ],
  "release": {
    "target": null,
    "tolerance_days": null,
    "scope_ref": null,
    "exit_criteria_status": "not-configured" // not-configured | pending | met
  },
  "baseline": {
    "status": "none", // none | frozen | legacy
    "legacy_semantics": null
  },
  "gaps": [
    { "owner": "AGENT", "field": "roadmap_items[].task_skeleton_present", "detail": "..." },
    { "owner": "HUMAN", "field": "release.target", "detail": "no target date set in 03-roadmap.md" }
  ]
}
```

## Rate-rung contract (exact thresholds)

| Rung | Condition |
|---|---|
| 3 | At least 5 completions across at least 3 distinct days. |
| 2 | 1–4 observed completions, blended with an explicit human prior. |
| 1 | No completions; explicit human `expected_weight_per_day` planning assumption in `03-roadmap.md`. |
| 0 | No rate available. Report only `required_weight_per_day` against a human target, never a fabricated pace. |

## `gaps[].owner` contract

- `AGENT` — evidence the agent can and should compute or draft (task-skeleton
  presence, linkage coverage, rate-rung evidence).
- `HUMAN` — scope, capacity assumptions, target dates, exit criteria,
  approval, or baseline/rebaseline decisions. An assessment must never fill
  these in on the human's behalf; it only names the gap.

## `--write` artifact

`os rc assess --write` creates `planning/rc/ASSESS-<UTC-timestamp>.md` (or
`.json` alongside it) containing this envelope plus a short human-readable
summary. Re-running `--write`:
- regenerates the evidence sections above (they are always fresh facts);
- never overwrites a human-authored answer recorded elsewhere (e.g. in
  `03-roadmap.md`) — the assessment reads that file, it does not write to it;
- creates a new revision file rather than silently replacing history, so a
  reviewer can diff successive assessments.
