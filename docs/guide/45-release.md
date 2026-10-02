## Read progress and assess a release

The dashboard measures delivery toward release-candidate readiness. Ask: “Explain the release scope, current progress, forecast confidence and evidence for every exit criterion.”

### Establish the release contract

After delivery planning, the agent drafts the release block and roadmap in `project-spine/03-roadmap.md`. You approve scope references, weights, targets and exit criteria. The agent may draft the contract but must not declare your approval for you. A discovery interview's default draft release is only a starting point.

The trace is task → epic → roadmap item → release. Tasks contribute completed weight to linked scope. Roadmap estimates represent projected release work even before every task has been filed. A frozen baseline preserves what was approved so later scope growth is visible.

### Read the dashboard

- **Next action:** the pending interview, handoff, decision or available work the OS can identify.
- **Models and usage:** observed work and accounting coverage; session duration is not model billing time.
- **Release:** approved scope and completed weighted delivery, with the contract's status.
- **Runway:** target, forecast and uncertainty where enough evidence exists.
- **Work:** roadmap, epic and task links, including unmapped work that cannot be credited to release scope.
- **Operations and calibration:** session/command evidence and advisory observations about OS usage, not a quality grade for the product.

One hundred percent weighted delivery does not make the release ready while exit criteria remain pending. Conversely, a blank forecast can be honest: missing capacity, dates or completion history should produce an explanation instead of an invented schedule.

### Assess and save release evidence

```bash
bash scripts/os.sh rc assess
bash scripts/os.sh rc assess --write
bash scripts/os.sh rc validate
```

Assessment explains current evidence and unresolved decisions. `--write` saves a versioned assessment under `planning/rc/`. Validation checks contract defects and names the responsible field or source. A command reporting incomplete evidence does not deploy the product, reject a Git push or approve a release.

For formal review of the release decision:

```bash
bash scripts/os.sh interview start release
```

The agent shows each criterion's evidence, discusses exceptions and records your actual decision. It then reconciles the release documents. The interview confirmation alone does not perform deployment, write a Git tag or rewrite release weights.

### Close an epic before moving on

When the epic's tasks are done, the agent demonstrates the result and completes its closeout interview. If you request changes, record the accepted revised scope and file the required work before resuming affected implementation. A completed task file is a delivery record; epic acceptance is your judgment against the agreed intent.

For deployment and release tags, follow the product's own documented workflow and authorization. `os release` only releases a task claim, and `os sync` merges a PR. Neither is a deployment system.
