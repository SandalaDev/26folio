#!/usr/bin/env bash
# scripts/branch.sh — git workflow helper for the 3-branch model.
#   main  : protected production. Moves only via reviewed dev->main promotion.
#   dev   : integration. Feature branches merge here after gate + review.
#   feature/EPIC-XXX[-SLICE-Y] : agent workspace, branched off dev.
#
# Subcommands:
#   start <EPIC-XXX> [SLICE-Y]  sync dev (clean/fetch/pull) then branch off it
#   base                        print the branch this HEAD should diff against
#   guard                       fail if currently on main/dev (agents must not commit there)
#   sync-dev                    bring local dev up to date with origin (safe, no-op if dirty)
#   cleanup <branch|--current>  delete a merged feature branch (local + optionally remote)
#   promote                     print the checklist to promote dev -> main
set -euo pipefail

MAIN="${MAIN_BRANCH:-main}"
DEV="${DEV_BRANCH:-dev}"

current() { git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "DETACHED"; }
have_origin() { git remote get-url origin >/dev/null 2>&1; }

# Bring local dev into a known-good state before branching off it:
#   1. local dev must be clean (no uncommitted changes) — else refuse, don't stash.
#   2. fetch origin/dev.
#   3. if local dev is behind origin, fast-forward pull; never merge/rebase blindly.
# Returns non-zero only on a real problem (dirty tree, diverged history).
cmd_sync_dev() {
  have_origin || { echo "[branch] no origin remote — skipping dev sync (local only)"; return 0; }
  git fetch origin "$DEV" >/dev/null 2>&1 || { echo "[branch] could not fetch origin/$DEV"; return 1; }

  # Is the local dev branch dirty? Check the working tree only if we're on dev,
  # otherwise inspect dev without switching by comparing refs.
  local cur; cur="$(current)"
  if [[ "$cur" == "$DEV" ]]; then
    if [[ -n "$(git status --porcelain)" ]]; then
      echo "[branch] REFUSED: local $DEV has uncommitted changes. Commit or discard them before syncing."
      return 1
    fi
  fi

  # Compare local dev to origin/dev.
  local localref originref base
  localref="$(git rev-parse "$DEV" 2>/dev/null || echo '')"
  originref="$(git rev-parse "origin/$DEV" 2>/dev/null || echo '')"
  [[ -z "$localref" || -z "$originref" ]] && { echo "[branch] $DEV not fully set up; continuing"; return 0; }

  if [[ "$localref" == "$originref" ]]; then
    echo "[branch] $DEV is up to date with origin."
    return 0
  fi

  base="$(git merge-base "$DEV" "origin/$DEV" 2>/dev/null || echo '')"
  if [[ "$base" == "$localref" ]]; then
    # local dev is strictly behind origin → fast-forward it.
    if [[ "$cur" == "$DEV" ]]; then
      git pull --ff-only origin "$DEV" >/dev/null 2>&1 && echo "[branch] fast-forwarded $DEV to origin."
    else
      git fetch origin "$DEV:$DEV" >/dev/null 2>&1 && echo "[branch] fast-forwarded $DEV to origin (without switching)."
    fi
    return 0
  elif [[ "$base" == "$originref" ]]; then
    echo "[branch] local $DEV is AHEAD of origin (unpushed commits) — leaving as is."
    return 0
  else
    echo "[branch] WARNING: local $DEV and origin/$DEV have DIVERGED. Resolve manually before branching."
    return 1
  fi
}

cmd_start() {
  local epic="${1:-}" slice="${2:-}"
  [[ -n "$epic" ]] || { echo "Usage: branch.sh start EPIC-XXX [SLICE-Y]"; exit 2; }
  local name="feature/${epic}"
  [[ -n "$slice" ]] && name="feature/${epic}-${slice}"

  # Sync dev first so the new branch is cut from up-to-date integration code.
  cmd_sync_dev || { echo "[branch] dev sync failed — fix the above before branching."; exit 1; }

  if git show-ref --verify --quiet "refs/heads/$name"; then
    git switch "$name"
    echo "[branch] resumed existing $name"
  else
    # Prefer the freshly-synced origin/dev as the base, fall back to local dev.
    git switch -c "$name" "origin/$DEV" 2>/dev/null || git switch -c "$name" "$DEV"
    echo "[branch] created $name off $DEV"
  fi
}

