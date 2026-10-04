# Agent OS

Agent OS keeps project intent, decisions and work recoverable across coding agents. You talk to the agent; it maintains the repository and regenerates the dashboard. It uses Node, Git and Bash, with an optional frontend pack.

Tell your agent: **“Set up this project, interview me about what we are building, and show me the next decision.”** The agent researches facts, asks small rounds of questions in chat, records answers and presents a summary for your confirmation. It then drafts the charter and roadmap and discusses scope, estimates, skills and model usage with you.

For a new product, export a clean project from a reviewed template commit:

~~~sh
bash scripts/scaffold-project.sh ../my-project --ref <commit> --profile core
~~~

Use profile frontend to include design skills. Run setup.sh in the new project, then start the interview. Git history, this template's development backlog and OS regression fixtures do not ship.

Open dashboard.html for the current project, next action, release evidence and usage. Open guide.html for the complete operator's guide: cloning and export, setup, interviews, planning, daily work, agent handoffs, usage accounting, reviews, releases and OS updates. Both regenerate through `bash scripts/os.sh refresh`. The guide's source chapters live in `docs/guide/`.

The source repository develops Agent OS itself. Previous development records live in archive/template-v1/; current overhaul work lives in backlog/. Runtime commands and accounting semantics are documented in OPERATING_MANUAL.md.

Usage supports native Codex, Claude Code and OpenCode exports. Token observations, API-equivalent estimates, actual billed amounts and subscription allocations remain distinct. Missing data stays unknown. No API key or paid review service is required.
