#!/usr/bin/env bash
# Compatibility entry point; interviews happen in the active agent conversation.
set -euo pipefail
source scripts/telemetry.sh
case "${1:-interview}" in brief|interview|ready|status) telemetry_install_exit_hook "project-intake" "intake:${1:-interview}" ;; esac
case "${1:-interview}" in
  brief|interview) node scripts/control.mjs interview start discovery ;;
  ready) node scripts/control.mjs interview ready ;;
  status) node scripts/control.mjs interview status ;;
  *) echo 'Use: os interview start discovery'; exit 2 ;;
esac
