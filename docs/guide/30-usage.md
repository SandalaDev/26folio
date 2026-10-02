## Understand usage

The usage panel answers what was observed, which task and model it belongs to, what API-equivalent value can be estimated, and what subscription payment was allocated. Start by asking: “Set up usage capture for the harnesses I use. Keep missing data explicit and show me the coverage.”

### Four numbers with different meanings

<table><thead><tr><th>Measure</th><th>Meaning</th><th>Evidence needed</th></tr></thead><tbody><tr><td>Observed tokens</td><td>Input, cached reads, cache writes, output and supported reasoning categories.</td><td>Native usage records or normalized events.</td></tr><tr><td>API-equivalent estimate</td><td>The estimated API value of the observed work.</td><td>A harness estimate or a dated model rate card.</td></tr><tr><td>Billed amount</td><td>An actual charge associated with the usage.</td><td>Invoice-backed billing evidence; ordinary harness cost fields are estimates.</td></tr><tr><td>Allocated subscription payment</td><td>The portion of a paid subscription explicitly assigned to this project and distributed over observed work.</td><td>Payment, period, project share and an allocation basis.</td></tr></tbody></table>

A budget is a fifth, separate planning number. A $200 monthly budget does not mean $200 was paid, and does not mean this project consumed $200. API-equivalent estimates and allocated subscription payments are alternative accounting views; adding them together would double-count the same work.

### 1. Bind usage to actual work

Start a session and claim a task before capture. For the current identified Codex session:

```bash
bash scripts/os.sh usage capture
bash scripts/os.sh usage report
```

Capture uses the current session identifier when exposed by the harness and searches for its matching local source. It also runs at checkpoint and end. If no task or session is active, it reports unattributed usage. If no supported source is available, it reports why; it does not guess another conversation's transcript.

For a known native export, set `OS_USAGE_FILE` to its absolute path and `HARNESS_NAME` to its adapter name before capture. Automatic capture supports the records the adapter recognizes. Check the report before relying on it; changing harness versions can change exported formats.

### 2. Import an existing session explicitly

The adapter names are `codex`, `claude-code`, `opencode`, `gemini-cli` and `normalized`. These are local parsers, not account connections. Obtain a native usage export using your installed harness's export facilities, then bind that file to its real task and session:

```bash
bash scripts/os.sh usage import claude-code "C:/usage/session.jsonl" \
  --task TASK-001 --session ACTUAL_SESSION_ID --type implementation

bash scripts/os.sh usage import opencode "C:/usage/session.json" \
  --task TASK-002 --session ACTUAL_OTHER_SESSION_ID \
  --account opencode-zen --type research
```

Run only the example that matches your file. Use `--model`, `--provider`, `--surface` and `--role` when that information is known but absent from the source. Source-reported model changes stay attached to their own observations. A binding does not retroactively change the provider that ran the call.

Imports return observation and import counts. Reimporting the same stable events is reconciled instead of added twice. Do not bind a whole multi-task transcript to whichever task is currently convenient: split the source into correctly attributed records. An already-bound event cannot simply be reassigned to another task.

### 3. Register a source for refresh

For a file that your harness continues to update for one task/session, ask the agent to create a source JSON such as `planning/usage/source.json`:

```json
{
  "id": "task-002-opencode-session",
  "file": "C:/usage/task-002-session.json",
  "harness": "opencode",
  "binding": {
    "task": "TASK-002",
    "session": "ACTUAL_SESSION_ID",
    "account": "opencode-zen",
    "type": "implementation"
  }
}
```

```bash
bash scripts/os.sh usage source planning/usage/source.json
bash scripts/os.sh usage sync
bash scripts/os.sh refresh
```

The source configuration is saved in runtime state. Refresh synchronizes registered sources and reports source-specific failures. Do not reuse a growing file across unrelated tasks under one fixed binding. Re-register the same source ID with the correct local path on a different machine.

Raw transcripts are not copied into the repository. The normalized ledger retains attribution and token/cost fields. Source paths can still reveal local usernames; inspect configuration before sharing it. Keep API keys and credentials in the harness's own secret storage, never in these JSON examples.

### 4. Record changing monthly subscriptions

Ask: “For this billing period, record my budget. Keep actual payment and project share unknown until I supply them.” Give each account and billing period a stable ID. The current accounting implementation accepts USD and uses start-inclusive, end-exclusive intervals.

This example records a **budget only**, with sample calendar dates that you must replace with the real billing period:

```json
{
  "id": "chatgpt-2026-09",
  "name": "ChatGPT",
  "harness": "codex",
  "account": "chatgpt",
  "currency": "USD",
  "start": "2026-09-01T00:00:00Z",
  "end": "2026-10-01T00:00:00Z",
  "budget_amount": 200,
  "paid_amount": null,
  "project_share": null,
  "basis": "tokens"
}
```

