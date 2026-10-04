#!/usr/bin/env node
// Generate the one-page delivery dashboard from canonical models and state.
// One delivery goal: release-candidate readiness. No inferred outcome-goal
// hierarchy — roadmap items render once, progress is measured against release
// scope, and every date carries its source.
import fs from "node:fs";
import { brandCSS } from "./brand.mjs";
import path from "node:path";
import { nextAction } from "./workflow.mjs";
import { usageModel } from "./usage.mjs";
import { execSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { loadProgressModel } from "./progress.mjs";
import { loadEffortModel } from "./effort.mjs";
import { loadForecastModel } from "./forecast.mjs";
import { loadMetricsModel } from "./render-metrics.mjs";

const STATE = "project-state/state.json";
const OUT = "dashboard.html";
const esc = value => String(value ?? "—").replace(/[&<>"]/g, character => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;",
}[character]));
const exists = file => fs.existsSync(file);
const readJson = file => JSON.parse(fs.readFileSync(file, "utf8"));

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
  return fs.readdirSync(dir).filter(name => name.endsWith(".md") && name !== "README.md").map(name => {
    const file = `${dir}/${name}`;
    const source = fs.readFileSync(file, "utf8");
    const frontmatter = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/)?.[1] || "";
    return {
      file, id: scalar(frontmatter, "id"), mode: scalar(frontmatter, "mode"),
      status: scalar(frontmatter, "status"), humanApproval: scalar(frontmatter, "human_approval"),
      purpose: scalar(frontmatter, "purpose"), modified: fs.statSync(file).mtimeMs,
    };
  }).sort((a, b) => b.modified - a.modified);
}

function nextStep(state) { return nextAction(process.cwd(), state); }
function attentionBand(next) {
 return '<section class="band" id="next"><h2>What happens next</h2><p><strong>'+esc(String(next.owner).toLowerCase().replace(/^./,c=>c.toUpperCase()))+'</strong> · '+esc(next.why)+'</p><blockquote>'+esc(next.prompt||next.command)+'</blockquote><details><summary>Agent action</summary><code>'+esc(next.command)+'</code></details></section>';
}
function usageBand() {
 const u=usageModel(),money=v=>v==null?'Unknown':'USD '+v.toFixed(2);
 const budgets=u.allocations.length?'<h3>Subscription periods</h3><ul>'+u.allocations.map(a=>'<li><strong>'+esc(a.name||a.id)+'</strong>: '+(a.budget!=null?'budget '+money(a.budget):'payment '+money(a.paid))+' · '+esc(a.start||'')+' to '+esc(a.end||'')+' · allocated '+money(a.allocated)+(a.reason?' · '+esc(a.reason):'')+'</li>').join('')+'</ul>':'';
 return '<section class="band" id="usage"><h2>Models and usage</h2><p>'+u.events+' observations · '+u.known_models+' with model identity · '+u.estimated_coverage+' with a cost estimate</p>'+(u.events?'<div class="table-wrap"><table><thead><tr><th>Task / work</th><th>Harness / model</th><th>Observed tokens</th><th>API-equivalent estimate</th><th>Subscription allocation</th></tr></thead><tbody>'+u.groups.map(g=>'<tr><td>'+esc(g.task)+'<br><small>'+esc(g.work_type)+'</small></td><td>'+esc(g.harness)+'<br><small>'+esc(g.model)+'</small></td><td>'+g.tokens.toLocaleString()+'</td><td>'+money(g.estimated)+'</td><td>'+(u.allocations.some(a=>a.allocated!==null)?money(g.allocated):'Not configured')+'</td></tr>').join('')+'</tbody></table></div>':'<p>No supported usage observations yet. Ask your agent to connect its current session or import a native usage export.</p>')+budgets+'<p>'+esc(u.note)+'</p></section>';
}
const percent = value => value == null ? "not estimable" : `${value}%`;
const ratio = item => item?.percent == null ? "unavailable" : `${item.percent}% (${item.numerator}/${item.denominator})`;
const fmtMin = value => Number.isFinite(+value)
  ? (+value >= 60 ? `${Math.floor(+value / 60)}h ${Math.round(+value % 60)}m` : `${Math.round(+value)}m`) : "—";
const fmtDate = value => value ? String(value).slice(0, 10) : null;

