#!/usr/bin/env bash
# scripts/os.sh — the single entry point for agent-os.
# Subcommands: start | end | checkpoint | check | status | render | claim | release | decide | context | deps | pr | sync | doctor
#
# DESIGN PRINCIPLES:
#  - NON-BLOCKING: the OS manages memory, state, and context. It does not gate
#    quality — tests are planned work (see the Testing methodology in the
#    manual), and reviews happen manually after the PR, outside the system.
#    A push is never blocked except a direct push to a trunk branch.
#  - Crash recovery preserves the stale lock (moves it aside), surfaces it, and
#    REQUIRES a decision. It never silently overwrites a journal.
#  - Crashed sessions are logged to the ledger with status:crashed + duration-run,
#    so failures become data instead of vanishing.
#  - The lock is a JOURNAL (in-flight state), not just a marker.
#  - AGENT_LOG.md is written at end/checkpoint; decisions.md is append-only and
#    written explicitly via `os decide` (it's advertised as L0 memory, so it must
#    have a real writer — never a dead var).
set -euo pipefail

# Always operate from the repo root, so the script works no matter which directory
# it's invoked from. Resolve via git (authoritative); fall back to the directory
# containing this script if not in a git repo. This fixes the "doubled
# scripts/scripts/" path error when run from inside scripts/.
__root="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "$__root" ]]; then
  __root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
fi
cd "$__root"

STATE="project-state/state.json"
LOCK="project-state/session.lock"
LEDGER="project-state/ledger.jsonl"
DECISIONS="project-state/decisions.md"
AGENT_LOG="project-state/AGENT_LOG.md"
USAGE=".session-usage.json"

have_node() { command -v node >/dev/null 2>&1; }

# ── Identity: derive harness/model/role, warn LOUDLY if unset ──────────────
derive_identity() {
  local h="${HARNESS_NAME:-${AGENT_NAME:-}}"
  # Auto-detect common harnesses from their telltale env vars when not declared.
  if [[ -z "$h" ]]; then
    if   [[ -n "${CLAUDECODE:-}${CLAUDE_CODE:-}" ]]; then h="claude-code"
    elif [[ -n "${CODEX_ENVIRONMENT:-}" ]];          then h="codex"
    elif [[ -n "${ZCODE:-}" ]];                      then h="zcode"
    elif [[ -n "${GEMINI_CLI:-}" ]];                 then h="gemini-cli"
    elif [[ -n "${CURSOR_TRACE_ID:-}" ]];            then h="cursor"
    elif [[ -n "${OPENCODE:-}" ]];                   then h="opencode"
    fi
  fi
  HARNESS="$h"
  MODEL="${MODEL_NAME:-unknown}"
  ROLE="${AGENT_ROLE:-executor}"
  # Identity is optional: auto-detected harness, honest "unknown" otherwise.
  # One quiet info line — never a loud warning; attribution must not add friction.
  if [[ -z "$HARNESS" ]]; then
    HARNESS="unknown"
    echo "[os] identity: harness unknown (optionally export HARNESS_NAME/MODEL_NAME for dashboard attribution)"
  fi
}

render() {
  if have_node; then node scripts/render-state.mjs
  else echo "[os] skip render (no node) — CI will render"; fi
}

# Read a scalar from state.json via node (single source of truth).
state_get() { node -e 'try{process.stdout.write(String(require("./"+process.argv[1]).current.task||""))}catch(e){process.stdout.write("")}' "$STATE" 2>/dev/null || true; }

# Read state.current.epic (for branch/epic alignment check).
state_epic() { node -e 'try{process.stdout.write(String(require("./project-state/state.json").current.epic||""))}catch(e){process.stdout.write("")}' 2>/dev/null || true; }

