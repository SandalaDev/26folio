#!/usr/bin/env bash
# Compatibility bridge: frontend decisions are captured in chat.
set -euo pipefail
phase="${1:-design}"; action="${2:-questionnaire}"
case "$phase" in design|content|ui) ;; *) echo 'Use design, content or ui'; exit 2 ;; esac
case "$action" in
 questionnaire) node scripts/control.mjs interview start "$phase" "project" ;;
 ready) node scripts/control.mjs interview ready "${phase}-project" ;;
 status) node scripts/control.mjs interview status ;;
 preview) echo 'Ask the agent to open the rendered design, walk through the main flow, and record your explicit acceptance in the design interview.' ;;
 *) echo 'Use questionnaire, ready, status or preview'; exit 2 ;;
esac