// ── 01 · RC readiness summary ────────────────────────────────────────────────
function rcBand(forecast, progress, state, metrics) {
  const rc = forecast.rc;
  if (!rc.configured) {
    const totalTasks = (state.counts?.tasks_open ?? 0) + (state.counts?.tasks_in_progress ?? 0) + (state.counts?.tasks_done ?? 0);
    const dated = forecast.sample.n;
    return `<section id="overview" class="release-band empty-release">
      <div class="release-kicker">RC not configured</div>
      <div class="empty-line"><strong>Release:</strong> <span>no <code>release:</code> block in <code>project-spine/03-roadmap.md</code> — the dashboard has one delivery goal once it exists</span></div>
      <div class="empty-line"><strong>Work that exists:</strong> <span>${state.counts?.epics_total ?? 0} epics · ${totalTasks} tasks (${state.counts?.tasks_done ?? 0} done) · ${progress.roadmap.length} roadmap item(s) · ${dated} dated completion(s)</span></div>
      <div class="empty-line"><strong>Progress:</strong> <span>${progress.scope === "not-estimable" ? "not estimable yet" : `${percent(progress.overallPercent)} of filed ${progress.scope} scope (provisional — not an RC percentage)`}</span></div>
      <div class="empty-line"><strong>Forecast:</strong> <span>withheld — an RC needs human-approved scope, estimate, and target before a date is honest</span></div>
      <div class="empty-line"><strong>Setup:</strong> <span>add <code>release:</code> with <code>status: approved</code>, <code>target_date</code>, <code>scope_refs</code>, and exit criteria to <code>project-spine/03-roadmap.md</code></span></div>
      <div class="empty-line"><strong>OS usage:</strong> <span>${metrics?.totals?.sessions ?? 0} sessions · ${metrics?.health?.taskAttribution?.numerator ?? 0} attributed to a task · ${metrics?.commandObservation?.events ?? 0} commands instrumented</span></div>
    </section>`;
  }
  const schedule = forecast.schedule;
  const range = schedule.range ? `${schedule.range.earliest} to ${schedule.range.latest}` : null;
  const baselineWeight = rc.baselineWeight;
  const scopeChange = rc.scopeChange;
  const criteria = rc.exitCriteria;
  const readiness = rc.ready
    ? "Ready"
    : !rc.approved
      ? `Draft — approval required`
    : rc.percent === 100 && criteria.unmet > 0
      ? `Not ready — ${criteria.unmet} exit criterion/criteria pending`
      : "In progress";
  return `<section id="overview" class="release-band">
    <div class="release-kicker">${esc(rc.id)} · ${esc(rc.title || "release candidate readiness")} · ${esc(readiness)}</div>
    ${rc.summary ? `<p class="release-summary">${esc(rc.summary)}</p>` : ""}
    <div class="release-grid">
      <div><span>RC scope complete</span><strong>${percent(rc.percent)}</strong><small>${rc.doneWeight} of ${rc.currentProjectedWeight} weight</small></div>
      <div><span>Working target</span><strong>${esc(fmtDate(rc.targetDate) || "Not set")}</strong><small>human-set · ±${rc.toleranceDays}d tolerance</small></div>
      <div><span>Current forecast</span><strong>${esc(schedule.forecastDate || "Unavailable")}</strong><small>${range ? esc(range) : `confidence ${esc(forecast.rate.confidence)}`}</small></div>
      <div><span>Schedule</span><strong class="status ${esc(schedule.statusKey)}">${esc(schedule.status)}</strong><small>${esc(schedule.recoveryNote || "forecast compared with target")}</small></div>
    </div>
    <div class="completion-track" role="progressbar" aria-label="Weighted RC completion" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${rc.percent ?? 0}"><span style="width:${Math.max(0, Math.min(100, rc.percent ?? 0))}%"></span></div>
    <div class="release-secondary">
      <span><b>Pace</b> ${forecast.rate.rate ?? "unavailable"} weight/day observed · ${schedule.requiredRate ?? "unavailable"} weight/day required</span>
      <span><b>Scope</b> baseline ${baselineWeight ?? "pending"} · ${rc.remainingWeight ?? "—"} remaining · change ${scopeChange == null ? "unavailable" : `${scopeChange >= 0 ? "+" : ""}${scopeChange}`}</span>
      <span><b>Exit criteria</b> ${criteria.total ? `${criteria.total - criteria.unmet}/${criteria.total} met` : "none configured"}</span>
    </div>
    <p class="evidence"><strong>Evidence:</strong> ${esc(schedule.evidence)} · ${esc(forecast.rate.sourceNote)}</p>
    ${(rc.unfiledWeight || rc.unestimatedRoadmap.length) ? `<p class="evidence migration"><strong>Scope still to file or estimate:</strong> ${rc.unfiledWeight} estimated weight is not yet filed${rc.unestimatedRoadmap.length ? ` · missing estimates: ${esc(rc.unestimatedRoadmap.join(", "))}` : ""}. Weighted completion is not release readiness.</p>` : ""}
    ${rc.legacyBaseline && forecast.baselineMigration ? `<p class="evidence migration"><strong>Baseline migration:</strong> ${esc(forecast.baselineMigration)}</p>` : ""}
  </section>`;
}

