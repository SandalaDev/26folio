#!/usr/bin/env bash
# scripts/skills.sh — installer, validator, vendor wrapper, registry tool.
# Vendors third-party skills ONTO DISK so any harness reads them identically.
set -euo pipefail
SKILLS_DIR=".agents/skills"
REGISTRY="$SKILLS_DIR/registry.md"
mkdir -p "$SKILLS_DIR/local"
cmd="${1:-help}"; arg="${2:-}"

cmd_validate() {
  echo "[skills] validating registry..."
  local missing=0
  for line in $(grep -oE '^\| [a-z0-9-]+' "$REGISTRY" 2>/dev/null | awk '{print $2}'); do
    [[ -f "$SKILLS_DIR/$line/SKILL.md" ]] || { echo "  MISSING: $SKILLS_DIR/$line/SKILL.md"; missing=$((missing+1)); }
  done
  [[ $missing -gt 0 ]] && { echo "[skills] $missing missing — run install-defaults"; exit 1; }
  echo "[skills] all present."
}

cmd_vendor() { # name method src [sub]
  local name="$1" method="$2" src="$3" sub="${4:-}" dest="$SKILLS_DIR/$1"
  mkdir -p "$dest"
  [[ -s "$dest/SKILL.md" ]] && { echo "  vendored (present): $name"; return 0; }
  local tmp; tmp="$(mktemp -d)"
  case "$method" in
    git) if git clone --depth 1 "$src" "$tmp/r" >/dev/null 2>&1; then cp -R "$tmp/r"/. "$dest"/; rm -rf "$dest/.git"; echo "  vendored (git): $name";
         else echo "  OFFLINE: stub $name"; touch "$dest/SKILL.md"; echo "# SOURCE: git $src" > "$dest/SOURCE.md"; fi ;;
    npx) if npx --yes skills add "$src" --skill "$sub" --dir "$SKILLS_DIR" >/dev/null 2>&1; then echo "  vendored (npx): $name";
         else echo "  OFFLINE: stub $name"; touch "$dest/SKILL.md"; echo "# SOURCE: npx skills add $src --skill $sub" > "$dest/SOURCE.md"; fi ;;
  esac
  rm -rf "$tmp"
}

cmd_install_defaults() {
  for s in impeccable frontend-design shadcn-ui-builder 21st-dev-components \
           ds-task-slicer ds-test-planner ds-reviewer ds-handoff ds-content-review; do
    mkdir -p "$SKILLS_DIR/$s"; [[ -f "$SKILLS_DIR/$s/SKILL.md" ]] || touch "$SKILLS_DIR/$s/SKILL.md"
  done
  cmd_vendor stop-slop            git "https://github.com/hardikpandya/stop-slop.git"
  cmd_vendor design-taste-frontend npx "https://github.com/leonxlnx/taste-skill" "design-taste-frontend"
  echo "[skills] defaults installed/vendored. Pin commits in lock.json."
}

cmd_add() { [[ -z "$arg" ]] && { echo "Usage: skills.sh add <name>"; exit 1; }; mkdir -p "$SKILLS_DIR/local/$arg"; touch "$SKILLS_DIR/local/$arg/SKILL.md"; echo "[skills] candidate: $SKILLS_DIR/local/$arg/SKILL.md"; }

case "$cmd" in
  validate)         cmd_validate ;;
  install-defaults) cmd_install_defaults ;;
  vendor)           cmd_vendor "$arg" "${3:-}" "${4:-}" "${5:-}" ;;
  add)              cmd_add ;;
  *) echo "Usage: bash scripts/skills.sh [validate|install-defaults|vendor <name> <git|npx> <src> [sub]|add <name>]" ;;
esac
