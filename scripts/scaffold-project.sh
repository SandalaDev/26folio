#!/usr/bin/env bash
# Export a reviewed commit into an independent core or frontend project.
# Usage: scaffold-project.sh TARGET [--ref REF] [--profile core|frontend] [--force]
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || {
  echo "ERROR: must run from inside the agent-os template's git repository." >&2; exit 1; }
cd "$ROOT"
ROOT="$(pwd -P)"

TARGET=""; REF="HEAD"; FORCE=0; PROFILE="frontend"
while [[ $# -gt 0 ]]; do
  case "$1" in
    --ref) REF="${2:?--ref requires a value}"; shift 2 ;;
    --force) FORCE=1; shift ;;
    --profile) PROFILE="${2:?profile required}"; shift 2 ;;
    -h|--help)
      sed -n '2,20p' "$0"; exit 0 ;;
    --) shift; break ;;
    -*) echo "ERROR: unknown flag: $1" >&2; exit 2 ;;
    *) [[ -z "$TARGET" ]] || { echo "ERROR: unexpected extra argument: $1" >&2; exit 2; }
       TARGET="$1"; shift ;;
  esac
done
[[ -n "$TARGET" ]] || { echo "Usage: scaffold-project.sh <target-dir> [--ref <branch|tag|commit>] [--force]"; exit 2; }

TARGET_PARENT_RAW="$(dirname "$TARGET")"
[[ -d "$TARGET_PARENT_RAW" ]] || { echo "ERROR: parent directory does not exist: $TARGET_PARENT_RAW" >&2; exit 1; }
TARGET_ABS="$(cd "$TARGET_PARENT_RAW" && pwd -P)/$(basename "$TARGET")"
if [[ -d "$TARGET_ABS" ]]; then TARGET_ABS="$(cd "$TARGET_ABS" && pwd -P)"; fi

# ── Refuse a target that is (or contains, or is contained by) the source repo ──
case "$TARGET_ABS" in
  "$ROOT"|"$ROOT"/*) echo "ERROR: refusing to scaffold onto the source template repository itself." >&2; exit 1 ;;
esac
case "$ROOT" in
  "$TARGET_ABS"/*) echo "ERROR: refusing to scaffold into a directory that contains the source template repository ($ROOT)." >&2; exit 1 ;;
esac

# ── Refuse a non-empty target (unless --force AND no existing .git) ──
if [[ -e "$TARGET_ABS" ]]; then
  [[ -d "$TARGET_ABS" ]] || { echo "ERROR: target exists and is not a directory: $TARGET_ABS" >&2; exit 1; }
  if [[ -e "$TARGET_ABS/.git" ]]; then
    echo "ERROR: target already contains a .git — refusing even with --force." >&2; exit 1
  fi
  entry_count="$(find "$TARGET_ABS" -mindepth 1 -maxdepth 1 | wc -l | tr -d ' ')"
  if [[ "$entry_count" != "0" ]]; then
    if [[ "$FORCE" != "1" ]]; then
      echo "ERROR: target is non-empty ($entry_count entries) — refusing. Pass --force to scaffold into a non-empty, non-git directory." >&2
      exit 1
    fi
    echo "[scaffold] --force: proceeding into non-empty target (no .git present)."
  fi
else
  mkdir -p "$TARGET_ABS"
fi

RESOLVED_REF="$(git rev-parse --verify "${REF}^{commit}" 2>/dev/null)" || {
  echo "ERROR: ref not found: $REF" >&2; exit 1; }

echo "=== scaffold-project ==="
echo "  source: $ROOT"
echo "  ref:    $REF ($RESOLVED_REF)"
echo "  target: $TARGET_ABS"
[[ "$REF" != "HEAD" ]] || echo "  note:   scaffolding from the current working tree's commit (HEAD), not a pinned release — pass --ref for a reviewed, reproducible export."

STAGE="$(mktemp -d)"
cleanup() { rm -rf -- "$STAGE" 2>/dev/null || true; }
trap cleanup EXIT
git archive "$RESOLVED_REF" | tar -x -C "$STAGE"

node "$STAGE/scripts/distribution/apply-seed.mjs" "$STAGE" "$TARGET_ABS" "$RESOLVED_REF" "$PROFILE"

(
  cd "$TARGET_ABS"
  git init -q
  git add -A
  git commit -q -m "Scaffold from agent-os template @ ${RESOLVED_REF}"
)

echo
echo "[scaffold] done — $(cd "$TARGET_ABS" && git rev-parse HEAD)"
echo "Next steps:"
echo "  cd $TARGET_ABS"
echo "  bash setup.sh"
echo "  bash scripts/os.sh interview start discovery"
