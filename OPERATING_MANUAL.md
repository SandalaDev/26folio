# Agent OS reference

The human explains and decides in chat. The agent researches, records evidence, operates the OS and demonstrates results. The dashboard is a generated view, not another editable state store.

For step-by-step operator workflows, open the generated `guide.html` or read `docs/guide/`. This manual is the compact agent reference. Both HTML views embed the shared theme from `scripts/brand.mjs`, based on the 26folio design system's espresso, rose and caramel tokens; no network assets are needed.

## Start and recover

Run bash scripts/os.sh start, read os next, then claim the chosen task. checkpoint "next step" records recovery context. end closes a session; done TASK completes work. switch "where I stopped" writes a handoff. The next agent uses onboard. A live foreign lock requires an explicit handover; --takeover preserves its journal. Session duration is wall time, not billable model effort.

Use os refresh after external changes. A successful refresh regenerates state, metrics, dashboard and guide and saves an artifact receipt in .agent-os-cache/. Rendering failure is visible. Ending a session remains available while an interview or check is pending.

## Interview operations

os interview start discovery creates a resumable conversation. packet shows known answers and the next independent questions. The agent uses record ID KEY "answer", review ID, then confirm ID DIGEST "actual user confirmation or message reference" after readback. The digest binds confirmation to those answers. Confirmation is an agent-recorded receipt; it is not cryptographic proof of human identity.

Discovery confirmation creates the charter, decision index and draft roadmap and starts delivery and capabilities. Delivery discusses decomposed estimates, uncertainty, capacity and targets; unknown capacity means no forecast. Capabilities covers skills, harnesses, accounting, testing and review spending. start epic EPIC-XXX creates epic kickoff; start closeout EPIC-XXX checks the demonstration against intent. start change EPIC-XXX reopens affected work. revisit refreshes changed upstream dependencies; previously confirmed answers must be reconsidered before reconfirming.

New exports enable workflow version 2. Existing projects enable it by starting discovery and importing their actual prior decisions through the conversation. Legacy intake.sh routes to this same state machine, so headings or a hand-edited ready status cannot bypass it.

Claims, done and work dispatch enforce interview decisions. Direct editor and shell writes are outside portable CLI control. guard-hook accepts harness tool input on stdin, conservatively rejects mutating tools while interviews are pending, and allows narrowly recognized interview/recovery commands. Install a hook only after testing the actual harness schema; the default assurance remains commands. A hook cannot establish human consent by itself.

## Usage and subscription accounting

os usage capture reads only the current identified Codex session, or OS_USAGE_FILE for a native export. It requires a claimed task. Capture runs at checkpoint and end. os usage import HARNESS FILE --task TASK --session SESSION supports codex, claude-code, opencode, gemini-cli and normalized events. Use explicit --model, --provider, --surface, --role and --type when the source lacks attribution. A changing model remains attached to its own events. Configured native sources sync during refresh; local raw transcripts are never copied into the project.

Codex input is split into uncached and cached tokens. Claude/OpenCode cache reads and writes remain separate. Reasoning is counted separately only when the adapter reports it outside output. Cumulative counters become deltas and duplicate source events are reconciled. Inclusive parent observations exclude their children. Unknown categories remain null.

os usage rate FILE accepts JSON with id, model, provider, effective_from, optional effective_to, source_url and per_million token categories. Rates are user-supplied dated evidence; the OS has no bundled claim about current prices. Harness cost values are API-equivalent estimates. normalized imports may explicitly supply billed_cost when invoice evidence exists.

os usage subscription FILE accepts id, harness, start, end, paid_amount, project_share (0..1), and basis (tokens or api-equivalent). The project share is your explicit budget, never inferred from incomplete account visibility. Allocated plus unallocated amounts reconcile to the subscription payment. API-equivalent value is not what a subscription user was charged. Keep shared subscriptions in one nonoverlapping period. Free or unknown provider cost never proves a free invoice.