Save it as `planning/usage/chatgpt-period.json`, then:

```bash
bash scripts/os.sh usage subscription planning/usage/chatgpt-period.json
bash scripts/os.sh usage report
```

The owner supplied a current budget example of $200 ChatGPT, $100 Claude, $10 OpenCode Go and $40 OpenCode Zen per month. Those are changeable planning amounts, not vendor price claims, payment evidence or universal defaults for new projects. Record Claude under `claude-code`; record Go and Zen under `opencode` with distinct `account` values such as `opencode-go` and `opencode-zen`. Bind imported events to the matching account.

When an actual payment and project share become known, update the same period record with those values and re-run `usage subscription`. It replaces configuration with the same ID. For the next billing period, create a new ID and interval with that month's values. Periods do not renew automatically, and overlapping periods for the same account are refused to avoid allocating twice.

### How allocation is calculated

Suppose an actual payment is $200 and you explicitly assign this project a share of `0.25`. The project budget is $50. If task A has 60 percent of the eligible observed token basis and task B has 40 percent, their allocations are $30 and $20. The remaining $150 is unallocated to this project.

With `basis: tokens`, the relative measured token count determines the split. With `basis: api-equivalent`, supported cost estimates determine it. If there is no usable basis, the payment stays unallocated. Partial observations may distribute the full project share across only the known work; inspect coverage before treating the split as representative.

The OS cannot see all work performed under your subscription in other projects or apps. You decide the project share and reconcile shares across repositories yourself. Do not assign the full same payment to every project and sum the results as account-wide spending.

### 5. Add dated rate evidence when needed

Ask the agent to research the exact provider/model rates for the relevant dates and prepare a rate JSON. The OS includes no live pricing service. The agent supplies an evidence URL and separates uncached input, cache reads, cache writes, output and separately priced reasoning where applicable.

```json
{
  "id": "EXAMPLE_MODEL_RATE_REVISION",
  "model": "ACTUAL_MODEL_ID",
  "provider": "ACTUAL_PROVIDER",
  "effective_from": "2026-09-01T00:00:00Z",
  "source_url": "ACTUAL_PRICING_EVIDENCE_URL",
  "per_million": {
    "input_uncached": null,
    "input_cached_read": null,
    "input_cache_write": null,
    "output": null
  }
}
```

This is a schema illustration, not a usable price card. Fill numeric rates only from actual evidence. Missing prices leave affected estimates unknown. An optional `effective_to` ends a card's validity; the report selects the matching model/provider card for each observation date.

```bash
bash scripts/os.sh usage rate planning/usage/model-rate.json
bash scripts/os.sh refresh
```

### Unsupported harnesses and normalized events

DeepSeek or a T3 control surface can be attributed through normalized records even without a dedicated live adapter. A minimal example follows; every count must come from a real source, and a known zero differs from unavailable `null`:

```json
{
  "event_id": "STABLE_SOURCE_EVENT_ID",
  "timestamp": "2026-09-10T12:00:00Z",
  "model": "ACTUAL_MODEL_ID",
  "tokens": {
    "input_uncached": 1000,
    "input_cached_read": 0,
    "input_cache_write": null,
    "output": 200,
    "reasoning_output": null,
    "reasoning_in_output": true
  },
  "billed_cost": null
}
```

```bash
bash scripts/os.sh usage import normalized "C:/usage/events.json" \
  --task TASK-001 --session ACTUAL_SESSION_ID \
  --provider ACTUAL_PROVIDER --surface t3 --type implementation
```

The adapter field remains `normalized`; the surface and provider label the real source. This is an interchange path, not a promise that the OS controls that harness. For worker observations use explicit `--worker` and `--parent` bindings. Mark a parent `--scope inclusive` only if it already includes its children's work; the report then excludes those children from its aggregate.

### Read the report and compare models

```bash
bash scripts/os.sh usage report
```

Check event counts, known-model coverage, estimate coverage, account periods and excluded inclusive children. A numeric total can be a sum of known values with other values missing. Codex cumulative input is split into cached and uncached deltas; Claude/OpenCode cache categories stay separate. Reasoning is added only when reported outside output.

To compare quality as well as quantity, save an outcome record and import it:

```json
{
  "task": "TASK-001",
  "work_type": "implementation",
  "complexity": "medium",
  "acceptance": "unknown",
  "retries": 1,
  "evidence": "Path to the demonstration and actual acceptance evidence",
  "verification": "Path to relevant test results"
}
```

```bash
bash scripts/os.sh usage outcome planning/usage/task-outcome.json
```

Set acceptance to `accepted` only with real human evidence, `rework` when required, or `unknown`. Compare the same work type and complexity. Mixed-model tasks remain mixed; neither token price nor a passing test proves a model winner.
