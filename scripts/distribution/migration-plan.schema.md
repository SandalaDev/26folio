# Migration-plan schema — `agent-os.migration-plan.v1`

Contract for the artifact produced by `os migrate plan` and consumed by
`os migrate apply` (implemented in TASK-604). Frozen shape; a migration
module must not perform a write that isn't declared in this structure.

## Envelope

```jsonc
{
  "schema": "agent-os.migration-plan.v1",
  "generated_at": "2026-08-11T00:00:00.000Z",
  "source_template_ref": "abcdef1234567890",
  "detected_project_schema": "agent-os.project.v0-legacy",
  "target_project_schema": "agent-os.project.v1",
  "modules": [
    {
      "id": "MIG-001-legacy-goal-project",
      "detect_result": "matched",
      "writes": [
        {
          "path": "project-state/state.json",
          "transform": "add-compat-block",
          "preserves": ["current", "counts", "epics", "handoff_queue"]
        }
      ],
      "preserved_values": ["project-state/decisions.md (untouched)"],
      "unresolved_human_decisions": [
        "release.target has no value — set it in project-spine/03-roadmap.md"
      ],
      "rollback": "restore project-state/state.json from the pre-apply snapshot recorded in the plan's receipt"
    }
  ],
  "receipt_preview": {
    "migration_ids": ["MIG-001-legacy-goal-project"],
    "applied_at": null,
    "idempotent_if_rerun": true
  }
}
```

## Module contract

Each migration module implements four operations:

| Stage | Write-allowed | Purpose |
|---|---|---|
| `detect(projectRoot)` | no | Returns `matched` / `not-matched` / `ambiguous` for this project's current state. |
| `plan(projectRoot)` | only the plan artifact itself | Returns the `writes[]`, `preserved_values[]`, `unresolved_human_decisions[]`, and `rollback` shown above. |
| `apply(projectRoot, plan)` | only paths listed in `plan.writes[].path` | Atomic write (temp file + rename); never touches an undeclared path. |
| `verify(projectRoot)` | no | Re-checks the applied state matches the plan's intent; used after `apply` and on every subsequent `inspect`. |

`ambiguous` from `detect` must stop the whole `plan`/`apply` pipeline for that
project with a precise manual-action message — it is never silently skipped
or guessed past.

## Receipt (stored in `project-state/state.json`)

```jsonc
"distribution": {
  "template_ref": "abcdef1234567890",
  "project_schema": "agent-os.project.v1",
  "migrations_applied": [
    { "id": "MIG-001-legacy-goal-project", "applied_at": "2026-08-11T00:00:00.000Z" }
  ]
}
```

`migrations_applied` is the idempotency key: `os migrate apply` skips any
module whose `id` is already present, and `os migrate inspect`/`verify`
report already-applied modules as no-ops rather than re-running them.

## Invariants

- `inspect` and `plan` never write outside an explicitly requested plan
  artifact file.
- `apply` uses atomic writes (write to a temp path, then rename) so a crash
  mid-apply cannot leave a half-written file.
- A migration module never invents scope, estimate, capacity, date, exit
  criterion, approval, or a replacement baseline — those always surface as
  `unresolved_human_decisions` for a human to resolve directly in
  `project-spine/03-roadmap.md`.
- A legacy release baseline is preserved verbatim and labeled, never
  reinterpreted or replaced, unless a human separately chooses a new baseline
  outside the migration workflow.