# Branch/epic alignment: branches are feature/EPIC-XXX[-slice]. Derive the epic
# token (EPIC-NNN) from the branch name and warn (not fail) if state.current.epic
# doesn't match — reduces the trust-the-agent surface by surfacing a mismatch
# instead of silently trusting a stale claim. Warn-only: a task can legitimately
# span branches.
check_epic_alignment() {
  local branch="$1"
  [[ "$branch" == feature/* ]] || return 0
  local rest="${branch#feature/}"
  # Match EPIC-<digits> at the start of the branch slug (e.g. EPIC-001, EPIC-001-slice).
  local bepic="$(printf '%s' "$rest" | grep -oE '^EPIC-[0-9]+' || true)"
  [[ -n "$bepic" ]] || return 0   # only when the branch actually carries an epic
  local sepic; sepic="$(state_epic)"
  if [[ -n "$sepic" && "$sepic" != "$bepic" ]]; then
    echo "[os] ⚠ epic mismatch: branch is '$bepic' but state.current.epic is '$sepic'." >&2
    echo "[os]   run 'os claim <TASK>' (current.epic is derived from the claimed task's epic_ref) if this branch is for a different epic." >&2
  fi
}

# ── start ──────────────────────────────────────────────────────────────────
cmd_start() {
  [[ -f "$STATE" ]] || { echo "[os] missing $STATE — run bootstrap first"; exit 1; }

  # Crash recovery: a stale lock means the previous session never ended cleanly.
  # PRESERVE it (never overwrite), surface it, and require a decision.
  if [[ -f "$LOCK" ]]; then
    local ts; ts="$(date -u +%Y%m%dT%H%M%SZ)"
    local crashed="project-state/session.lock.crashed-${ts}"
    mv "$LOCK" "$crashed"
    echo "[os] ⚠ PREVIOUS SESSION DID NOT END CLEANLY."
    echo "[os]   journal preserved at: $crashed"
    echo "[os]   ── contents ──"
    sed 's/^/      /' "$crashed"
    echo "[os]   ─────────────"
    echo "[os] The crashed session has been logged with status:crashed."
    log_crashed "$crashed" || true
    # If the dead agent left a usage drop-file, fold it into the crashed row,
    # then clear it so it can't leak into the recovered session's ledger line.
    if [[ -f "$USAGE" ]]; then rm -f "$USAGE"; fi
    echo "[os] Recover by reading the journal above, or start fresh below."
  fi

  derive_identity
  bash scripts/branch.sh guard 2>/dev/null || echo "[os] warning: not on a feature branch — run branch.sh start EPIC-XXX"

  local curtask; curtask="$(state_get)"

  # Write a REAL journal: identity + branch + task + recoverable fields.
  local branch; branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo none)"
  check_epic_alignment "$branch"
  write_lock "$branch" "$curtask" "" ""
  # Render after the lock exists so the dashboard reports the open session.
  render
  echo "[os] session started as ${HARNESS}/${MODEL} (${ROLE})."
  echo "[os] Run 'os checkpoint \"next step\"' before risky edits so a crash is recoverable."
}

# write_lock <branch> <task> <next_step> <files_touched>
write_lock() {
  local branch="$1" task="$2" next_step="${3:-}" files="${4:-}"
  printf 'started: %s\nharness: %s\nmodel: %s\nrole: %s\nbranch: %s\ntask: %s\nnext_step: %s\nlast_verification: %s\nfiles_touched: %s\n' \
    "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$HARNESS" "$MODEL" "$ROLE" \
    "$branch" "$task" "$next_step" "unknown" "$files" > "$LOCK"
}

# ── checkpoint: update the journal's in-flight state so a crash is recoverable ──
cmd_checkpoint() {
  local next_step="${1:-}"
  if [[ ! -f "$LOCK" ]]; then echo "[os] no active session — run 'os start' first."; exit 1; fi
  derive_identity
  local branch task files
  branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo none)"
  task="$(state_get)"
  # Auto-derive touched files from the diff vs base (best-effort).
  files="$(git diff --name-only 2>/dev/null | tr '\n' ' ' || echo '')"
  write_lock "$branch" "$task" "$next_step" "$files"
  # Append a progress line to AGENT_LOG.md so checkpoints are durable even mid-session.
  append_log "checkpoint" "$task" "$next_step" "" || true
  echo "[os] checkpoint saved. next_step='$next_step' files='${files:-none}'"
}

# ── end: sanity check (non-blocking), ONE state update, ledger, log, handoffs, clear lock ──
cmd_end() {
  local task="${1:-${ACTIVE_TASK:-}}"
  local check="ok"
  if [[ -n "$task" ]]; then
    # Materialise a declared handoff (session/task continuity — optional).
    if have_node && [[ -f "$task" ]] && [[ -f "scripts/create-handoff.mjs" ]] \
       && [[ "$(node scripts/read-fm.mjs "$task" handoff_required 2>/dev/null)" == "true" ]]; then
      node scripts/create-handoff.mjs "$task" || echo "[os] warning: create-handoff failed — create it by hand if you need the continuity note"
    fi
    # Sanity check is ADVISORY: report problems, never block ending the session.
    if [[ -f "scripts/verify.sh" ]]; then
      bash scripts/verify.sh "$task" || { check="warn"; echo "[os] sanity check reported issues (see above) — session still ends; fix when convenient."; }
    fi
  else
    cmd_check || check="warn"
  fi

  derive_identity

  local started branch
  started="$(grep '^started:' "$LOCK" 2>/dev/null | cut -d' ' -f2- || echo '')"
  branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo none)"
  local usage_json; usage_json="$(read_usage)"
  append_ledger "completed" "$started" "$branch" "$task" "$check" "$usage_json"
  append_log "end" "$task" "" "$check" || true
  rm -f "$LOCK" "$USAGE"

  # Clear the claim for the finished task so a stale pointer doesn't linger.
  if [[ -n "$task" && "$task" != "none" ]] && have_node; then
    local cid="$task"; [[ "$task" == */* ]] && cid="$(basename "$task" .md)"
    local claimed; claimed="$(node -e 'try{const s=require("./project-state/state.json");process.stdout.write(s.current&&s.current.task||"")}catch{}' 2>/dev/null || true)"
    if [[ "$claimed" == "$cid" ]]; then
      node scripts/update-state.mjs clear-task >/dev/null 2>&1 || true
    fi
  fi

  # Render last: ledger, lock removal, and claim release must already be visible.
  render

  echo "[os] session ended as ${HARNESS}/${MODEL} (${ROLE}). state.json canonical; views regenerated; ledger appended."
}