// ── 02 · planned, actual, and forecast schedule ─────────────────────────────
function timelineBand(forecast) {
  const view = forecast.visualization;
  if (!view.available) {
    const present = forecast.prerequisites.present.join(" · ") || "none";
    const missing = forecast.prerequisites.missing.map(item => item.message).join(" · ") || "timeline geometry unavailable";
    return `<section id="timeline" class="band"><div class="section-head"><div><span>02</span><h2>Release runway</h2></div><p>${esc(view.summary)}</p></div><div class="empty-card"><strong>Present:</strong> ${esc(present)}<br><strong>Missing:</strong> ${esc(missing)}. Historical pace remains ${forecast.rate.rate ? `${forecast.rate.rate} weight/day (${esc(forecast.rate.name)})` : `unavailable (${forecast.sample.n} dated completion(s))`}.</div></section>`;
  }
  const runway = view.runway;
  const baseline = runway.baseline;
  const range = runway.range;
  const point = runway.forecast;
  const target = runway.target;
  const roadmapRows = view.roadmapRows.map(row => `<tr data-roadmap-id="${esc(row.id)}"><td><code>${esc(row.id)}</code></td><td>${esc(row.title)}</td><td><span class="road-state ${esc(row.state.replace(/ /g, "-"))}">${esc(row.state.replace(/^./, value => value.toUpperCase()))}</span></td><td>${row.actualEnd ? `Actual ${esc(row.actualEnd)}` : row.plannedStart ? `${esc(row.plannedStart)} to ${esc(row.plannedEnd)}` : esc(row.plannedEnd || "Not dated")}</td><td>${row.remainingWeight ?? "—"}</td></tr>`).join("");
  const planSummary = baseline && target
    ? `Remaining plan starts at ${baseline.weight ?? forecast.rc.doneWeight} earned weight on ${baseline.date} and reaches ${forecast.rc.currentProjectedWeight} by ${target.date}.`
    : "Remaining-work plan needs a release baseline and target.";
  return `<section id="timeline" class="band">
    <div class="section-head"><div><span>02</span><h2>Release runway</h2></div><p>${esc(planSummary)}</p></div>
    <svg class="rc-runway" viewBox="0 0 ${view.width} ${view.height}" role="img" aria-labelledby="rc-runway-title rc-runway-desc">
      <title id="rc-runway-title">Release candidate runway</title>
      <desc id="rc-runway-desc">${esc(view.summary)}</desc>
      <line class="runway-track" x1="70" y1="92" x2="830" y2="92"/>
      ${range ? `<rect class="runway-range" x="${range.x1}" y="76" width="${Math.max(4, range.x2 - range.x1)}" height="32" rx="16"/><text class="range-label" text-anchor="middle" x="${(range.x1 + range.x2) / 2}" y="68">Forecast range ${esc(range.earliest)} to ${esc(range.latest)}</text>` : ""}
      ${baseline ? `<path class="baseline-marker" d="M ${baseline.x} 84 l 8 8 l -8 8 l -8 -8 z"/><text x="${baseline.x}" y="128" text-anchor="middle">Assessment baseline</text><text x="${baseline.x}" y="145" text-anchor="middle">${esc(baseline.date)}</text>` : ""}
      <line class="today-marker" x1="${runway.today.x}" y1="48" x2="${runway.today.x}" y2="116"/><text x="${runway.today.x}" y="38" text-anchor="middle">Today ${esc(runway.today.date)}</text>
      ${point ? `<circle class="forecast-marker" cx="${point.x}" cy="92" r="8"/><text class="forecast-label" x="${point.x}" y="20" text-anchor="middle">Point forecast ${esc(point.date)}</text>` : ""}
      ${target ? `<path class="target-marker" d="M ${target.x - 8} 92 l 8 -12 l 8 12 l -8 12 z"/><text class="target-label" x="${target.x}" y="166" text-anchor="middle">Target ${esc(target.date)}</text>` : ""}
    </svg>
    <dl class="runway-mobile-facts">
      ${baseline ? `<div><dt>Assessment baseline</dt><dd>${esc(baseline.date)} · ${baseline.weight ?? forecast.rc.doneWeight} earned weight</dd></div>` : ""}
      <div><dt>Today</dt><dd>${esc(runway.today.date)}</dd></div>
      ${range ? `<div><dt>Forecast range</dt><dd>${esc(range.earliest)} to ${esc(range.latest)}</dd></div>` : ""}
      ${point ? `<div><dt>Point forecast</dt><dd>${esc(point.date)}</dd></div>` : ""}
      ${target ? `<div><dt>Working target</dt><dd>${esc(target.date)}</dd></div>` : ""}
    </dl>
    <div class="roadmap-table"><h3>Roadmap delivery</h3>${roadmapRows ? `<div class="table-wrap"><table><thead><tr><th>Item</th><th>Outcome</th><th>State</th><th>Delivery date</th><th>Remaining weight</th></tr></thead><tbody>${roadmapRows}</tbody></table></div>` : `<p class="empty">No in-scope roadmap items are available.</p>`}</div>
  </section>`;
}

// ── 03 · estimate calibration (each roadmap item once) ──────────────────────
function calibrationBand(forecast, progress) {
  const rows = forecast.calibration.roadmap;
  const scopeRefs = new Set(forecast.release?.scope_refs || []);
  const rowHtml = rows.map(item => {
    const estimate = item.estimatedWeight == null ? "—" : `${item.estimatedWeight} est × ${item.riskMultiplier} risk`;
    const scopeFlag = forecast.release
      ? (scopeRefs.has(item.id) ? `<span class="signal core">in RC scope</span>` : `<span class="signal low-use">out of scope</span>`)
      : "";
    return `<tr>
      <td><code>${esc(item.id)}</code>${scopeFlag}</td>
      <td>${esc(item.title)}</td>
      <td>${estimate} → ${item.filedWeight} filed → ${item.doneWeight} done</td>
      <td>${item.scopeRatio == null ? "—" : `${item.scopeRatio}×`}${item.breach ? ` <b class="breach">breach</b>` : ""}</td>
      <td>${item.projectedWeight ?? "—"}</td>
      <td>${item.remainingWeight ?? "—"}</td>
      <td>${esc(fmtDate(item.targetEnd) || "not set")}</td>
      <td>${esc(item.actualEnd || (item.complete ? "complete · date unavailable" : "—"))}</td>
    </tr>`;
  }).join("");
  return `<section id="calibration" class="band">
    <div class="section-head"><div><span>03</span><h2>Estimate calibration</h2></div><p>Each roadmap item once: estimated × risk → filed → done. Scope discovery is ${esc(forecast.calibration.discoveryRate)}× (${esc(forecast.calibration.discoveryEvidence)}).</p></div>
    ${rows.length ? `<div class="table-wrap"><table><thead><tr><th>Item</th><th>Title</th><th>estimated → filed → done</th><th>Discovery</th><th>Projected</th><th>Remaining</th><th>Target end</th><th>Actual end</th></tr></thead><tbody>${rowHtml}</tbody></table></div>` : `<div class="empty-card">No roadmap items in <code>project-spine/03-roadmap.md</code>.</div>`}
    ${progress.legacyGoals.length ? `<p class="footnote">Outcome goals in the charter remain as context only — they do not organize this dashboard.</p>` : ""}
  </section>`;
}

