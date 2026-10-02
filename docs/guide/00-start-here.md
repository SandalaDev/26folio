## Start here

Agent OS gives a coding agent a durable record of your project's intent, decisions, work and evidence. You explain what you want in conversation; the agent maintains the files and demonstrates the result. This guide explains both the human workflow and the commands underneath it.

### Choose your starting point

- Just cloned the template? Follow [Create a new project](#02-new-project), including export, setup, the first interview and your own Git remote.
- Returning to a product project? Follow [Daily work](#20-daily-work).
- Moving to another model or agent? Follow [Switch agents and delegate work](#25-agents).
- Updating a project's OS? Follow [Update an existing project](#50-maintenance).
- Want the system explained first? Read [How the OS works](#05-system).
- Something failed? Start with [Diagnose and recover](#55-recovery).

### How to read the examples

Commands use Bash. On Windows, open **Git Bash**; paths such as `/c/_git/my-project` mean `C:\_git\my-project`. PowerShell uses different syntax, and Windows' default `bash.exe` may launch WSL instead of Git Bash. On macOS or Linux, substitute your own filesystem paths.

Run commands from the product repository root unless a step explicitly says **template checkout**. Replace identifiers such as `TASK-001`, `YOUR_TEMPLATE_URL`, `YOUR_PRODUCT_URL` and `YOUR_RELEASE_TAG` with real values. A release tag or full commit hash must already exist in the source repository. Example JSON records are templates for your agent to populate from evidence, not configuration to paste blindly.

Each workflow explains when to use it, what you decide, what the agent runs, what changes and what to check next. You can operate the commands yourself, but you do not need to edit interview forms or generated dashboards.

### Give your agent a prompt

<div class="prompt-list">
<p class="quick-prompt"><span>Scaffold a new independent project from the template. Explain the destination and chosen template revision, run setup, then interview me in this conversation.</span><button type="button" class="copy-prompt">Copy prompt</button></p>
<p class="quick-prompt"><span>Resume this project. Read its state, saved decisions and handoff. Tell me the next decision or task before continuing.</span><button type="button" class="copy-prompt">Copy prompt</button></p>
<p class="quick-prompt"><span>Walk me through the next epic: expected behavior, scope, examples, estimated work, risks and what I will inspect when it is done.</span><button type="button" class="copy-prompt">Copy prompt</button></p>
<p class="quick-prompt"><span>Show model usage and subscription accounting. Separate observed tokens, API-equivalent estimates, actual payments and project allocation. Explain missing data.</span><button type="button" class="copy-prompt">Copy prompt</button></p>
<p class="quick-prompt"><span>Preview an OS update from the template. Show files to update, retire or reconcile, preserve my project records, then validate the applied changes.</span><button type="button" class="copy-prompt">Copy prompt</button></p>
<p class="quick-prompt"><span>Save a handoff for another agent. Record what changed, evidence paths, unresolved decisions and the exact next step.</span><button type="button" class="copy-prompt">Copy prompt</button></p>
</div>

### What this guide covers

The OS lifecycle is: export → setup → discovery → delivery and capability decisions → epic planning → implementation and verification → demonstration and acceptance → release assessment. Sessions, usage capture and handoffs keep that work recoverable. OS updates maintain the tooling across the life of the product.

The HTML is an offline document. It displays information and copies text; it does not run shell commands, submit interview answers, connect accounts or mutate your project. Open `dashboard.html` to inspect current project status. After an agent changes source records, regenerate the pages and reload your browser.
