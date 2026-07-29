#!/usr/bin/env bash
# End-to-end derived-state regression test.
#
# All mutations happen in a disposable workspace. The live repository is only
# read while the test copies scripts, seed state, and installed dependencies.
set -uo pipefail

SOURCE_REPO="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
SANDBOX="$(mktemp -d)"
cleanup() {
  if [[ -n "${SANDBOX:-}" && -d "$SANDBOX" && "$SANDBOX" == /tmp/* ]]; then
    rm -rf -- "$SANDBOX"
  fi
}
trap cleanup EXIT

node -v >/dev/null 2>&1 || { echo "FAIL: node not on PATH"; exit 2; }
[[ -d "$SOURCE_REPO/node_modules" ]] || {
  echo "FAIL: node_modules missing; run the reviewed setup workflow first"
  exit 2
}

mkdir -p "$SANDBOX/project-state"
cp -R "$SOURCE_REPO/scripts" "$SANDBOX/scripts"
cp "$SOURCE_REPO/package.json" "$SANDBOX/package.json"
[[ -f "$SOURCE_REPO/package-lock.json" ]] \
  && cp "$SOURCE_REPO/package-lock.json" "$SANDBOX/package-lock.json"
cp "$SOURCE_REPO/project-state/state.json" "$SANDBOX/project-state/state.json"
[[ -f "$SOURCE_REPO/project-state/completion.md" ]] \
  && cp "$SOURCE_REPO/project-state/completion.md" "$SANDBOX/project-state/completion.md"
[[ -f "$SOURCE_REPO/project-state/ledger.jsonl" ]] \
  && cp "$SOURCE_REPO/project-state/ledger.jsonl" "$SANDBOX/project-state/ledger.jsonl"
ln -s "$SOURCE_REPO/node_modules" "$SANDBOX/node_modules"

cd "$SANDBOX" || { echo "FAIL: could not enter isolated test workspace"; exit 2; }

PASS=0
FAIL=0
ok() { echo "  ✓ $1"; PASS=$((PASS + 1)); }
bad() { echo "  ✗ $1"; FAIL=$((FAIL + 1)); }
assert_eq() {
  if [[ "$2" == "$3" ]]; then ok "$1 ($2)"
  else bad "$1: expected [$3] got [$2]"
  fi
}

sj() {
  node -e 'try{const s=require("./project-state/state.json");let v=s;for(const k of process.argv[1].split(".")){if(v==null)break;v=v[k]}process.stdout.write(v==null?"":String(v))}catch{process.stdout.write("")}' "$1" 2>/dev/null
}
sj_json() {
  node -e 'try{const s=require("./project-state/state.json");let v=s;for(const k of process.argv[1].split(".")){if(v==null)break;v=v[k]}process.stdout.write(JSON.stringify(v==null?[]:v))}catch{process.stdout.write("[]")}' "$1" 2>/dev/null
}

echo "── derived-state round-trip (isolated)"

# 1. No copied backlog or handoffs means a deterministic empty baseline.
node scripts/render-state.mjs >/dev/null 2>&1
assert_eq "empty backlog -> epics[]" "$(sj_json epics)" "[]"
assert_eq "empty backlog -> handoff_queue[]" "$(sj_json handoff_queue)" "[]"
assert_eq "empty -> counts.handoffs_pending" "$(sj counts.handoffs_pending)" "0"

# 2. Epic and task metadata derive current and inventory state.
bash scripts/new-task.sh epic EPIC-001 "Test epic" >/dev/null 2>&1
bash scripts/new-task.sh task TASK-001 "Test task" EPIC-001 medium >/dev/null 2>&1
node scripts/update-state.mjs set-current task TASK-001 >/dev/null 2>&1
node scripts/render-state.mjs >/dev/null 2>&1
assert_eq "claimed task -> current.epic" "$(sj current.epic)" "EPIC-001"
[[ "$(sj_json epics)" == *'"id":"EPIC-001"'* ]] \
  && ok "epics[] contains EPIC-001" || bad "epics[] missing EPIC-001"

# 3. The canonical writer refuses direct mutation of a derived epic.
if node scripts/update-state.mjs set-current epic EPIC-BOGUS >/dev/null 2>&1; then
  bad "set-current epic was accepted"
else
  ok "set-current epic refused"
fi

# 4. Handoff creation writes a file, not state.json.
node -e 'const fs=require("fs");const p="backlog/tasks/TASK-001.md";const s=fs.readFileSync(p,"utf8").replace(/^---\r?\n/,"---\nhandoff_required: true\nhandoff_type: [task]\n");fs.writeFileSync(p,s);'
cp project-state/state.json pre-handoff.json
node scripts/create-handoff.mjs backlog/tasks/TASK-001.md >/dev/null 2>&1
if diff -q project-state/state.json pre-handoff.json >/dev/null 2>&1; then
  ok "create-handoff did not mutate state.json"
else
  bad "create-handoff mutated state.json"
fi
node scripts/render-state.mjs >/dev/null 2>&1
[[ "$(sj_json handoff_queue)" == *'"id":"HANDOFF-TASK-TASK-001"'* ]] \
  && ok "handoff_queue has the task-continuity entry" \
  || bad "handoff_queue missing task-continuity entry"
assert_eq "task handoff -> counts.handoffs_pending" "$(sj counts.handoffs_pending)" "1"

# 5. Full and structural drift checks serve different purposes.
if node scripts/render-state.mjs --check >/dev/null 2>&1; then
  ok "--check consistent"
else
  bad "--check reported drift"
fi
if node scripts/render-state.mjs --check-structural >/dev/null 2>&1; then
  ok "--check-structural clean"
else
  bad "--check-structural reported drift"
fi

node -e 'const fs=require("fs");const s=require("./project-state/state.json");s.handoff_queue.push({id:"HANDOFF-BOGUS",status:"pending"});fs.writeFileSync("project-state/state.json",JSON.stringify(s,null,2)+"\n");'
if node scripts/render-state.mjs --check >/dev/null 2>&1; then
  bad "--check missed handoff_queue drift"
else
  ok "--check caught handoff_queue drift"
fi
if node scripts/render-state.mjs --check-structural >/dev/null 2>&1; then
  ok "--check-structural ignores derived drift"
else
  bad "--check-structural flagged derived drift"
fi

# 6. Completion narrative is canonical and state.completion is derived.
cat > project-state/completion.md <<'CMEOF'
---
summary: "test summary"
done:
  - thing one
remaining: []
blocked: none
---
CMEOF
node scripts/render-state.mjs >/dev/null 2>&1
assert_eq "completion.summary derives" "$(sj completion.summary)" "test summary"
[[ "$(sj_json completion.done)" == *'"thing one"'* ]] \
  && ok "completion.done derives" || bad "completion.done missing"
node -e 'const fs=require("fs");const s=require("./project-state/state.json");s.completion.summary="STALE";fs.writeFileSync("project-state/state.json",JSON.stringify(s,null,2)+"\n");'
if node scripts/render-state.mjs --check >/dev/null 2>&1; then
  bad "--check missed completion drift"
else
  ok "--check caught completion drift"
fi
node scripts/render-state.mjs >/dev/null 2>&1

# 7. Release clears task-derived epic state.
node scripts/update-state.mjs clear-task >/dev/null 2>&1
node scripts/render-state.mjs >/dev/null 2>&1
assert_eq "release -> current.epic cleared" "$(sj current.epic)" ""

echo
if [[ "$FAIL" -eq 0 ]]; then
  echo "PASS: $PASS assertion(s), 0 failures (live repository untouched)"
  exit 0
fi
echo "FAIL: $FAIL failure(s), $PASS passed (live repository untouched)"
exit 1