// ── 04 · current and remaining work (source-aware task states) ──────────────
const taskStateLabel = task => {
  if (task.done) {
    return task.completedAt
      ? `done · ${task.completedSource} completion ${fmtDate(task.completedAt)}`
      : "done · date unavailable";
  }
  const start = task.startedAt ? `started ${fmtDate(task.startedAt)} (${task.startedSource})` : "not started";
  return `open · ${start}`;
};

function taskList(tasks) {
  if (!tasks.length) return `<p class="empty">No filed tasks.</p>`;
  return `<ul class="task-list">${tasks.map(task => `<li data-task-id="${esc(task.id)}"><span class="task-state ${task.done ? "done" : "open"}">${task.done ? "done" : "open"}</span><code>${esc(task.id)}</code><span>${esc(task.title)}</span><b>${task.progressWeight} wt</b><small>${esc(taskStateLabel(task))}${task.impossibleOrder ? " · ⚠ impossible date ordering" : ""}</small></li>`).join("")}</ul>`;
}

function workBand(progress, forecast) {
  const items = progress.tasks.items;
  const doneWeight = items.filter(task => task.done).reduce((sum, task) => sum + task.progressWeight, 0);
  const openWeight = items.filter(task => !task.done).reduce((sum, task) => sum + task.progressWeight, 0);
  const epics = progress.epics.map(epic => {
    const tasks = items.filter(task => task.epicId === epic.id);
    const summary = epic.tasksTotal ? `${epic.doneWeight}/${epic.totalWeight} weight · ${epic.tasksDone}/${epic.tasksTotal} tasks` : "No filed work";
    return `<details class="epic" open><summary><span><code>${esc(epic.id)}</code> ${esc(epic.title)}</span><span>${summary}</span></summary>${taskList(tasks)}</details>`;
  }).join("");
  const loose = items.filter(task => !task.epicId);
  return `<section id="work" class="band">
    <div class="section-head"><div><span>04</span><h2>Current and remaining work</h2></div><p>${doneWeight} filed weight done · ${openWeight} filed weight open. Dates carry their source; rendering never invents or rewrites them.</p></div>
    ${epics || `<p class="empty">No epics filed.</p>`}
    ${loose.length ? `<details><summary>Tasks without an epic</summary>${taskList(loose)}</details>` : ""}
    <details class="unmapped" ${progress.tasks.unmapped.count ? "open" : ""}><summary>Missing roadmap linkage · ${progress.tasks.unmapped.count} task(s) · ${progress.tasks.unmapped.weight} weight · ${progress.tasks.unmapped.percentOfTotalWeight}% of filed weight</summary>${progress.tasks.unmapped.count ? `<p>Full task rows remain in their epic above. Missing links: ${items.filter(task => !task.roadmapRefs.length).map(task => `<code>${esc(task.id)}</code>`).join(" ")}</p>` : `<p class="empty">Every task has a roadmap link.</p>`}</details>
  </section>`;
}