# ── log a crashed session: closes out the dead session with duration it DID run ──
log_crashed() {
  local crashed="$1"
  local started harness model role branch task
  started="$(grep '^started:' "$crashed" 2>/dev/null | cut -d' ' -f2- || echo '')"
  harness="$(grep '^harness:' "$crashed" 2>/dev/null | cut -d' ' -f2- || echo unknown)"
  model="$(grep '^model:' "$crashed" 2>/dev/null | cut -d' ' -f2- || echo unknown)"
  role="$(grep '^role:' "$crashed" 2>/dev/null | cut -d' ' -f2- || echo executor)"
  branch="$(grep '^branch:' "$crashed" 2>/dev/null | cut -d' ' -f2- || echo none)"
  task="$(grep '^task:' "$crashed" 2>/dev/null | cut -d' ' -f2- || echo none)"
  # Fold in the dead session's usage drop-file if it survived the crash.
  local usage; usage="$(read_usage)"
  append_ledger_raw "crashed" "$started" "$harness" "$model" "$role" "$branch" "$task" "skipped" "$usage"
  append_log "crashed" "$task" "$(grep '^next_step:' "$crashed" 2>/dev/null | cut -d' ' -f2-)" "skipped" || true
}

# read_usage: parse the .session-usage.json drop-file -> inline JSON fields, or
# an explicit "unknown" set if absent/invalid. Delegates to read-usage.mjs to
# avoid fragile inline-node shell-escaping.
read_usage() {
  have_node || { echo '"tokens_in":"unknown","tokens_out":"unknown","cost_usd":"unknown",'; return; }
  node scripts/read-usage.mjs 2>/dev/null || echo '"tokens_in":"unknown","tokens_out":"unknown","cost_usd":"unknown",'
}

