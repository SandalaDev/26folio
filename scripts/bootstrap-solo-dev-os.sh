#!/usr/bin/env bash
# bootstrap-solo-dev-os.sh — create the v6.1 skeleton. Pure shell; no package manager assumed.
set -euo pipefail
ROOT="${1:-.}"; cd "$ROOT"

# Only pre-create directories that exist from day one. Deferred / lazy-created:
# project-spine/references/{design,content,ui}/ (created when you drop references
# in), planning/content/** (created as work lands), handoffs/archive (created on
# first archive), tests/** (created when tests are written). This keeps the
# skeleton to what is actually used on a fresh clone.
mkdir -p \
  project-state \
  handoffs/review handoffs/session handoffs/task handoffs/rework \
  project-spine \
  planning/slices \
  backlog/epics backlog/tasks backlog/done \
  memory memory/agent-log \
  .agents/skills/local .agents/reviews \
  scripts scripts/test .githooks .github/workflows

for file in \
  AGENTS.md \
  project-state/CURRENT_STATE.md project-state/HANDOFF_QUEUE.md \
  project-state/AGENT_LOG.md \
  memory/decisions.md memory/progress-log.md \
  project-spine/00-manifesto.md project-spine/01-project-charter.md \
  project-spine/02-business-outcomes-map.md project-spine/03-project-prd.md \
  project-spine/04-domain-model.md project-spine/05-data-model.md \
  project-spine/06-project-technical-plan.md project-spine/07-architecture-principles.md \
  project-spine/08-risk-register.md project-spine/09-roadmap.md \
  CODEOWNERS \
  .agents/skills/registry.md .agents/skills/lock.json; do
  [[ -f "$file" ]] || touch "$file"
done

# Seed canonical STATE.json
if [[ ! -s "project-state/STATE.json" ]]; then
  cat > "project-state/STATE.json" <<'JSON'
{
  "schema": "solo-dev-os.state.v2",
  "updated": "",
  "updated_by": "bootstrap",
  "actor": { "harness": null, "model": null, "role": null },
  "current": { "epic": null, "slice": null, "task": null, "agent": null, "branch": null, "session_status": "none", "handoff_status": "none" },
  "completion": { "summary": "", "done": [], "remaining": [], "blocked": "none" },
  "counts": { "epics_total": 0, "tasks_open": 0, "tasks_in_progress": 0, "tasks_done": 0, "handoffs_pending": 0, "handoffs_consumed": 0 },
  "verification": { "lint": "skipped", "typecheck": "skipped", "unit": "skipped", "integration": "skipped", "e2e": "skipped" },
  "handoff_queue": []
}
JSON
fi

# Default CODEOWNERS — protected paths require a human approver.
if [[ ! -s CODEOWNERS ]]; then
  cat > CODEOWNERS <<'CO'
# Protected paths require a signed approving commit from an owner below.
project-spine/05-data-model.md   @owner
src/db/                          @owner
src/auth/                        @owner
drizzle/                         @owner
.github/workflows/               @owner
CO
fi

# Git hooks that travel with the repo (work in any harness).
cat > .githooks/pre-push <<'HK'
#!/usr/bin/env bash
set -euo pipefail
# Agents must push feature/* branches, never main/dev directly.
bash scripts/branch.sh guard
TASK="$(node scripts/active-task.mjs 2>/dev/null || true)"
if [[ -n "${TASK:-}" ]]; then bash scripts/verify-task.sh "$TASK"; else bash scripts/os.sh check; fi
HK
cat > .githooks/pre-commit <<'HK'
#!/usr/bin/env bash
set -euo pipefail
bash scripts/os.sh check || true
HK
chmod +x .githooks/pre-push .githooks/pre-commit 2>/dev/null || true

# active-task helper: reads STATE.current.task -> task path
if [[ ! -f scripts/active-task.mjs ]]; then
  cat > scripts/active-task.mjs <<'JS'
import fs from "node:fs";
try {
  const s = JSON.parse(fs.readFileSync("project-state/STATE.json","utf8"));
  const t = s.current?.task;
  if (t && t !== "TASK-XXX") {
    const p = `backlog/tasks/${t}.md`;
    if (fs.existsSync(p)) process.stdout.write(p);
  }
} catch {}
JS
fi

# Vendor the two real third-party skills (stop-slop, design-taste-frontend).
# Other skills are authored on disk as needed — no empty stubs are pre-created.
if [[ -x scripts/skills.sh ]]; then bash scripts/skills.sh install-defaults || true; fi
if command -v git >/dev/null 2>&1; then
  git config core.hooksPath .githooks || true
  # Establish the integration branch off main if it does not exist yet.
  if git rev-parse --verify main >/dev/null 2>&1 && ! git rev-parse --verify dev >/dev/null 2>&1; then
    git branch dev main || true
    echo "[bootstrap] created 'dev' off 'main'. Protect both on your host; agents branch feature/* off dev."
  fi
fi
if [[ -f AGENTS.md && -x scripts/sync-agent-files.sh ]]; then bash scripts/sync-agent-files.sh || true; fi

echo "Solo Dev OS skeleton created."
echo "Next:"
echo "  1. Author the project spine (00-manifesto … 09-roadmap, then 10-design-system,"
echo "     11-content-strategy, 12-ui-element-map) under project-spine/."
echo "  2. Set owners in CODEOWNERS (replace @owner)."
echo "  3. Shape the first Epic → Slice → Tasks under backlog/ and planning/slices/."
echo "  4. Fill STATE.json current + completion, then run 'bash scripts/os.sh render'."
