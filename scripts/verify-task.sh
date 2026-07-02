#!/usr/bin/env bash
# scripts/verify-task.sh — the fail-closed quality gate for Solo Dev OS v6.1
# Replaces `pnpm os:verify-task`. Pure shell spine; Node-backed checks degrade
# to declared skips locally and are re-enforced in CI.
set -euo pipefail

TASK="${1:-${ACTIVE_TASK:-}}"
[[ -n "$TASK" && -f "$TASK" ]] || { echo "Usage: bash scripts/verify-task.sh backlog/tasks/TASK-XXX.md"; exit 2; }

# Base resolves to dev for feature branches, main when promoting dev (see branch.sh).
BASE="${BASE_REF:-$(bash scripts/branch.sh base 2>/dev/null || echo main)}"
FAIL=0

# Feature work must not run from main/dev — that would make BASE...HEAD empty
# and the scope / protected / slop diffs would vacuously pass.
if [[ -z "${BASE_REF:-}" ]]; then
  bash scripts/branch.sh guard || FAIL=1
fi
have_node() { command -v node >/dev/null 2>&1; }
fm() { node scripts/read-fm.mjs "$TASK" "$1" 2>/dev/null || true; }   # reads one frontmatter field via real YAML

section() { echo; echo "── $1"; }

# 1) Task metadata (real YAML validation)
section "task metadata"
if have_node; then node scripts/validate-task.mjs "$TASK" || FAIL=1; else echo "skip (no node) — enforced in CI"; fi

# 2) Skill registry present on disk
section "skill registry"
bash scripts/skills.sh validate || FAIL=1

# 3) Scope — diff must stay inside files_allowed
# The diff is cumulative (BASE...HEAD covers the whole feature branch), but one
# epic branch carries several tasks. Checking that cumulative diff against a
# single task's files_allowed false-flags every *other* task's files. So the
# allowed set is the UNION of files_allowed across the current task plus every
# task referenced in the branch's commit messages.
section "scope (files_allowed)"
CHANGED="$(git diff --name-only "$BASE"...HEAD 2>/dev/null || git diff --name-only || true)"
if have_node && [[ -n "$CHANGED" ]]; then
  branch_task_files() {
    printf '%s\n' "$TASK"
    git log --format=%s "$BASE"..HEAD 2>/dev/null | grep -oE 'TASK-[0-9]+' | sort -u | while IFS= read -r id; do
      for d in backlog/tasks backlog/done; do [[ -f "$d/$id.md" ]] && echo "$d/$id.md"; done
    done
  }
  ALLOWED="$(branch_task_files | sort -u | while IFS= read -r tf; do
    node scripts/read-fm.mjs "$tf" files_allowed --list 2>/dev/null; done | sort -u)"
  # OS-managed paths are written by os.sh/render/create-handoff, not by task
  # implementation, so they are never listed in files_allowed. Exclude them so
  # the scope gate judges real code/content, not the OS's own bookkeeping.
  OS_MANAGED='^(project-state/|handoffs/|memory/|backlog/done/|backlog/epics/|CLAUDE\.md$)'
  if [[ -n "$ALLOWED" ]]; then
    while IFS= read -r f; do
      [[ -z "$f" ]] && continue
      [[ "$f" =~ $OS_MANAGED ]] && continue
      ok=0
      while IFS= read -r a; do [[ -n "$a" && "$f" == $a* ]] && ok=1; done <<< "$ALLOWED"
      if [[ "$ok" -eq 0 ]]; then echo "  SCOPE ESCAPE: $f not in files_allowed"; FAIL=1; fi
    done <<< "$CHANGED"
    [[ "$FAIL" -eq 0 ]] && echo "  all changed files are allowed"
  else
    echo "  WARNING: task declares no files_allowed; cannot enforce scope"
  fi
else
  echo "  skip (no node or no diff)"
fi

# 4) Risk-matched proof — run only declared levels
section "risk-matched proof"
run_if() { # field, label, command...
  local want; want="$(fm "$1")"
  if [[ "$want" == "true" ]]; then
    echo "  run: $2"; shift 2; "$@" || FAIL=1
  else
    echo "  skip (per task): $2"
  fi
}
# Stack-agnostic dispatch: prefer scripts/test/*.sh if present, else npm script if available.
proof() { local s="scripts/test/$1.sh"; if [[ -x "$s" ]]; then bash "$s"; elif command -v npm >/dev/null 2>&1; then npm run -s "$2" 2>/dev/null || true; else echo "   (no runner for $1)"; fi; }
# Proof levels live under the `verification_required:` map in task frontmatter,
# so they must be read by dot-path — a bare `lint` reads a (nonexistent)
# top-level key and skips every check.
run_if "verification_required.lint"        "lint"        proof lint        lint
run_if "verification_required.typecheck"   "typecheck"   proof typecheck   typecheck
run_if "verification_required.unit"        "unit"        proof unit        test:unit
run_if "verification_required.integration" "integration" proof integration test:integration
run_if "verification_required.e2e"         "e2e"         proof e2e         test:e2e
run_if "verification_required.accessibility" "a11y"      proof a11y        test:a11y

# 5) Public-text slop gate — score recomputed independently
section "stop-slop (public text)"
if [[ "$(fm public_text)" == "true" ]]; then
  if have_node; then
    # Score only rendered-app sources (src/). Same over-breadth family as the
    # scope check's OS_MANAGED exclusion: planning docs, task files, and the
    # spine are internal, and the GENERATED views (CURRENT_STATE.md) emit
    # typographic dashes as null placeholders by design — scoring them made
    # every public_text push fail on files no reader ever sees.
    PUBLIC_CHANGED="$(printf '%s\n' "$CHANGED" | grep -E '^src/' || true)"
    if [[ -n "$PUBLIC_CHANGED" ]]; then
      node .agents/skills/stop-slop/score.mjs --verify "$PUBLIC_CHANGED" || { echo "  SLOP GATE FAILED"; FAIL=1; }
    else
      echo "  no changed public-surface files (src/) — n/a"
    fi
  else
    echo "  skip (no node) — enforced in CI"
  fi
else
  echo "  not public text — n/a"
fi

# 6) Protected paths — approval from CODEOWNERS + signed commit, not a boolean
section "protected paths"
bash scripts/check-protected-files.sh "$BASE" || FAIL=1

# 7) Handoff presence
section "handoff presence"
if [[ "$(fm handoff_required)" == "true" ]]; then
  HF="$(fm handoff_file)"
  if [[ -n "$HF" && -f "$HF" ]]; then echo "  present: $HF";
  else echo "  FAIL: handoff_required but file missing ($HF). Run create-handoff.mjs."; FAIL=1; fi
else
  echo "  not required"
fi

# 8) Open rework — feedback must be resolved before the task can close
section "rework"
if have_node; then
  if node scripts/rework.mjs status "$(fm id)" >/dev/null 2>&1; then
    echo "  no open rework items"
  else
    echo "  FAIL: open rework items for this task. Resolve them, then 'rework.sh close'."
    node scripts/rework.mjs list "$(fm id)" 2>/dev/null | sed 's/^/    /' || true
    FAIL=1
  fi
else
  echo "  skip (no node)"
fi

# 9) State consistency
section "state consistency"
if have_node; then node scripts/render-state.mjs --check || FAIL=1; else echo "  skip (no node)"; fi

echo
if [[ "$FAIL" -ne 0 ]]; then
  echo "[verify-task] FAILED — see the section(s) above. Push rejected."
  exit 1
fi
echo "[verify-task] all gates pass."
