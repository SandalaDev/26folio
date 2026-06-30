#!/usr/bin/env bash
# scripts/os.sh — single shell entry point for Solo Dev OS v6.1
# Works in any harness or a bare terminal. No package manager assumed.
# Subcommands: start | end | check | render | rotate-log | migrate-v61
set -euo pipefail

STATE="project-state/STATE.json"
LOCK="project-state/ACTIVE_SESSION.lock"
LEDGER="project-state/SESSION_LEDGER.jsonl"
# Structured actor identity — set these per harness so the dashboard can compare
# harness/model/role performance. HARNESS is the tool, MODEL the actual model id.
HARNESS="${HARNESS_NAME:-${AGENT_NAME:-unknown}}"
MODEL="${MODEL_NAME:-unknown}"
ROLE="${AGENT_ROLE:-executor}"        # executor | reviewer | planner
AGENT="${AGENT_NAME:-$HARNESS}"

have_node() { command -v node >/dev/null 2>&1; }

render() {
  if have_node; then
    node scripts/render-state.mjs
  else
    echo "[os] skip render (no node) — CI will render"
  fi
}

cmd_start() {
  [[ -f "$STATE" ]] || { echo "[os] missing $STATE — run bootstrap first"; exit 1; }
  # Crash recovery: a lock with no clean end means the last session aborted.
  if [[ -f "$LOCK" ]]; then
    echo "[os] Previous session did not end cleanly:"
    cat "$LOCK"
    echo "[os] Resume from the task above, or run 'os.sh end' to close it out."
  fi
  render
  bash scripts/branch.sh guard 2>/dev/null || echo "[os] warning: not on a feature branch — run branch.sh start EPIC-XXX"
  # Surface any open rework for the current task so the agent addresses it first.
  local curtask
  curtask="$(node -e 'try{process.stdout.write(require("./"+process.argv[1]).current.task||"")}catch(e){}' "$STATE" 2>/dev/null || true)"
  if [[ -n "$curtask" ]] && have_node && ! node scripts/rework.mjs status "$curtask" >/dev/null 2>&1; then
    echo "[os] OPEN REWORK on $curtask — address these before closing the task:"
    node scripts/rework.mjs list "$curtask" 2>/dev/null | sed 's/^/    /' || true
  fi
  printf 'started: %s\nharness: %s\nmodel: %s\nrole: %s\nbranch: %s\ntask: %s\n' \
    "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$HARNESS" "$MODEL" "$ROLE" \
    "$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo none)" \
    "$(node -e 'try{process.stdout.write(require("./"+process.argv[1]).current.task||"none")}catch(e){process.stdout.write("none")}' "$STATE" 2>/dev/null || echo none)" \
    > "$LOCK"
  echo "[os] session started as $HARNESS/$MODEL ($ROLE). Lock written. Identify Epic -> Slice -> Task."
}

cmd_end() {
  local task="${1:-${ACTIVE_TASK:-}}"
  local gate="skipped"
  if [[ -n "$task" ]]; then
    # Materialise any required handoff BEFORE the gate checks for its presence.
    # ds-handoff (the judgement layer) then enriches the generated prose blocks.
    if have_node && [[ -f "$task" ]] && \
       [[ "$(node scripts/read-fm.mjs "$task" handoff_required 2>/dev/null)" == "true" ]]; then
      node scripts/create-handoff.mjs "$task" || echo "[os] warning: create-handoff failed; gate will reject if file is missing"
    fi
    if bash scripts/verify-task.sh "$task"; then gate="pass"; else gate="fail"; fi
  else
    echo "[os] no task supplied; running state check only"
    cmd_check || true
  fi
  render
  # Append one ledger line per session — the raw data for harness/model metrics.
  # gate result is externally computed ground truth, not self-reported.
  local started branch
  started="$(grep '^started:' "$LOCK" 2>/dev/null | cut -d' ' -f2- || echo '')"
  branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo none)"
  printf '{"ended":"%s","started":"%s","harness":"%s","model":"%s","role":"%s","task":"%s","branch":"%s","gate":"%s"}\n' \
    "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$started" "$HARNESS" "$MODEL" "$ROLE" "${task:-none}" "$branch" "$gate" \
    >> "$LEDGER"
  cmd_rotate_log || true
  rm -f "$LOCK"
  if [[ "$gate" == "fail" ]]; then
    echo "[os] session recorded but gate FAILED — fix the reported rule before pushing."
    exit 1
  fi
  echo "[os] session ended as $HARNESS/$MODEL ($ROLE). STATE.json canonical; views regenerated; ledger appended."
}

cmd_check() {
  have_node || { echo "[os] check needs node"; exit 0; }
  node scripts/render-state.mjs --check
}

cmd_render() { render; }

cmd_rotate_log() {
  local log="project-state/AGENT_LOG.md"
  [[ -f "$log" ]] || return 0
  # Rotate if over ~2000 lines.
  local lines; lines=$(wc -l < "$log" | tr -d ' ')
  if [[ "${lines:-0}" -gt 2000 ]]; then
    local ym; ym=$(date -u +%Y-%m)
    mkdir -p memory/agent-log
    cp "$log" "memory/agent-log/${ym}.md"
    printf '# Agent Log\n(see memory/agent-log/ for archived months)\n' > "$log"
    echo "[os] rotated AGENT_LOG.md -> memory/agent-log/${ym}.md"
  fi
}

cmd_migrate_v61() {
  local old="project-state/BUILD_DASHBOARD.json"
  if [[ -f "$old" && ! -f "$STATE" ]]; then
    git mv "$old" "$STATE" 2>/dev/null || mv "$old" "$STATE"
    echo "[os] migrated BUILD_DASHBOARD.json -> STATE.json. Review the schema field."
  else
    echo "[os] nothing to migrate."
  fi
}

case "${1:-help}" in
  start)       cmd_start ;;
  end)         shift; cmd_end "${1:-}" ;;
  check)       cmd_check ;;
  render)      cmd_render ;;
  rotate-log)  cmd_rotate_log ;;
  migrate-v61) cmd_migrate_v61 ;;
  *) echo "Usage: bash scripts/os.sh [start|end <task>|check|render|rotate-log|migrate-v61]" ;;
esac