os usage source FILE registers a native export with id, file, harness and binding containing task and session. os usage report shows coverage and groups. Do not rank models from raw token price: compare the same work type and complexity and record human acceptance, retries and verification first. DeepSeek and T3 may be named as providers/control surfaces through normalized events; dedicated live adapters are capability-dependent.

## Work, context and skills

os context TASK --budget 4000 builds a bounded file packet; os map regenerates a cheap lexical file map; os locate QUERY finds paths and symbols. Maps carry content revisions, omit dependencies and archived development history, and do not claim to be semantic call graphs. Graphify remains an optional external experiment, not an installed runtime requirement.

Task testing metadata contains risk/behavior prose and testing.commands as arrays of executable and arguments. os verify-task TASK runs those commands without shell interpolation, recording exit codes, bounded output and source fingerprints. No command is inferred from model prose. Missing checks report not-run.

os skills for-task TASK resolves names. resolve NAME returns path/hash. record NAME --task TASK --reason "why" captures invocation evidence. pin NAME --source URL --revision REF --license ID records reviewed provenance; installation itself uses the environment's skill installer. Never silently download or execute an unreviewed skill.

os work assess TASK reads its parallel contract. dispatch TASK WORKER --harness EXE checks availability, interview readiness and ownership, then prepares an isolated Git worktree at the committed base. Start the returned prompt in the harness. Workers return a committed revision, verification and changed paths through work result FILE. work integrate WORKER cherry-picks a validated result into a clean coordinator tree; conflicts require normal Git recovery. Run verification after integration. The dispatcher does not pretend that creating a worktree launches an agent.

## Reviews and release

os review prepare TASK produces a read-only packet bound to the current diff and verification. Supply it to an authorized manual, Gemini, Greptile or frontier reviewer. os review import FILE validates packet_id, snapshot and structured findings. Changed code makes old results stale. Preparing a packet makes no network call or paid request. Human PR review and release acceptance remain separate.

Release progress uses approved scope and weights against frozen baselines. One hundred percent weighted delivery is insufficient while exit criteria are pending. os rc assess/validate manages evidence; os migrate inspect/plan/apply/verify handles explicit project-data migration. Machinery updates never approve a release or silently migrate product data.

## Distribution and maintenance

scaffold-project.sh TARGET --ref COMMIT --profile core|frontend exports the selected commit into an independent repository. Source development history, tests and probes are excluded. A destination cannot contain or be inside the source repository.

update-from-template.sh --from SOURCE --ref COMMIT --dry-run prints per-file actions. Apply without --dry-run after reviewing them. Updates replace or retire files only when the last distribution hash matches local content. Customized files and unknown baselines are preserved for merging. README and custom docs/skills therefore survive. yaml compatibility is checked before writes; the updater installs no packages. Append-only distribution receipts provide retirement provenance. Keep the Git diff for recovery; a filesystem write failure can require reverting a partial update.

For OS development run npm test. Product projects plan their own tests; template-only fixtures do not ship. The optional frontend pack owns design skills and lanes. Archive records document history and carry no active instructions.

Review wrappers can be registered with os review configure FILE. The JSON supplies id, command (argv), mode read-only, authorization evidence, optional model and max_cost_usd. os review run PACKET --provider ID sends the packet on stdin and imports structured findings from stdout. The wrapper must enforce read-only access and its cost cap; the OS detects repository modifications after the call but cannot undo external side effects. Provider failure records no successful review. Native Gemini/Greptile/frontier access remains unavailable until its authorized wrapper is configured and tested.

os usage outcome FILE records task, work_type, complexity, acceptance, retries and evidence. Comparisons group similar work and disclose mixed models; neither passing tests nor a model reviewer fabricates human acceptance. Budget amounts and actual payments are separate, and subscription periods do not renew automatically. --account on a usage binding distinguishes subscriptions sharing a harness.
