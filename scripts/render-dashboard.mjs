#!/usr/bin/env node
// Generate dashboard.html from canonical project state and planning metadata.
// This is a view: edit state/spine/backlog sources, then rerun `os render`.
import fs from "node:fs";
import { execSync } from "node:child_process";
import { loadProgressModel } from "./progress.mjs";
import { loadEffortModel } from "./effort.mjs";

const STATE = "project-state/state.json";
const LEDGER = "project-state/ledger.jsonl";
const OUT = "dashboard.html";

const esc = (value) => String(value ?? "—").replace(/[&<>"]/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;",
}[char]));
const readJson = file => JSON.parse(fs.readFileSync(file, "utf8"));
const exists = file => fs.existsSync(file);

function readLedger() {
  if (!exists(LEDGER)) return [];
  return fs.readFileSync(LEDGER, "utf8").split(/\r?\n/).filter(Boolean)
    .map(line => { try { return JSON.parse(line); } catch { return null; } })
    .filter(Boolean);
}

function fmStatus(file) {
  if (!exists(file)) return null;
  const match = fs.readFileSync(file, "utf8").match(/^---[\s\S]*?status:\s*(\S+)/);
  return match ? match[1] : "unknown";
}

function dependencyPlans() {
  const dir = "planning/dependencies";
  if (!exists(dir)) return [];
  const scalar = (frontmatter, key) => {
    const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, "m"));
    return match ? match[1].replace(/^["']|["']$/g, "") : "unknown";
  };
  return fs.readdirSync(dir)
    .filter(name => name.endsWith(".md") && name !== "README.md")
    .map(name => {
      const file = `${dir}/${name}`;
      const source = fs.readFileSync(file, "utf8");
      const frontmatter = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/)?.[1] || "";
      return {
        file,
        id: scalar(frontmatter, "id"),
        mode: scalar(frontmatter, "mode"),
        status: scalar(frontmatter, "status"),
        humanApproval: scalar(frontmatter, "human_approval"),
        purpose: scalar(frontmatter, "purpose"),
        modified: fs.statSync(file).mtimeMs,
      };
    })
    .sort((a, b) => b.modified - a.modified);
}

function nextStep(state) {
  let hooksPath = "";
  try {
    hooksPath = execSync("git config core.hooksPath", {
      encoding: "utf8", stdio: ["pipe", "pipe", "ignore"],
    }).trim();
  } catch { /* setup probe is best-effort */ }

  if (hooksPath !== ".githooks") {
    return { owner: "HUMAN", command: "bash setup.sh", why: "Wire this clone once." };
  }
  const brief = fmStatus("project-spine/00-brief.md");
  const interview = fmStatus("project-spine/00-interview.md");
  if (!brief) return { owner: "HUMAN", command: "bash scripts/intake.sh brief", why: "Write the project intent." };
  if (brief !== "ready") return { owner: "HUMAN", command: "finish 00-brief.md; set status: ready", why: "The brief still needs human intent." };
  if (!interview) return { owner: "AGENT", command: "bash scripts/intake.sh interview", why: "Turn gaps in the brief into questions." };
  if (interview !== "answered") return { owner: "HUMAN", command: "answer 00-interview.md; set status: answered", why: "The agent is waiting on project facts." };
  if (!exists("project-spine/01-charter.md")) {
    return { owner: "AGENT", command: 'hydrate the lean context', why: "Draft charter, decisions, and roadmap for human review." };
  }
  if (!state.current?.task) {
    const dependencyPlan = dependencyPlans()
      .find(plan => !["installed", "decided", "rejected", "superseded"].includes(plan.status));
    if (dependencyPlan?.status === "evidence-collected" || dependencyPlan?.status === "draft") {
      return {
        owner: "AGENT",
        command: `complete ${dependencyPlan.file}; set status: review-ready`,
        why: `${dependencyPlan.id} still needs its cross-package evidence and conclusion.`,
      };
    }
    if (dependencyPlan?.status === "review-ready" || dependencyPlan?.humanApproval === "pending") {
      return {
        owner: "HUMAN",
        command: `review ${dependencyPlan.file}; approve, revise, or reject it`,
        why: `${dependencyPlan.id} cannot authorize a dependency or architecture choice without you.`,
      };
    }
    if (dependencyPlan?.status === "approved" && dependencyPlan.mode === "architecture") {
      return {
        owner: "AGENT",
        command: `record the accepted choice with os decide; reference ${dependencyPlan.file}; set status: decided`,
        why: `${dependencyPlan.id} is approved and ready to become durable project memory.`,
      };
    }
    if (dependencyPlan?.status === "approved") {
      return {
        owner: "AGENT",
        command: `bash scripts/os.sh deps install ${dependencyPlan.file}`,
        why: `${dependencyPlan.id} is human-approved and ready for exact installation.`,
      };
    }
  }
  if ((state.counts?.epics_total ?? 0) === 0) {
    return { owner: "AGENT", command: "shape the first epic and tasks", why: "Translate the roadmap into executable work." };
  }
  if (!state.current?.task && (state.counts?.tasks_open ?? 0) > 0) {
    const win = loadEffortModel().quickWins[0];
    const why = win
      ? `${state.counts.tasks_open} task(s) are ready. Quickest: ${win.id} (weight ${win.weight}).`
      : `${state.counts.tasks_open} task(s) are ready.`;
    return { owner: "AGENT", command: "claim the next ready task", why };
  }
  if (!state.current?.task) {
    return { owner: "HUMAN + AGENT", command: "choose and shape the next roadmap item", why: "There is no ready work." };
  }
  if (!exists("project-state/session.lock")) {
    return { owner: "AGENT", command: "bash scripts/os.sh start", why: `${state.current.task} is claimed without an open session.` };
  }
  return { owner: "AGENT", command: `bash scripts/os.sh end backlog/tasks/${state.current.task}.md`, why: "After implementation and checks, close the session and prepare the PR." };
}