// ── 05 · OS performance (feature utilization) ───────────────────────────────
function agentBand(metrics) {
  const health = metrics?.health;
  const features = metrics?.features || [];
  const sequences = metrics?.repeatedSequences || [];
  const featureRows = features.map(item => `<tr>
    <td><code>${esc(item.id)}</code><br><small>${item.commands.map(command => `<code>${esc(command)}</code>`).join(" ")}${item.introducedAt ? ` · since ${esc(item.introducedAt)}` : ""}</small></td>
    <td>${item.uses}<br><small>${item.sessionsWithUse} session(s)</small></td>
    <td>${item.opportunityKnown ? `${item.opportunities} (${esc(item.opportunity)})` : `unknown (${esc(item.opportunity)})`}</td>
    <td>${item.utilization == null ? "—" : `${item.utilization}%`}</td>
    <td>${item.uses ? `${item.successes}/${item.uses}` : "unavailable"}</td>
    <td>${esc(fmtDate(item.observationStart) || "not started")}<br><small>to ${esc(fmtDate(item.observationEnd) || "not started")}</small></td>
    <td><span class="signal ${item.repetition.status.replace(/ /g, "-")}">${esc(item.repetition.status)}</span>${item.automationCandidate ? ` <span class="signal automation-candidate">automation candidate</span>` : ""}<br><small>${esc(item.repetition.rationale)}</small></td>
    <td><span class="signal ${item.classification.replace(/ /g, "-")}">${esc(item.classification)}</span><br><small>${esc(item.rationale)}</small></td>
  </tr>`).join("");
  return `<section id="agent-os" class="band">
    <div class="section-head"><div><span>05</span><h2>Agent OS performance</h2></div><p>Local evidence only. Command arguments are never recorded; classifications are evidence for a human decision — nothing is pruned or automated automatically.</p></div>
    <div class="health-grid">
      <div><span>Task attribution</span><strong>${ratio(health?.taskAttribution)}</strong></div>
      <div><span>Clean endings</span><strong>${ratio(health?.cleanEnds)}</strong><small>${health?.cleanEnds?.crashed ?? 0} crashed</small></div>
    </div>
    <details><summary>Feature utilization and diagnostic evidence</summary><h3>Feature utilization</h3>
    ${features.length ? `<div class="table-wrap"><table><thead><tr><th>Feature</th><th>Uses</th><th>Opportunities</th><th>Utilization</th><th>Successes</th><th>Observation window</th><th>Repetition / automation</th><th>Utilization classification</th></tr></thead><tbody>${featureRows}</tbody></table></div>` : `<p class="empty">Feature telemetry begins with the next OS invocation.</p>`}
    ${sequences.length ? `<h3>Repeated adjacent sequences</h3><ul>${sequences.map(item => `<li><code>${esc(item.sequence)}</code> · ${item.count} repeats</li>`).join("")}</ul>` : ""}
    <p class="footnote">Shared telemetry span: ${esc(metrics?.commandObservation?.start || "not started")} to ${esc(metrics?.commandObservation?.end || "not started")} · ${metrics?.commandObservation?.events ?? 0} operation event(s). Each row shows its effective feature start. Unknown denominators abstain from underuse and overuse. Nothing is pruned or automated automatically.</p></details>
  </section>`;
}

// ── operations drawer ────────────────────────────────────────────────────────
function operations(state, effort, next) {
  const plans = dependencyPlans();
  const longestRows = effort.longest.length
    ? `<table><thead><tr><th>Task</th><th>Effort</th><th>Sessions</th><th>Weight</th><th>Flag</th></tr></thead><tbody>${effort.longest.map(t => `<tr><td><code>${esc(t.id)}</code>${t.noFile ? ` <small>(no file)</small>` : ""}</td><td>${fmtMin(t.totalMin)}</td><td>${t.sessions}${t.crashed ? ` · ${t.crashed} crashed` : ""}</td><td>${t.weight}</td><td>${t.flag ? esc(t.flag) : "—"}</td></tr>`).join("")}</tbody></table>`
    : `<p class="empty">No attributed sessions yet — effort appears after tasks are claimed and sessions end.</p>`;
  const quickWinsHtml = effort.quickWins.length
    ? `<ul>${effort.quickWins.map(t => `<li><code>${esc(t.id)}</code> · ${esc(t.title)} · weight ${t.weight}</li>`).join("")}</ul>`
    : "";
  const handoffs = state.handoff_queue || [];
  const pendingHandoffs = handoffs.filter(item => item.status === "pending").length;
  const resolvedHandoffs = handoffs.filter(item => item.status === "consumed" || item.status === "resolved").length;
  const handoffHtml = handoffs.length ? `<h3>Handoffs · ${pendingHandoffs} pending · ${resolvedHandoffs} resolved</h3><ul>${handoffs.map(item => `<li><code>${esc(item.file)}</code> · ${item.status === "consumed" ? "resolved" : esc(item.status)}</li>`).join("")}</ul>` : "";
  return `<details id="operations" class="drawer"><summary>Operations · next action, effort, handoffs, dependencies, completion</summary>
    <div class="drawer-grid"><article class="next-action"><span>${esc(next.owner)}</span><h3>${esc(next.why)}</h3><code>${esc(next.command)}</code></article>
    <article><h3>Effort calibration</h3><p>${fmtMin(effort.trackedMin)} tracked · ${effort.unattributed.sessions} unattributed session(s)</p><p>${effort.calibration.baselineMinPerWeight == null ? `Needs 5 completed attributed tasks; have ${effort.calibration.n}.` : `${Math.round(effort.calibration.baselineMinPerWeight)} min/weight · n=${effort.calibration.n}`}</p></article></div>
    <h3>Longest tasks</h3>${longestRows}
    ${quickWinsHtml ? `<h3>Quick wins</h3>${quickWinsHtml}` : ""}
    <h3>Completion narrative</h3><p>${esc(state.completion?.summary || "No completion summary yet.")}</p>
    ${handoffHtml}
    <h3>Dependency evidence</h3>${plans.length ? `<ul>${plans.map(plan => `<li><code>${esc(plan.id)}</code> · ${esc(plan.mode)} · ${esc(plan.status)} · human ${esc(plan.humanApproval)} · <code>${esc(plan.file)}</code></li>`).join("")}</ul>` : `<p class="empty">No dependency evidence plans.</p>`}
  </details>`;
}

