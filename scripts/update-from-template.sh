#!/usr/bin/env bash
# Node loads the updater before any self-replacement. No project package install.
set -euo pipefail
node "$(dirname "$0")/distribution/update.mjs" "$@"