# Delete a feature branch after its task/epic has merged into dev.
# Safe by default: refuses to delete a branch not merged into dev unless --force.
cmd_cleanup() {
  local target="${1:-}" force="${2:-}"
  [[ -n "$target" ]] || { echo "Usage: branch.sh cleanup <branch|--current> [--force]"; exit 2; }
  [[ "$target" == "--current" ]] && target="$(current)"
  case "$target" in
    "$MAIN"|"$DEV"|"") echo "[branch] refusing to delete '$target'."; exit 1 ;;
    feature/*) : ;;
    *) echo "[branch] '$target' is not a feature/* branch; refusing."; exit 1 ;;
  esac

  # Never delete the branch you're standing on; move to dev first.
  if [[ "$(current)" == "$target" ]]; then
    cmd_sync_dev || true
    git switch "$DEV" >/dev/null 2>&1 || git switch -c "$DEV" "origin/$DEV"
  fi

  # Confirm it's merged into dev unless forced.
  if [[ "$force" != "--force" ]]; then
    if ! git branch --merged "$DEV" 2>/dev/null | grep -qx "  $target"; then
      echo "[branch] '$target' is not merged into $DEV. Merge the PR first, or pass --force."
      exit 1
    fi
  fi

  git branch -D "$target" >/dev/null 2>&1 && echo "[branch] deleted local $target"
  if have_origin && git ls-remote --exit-code --heads origin "$target" >/dev/null 2>&1; then
    git push origin --delete "$target" >/dev/null 2>&1 && echo "[branch] deleted remote origin/$target" \
      || echo "[branch] could not delete remote $target (it may already be gone, or the PR auto-deleted it)"
  fi
}

# The gate diffs against dev for feature work, and against main when promoting dev.
cmd_base() {
  local c; c="$(current)"
  case "$c" in
    "$DEV")    echo "$MAIN" ;;      # promoting dev -> main
    "$MAIN")   echo "$MAIN" ;;      # on main itself the gate isn't used; self-base
    feature/*) echo "$DEV" ;;       # feature work integrates to dev
    *)         echo "${BASE_REF:-$DEV}" ;;
  esac
}

cmd_guard() {
  local c; c="$(current)"
  if [[ "$c" == "$MAIN" || "$c" == "$DEV" ]]; then
    echo "[branch] REFUSED: you are on '$c'. Agents work on feature/EPIC-* branches."
    echo "         Run: bash scripts/branch.sh start EPIC-XXX [SLICE-Y]"
    exit 1
  fi
  echo "[branch] ok — on '$c'"
}

cmd_promote() {
  cat <<TXT
[branch] dev -> $MAIN promotion checklist:
  1. git switch $DEV && git pull
  2. BASE_REF=$MAIN bash scripts/verify-task.sh <last-task>   # full gate vs main
  3. Run the full test suite (not just risk-matched task proof).
  4. Open PR $DEV -> $MAIN; require a human-signed, CODEOWNER-approved merge.
  5. Tag the release on $MAIN (e.g. git tag -s vX.Y.Z).
TXT
}

case "${1:-help}" in
  start)    shift; cmd_start "${1:-}" "${2:-}" ;;
  base)     cmd_base ;;
  guard)    cmd_guard ;;
  sync-dev) cmd_sync_dev ;;
  cleanup)  shift; cmd_cleanup "${1:-}" "${2:-}" ;;
  promote)  cmd_promote ;;
  *) echo "Usage: bash scripts/branch.sh [start EPIC-XXX [SLICE-Y]|base|guard|sync-dev|cleanup <branch|--current> [--force]|promote]" ;;
esac
