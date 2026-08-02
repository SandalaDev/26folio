#!/usr/bin/env bash
# scripts/branch.sh — the branch model mechanics, flow-aware.
# Subcommands: start <EPIC> [SLICE] | base | guard | sync-dev | cleanup <branch> | promote
#
# FLOW: state.flow selects the model.
#   github (default) — feature branches cut off main and PR back to main (GitHub Flow).
#   trunk-dev        — the legacy three-branch model: feature -> dev -> main (promote).
# Read from state.json so branch.sh and os pr agree on the integration base.
set -euo pipefail

MAIN="${MAIN_BRANCH:-main}"
DEV="${DEV_BRANCH:-dev}"
STATE="project-state/state.json"

cur() { git symbolic-ref --short -q HEAD 2>/dev/null || echo ""; }

# flow(): print "github" or "trunk-dev". Defaults to github if state missing/unreadable.
flow() {
  command -v node >/dev/null 2>&1 || { echo "github"; return; }
  local f; f="$(node -e 'try{process.stdout.write(require("./project-state/state.json").flow||"github")}catch{process.stdout.write("github")}' 2>/dev/null || echo github)"
  [[ "$f" == "trunk-dev" ]] && echo "trunk-dev" || echo "github"
}

# integration base: where feature branches PR back to. main in github flow, dev in trunk-dev.
ibase() {
  if [[ "$(flow)" == "trunk-dev" ]]; then echo "$DEV"; else echo "$MAIN"; fi
}

cmd_base() {
  # The integration base (comparison ref).
  # trunk-dev: dev for feature branches, main when promoting dev.
  # github:    main for feature branches (they cut off main).
  local b; b="$(cur)"
  if [[ "$b" == "$MAIN" ]]; then echo "$MAIN"
  elif [[ "$b" == "$DEV" ]]; then echo "$MAIN"
  elif [[ "$b" == feature/* ]]; then ibase
  else ibase; fi
}

cmd_guard() {
  # Refuse to operate from main/dev so the diff base can never be empty.
  local b; b="$(cur)"
  if [[ "$b" == "$MAIN" || "$b" == "$DEV" ]]; then
    echo "[branch] REFUSED: on '$b' — run 'branch.sh start EPIC-XXX' first." >&2
    exit 1
  fi
  echo "ok"
}

# sync_base: fetch + ff-only the integration base (main in github flow, dev in trunk-dev).
# Refuses if the local base is dirty (never auto-stash).
cmd_sync_base() {
  local base; base="$(ibase)"
  git fetch origin "$base" 2>/dev/null || true
  if [[ "$(cur)" == "$base" ]]; then
    git diff --quiet || { echo "[branch] local $base is dirty — commit or stash first." >&2; exit 1; }
    git pull --ff-only origin "$base" 2>/dev/null || echo "[branch] could not ff-only $base"
  fi
}

# legacy alias kept for callers that reference sync-dev directly.
cmd_sync_dev() { cmd_sync_base; }

cmd_start() {
  local name="$1"
  [[ -n "$name" ]] || { echo "Usage: branch.sh start EPIC-XXX [SLICE-Y]"; exit 2; }
  local slug="${2:+-$2}"
  local branch="feature/${name}${slug}"
  local base; base="$(ibase)"
  cmd_sync_base
  # Branch off the up-to-date integration base.
  if git show-ref --verify --quiet "refs/heads/$branch"; then
    git switch "$branch"
    echo "[branch] resumed existing $branch"
  else
    git switch -c "$branch" "origin/$base" 2>/dev/null || git switch -c "$branch" "$base"
    echo "[branch] created $branch off $base (flow: $(flow))"
  fi
}

cmd_cleanup() {
  local branch="$1"
  [[ -n "$branch" ]] || { echo "Usage: branch.sh cleanup <branch>"; exit 2; }
  # Refuse unless merged into the integration base (main or dev, per flow).
  local base; base="$(ibase)"
  if ! git merge-base --is-ancestor "$branch" "$base" 2>/dev/null; then
    echo "[branch] REFUSED: $branch not merged into $base." >&2; exit 1
  fi
  git branch -D "$branch"
  git push origin --delete "$branch" 2>/dev/null || true
  echo "[branch] cleaned up $branch"
}

cmd_promote() {
  cat <<EOF
[branch] dev -> main promotion checklist:
  1. Planned test tasks for this release are done (or consciously deferred).
  2. Every PR in range was reviewed manually (your process, outside the system).
  3. Tag the release on main.
Run: git switch main && git merge --no-ff dev && git tag vX.Y.Z
EOF
}

case "${1:-help}" in
  start)    shift; cmd_start "${1:-}" "${2:-}" ;;
  base)     cmd_base ;;
  guard)    cmd_guard ;;
  sync-dev) cmd_sync_dev ;;
  cleanup)  shift; cmd_cleanup "${1:-}" ;;
  promote)  cmd_promote ;;
  *) echo "Usage: bash scripts/branch.sh [start EPIC-XXX [SLICE] | base | guard | sync-dev | cleanup <branch> | promote]" ;;
esac