function buildDataIssues(progress, forecast) {
  if (!forecast.release) return [];
  const issues = [];
  const add = (title, consequence, source, repair) => issues.push({ title, consequence, source, repair });
  if (!forecast.release.approved) add(
    `RC contract is ${forecast.release.status || "not approved"}`,
    "The release baseline and decision forecast cannot be trusted.",
    "project-spine/03-roadmap.md · release.status",
    "Review the contract and set release.status to approved when the human accepts it.",
  );
  if (!forecast.release.target_date) add(
    "RC has no working target",
    "Schedule status and required pace are unavailable.",
    "project-spine/03-roadmap.md · release.target_date",
    "Add target_date to the release contract.",
  );
  if (!forecast.release.scope_refs.length) add(
    "RC has no scope references",
    "Weighted completion cannot identify release-critical roadmap work.",
    "project-spine/03-roadmap.md · release.scope_refs",
    "Add the in-scope ROAD identifiers to release.scope_refs.",
  );
  if (forecast.prerequisites.missing.some(item => item.key === "scope-match")) add(
    "RC scope references match no roadmap items",
    "Weighted completion and forecast have no release scope to measure.",
    "project-spine/03-roadmap.md · release.scope_refs and roadmap[].id",
    "Correct release.scope_refs so each identifier matches an intended roadmap item.",
  );
  for (const id of forecast.rc.unestimatedRoadmap || []) add(
    `${id} has no estimated weight`,
    "RC completion and forecast are unreliable.",
    `project-spine/03-roadmap.md · roadmap.${id}.estimated_weight`,
    `Add estimated_weight to ${id}.`,
  );
  for (const id of forecast.rc.missingTargetEnds || []) add(
    `${id} has no target end`,
    "The remaining-work plan cannot place this roadmap item on the runway.",
    `project-spine/03-roadmap.md · roadmap.${id}.target_end`,
    `Add target_end to ${id}.`,
  );
  for (const item of forecast.sample.missing || []) add(
    `${item.id} has no completion date`,
    "Observed pace omits delivered work and may move the forecast.",
    item.file,
    `Add completed_at to ${item.id} or restore its completion ledger evidence.`,
  );
  for (const item of progress.tasks.impossibleOrder || []) add(
    `${item.id || item.file} completes before it starts`,
    "Cycle-time evidence excludes this task.",
    item.file,
    "Correct started_at or completed_at so the dates are chronological.",
  );
  if (forecast.baselineLegacy) add(
    "Release baseline uses the legacy schema",
    "Scope-change comparisons may lack projected-weight detail.",
    "project-state/state.json · release_baselines",
    "Run os render to migrate the baseline, then review the resulting scope history.",
  );
  if (progress.tasks.unlinked.length) add(
    `${progress.tasks.unlinked.length} task(s) lack roadmap linkage`,
    "Those tasks cannot be attributed reliably to RC scope.",
    progress.tasks.unlinked.map(item => item.file).join(", "),
    "Add roadmap_refs directly or through each task's epic_ref.",
  );
  return issues;
}

function dataIssuesBand(issues) {
  if (!issues.length) return "";
  return `<section id="data-issues" class="band issues-band"><div class="section-head"><div><h2>Data issues (${issues.length})</h2></div><p>Only defects that can change a delivery decision appear here.</p></div><ol class="issue-list">${issues.map(issue => `<li><h3>${esc(issue.title)}</h3><dl><div><dt>Consequence</dt><dd>${esc(issue.consequence)}</dd></div><div><dt>Source</dt><dd><code>${esc(issue.source)}</code></dd></div><div><dt>Repair</dt><dd>${esc(issue.repair)}</dd></div></dl></li>`).join("")}</ol></section>`;
}

export { nextStep };

