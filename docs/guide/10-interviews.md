## How interviews work

An interview is a saved conversation about decisions. Your agent reads the repository first, asks up to three independent questions at a time in chat, recommends an option with its tradeoff, then waits for you. You can answer naturally, correct an assumption or explain why something does not apply.

### What you experience

1. Ask the agent to start or resume the relevant interview.
2. The agent tells you what it already knows and asks only for missing intent or decisions.
3. You answer in the conversation. The agent saves those actual answers, then asks dependent follow-ups.
4. The agent reads the complete decision summary back. You confirm or correct it.
5. The agent records confirmation against that exact version and explains what is now ready to do.

For example, “Offline use matters more than collaboration in the first release” is useful discovery input. The agent should explore its effects on scope and architecture, not silently choose a database. “No fixed launch date yet” is also a valid delivery answer; it should remain an unknown target rather than become an invented promise.

### The interview sequence

<table><thead><tr><th>Interview</th><th>When and what it settles</th><th>Scope</th></tr></thead><tbody><tr><td>Discovery</td><td>Project name, users, problem, first release, constraints and observable success.</td><td>Project</td></tr><tr><td>Delivery</td><td>Proposed scope, decomposed estimates, uncertainty, capacity, dates and exit criteria.</td><td>Project</td></tr><tr><td>Capabilities</td><td>Harnesses, subscriptions, skills, accounting, testing and authorized review spend.</td><td>Project</td></tr><tr><td>Architecture</td><td>A consequential technical choice, its constraints, evidence and alternatives.</td><td>Project unless explicitly scoped</td></tr><tr><td>Design → content → UI</td><td>Frontend journeys, visual direction, approved claims, voice, interactions, accessibility and failure states.</td><td>Project by default</td></tr><tr><td>Epic kickoff</td><td>The next epic's outcome, boundaries, examples, dependencies and demonstration.</td><td>That epic</td></tr><tr><td>Change</td><td>What changed, which decisions are affected and the accepted revised direction.</td><td>Project or affected epic</td></tr><tr><td>Closeout</td><td>Demonstration, departures, remaining risks and your acceptance or required rework.</td><td>That epic</td></tr><tr><td>Release</td><td>Evidence against release criteria, explicit exceptions and acceptance.</td><td>Project</td></tr></tbody></table>

Discovery confirmation creates any missing lean-context files and starts delivery and capabilities. It does not overwrite an existing charter or fully populate a product roadmap from a few answers. The agent reconciles existing documents and expands the draft into agreed scope. Delivery and capability confirmation do not install dependencies, connect subscriptions or authorize arbitrary paid reviewers.

### Commands the agent uses

Start a session first if none is active. Discovery has a stable ID, `discovery-project`:

```bash
bash scripts/os.sh interview start discovery
bash scripts/os.sh interview packet discovery-project
bash scripts/os.sh interview record discovery-project project_name "My project"
bash scripts/os.sh interview review discovery-project
```

`record` saves one actual answer by its key. The agent records all required topics, then `review` returns the current digest and readback instruction. Only after your explicit confirmation does the agent use the returned digest:

```bash
bash scripts/os.sh interview confirm discovery-project CURRENT_DIGEST "ACTUAL_CONFIRMATION_REFERENCE"
bash scripts/os.sh interview status
bash scripts/os.sh next
```

The capitalized values are placeholders. A digest ties the receipt to the questions, answers and dependencies. It is not proof of your identity; the agent is responsible for citing the real answer and must not turn silence into approval.

Follow-on examples:

```bash
bash scripts/os.sh interview packet delivery-project
bash scripts/os.sh interview packet capabilities-project
bash scripts/os.sh interview start epic EPIC-001
bash scripts/os.sh interview gate TASK-001
```

The gate report shows whether implementation is allowed and names blockers. Finishing the last open task in an epic automatically starts closeout in workflow version 2. A closeout confirmation records the conversation; the agent still reconciles epic metadata and any accepted rework.

### Frontend interviews

With the frontend profile, the agent uses design, content and UI conversations alongside the project and epic work:

```bash
bash scripts/os.sh interview start design
bash scripts/os.sh interview start content
bash scripts/os.sh interview start ui
```

Run these in sequence after confirming their prerequisites. Content depends on design; UI depends on design and content. The agent should show references and concrete screen behavior, then record your decisions in project design documents. The frontend pack's legacy phase entry point routes into these conversations. It does not mean every project needs a website.

### Resume or change an answer

Say “Resume the interview using the answers already recorded.” The agent reads `packet` and continues from unanswered topics. Starting the same kind and scope returns its existing record, so you do not get duplicate interviews.

For a material epic change:

```bash
bash scripts/os.sh interview start change EPIC-001
```

The agent records the change and its effects, revises the affected source documents and reads the new understanding back. Editing a confirmed answer invalidates its confirmation. Dependent interviews also become stale when their recorded upstream digest changes. After the upstream decision is confirmed, the agent uses `interview revisit INTERVIEW_ID`, reconsiders the saved answers, and obtains fresh confirmation. Revisit does not approve old answers automatically.

Project interviews block all implementation; epic interviews block only the affected epic. Research, interview capture, diagnostics and recovery can continue while you are unavailable. An implementation claim cannot bypass the missing decision by changing a Markdown status label.
