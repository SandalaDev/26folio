#!/usr/bin/env bash
# scripts/skills.sh — skill installer / validator / registry tool.
# Subcommands: validate | audit | add <name> [core|frontend]
#
# validate  (gate-facing): confirm every discovered skill has portable metadata.
# audit     (release-facing): validate plus a minimal substance check.
# add       : scaffold a new skill folder with a SKILL.md template.
#
# PORTED design: the validate-vs-audit distinction, and the directory-scan
# fallback that closes the "empty registry vacuously passes" hole.
set -euo pipefail

CORE_DIR=".agents/skills"
FE_DIR="pack-frontend/skills"

# List "name layer" pairs by scanning both layers for SKILL.md. The directory is
# the source of truth (unambiguous: .agents/skills=core, pack-frontend/skills=frontend).
# registry.md is human-readable documentation; we don't parse its table because a
# 3-column markdown table is fragile to parse and carries no reliable layer column.
skill_names() {
  # A portable skill is one direct child folder. Vendored skills may contain
  # nested specialist SKILL.md references; those belong to the parent package
  # and must not be mistaken for separately installed top-level skills.
  find "$CORE_DIR" "$FE_DIR" -mindepth 2 -maxdepth 2 -name SKILL.md -type f 2>/dev/null | while read -r f; do
    local name; name="$(basename "$(dirname "$f")")"
    local layer; layer="core"; [[ "$f" == *"$FE_DIR"* ]] && layer="frontend"
    echo "$name $layer"
  done
}

cmd_validate() {
  local fail=0 found=0
  while IFS=' ' read -r name layer; do
    [[ -z "$name" ]] && continue
    local dir="$CORE_DIR"; [[ "$layer" == "frontend" ]] && dir="$FE_DIR"
    local f="$dir/$name/SKILL.md"
    found=$((found + 1))
    if [[ ! -f "$f" ]]; then echo "  ✗ MISSING: $name ($f)"; fail=1
    elif [[ ! -s "$f" ]]; then echo "  ✗ EMPTY: $name ($f)"; fail=1
    else
      local declared description
      declared="$(sed -n 's/^name:[[:space:]]*//p' "$f" | head -n 1)"
      description="$(sed -n 's/^description:[[:space:]]*//p' "$f" | head -n 1)"
      if [[ "$declared" != "$name" ]]; then
        echo "  ✗ NAME MISMATCH: folder=$name frontmatter=${declared:-missing}"; fail=1
      elif [[ -z "$description" || "$description" == *"TODO"* ]]; then
        echo "  ✗ DESCRIPTION MISSING: $name"; fail=1
      else
        echo "  ok: $name ($layer)"
      fi
    fi
  done < <(skill_names)
  if [[ $found -eq 0 ]]; then echo "  (no skills registered)"; fi
  [[ $fail -ne 0 ]] && { echo "[skills] INVALID"; exit 1; }
  echo "[skills] valid ($found skill(s))"
}

cmd_audit() {
  local fail=0 found=0
  while IFS=' ' read -r name layer; do
    [[ -z "$name" ]] && continue
    local dir="$CORE_DIR"; [[ "$layer" == "frontend" ]] && dir="$FE_DIR"
    local f="$dir/$name/SKILL.md"
    found=$((found + 1))
    if [[ ! -f "$f" ]]; then echo "  ✗ MISSING: $name"; fail=1
    elif [[ ! -s "$f" ]]; then echo "  ✗ EMPTY STUB: $name (audit fails on debt)"; fail=1
    elif [[ "$(wc -l < "$f")" -lt 12 ]]; then echo "  ✗ THIN STUB: $name"; fail=1
    else echo "  ok: $name ($layer, $(wc -l < "$f") lines)"
    fi
  done < <(skill_names)
  [[ $fail -ne 0 ]] && { echo "[skills] AUDIT FAILED — debt present"; exit 1; }
  echo "[skills] audit clean ($found skill(s))"
}

cmd_add() {
  local name="${1:-}"; local layer="${2:-core}"
  [[ -n "$name" ]] || { echo "Usage: skills.sh add <name> [core|frontend]"; exit 2; }
  local dir="$CORE_DIR"; [[ "$layer" == "frontend" ]] && dir="$FE_DIR"
  mkdir -p "$dir/$name"
  cat > "$dir/$name/SKILL.md" <<EOF
---
name: $name
description: TODO - explain what this skill does and the concrete situations that should trigger it.
metadata:
  layer: $layer
  risk: low
---
# Skill: $name

## When to use
(describe the repeatable situation this skill addresses)

## Procedure
1. (step)

## Anti-patterns
- (what this skill is NOT)
EOF
  echo "[skills] scaffolded $dir/$name/SKILL.md — fill it in, then reference via skill_refs."
}

case "${1:-help}" in
  validate) cmd_validate ;;
  audit)    cmd_audit ;;
  add)      shift; cmd_add "${1:-}" "${2:-core}" ;;
  *) echo "Usage: bash scripts/skills.sh [validate|audit|add <name> [core|frontend]]" ;;
esac