function main() {
  if (!exists(STATE)) { console.error(`[dashboard] missing ${STATE}`); process.exit(1); }
  const state = readJson(STATE);
  const progress = loadProgressModel();
  const effort = loadEffortModel();
  const forecast = loadForecastModel(process.cwd(), { now: process.env.AGENT_OS_NOW || undefined });
  const next = nextStep(state);
  const metrics = loadMetricsModel();
  const dataIssues = buildDataIssues(progress, forecast);
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(state.project?.name || path.basename(process.cwd()))} · Agent OS</title>
<style>${brandCSS}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 var(--font-sans)}code{font:12px var(--font-mono);background:var(--surface-2);border-radius:0;padding:2px 5px}a{color:inherit}header.site{position:static;background:transparent;color:var(--ink)}.nav{max-width:none;margin:auto;padding:24px 4vw;display:flex;align-items:center;gap:24px}.brand{font-weight:850;letter-spacing:.01em;margin-right:auto}.nav a{text-decoration:none;color:var(--muted);font-size:13px}.nav a:hover{color:var(--ink)}.nav .guide{border:1px solid var(--line-strong);border-radius:0;padding:6px 9px}main{max-width:none;margin:auto;padding:24px 4vw}.release-band{background:var(--surface-2);color:var(--ink);border-radius:0;padding:24px;margin-bottom:22px;box-shadow:0 8px 24px transparent}.release-kicker{text-transform:none;letter-spacing:.12em;font-size:11px;font-weight:850;color:var(--caramel);margin-bottom:16px}.release-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--line-strong);border:1px solid var(--line-strong)}.release-grid>div{background:var(--surface-2);padding:14px}.release-grid span,.release-grid small{display:block;color:var(--muted);font-size:11px}.release-grid strong{display:block;font-size:22px;margin:4px 0}.evidence{margin:14px 0 0;color:var(--soft-ink)}.empty-release .empty-line{display:grid;grid-template-columns:130px 1fr;gap:8px;border-top:1px solid var(--line-strong);padding:7px 0}.empty-release code{background:var(--bg);color:var(--ink)}.empty-line span{color:var(--muted)}.band{background:var(--surface);border:1px solid var(--line);border-radius:0;padding:22px;margin-bottom:22px}.section-head{display:flex;align-items:flex-start;justify-content:space-between;gap:24px;border-bottom:1px solid var(--line);padding-bottom:14px;margin-bottom:18px}.section-head>div{display:flex;align-items:center;gap:10px}.section-head>div>span{font:800 12px var(--font-mono);color:var(--success)}h2{font-size:20px;margin:0}.section-head p{max-width:650px;margin:0;color:var(--muted);font-size:13px}.goal{border:1px solid var(--line);border-radius:0;margin:14px 0;overflow:hidden}.goal>header,.roadmap-item>header{display:flex;justify-content:space-between;gap:20px;align-items:center}.goal>header{padding:14px;background:var(--surface-2)}.goal h3,.roadmap-item h3{display:inline;margin:0 0 0 8px;font-size:16px}.goal header small,.roadmap-item header small{display:block;color:var(--muted);text-align:right}.roadmap-item{padding:16px;border-top:1px solid var(--line)}.weight-line{text-align:right}.epic{margin-top:12px;border-left:3px solid var(--caramel);padding:4px 0 4px 12px}.epic summary{display:flex;justify-content:space-between;gap:16px;cursor:pointer}.breach{color:var(--peach);margin-left:8px}.task-list{list-style:none;margin:10px 0;padding:0}.task-list li{display:grid;grid-template-columns:54px 105px 1fr 52px minmax(190px,.5fr);gap:8px;padding:7px 0;border-top:1px solid var(--line);align-items:center}.task-list small{color:var(--muted)}.task-state{text-transform:none;font-size:9px;font-weight:850;letter-spacing:.08em}.task-state.done{color:var(--success)}.task-state.open{color:var(--caramel)}.unmapped{margin-top:14px;border:1px solid var(--caramel);background:var(--surface-2);border-radius:0;padding:10px}.unmapped summary,.drawer summary{cursor:pointer;font-weight:800}.health-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px}.health-grid>div{background:var(--surface-2);padding:14px;border-radius:0}.health-grid span,.health-grid small{display:block;color:var(--muted);font-size:11px}.health-grid strong{display:block;font-size:18px;margin-top:3px}.table-wrap{overflow:auto}table{width:100%;border-collapse:collapse;font-size:13px}th,td{text-align:left;padding:9px;border-bottom:1px solid var(--line)}th{font-size:10px;text-transform:none;color:var(--muted)}.signal{font-size:10px;text-transform:none;font-weight:850}.signal.core{color:var(--success)}.signal.never-used{color:var(--peach)}.signal.low-use{color:var(--caramel)}.footnote,.empty{color:var(--muted);font-size:12px}.drawer{background:var(--surface);border:1px solid var(--line);border-radius:0;padding:14px;margin-bottom:12px}.drawer>summary{font-size:15px}.drawer[open]>summary{border-bottom:1px solid var(--line);padding-bottom:12px;margin-bottom:14px}.drawer-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.drawer article{background:var(--surface-2);padding:14px;border-radius:0}.next-action>span{font-size:10px;font-weight:850;color:var(--caramel)}.next-action code{display:block;margin-top:10px;background:var(--bg);color:var(--ink);padding:9px}.empty-card{border:1px dashed var(--line-strong);border-radius:0;padding:22px;color:var(--muted)}footer{max-width:none;margin:auto;padding:18px 24px 36px;color:var(--muted);font-size:12px}.status.behind{color:var(--peach)}.status.ahead{color:var(--success)}.status.on-schedule{color:var(--rose)}.status.insufficient{color:var(--amber)}@media(max-width:900px){.release-grid{grid-template-columns:repeat(2,1fr)}.health-grid{grid-template-columns:repeat(2,1fr)}.task-list li{grid-template-columns:50px 100px 1fr}.task-list small{grid-column:2/4}.nav a:not(.guide){display:none}}@media(max-width:600px){main{padding:14px}.release-grid,.drawer-grid,.health-grid{grid-template-columns:1fr}.section-head,.goal>header,.roadmap-item>header,.epic summary{display:block}.weight-line,.goal header small,.roadmap-item header small{text-align:left}.empty-release .empty-line{display:block}.task-list li{grid-template-columns:45px 90px 1fr}.task-list b{display:none}}@media print{header.site{position:static}.nav a{display:none}.band,.release-band,.drawer{box-shadow:none;break-inside:avoid}details{display:block}details>*{display:block!important}body{background:var(--ink)}main{max-width:none}}</style>
<style>
.release-summary{margin:0 0 14px;color:var(--soft-ink);font-size:14px}
.release-grid{grid-template-columns:repeat(4,1fr)}
.completion-track{height:10px;margin:18px 0 14px;overflow:hidden;border-radius:0;background:var(--line-strong)}.completion-track span{display:block;height:100%;background:var(--success)}
.release-secondary{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;color:var(--soft-ink);font-size:12px}.release-secondary span{padding-left:12px;border-left:2px solid var(--line-strong)}.release-secondary b{display:block;color:var(--ink);font-size:11px;text-transform:none;letter-spacing:.08em}
.rc-runway{display:block;width:100%;min-height:190px;background:var(--surface);border:1px solid var(--line);border-radius:0}.rc-runway text{font-size:12px;fill:var(--muted)}.runway-track{stroke:var(--muted);stroke-width:4}.runway-range{fill:var(--surface-2);stroke:var(--rose)}.range-label,.forecast-label{fill:var(--rose)!important;font-weight:700}.baseline-marker{fill:var(--success)}.today-marker{stroke:var(--amber);stroke-width:3;stroke-dasharray:4 3}.forecast-marker{fill:var(--rose);stroke:var(--ink);stroke-width:3}.target-marker{fill:var(--peach);stroke:var(--ink);stroke-width:2}.roadmap-table{margin-top:20px}.roadmap-table h3{font-size:14px}.road-state{font-size:11px;font-weight:800;text-transform:none}.road-state.complete{color:var(--success)}.road-state.remaining{color:var(--caramel)}.road-state.in-progress{color:var(--rose)}
.runway-mobile-facts{display:none}
.health-grid{grid-template-columns:repeat(2,1fr)}
.issues-band{border-left:5px solid var(--caramel)}.issue-list{padding-left:22px}.issue-list>li{padding:4px 0 16px}.issue-list h3{margin:0 0 8px}.issue-list dl{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:0}.issue-list dl>div{background:var(--surface-2);padding:10px}.issue-list dt{font-size:10px;font-weight:850;text-transform:none;color:var(--muted)}.issue-list dd{margin:4px 0 0}
.signal{display:inline-block;padding:2px 8px;border-radius:0;font-size:11px;font-weight:700;background:var(--surface-2);color:var(--ink)}
.signal.core{background:var(--surface-2);color:var(--success)}
.signal.healthy{background:var(--surface-2);color:var(--success)}
.signal.under-observed{background:var(--surface-2);color:var(--caramel)}
.signal.underused{background:var(--surface-2);color:var(--caramel)}
.signal.overused{background:var(--surface-2);color:var(--caramel)}
.signal.healthy-cadence{background:var(--surface-2);color:var(--success)}
.signal.one-session-burst{background:var(--surface-2);color:var(--amber)}
.signal.automation-candidate{background:var(--surface-2);color:var(--rose)}
.signal.pruning-candidate{background:var(--surface-2);color:var(--peach)}
.signal.failing{background:var(--surface-2);color:var(--peach)}
.signal.low-use{background:var(--surface-2);color:var(--caramel)}
.signal.never-used{background:var(--surface-2);color:var(--muted)}
td small{color:var(--muted)}
.evidence.migration{color:var(--peach)}
@media (max-width:900px){.release-grid{grid-template-columns:repeat(2,1fr)}.release-secondary,.issue-list dl{grid-template-columns:1fr}.rc-runway{min-height:0}}
@media (max-width:600px){.release-grid{grid-template-columns:1fr}.rc-runway{font-size:10px}.runway-mobile-facts{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:10px 0 0}.runway-mobile-facts>div{background:var(--surface);border:1px solid var(--line);padding:9px}.runway-mobile-facts dt{font-size:10px;font-weight:800;text-transform:none;color:var(--muted)}.runway-mobile-facts dd{margin:2px 0 0;font-size:12px}.roadmap-table table{min-width:680px}}
h2{font-family:var(--font-display);font-weight:600}main{min-width:0}.nav{flex-wrap:wrap}.release-band{box-shadow:none}.brand{font-size:22px}.nav .guide{color:var(--rose);border-color:var(--rose)}.band h2{font-size:25px}.section-head p{line-height:1.6}.table-wrap{max-width:100%}.task-list li{min-width:0}.task-list li>*{overflow-wrap:anywhere}.release-kicker,.task-state,.signal,.road-state{letter-spacing:.01em}code{overflow-wrap:anywhere}.table-wrap:focus-visible{outline:2px solid var(--rose)}@media(max-width:600px){.nav{padding:18px 14px;gap:14px}.band,.release-band{padding:18px}.section-head h2{font-size:23px}}
</style></head><body><a class="skip-link" href="#next">Skip to next action</a><header class="site"><nav class="nav"><strong class="brand">${esc(state.project?.name || path.basename(process.cwd()))}</strong><a href="#next">Next</a><a href="#usage">Usage</a><a href="#overview">RC</a><a href="#timeline">Runway</a><a href="#calibration">Calibration</a><a href="#work">Work</a><a href="#agent-os">Agent OS</a><a href="#operations">Operations</a>${dataIssues.length ? `<a href="#data-issues">Data issues (${dataIssues.length})</a>` : ""}<a class="guide" href="guide.html">Usage guide</a></nav></header><main>
${attentionBand(next)}
${rcBand(forecast, progress, state, metrics)}
${usageBand()}
${timelineBand(forecast)}
${calibrationBand(forecast, progress)}
${workBand(progress, forecast)}
${agentBand(metrics)}
${operations(state, effort, next)}
${dataIssuesBand(dataIssues)}
</main><footer>Generated ${esc(state.updated || "never")}. Sources: canonical state, release contract, backlog, release baseline, resolved task dates, command events, and session ledger. Edit sources; never edit this view.</footer></body></html>`;
  fs.writeFileSync(OUT, html);
  console.log(`[dashboard] wrote ${OUT}; release=${forecast.release?.id || "not-set"}; schedule=${forecast.schedule.status}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
