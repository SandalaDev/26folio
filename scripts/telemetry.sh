#!/usr/bin/env bash
# Shared non-blocking telemetry wrapper for template-owned shell entry points.
# feature/action values must be constants declared in os-feature-registry.mjs.

telemetry_capture() {
  local feature="$1" action="$2"; shift 2
  local started ended status
  started="$(node -e 'process.stdout.write(String(Date.now()))' 2>/dev/null || date +%s000)"
  set +e
  ( "$@" )
  status=$?
  set -e
  ended="$(node -e 'process.stdout.write(String(Date.now()))' 2>/dev/null || date +%s000)"
  node scripts/record-telemetry.mjs "$feature" "$action" "$status" "$((ended - started))" 2>/dev/null || true
  return "$status"
}

telemetry_install_exit_hook() {
  __telemetry_feature="$1"
  __telemetry_action="$2"
  __telemetry_started="$(node -e 'process.stdout.write(String(Date.now()))' 2>/dev/null || date +%s000)"
  trap 'telemetry_finish "$?"' EXIT
}

telemetry_finish() {
  local status="$1" ended
  trap - EXIT
  ended="$(node -e 'process.stdout.write(String(Date.now()))' 2>/dev/null || date +%s000)"
  node scripts/record-telemetry.mjs "$__telemetry_feature" "$__telemetry_action" "$status" "$((ended - __telemetry_started))" 2>/dev/null || true
  exit "$status"
}
