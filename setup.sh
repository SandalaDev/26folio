#!/usr/bin/env bash
# setup.sh — the ONE thing you run after cloning agent-os.
#
# WHY THIS EXISTS
# Git config (core.hooksPath) is LOCAL — it doesn't travel with a clone.
# Without this, a fresh clone has NO active hooks and trunk protection is
# absent (the pre-push hook's only job: stop accidental direct pushes to a
# trunk). This script wires it all up.
#
# Run once after cloning (or after cloning into a new project):
#   bash setup.sh
set -euo pipefail

echo "=== agent-os setup ==="

# 1) Point git at the repo's hooks (so the pre-push trunk guard actually runs).
git config core.hooksPath .githooks
echo "[setup] core.hooksPath = $(git config core.hooksPath)"

# 2) Fetch and verify the exact prescribed dependency source BEFORE npm installs
# project packages. OpenSrc is bootstrapped through npx and remains a tool/cache,
# not a project dependency. The reviewed baseline is checked into docs/.
echo "[setup] OpenSrc dependency evidence preflight:"
node scripts/deps.mjs baseline

# 3) Install the exact reviewed OS dependency.
if ! node -e "require('yaml')" 2>/dev/null; then
  echo "[setup] installing reviewed dependency set..."
  npm install >/dev/null 2>&1 || { echo "[setup] npm install failed — run it manually."; }
fi
echo "[setup] node + yaml: $(node -e "require('yaml'); console.log('ok')" 2>/dev/null || echo 'MISSING — run npm install')"

# 4) Health check + first render (so dashboard.html and guide.html exist).
echo "[setup] health check:"
bash scripts/os.sh check 2>&1 | sed 's/^/  /'
bash scripts/skills.sh validate 2>&1 | sed 's/^/  /' | tail -1
bash scripts/os.sh render >/dev/null 2>&1   # generates dashboard.html + guide.html + current-state.md

echo
echo "=== setup complete ==="
echo "Dashboard: $(pwd)/dashboard.html"
echo "Usage guide: $(pwd)/guide.html"
echo "Next: bash scripts/intake.sh brief   (start a project)"
echo "Verify everything works: open guide.html and follow its VERIFY callouts."
