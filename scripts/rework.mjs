#!/usr/bin/env node
// rework.mjs — manage rework feedback as repo artifacts (source of truth).
// The artifact, not a PR thread, is what blocks task closure. PR comments are
// only an optional input (see rework.sh from-github); they always land here.
//
// Commands:
//   open    <TASK> <text>        add a rework item (status: open); set task -> rework
//   resolve <TASK> <id> [note]   mark one item resolved (the agent does this)
//   close   <TASK>               accept all rework (fails unless every item resolved)
//   status  <TASK>               print open/resolved counts; exit 1 if any open
//   list    <TASK>               print the items
import fs from "node:fs";
import path from "node:path";

const DIR = "handoffs/rework";
const STATE = "project-state/STATE.json";
const [cmd, task, ...rest] = process.argv.slice(2);

if (!cmd || !task) {
  console.error("Usage: rework.mjs <open|resolve|close|status|list> TASK-XXX [...]");
  process.exit(2);
}
const file = path.join(DIR, `REWORK-${task}.md`);

function load() {
  if (!fs.existsSync(file)) return { src: "", items: [] };
  const src = fs.readFileSync(file, "utf8");
  const items = [];
  // Split on item headers; each block is "### [id] status: open|resolved\n<body>".
  const parts = src.split(/^### \[(\d+)\] status: (open|resolved)\n/gm);
  // parts[0] is the preamble; then repeating triples: [id, status, body].
  for (let i = 1; i < parts.length; i += 3) {
    const id = parts[i];
    const status = parts[i + 1];
    const body = (parts[i + 2] || "").trim();
    if (id && status) items.push({ id, status, body });
  }
  return { src, items };
}

function nextId(items) {
  return String(items.reduce((n, i) => Math.max(n, +i.id), 0) + 1).padStart(3, "0");
}

function render(items) {
  const banner = "<!-- rework artifact — source of truth for task rework; blocks closure while any item is open -->";
  const open = items.filter(i => i.status === "open").length;
  const head = `${banner}\n# Rework: ${task}\nopen: ${open} · total: ${items.length}\n`;
  const body = items.map(i =>
    `### [${i.id}] status: ${i.status}\n${i.body}\n`).join("\n");
  return head + "\n" + body;
}

function setTaskStatus(status) {
  if (!fs.existsSync(STATE)) return;
  const state = JSON.parse(fs.readFileSync(STATE, "utf8"));
  if (state.current && state.current.task === task) state.current.session_status = state.current.session_status;
  // queue a rework handoff if opening
  state.handoff_queue = state.handoff_queue || [];
  const qid = `HANDOFF-REWORK-${task}`;
  const existing = state.handoff_queue.find(h => h.id === qid);
  if (status === "rework") {
    if (!existing)
      state.handoff_queue.push({ id: qid, type: "rework", task_ref: `backlog/tasks/${task}.md`, file, status: "pending" });
    else existing.status = "pending";
  } else if (status === "cleared" && existing) {
    existing.status = "consumed";
  }
  state.updated = new Date().toISOString();
  fs.writeFileSync(STATE, JSON.stringify(state, null, 2) + "\n");
}

const { items } = load();

switch (cmd) {
  case "open": {
    const text = rest.join(" ").trim();
    if (!text) { console.error("open needs feedback text"); process.exit(2); }
    fs.mkdirSync(DIR, { recursive: true });
    const id = nextId(items);
    const who = process.env.REVIEWER_NAME || "human";
    items.push({ id, status: "open", body: `author: ${who}\nopened: ${new Date().toISOString()}\n\n${text}` });
    fs.writeFileSync(file, render(items));
    setTaskStatus("rework");
    console.log(`[rework] opened item [${id}] on ${task}. Task flagged for rework; closure blocked until resolved.`);
    break;
  }
  case "resolve": {
    const [id, ...noteParts] = rest;
    const it = items.find(i => i.id === id);
    if (!it) { console.error(`no rework item [${id}] on ${task}`); process.exit(1); }
    it.status = "resolved";
    const note = noteParts.join(" ").trim();
    it.body += `\n\nresolved: ${new Date().toISOString()}${note ? `\nnote: ${note}` : ""}`;
    fs.writeFileSync(file, render(items));
    const open = items.filter(i => i.status === "open").length;
    console.log(`[rework] item [${id}] resolved. ${open} item(s) still open.`);
    break;
  }
  case "close": {
    const open = items.filter(i => i.status === "open");
    if (open.length) {
      console.error(`[rework] CANNOT CLOSE ${task}: ${open.length} open item(s): ${open.map(i => i.id).join(", ")}`);
      process.exit(1);
    }
    setTaskStatus("cleared");
    console.log(`[rework] ${task} rework accepted — all items resolved. Closure unblocked.`);
    break;
  }
  case "status": {
    const open = items.filter(i => i.status === "open").length;
    console.log(`${task}: ${open} open / ${items.length} total`);
    process.exit(open > 0 ? 1 : 0);
  }
  case "list": {
    if (!items.length) { console.log(`${task}: no rework items`); break; }
    for (const i of items) {
      // Body starts with metadata lines (author/opened) then a blank line then feedback.
      const feedback = i.body.split(/\n\s*\n/).slice(1).join(" ").trim() || i.body;
      console.log(`[${i.id}] ${i.status}: ${feedback.slice(0, 80)}`);
    }
    break;
  }
  default:
    console.error(`unknown command: ${cmd}`);
    process.exit(2);
}