const percent = value => value == null ? "Not estimable" : `${value}%`;
const meter = (value, label) => value == null
  ? `<div class="meter unknown" role="img" aria-label="${esc(label)} is not estimable"><span></span></div>`
  : `<div class="meter" role="progressbar" aria-label="${esc(label)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${value}"><span style="width:${Math.max(0, Math.min(100, value))}%"></span></div>`;

function progressRows(items, type) {
  if (!items.length) {
    return `<div class="empty">No structured ${esc(type)} metadata yet. The estimate will sharpen after the human approves goals and roadmap links.</div>`;
  }
  return items.map(item => `
    <div class="progress-row">
      <div class="row-copy">
        <strong>${esc(item.id)} · ${esc(item.title)}</strong>
        <small>${item.tasksDone}/${item.tasksTotal} linked tasks done${item.successSignal ? ` · success signal: ${esc(item.successSignal)}` : ""}${item.outcomeStatus ? ` · outcome: ${esc(item.outcomeStatus)}` : ""}</small>
      </div>
      <div class="row-meter">${meter(item.percent, `${item.id} progress`)}<b>${percent(item.percent)}</b></div>
    </div>`).join("");
}

if (!exists(STATE)) {
  console.error(`[dashboard] missing ${STATE}`);
  process.exit(1);
}

const state = readJson(STATE);
const rows = readLedger();
const progress = loadProgressModel();
const effort = loadEffortModel();
const next = nextStep(state);
const counts = state.counts || {};
const current = state.current || {};
const completion = state.completion || {};
const totals = state.metrics?.totals || {};
const actor = state.actor?.harness
  ? `${state.actor.harness} / ${state.actor.model || "unknown"} (${state.actor.role || "unknown"})`
  : "unknown";
const confidenceText = {
  high: "High: every goal and roadmap item has scoped work; at least 90% of tasks trace through both.",
  medium: "Medium: intent metadata exists, but some scope or task-to-intent links are missing.",
  low: "Low: treat this as a rough planning signal until goals, roadmap scope, and links are completed.",
}[progress.confidence];
const fmtMin = value => Number.isFinite(+value)
  ? (+value >= 60 ? `${Math.floor(+value / 60)}h ${Math.round(+value % 60)}m` : `${Math.round(+value)}m`)
  : "—";

