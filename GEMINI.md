<!-- generated from AGENTS.md — do not edit; run scripts/sync-agent-files.sh -->

# AGENTS.md
## Operating law
The repository is the source of truth. Chats are scratchpads.
Do not make durable decisions that are not reflected in Markdown or code.
State is written in exactly one place: project-state/STATE.json.
Never hand-edit generated files (CURRENT_STATE.md, HANDOFF_QUEUE.md).

## Identity (set per harness so the dashboard can compare combos)
Export before working:
  HARNESS_NAME = claude-code | codex | opencode | cursor | warp | gemini-cli
  MODEL_NAME   = the actual model id (e.g. claude-opus-4-6, gpt-5-codex)
  AGENT_ROLE   = executor | reviewer | planner
os.sh records these into the session lock and SESSION_LEDGER.jsonl.

## Git workflow (three branches)
main = protected production. dev = integration. feature/EPIC-XXX = your workspace.
Never commit to main or dev. Branch off dev with:
  bash scripts/branch.sh start EPIC-XXX [SLICE-Y]
This syncs dev first (refuses if local dev is dirty, fetches origin, fast-forwards
if behind) so you branch from up-to-date code. One branch per epic (or epic-slice
for large epics). Push the feature branch; open a PR into dev. The pre-push hook
refuses pushes from main/dev. After a PR merges, the human runs:
  bash scripts/branch.sh cleanup feature/EPIC-XXX   (deletes merged branch)

## Session Start (every session, every agent)
Run: bash scripts/branch.sh start EPIC-XXX   (then)   bash scripts/os.sh start
This switches to the epic feature branch, reads STATE.json, renders the views,
loads assigned handoffs, and writes ACTIVE_SESSION.lock (tagged harness/model/role).
Then:
1. Identify current Epic → Slice → Task.
2. Read the task file, referenced slice plan and epic.
3. Read only the relevant Project Spine files.
4. Read required skill_refs from .agents/skills/<name>/SKILL.md.
5. Produce a short implementation checklist before editing code.

## Session End (every session, every agent)
Run: bash scripts/os.sh end
This runs verify-task.sh (diffing against dev), writes ONE STATE.json update,
renders all views, appends AGENT_LOG.md and a SESSION_LEDGER.jsonl line
(harness/model/role + gate result), creates required handoffs, and clears the lock.

## Scope
Edit only files listed in the task's files_allowed. The pre-push gate
rejects any diff that escapes that list.

## Skills
Skills are SKILL.md folders. Load only task skill_refs — never all skills.
For UI tasks the active design lane is Impeccable; frontend-design is fallback.
Do not run both as active authorities in one pass.
For landing pages/portfolios/redesigns, load design-taste-frontend first,
state the one-line design read, then let Impeccable implement.
Build UI with shadcn/ui primitives; check free/public 21st.dev before hand-rolling.

## Public-facing text
Before finalizing ANY public/client-facing text, run stop-slop and its scorer.
The verify gate RECOMPUTES the score and fails below 35/50 — do not self-report.
Then run ds-content-review. Do not ship un-de-slopped text.

## Testing
Every task declares verification_required matched to risk_level.
Do not add snapshots/mocks/fixtures unless they prove durable behavior.

## Handoffs
If handoff_required: true, use ds-handoff at session end.
Reference files by path — never copy artifact content into a handoff.

## Stop conditions (human approval required)
Stop before changing schema, auth, billing, secrets, infrastructure, or
legal/compliance copy. Protected paths require a human-signed approving commit
(CODEOWNERS) — not an agent-set boolean.