# append_ledger <status> <started> <branch> <task> <gate> <usageFieldsJson>
append_ledger() {
  append_ledger_raw "$1" "$2" "$HARNESS" "$MODEL" "$ROLE" "$3" "${4:-none}" "$5" "$6"
}

# append_ledger_raw <status> <started> <h> <m> <r> <branch> <task> <gate> <usageFieldsJson>
append_ledger_raw() {
  local status="$1" started="$2" h="$3" m="$4" r="$5" branch="$6" task="$7" gate="$8" usage="$9"
  printf '{"started":%s,"ended":"%s","harness":"%s","model":"%s","role":"%s","branch":"%s","task":"%s","gate":"%s","status":"%s",%s"duration_min":%s}\n' \
    "$(json_str "$started")" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$h" "$m" "$r" "$branch" "$task" "$gate" "$status" \
    "$usage" "$(duration_min "$started")" >> "$LEDGER"
}

# duration_min <startedISO> -> integer minutes, or "unknown"
duration_min() {
  local s="$1"
  [[ -z "$s" ]] && { echo "unknown"; return; }
  have_node || { echo "unknown"; return; }
  node -e '
    const s=new Date(process.argv[1]); const e=new Date();
    const m=(e-s)/60000;
    process.stdout.write(Number.isFinite(m)&&m>=0?String(Math.round(m)):"unknown");
  ' "$s" 2>/dev/null || echo "unknown"
}

# json_str <raw> -> a JSON-safe quoted string, or null if empty
json_str() {
  local v="$1"
  [[ -z "$v" ]] && { echo "null"; return; }
  node -e 'process.stdout.write(JSON.stringify(process.argv[1]))' "$v" 2>/dev/null || echo "null"
}

# append_log <event> <task> <detail> <gate> -> appends a structured line to AGENT_LOG.md
append_log() {
  local event="$1" task="${2:-none}" detail="${3:-}" gate="${4:-}"
  local ts; ts="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  [[ -f "$AGENT_LOG" ]] || printf '# Agent Log\n<!-- append-only audit trail; one line per session event -->\n' > "$AGENT_LOG"
  if [[ -n "$detail" ]]; then
    printf -- '- %s | %s/%s | %s | task=%s | gate=%s | %s\n' \
      "$ts" "${HARNESS:-?}" "${MODEL:-?}" "$event" "$task" "$gate" "$detail" >> "$AGENT_LOG"
  else
    printf -- '- %s | %s/%s | %s | task=%s | gate=%s\n' \
      "$ts" "${HARNESS:-?}" "${MODEL:-?}" "$event" "$task" "$gate" >> "$AGENT_LOG"
  fi
}

# ── check: state consistency probe (the human's status command) ────────────
cmd_check() {
  have_node || { echo "[os] check needs node"; exit 0; }
  node scripts/render-state.mjs --check
}

cmd_status() {
  echo "=== agent-os status ==="
  if [[ -f "$LOCK" ]]; then
    echo "session: ACTIVE"; sed 's/^/  /' "$LOCK"
  else echo "session: none"; fi
  echo "---"
  cmd_check || true
}

cmd_render() { render; }

# ── doctor: system health check (catches environment + self-drift) ───────────
# Runs deps/identity/hooks/sanity checks plus self-drift: asserts advertised
# subcommands actually exist in the case dispatch, and that referenced memory
# files (decisions.md) have a writer. Exits 1 on any issue; each failure names
# the one fix. The OS is its own first user — this applies its doctrine to itself.
cmd_doctor() {
  have_node || { echo "[os] doctor needs node"; exit 1; }
  node scripts/doctor.mjs
}