const handoffs = (state.handoff_queue || []).map(handoff => `
  <tr><td>${esc(handoff.id)}</td><td>${esc(handoff.type)}</td><td>${esc(handoff.task_ref)}</td>
  <td><code>${esc(handoff.file)}</code></td><td>${esc(handoff.status)}</td></tr>`).join("")
  || `<tr><td colspan="5" class="empty">No handoffs queued.</td></tr>`;

const dependencyEvidence = dependencyPlans().map(plan => `
  <tr><td>${esc(plan.id)}</td><td>${esc(plan.mode)}</td><td>${esc(plan.purpose)}</td>
  <td>${esc(plan.status)}</td><td>${esc(plan.humanApproval)}</td><td><code>${esc(plan.file)}</code></td></tr>`).join("")
  || `<tr><td colspan="6" class="empty">No dependency evidence plans yet. Create one before the first package install, or before adding, upgrading, or choosing system-wide technology.</td></tr>`;

const unlinked = progress.tasks.unlinked.length
  ? `<details class="warning"><summary>${progress.tasks.unlinked.length} task(s) weaken the estimate</summary>
      <p>Add valid roadmap and goal references directly or through their epic:</p>
      <ul>${progress.tasks.unlinked.map(task => `<li><code>${esc(task.file)}</code></li>`).join("")}</ul>
    </details>`
  : "";

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Agent OS · Project dashboard</title>
<style>
:root{--bg:#f4f1ea;--paper:#fffdf8;--ink:#20231f;--muted:#666b63;--line:#d9d5ca;--brand:#245548;--accent:#c75b37;--soft:#e4eee8;--warn:#8a4a14}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 Inter,ui-sans-serif,system-ui,sans-serif}
header{background:var(--brand);color:#fff;padding:24px max(24px,calc((100vw - 1160px)/2));display:flex;justify-content:space-between;gap:24px;align-items:center}
h1{font-size:22px;margin:0}header p{margin:2px 0 0;color:#d9e6e1;font-size:13px}.header-links{display:flex;gap:10px;flex-wrap:wrap}
.button{display:inline-block;border:1px solid #91b0a5;border-radius:6px;color:#fff;text-decoration:none;padding:8px 12px;font-weight:700;font-size:13px}
main{max-width:1160px;margin:auto;padding:28px 24px 48px}.eyebrow{text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-size:11px;font-weight:800}
.hero{display:grid;grid-template-columns:1.3fr .7fr;gap:16px;margin-bottom:16px}.card{background:var(--paper);border:1px solid var(--line);border-radius:10px;padding:18px;margin-bottom:16px}
.next{border-left:6px solid var(--accent)}.next h2{font-size:19px;margin:4px 0}.owner{display:inline-block;border-radius:999px;padding:3px 9px;background:#fae6dc;color:#823a22;font-size:11px;font-weight:800}
.command{background:#242824;color:#f8f7f2;border-radius:6px;padding:10px 12px;display:block;overflow:auto}.overall{font-size:44px;line-height:1;font-weight:850;color:var(--brand);margin:8px 0}
.meter{height:10px;border-radius:99px;background:#e3e0d7;overflow:hidden}.meter span{display:block;height:100%;background:var(--brand);border-radius:inherit}.meter.unknown span{width:100%;background:repeating-linear-gradient(135deg,#d9d5ca,#d9d5ca 7px,#eeeae1 7px,#eeeae1 14px)}
.warning{background:#fff5e9;border:1px solid #e7b98e;border-radius:8px;padding:10px 12px;color:#65330e;margin-top:12px}.warning summary{font-weight:800;cursor:pointer}
.disclaimer{font-size:13px;color:var(--muted);border-top:1px solid var(--line);padding-top:10px;margin-top:12px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.progress-row{display:grid;grid-template-columns:1fr minmax(190px,.55fr);gap:20px;align-items:center;padding:12px 0;border-bottom:1px solid var(--line)}.progress-row:last-child{border:0}
.row-copy small{display:block;color:var(--muted);margin-top:3px}.row-meter{display:grid;grid-template-columns:1fr 88px;gap:10px;align-items:center}.row-meter b{text-align:right}
h2{font-size:17px;margin:0 0 12px}h3{font-size:14px;margin:0 0 10px}.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px}.stat{background:var(--soft);border-radius:7px;padding:12px}.stat b{font-size:23px;display:block;color:var(--brand)}.stat span{font-size:12px;color:var(--muted)}
dl{display:grid;grid-template-columns:100px 1fr;gap:5px 12px;margin:0}dt{color:var(--muted)}dd{margin:0}code{font:12px ui-monospace,SFMono-Regular,Consolas,monospace;background:#eeece5;border-radius:4px;padding:2px 5px}
table{border-collapse:collapse;width:100%;font-size:13px}th,td{text-align:left;border-bottom:1px solid var(--line);padding:9px}th{color:var(--muted);font-size:11px;text-transform:uppercase}.empty{color:var(--muted);padding:12px 0}
footer{text-align:center;color:var(--muted);font-size:12px;padding:20px}
@media(max-width:760px){.hero,.grid{grid-template-columns:1fr}.stats{grid-template-columns:repeat(2,1fr)}.progress-row{grid-template-columns:1fr}.header-links{width:100%}header{align-items:flex-start;flex-direction:column}}
</style>
</head>
<body>
<header>
  <div><h1>Project dashboard</h1><p>Generated ${esc(state.updated || "never")} · operational memory, delivery trace, and recovery</p></div>
  <div class="header-links"><a class="button" href="guide.html">Open idiot-proof guide ↗</a><a class="button" href="project-state/current-state.md">Raw current state</a></div>
</header>
<main>
  <section class="hero">
    <article class="card next">
      <div class="eyebrow">Do this next · <span class="owner">${esc(next.owner)}</span></div>
      <h2>${esc(next.why)}</h2>
      <code class="command">${esc(next.command)}</code>
    </article>
    <article class="card">
      <div class="eyebrow">Estimated delivery toward intent</div>
      <div class="overall">${percent(progress.overallPercent)}</div>
      ${meter(progress.overallPercent, "Estimated delivery toward intent")}
      <p><strong>${esc(progress.confidence)} confidence.</strong> ${esc(confidenceText)}</p>
      <div class="disclaimer">${esc(progress.warning)}</div>
    </article>
  </section>

  ${unlinked}

  <section class="card">
    <h2>Business-goal progress</h2>
    ${progressRows(progress.goals, "business-goal")}
  </section>

  <section class="card">
    <h2>Roadmap progress</h2>
    ${progressRows(progress.roadmap, "roadmap")}
  </section>

  <section class="card">
    <h2>Work inventory</h2>
    <div class="stats">
      <div class="stat"><b>${counts.epics_total ?? 0}</b><span>epics</span></div>
      <div class="stat"><b>${counts.tasks_open ?? 0}</b><span>ready tasks</span></div>
      <div class="stat"><b>${counts.tasks_in_progress ?? 0}</b><span>in progress</span></div>
      <div class="stat"><b>${counts.tasks_done ?? 0}</b><span>done tasks</span></div>
      <div class="stat"><b>${progress.tasks.coveragePercent}%</b><span>intent trace coverage</span></div>
      <div class="stat"><b>${progress.tasks.scopeCoveragePercent}%</b><span>goals/roadmap with tasks</span></div>
    </div>
  </section>

  <section class="card">
    <h2>Effort & estimation</h2>
    <div class="stats">
      <div class="stat"><b>${fmtMin(effort.trackedMin)}</b><span>tracked effort</span></div>
      <div class="stat"><b>${effort.unattributed.sessions}</b><span>unattributed sessions</span></div>
      <div class="stat"><b>${effort.longest.length}</b><span>tasks with effort</span></div>
      ${effort.calibration.baselineMinPerWeight != null ? `<div class="stat"><b>${Math.round(effort.calibration.baselineMinPerWeight)}m</b><span>per weight · n=${effort.calibration.n}</span></div>` : ""}
    </div>
    ${effort.longest.length ? `
    <table><thead><tr><th>Task</th><th>Epic</th><th>Effort</th><th>Sessions</th><th>Weight</th><th>Flag</th></tr></thead>
    <tbody>${effort.longest.map(t => `
      <tr><td><code>${esc(t.id)}</code></td><td>${esc(t.epic || "—")}</td><td>${fmtMin(t.totalMin)}</td>
      <td>${t.sessions}${t.gateFails ? ` · ${t.gateFails} fail` : ""}</td><td>${t.weight}</td>
      <td>${t.flag ? esc(t.flag) : "—"}</td></tr>`).join("")}</tbody></table>` : `<p class="empty">No completed sessions with task attribution yet.</p>`}
    ${effort.quickWins.length ? `<h3>Quick wins</h3><ul>${effort.quickWins.map(t => `<li><code>${esc(t.id)}</code> · ${esc(t.title)} · weight ${t.weight}</li>`).join("")}</ul>` : ""}
    ${effort.unattributed.sessions ? `<p class="empty">${effort.unattributed.sessions} session(s) ran with no claimed task (${fmtMin(effort.unattributed.minutes)} unattributed) — run <code>os claim</code> to attribute effort.</p>` : ""}
    <p class="empty">${effort.calibration.baselineMinPerWeight == null ? `Estimation baseline needs ≥5 completed tasks (have ${effort.calibration.n}).` : `Baseline: ~${Math.round(effort.calibration.baselineMinPerWeight)} min per weight (n=${effort.calibration.n}).`}</p>
  </section>

  <section class="grid">
    <article class="card"><h2>Active work</h2><dl>
      <dt>Epic</dt><dd>${esc(current.epic)}</dd><dt>Slice</dt><dd>${esc(current.slice)}</dd>
      <dt>Task</dt><dd>${esc(current.task)}</dd><dt>Branch</dt><dd><code>${esc(current.branch)}</code></dd>
      <dt>Actor</dt><dd>${esc(actor)}</dd>
    </dl></article>
    <article class="card"><h2>Session history</h2><dl>
      <dt>Sessions</dt><dd>${totals.sessions ?? rows.length}</dd>
      <dt>Gate pass / fail</dt><dd>${totals.gate_pass ?? 0} / ${totals.gate_fail ?? 0}</dd>
      <dt>Crashed</dt><dd>${totals.crashed ?? 0}</dd>
    </dl></article>
  </section>

  <section class="card"><h2>Completion narrative</h2>
    <p>${esc(completion.summary || "No completion summary yet.")}</p>
    ${completion.done?.length ? `<h3>Done</h3><ul>${completion.done.map(item => `<li>${esc(item)}</li>`).join("")}</ul>` : ""}
    ${completion.remaining?.length ? `<h3>Remaining</h3><ul>${completion.remaining.map(item => `<li>${esc(item)}</li>`).join("")}</ul>` : ""}
    <p><strong>Blocked:</strong> ${esc(completion.blocked || "none")}</p>
  </section>

  <section class="card"><h2>Dependency evidence and approvals</h2>
    <p class="empty">OpenSrc supplies version-matched source and documentation. Package-manager resolution plus explicit cross-package review supplies the compatibility decision.</p>
    <table><thead><tr><th>ID</th><th>Mode</th><th>Purpose</th><th>Status</th><th>Human</th><th>File</th></tr></thead><tbody>${dependencyEvidence}</tbody></table>
  </section>

  <section class="card"><h2>Handoff queue</h2>
    <table><thead><tr><th>ID</th><th>Type</th><th>Task</th><th>File</th><th>Status</th></tr></thead><tbody>${handoffs}</tbody></table>
  </section>
</main>
<footer>Generated view. Sources: <code>state.json</code>, charter, roadmap, epics, tasks, dependency evidence, done work, and ledger. Never edit this HTML.</footer>
</body>
</html>`;

fs.writeFileSync(OUT, html);
console.log(`[dashboard] wrote ${OUT}; progress=${percent(progress.overallPercent)} (${progress.confidence} confidence)`);
