## Verify and review

Use verification to demonstrate the task's agreed behavior. Use optional model review for additional findings. Human review of the PR remains a separate decision.

### Run task checks and inspect the evidence

```bash
bash scripts/os.sh verify-task TASK-001
```

The runner executes each `testing.commands` argument array without shell interpolation, saves bounded output, exit codes and a source snapshot in `project-state/verification.jsonl`, and reports `passed`, `failed` or `not-run`. It does not invent a test from the acceptance prose. Inspect the returned result; recording a failed result is not a successful check.

Ask the agent to demonstrate the behavior too: a relevant preview, example input/output, migration rehearsal or recovery case. An assertion count alone does not establish that the intended workflow works. `os check` examines state consistency; it is not a product test suite. Template development uses `npm test`, but exported product projects need their own planned tests because template regression fixtures do not ship.

### Prepare an optional review packet

```bash
bash scripts/os.sh review prepare TASK-001
bash scripts/os.sh review providers
```

Preparation writes a packet under `planning/reviews/` with the task contract, scope, current working diff and recorded verification. Its ID and snapshot bind results to that source state. Preparation is local: it does not contact Gemini, Greptile or another paid service.

The built-in packet's diff is the working change against `HEAD`. It is not automatically the whole feature-branch PR diff after all changes have been committed. Include the intended code and evidence in the review workflow, and use the Git host's actual PR diff for human review. Untracked files are fingerprinted for freshness but their contents are not embedded in that diff; a reviewer needs those files explicitly when relevant.

### Configure and run an authorized reviewer

This is optional advanced setup. A provider wrapper must accept the JSON packet on stdin and return JSON findings on stdout. It must enforce read-only access and its spending limit. Merely having a subscription does not install a wrapper or authorize arbitrary API charges.

Example configuration shape, to be populated with an existing, tested wrapper:

```json
{
  "id": "my-reviewer",
  "command": ["node", "PATH_TO_TESTED_REVIEW_WRAPPER.mjs"],
  "mode": "read-only",
  "authorization": "ACTUAL_USER_AUTHORIZATION_REFERENCE",
  "max_cost_usd": 0,
  "model": "ACTUAL_MODEL_ID"
}
```

```bash
bash scripts/os.sh review configure planning/reviews/provider.json
bash scripts/os.sh review run planning/reviews/ACTUAL_PACKET.json --provider my-reviewer
```

`max_cost_usd: 0` is appropriate only for an authorized wrapper that can operate without paid charges and enforce that cap. Set any other cap only from your actual authorization. The OS passes the limit to the wrapper; it does not enforce a provider's billing API. It detects repository modifications after execution but cannot undo external side effects. A failed provider call does not record a successful review.

### Import findings from a manual review

The result needs the exact `packet_id`, a copied `snapshot` from that packet and a `findings` array. Each finding includes `file`, a positive `line`, `severity` (`critical`, `high`, `medium` or `low`), `explanation` and `evidence`. An empty array means that reviewer returned no findings; it does not establish release acceptance.

```bash
bash scripts/os.sh review import planning/reviews/ACTUAL_RESULT.json
bash scripts/os.sh review status
```

Changing reviewed source makes old results stale. Fix the issue, rerun relevant checks and prepare a fresh packet when further review is needed. Do not reuse an old digest to present a different diff as reviewed.

### Open the PR and merge after human review

Commit the intended changes on the feature branch and push it before opening a PR. `os pr` needs GitHub CLI and authentication; use `gh auth status` to diagnose missing access.

```bash
git push -u origin HEAD
bash scripts/os.sh pr "Describe the behavior delivered" --draft
```

The default flow targets `main`; trunk-dev projects target `dev`. Explain test evidence, remaining limitations and material schema, auth, billing, secrets or infrastructure risks in the PR. The OS does not observe or approve your human review.

:::human Sync can merge the PR
After review and explicit authorization to merge, `bash scripts/os.sh sync` invokes `gh pr merge --squash --delete-branch`, switches to the integration base and attempts a fast-forward pull and cleanup. It is not a read-only status command, and it does not update the OS from the template.
:::

If you already merged through the Git host, fetch and switch to the integration base, then fast-forward it. The branch cleanup helper requires ancestry; a squash-merged feature may fail that check because its original commits are not ancestors. Verify the merged PR before manually retiring such a branch. Do not treat a cleanup refusal as evidence to re-merge the feature.