# ── context: print the bounded session briefing (the highest-leverage Phase 1 change)
# Leads with the charter's north star so intent re-enters every loop, then layers
# in current state. Bounded to ~3 KB so it actually gets read. Delegates assembly
# to context.mjs (cleaner than inline bash for text shaping + truncation).
cmd_context() {
  have_node || { echo "[os] context needs node"; exit 1; }
  node scripts/context.mjs
}

# ── claim <TASK>: set state.current.task ────────────────────────────────────
# Claiming attributes the session's work to a task (state, views, ledger).
# It is explicit and validated: the task file must exist. Branch is recorded
# best-effort; identity is derived so the active agent is attributed.
cmd_claim() {
  local task="${1:-}"
  [[ -n "$task" ]] || { echo "Usage: bash scripts/os.sh claim <TASK-XXX>"; exit 2; }
  have_node || { echo "[os] claim needs node (update-state.mjs)"; exit 1; }
  # Accept either a bare ID (TASK-001) or a path; resolve to the ID for state.
  local id="$task"
  if [[ "$task" == */* ]]; then id="$(basename "$task" .md)"; fi
  # The task file must exist somewhere under backlog/.
  local found=""
  for d in backlog/tasks backlog/done; do
    if [[ -f "$d/$id.md" ]]; then found="$d/$id.md"; break; fi
  done
  if [[ -z "$found" ]]; then
    echo "[os] claim: no task file for '$id' in backlog/tasks or backlog/done." >&2
    exit 1
  fi
  derive_identity
  local branch; branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo none)"
  node scripts/update-state.mjs set-current task "$id" || { echo "[os] claim failed."; exit 1; }
  node scripts/update-state.mjs set-current branch "$branch" >/dev/null || true
  node scripts/update-state.mjs set-current agent "${HARNESS}/${MODEL}" >/dev/null || true
  echo "[os] claimed $id (${found})."
  echo "[os] run 'os start' to open the session, 'os end $found' to close + clear."
}

# ── release: clear current.task/branch/agent (e.g. after a merged task) ───────
cmd_release() {
  have_node || { echo "[os] release needs node"; exit 1; }
  node scripts/update-state.mjs clear-task || { echo "[os] release failed."; exit 1; }
  echo "[os] released task."
}

# ── decide: append an ADR entry to decisions.md (the L0 memory writer)
# decisions.md is advertised across the docs as append-only ADR-lite memory and
# ships with a defined format, but nothing ever wrote it — a dead reference.
# This is its writer, appending in the documented format:
#   ## YYYY-MM-DD — <title>
#   context: ...    decision: ...    alternatives: ...
# Creates the file with its canonical header on first use.
#
# Usage:
#   os decide --title "<short title>" --context "<why>" --decision "<what>" [--alternatives "<rejected, why>"]
cmd_decide() {
  local title="" context="" decision="" alternatives=""
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --title)        title="$2"; shift 2 ;;
      --context)      context="$2"; shift 2 ;;
      --decision)     decision="$2"; shift 2 ;;
      --alternatives) alternatives="$2"; shift 2 ;;
      *) echo "[os] decide: unknown arg '$1'"; echo "Usage: os decide --title <t> --context <c> --decision <d> [--alternatives <a>]"; exit 2 ;;
    esac
  done
  if [[ -z "$title" || -z "$context" || -z "$decision" ]]; then
    echo "Usage: bash scripts/os.sh decide --title <t> --context <c> --decision <d> [--alternatives <a>]"
    exit 2
  fi
  if [[ ! -f "$DECISIONS" ]]; then
    printf '# Decisions\n\nAn append-only ADR-lite log. The highest-value long-term memory: decisions and their rationale, captured once and never re-litigated. Append via `os decide` or by hand; never rewrite history.\n\n' > "$DECISIONS"
  fi
  local date; date="$(date -u +%Y-%m-%d)"
  {
    printf '## %s — %s\n' "$date" "$title"
    printf 'context: %s\n' "$context"
    printf 'decision: %s\n' "$decision"
    [[ -n "$alternatives" ]] && printf 'alternatives: %s\n' "$alternatives"
    printf '\n'
  } >> "$DECISIONS"
  echo "[os] recorded decision '## $date — $title' in $DECISIONS."
}

# ── pr [title]: open a PR into the integration base via gh ───────────────────
# Uses the flow-aware base (main in github flow, dev in trunk-dev) so the PR
# targets the right trunk without the human remembering which model is active.
# Optional: --body "..." to set the PR body; --draft for a draft PR.
cmd_pr() {
  command -v gh >/dev/null 2>&1 || { echo "[os] pr needs the gh CLI installed"; exit 1; }
  local title="" body="" draft=0
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --body) body="$2"; shift 2 ;;
      --draft) draft=1; shift ;;
      *) [[ -z "$title" ]] && title="$1" || { echo "[os] pr: unexpected arg '$1'"; exit 2; }; shift ;;
    esac
  done
  local branch; branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '')"
  [[ -n "$branch" && "$branch" != "main" && "$branch" != "dev" ]] \
    || { echo "[os] pr: on '$branch' — run from a feature branch (branch.sh start <EPIC>)."; exit 1; }
  [[ -n "$title" ]] || title="merge ${branch}"
  local base; base="$(bash scripts/branch.sh base 2>/dev/null || echo main)"
  local args=(gh pr create --base "$base" --head "$branch" --title "$title")
  [[ -n "$body" ]] && args+=(--body "$body")
  [[ "$draft" -eq 1 ]] && args+=(--draft)
  echo "[os] opening PR: ${branch} -> ${base}"
  "${args[@]}"
}

# ── sync: merge the current branch's PR (squash) + clean up the branch ────────
# Wraps gh pr merge + branch.sh cleanup so the post-merge flow is one command.
# Refuses if the PR isn't merged or the branch isn't yet merged into the base.
cmd_sync() {
  command -v gh >/dev/null 2>&1 || { echo "[os] sync needs the gh CLI installed"; exit 1; }
  local branch; branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '')"
  [[ -n "$branch" && "$branch" != "main" && "$branch" != "dev" ]] \
    || { echo "[os] sync: on '$branch' — run from a feature branch."; exit 1; }
  local base; base="$(bash scripts/branch.sh base 2>/dev/null || echo main)"
  echo "[os] merging PR for ${branch} into ${base} (squash)..."
  gh pr merge --squash --delete-branch 2>&1 || { echo "[os] gh merge failed (merge it in the UI, then re-run 'os sync' or 'branch.sh cleanup')."; exit 1; }
  git switch "$base" 2>/dev/null
  git pull --ff-only origin "$base" 2>/dev/null || true
  # branch.sh cleanup refuses unless merged; safe no-op if gh already deleted it.
  bash scripts/branch.sh cleanup "$branch" 2>/dev/null || true
  echo "[os] synced. Now on ${base}."
}

# ── deps: OpenSrc evidence planning before dependency installation ───────────
cmd_deps() {
  have_node || { echo "[os] deps needs node"; exit 1; }
  node scripts/deps.mjs "$@"
}

case "${1:-help}" in
  start)       cmd_start ;;
  end)         shift; cmd_end "${1:-}" ;;
  checkpoint)  shift; cmd_checkpoint "${*:-}" ;;
  claim)       shift; cmd_claim "${1:-}" ;;
  release)     cmd_release ;;
  decide)      shift; cmd_decide "$@" ;;
  context)     cmd_context ;;
  deps)        shift; cmd_deps "$@" ;;
  pr)          shift; cmd_pr "$@" ;;
  sync)        cmd_sync ;;
  check)       cmd_check ;;
  status)      cmd_status ;;
  render)      cmd_render ;;
  doctor)      cmd_doctor ;;
  *) echo "Usage: bash scripts/os.sh [start|end [task]|checkpoint \"next\"|claim <TASK>|release|decide|context|deps|pr|sync|check|status|render|doctor]" ;;
esac
