#!/usr/bin/env bash
# scripts/skills.sh — installer, validator, vendor wrapper, registry tool.
# Vendors third-party skills ONTO DISK so any harness reads them identically.
set -euo pipefail
SKILLS_DIR=".agents/skills"
REGISTRY="$SKILLS_DIR/registry.md"
mkdir -p "$SKILLS_DIR/local"
cmd="${1:-help}"; arg="${2:-}"

# Expected skill set: registry.md rows if it lists any, else a scan of every skill
# dir on disk. The old validator read ONLY the registry — when registry.md was
# empty the loop ran zero times and vacuously "passed", hiding nine empty skills.
# Falling back to the directory scan closes that hole.
skill_names() {
  local names
  # Table rows look like `| <name> | … |`. Drop the header row (name) and the
  # `|---|` separator (no content cell) so only real skill names survive.
  names="$(grep -oE '^\| `?[a-z0-9-]+' "$REGISTRY" 2>/dev/null | tr -d '`' | awk '{print $2}' | grep -vx 'name')"
  if [[ -z "$names" ]]; then
    names="$(find "$SKILLS_DIR" -mindepth 2 -maxdepth 2 -name SKILL.md -printf '%h\n' 2>/dev/null | xargs -r -n1 basename)"
  fi
  echo "$names"
}

# Gate-facing check. Fails on a MISSING SKILL.md (structural corruption) but only
# WARNS on empty stubs — an unauthored UI skill must not block an unrelated backend
# task. Per-task enforcement of the skills a task actually needs lives in
# validate-task.mjs (skill_refs are resolved against disk there).
cmd_validate() {
  echo "[skills] validating skills on disk..."
  local missing=0 empty=0 checked=0
  for name in $(skill_names); do
    checked=$((checked+1))
    local f="$SKILLS_DIR/$name/SKILL.md"
    if [[ ! -f "$f" ]]; then echo "  MISSING: $f"; missing=$((missing+1));
    elif [[ ! -s "$f" ]]; then echo "  warn: EMPTY stub (not yet authored): $f"; empty=$((empty+1)); fi
  done
  echo "  checked $checked skill(s); $empty empty stub(s)."
  [[ $missing -gt 0 ]] && { echo "[skills] $missing missing — run install-defaults."; exit 1; }
  echo "[skills] all skill files present (empty stubs warned, not blocked)."
}

# Strict audit for humans / CI: empty stubs are debt and fail here. Run deliberately
# (e.g. before a release) to force the stub backlog down.
cmd_audit() {
  echo "[skills] strict audit (empty stubs count as failures)..."
  local bad=0
  for name in $(skill_names); do
    local f="$SKILLS_DIR/$name/SKILL.md"
    if [[ ! -s "$f" ]]; then echo "  UNAUTHORED: $f"; bad=$((bad+1)); fi
  done
  [[ $bad -gt 0 ]] && { echo "[skills] $bad unauthored skill(s)."; exit 1; }
  echo "[skills] every skill is authored."
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
  audit)            cmd_audit ;;
  install-defaults) cmd_install_defaults ;;
  vendor)           cmd_vendor "$arg" "${3:-}" "${4:-}" "${5:-}" ;;
  add)              cmd_add ;;
  *) echo "Usage: bash scripts/skills.sh [validate|audit|install-defaults|vendor <name> <git|npx> <src> [sub]|add <name>]" ;;
esac
