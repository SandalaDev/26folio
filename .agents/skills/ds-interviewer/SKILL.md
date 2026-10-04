---
name: ds-interviewer
description: Run resumable project, delivery, capability, epic, change and closeout interviews in the active conversation. Use when intent or an accepted decision is missing or has materially changed; research repository facts without asking the human to fill forms.
---
# Conversational interviews

Start with `os next` and `os interview packet`. Start the required interview if absent. Read its known answers and relevant project files. Existing explicit user decisions persist; preserve them and only reopen a changed point.

Research facts yourself. Present a concise recommended choice with the meaningful tradeoff. Ask one to three independent questions through the harness question tool or normal conversation. Wait for the answer; silence is not consent. Record each actual answer with `os interview record ID KEY "answer"`. Do not answer on the human's behalf or treat a template placeholder as a decision.

Use `os interview ask ID KEY` with a JSON question containing text and after keys for a project-specific follow-up. Ask dependent questions after their prerequisites. Keep technical implementation details out of product questions unless they affect the human's choice.

When required answers are present, run `os interview review ID`. Read the decisions back in ordinary language. Ask whether this exact summary matches the user's intent. Only after explicit confirmation run `os interview confirm ID DIGEST "user answer or message reference"`. A changed digest requires a new readback. Record prior explicit approval by its source when it already covers the exact decisions; do not ask again merely to perform ceremony.

After discovery, inspect the hydrated charter and draft roadmap. Use ds-task-slicer and ds-epic-estimator to prepare actual weighted scope before the delivery conversation. No observed capacity means no invented date. Conduct the capability conversation about useful skills, harnesses, subscriptions, failure modes and review authorization. Missing payment amounts remain unknown and do not prevent usage collection.

Start epic interviews before implementation; demonstrate results at closeout. A material upstream change invalidates dependent confirmations. Use revisit after reassessing impact. Project interviews block all implementation; epic interviews block only the affected epic. Continue research, interview capture, diagnostics and recovery while answers are pending.

The CLI records agent-reported human evidence and enforces its own entry points. Do not claim that arbitrary editor writes are blocked unless a tested harness adapter covers them. Never install hooks or invoke a paid review provider without authorization for that action.
