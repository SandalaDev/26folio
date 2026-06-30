// Build Dashboard generator — Solo Dev OS v6.1
//
// WHAT THIS DOES
//   Reads project-state/STATE.json + backlog/ + project-state/SESSION_LEDGER.jsonl
//   (via render-metrics.mjs) and writes a single, self-contained dashboard.html
//   with two tabs: the live Build Dashboard and the User Guide.
//
// HOW TO RUN
//   node scripts/render-dashboard.mjs        # standalone
//   bash scripts/os.sh render                # via the OS entry point (also runs the markdown views)
//   bash scripts/bootstrap-solo-dev-os.sh    # runs it once at project start
//
// HOW TO EXTRACT THIS SCRIPT STANDALONE
//   This file has NO template dependency — the HTML, CSS, and JS are all in code
//   below. To use it in another repo, copy this one file out alongside a
//   project-state/STATE.json (and optionally backlog/epics + backlog/{tasks,done}
//   for the progress table, and project-state/SESSION_LEDGER.jsonl for metrics).
//   Run `node render-dashboard.mjs` from the repo root; it writes dashboard.html.
//
// DESIGN
//   - dashboard.html is GENERATED (gitignored). Never hand-edit it.
//   - Null / missing scalar fields render as "—".
//   - Block tokens (handoff rows, epic rows, metrics rows) fall back to an
//     honest empty-state row when there is no data, never a stale sample.
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";   // same real parser render-state.mjs uses — one reader, no drift

const STATE = "project-state/STATE.json";
const TASKS = "backlog/tasks";
const DONE  = "backlog/done";
const EPICS = "backlog/epics";
const OUT   = "dashboard.html";

const readJSON = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const exists   = (p) => fs.existsSync(p);

// ---- YAML frontmatter reader (same real parser render-state.mjs uses) ----
// A hand-rolled reader drifts from the canonical one: it can't strip inline
// `# comments` or unquote values, so `status: done  # note` reads as not-done
// and pollutes the UI. Use the real parser so both scripts derive identically.
function frontmatter(file) {
  const src = fs.readFileSync(file, "utf8");
  // CRLF-tolerant anchor (Windows autocrlf yields ---\r\n).
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  try { return YAML.parse(m[1]) ?? {}; } catch { return {}; }
}

if (!exists(STATE)) { console.error(`[dashboard] missing ${STATE}`); process.exit(1); }
const s = readJSON(STATE);

// ---------- value stamping (null/empty -> em dash) ----------
const dash = (v) => (v === null || v === undefined || v === "") ? "—" : v;
const get  = (pth) => pth.split(".").reduce((o, k) => (o == null ? o : o[k]), s);
const esc  = (str) => String(str ?? "—").replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

function handoffQueueRows() {
  const hq = s.handoff_queue || [];
  if (!hq.length)
    return `<div class="hq-row"><strong>—</strong><span>No pending handoffs</span><span>—</span><span class="pill pass">✓ Clear</span></div>`;
  return hq.map(h => {
    const purpose = h.task_ref ? `Awaiting action: ${h.task_ref}` : (h.purpose ?? "—");
    const status  = h.status === "consumed" ? "✓ Consumed" : "⏳ Pending";
    const pillCls = h.status === "consumed" ? "pass" : "wait";
    return `<div class="hq-row"><strong>${esc(h.id)}</strong><span>${esc(purpose)}</span><span class="hq-type ${esc(h.type)}">${esc(h.type)}</span><span class="pill ${pillCls}">${status}</span></div>`;
  }).join("\n");
}

// Epic rows from backlog/epics/*.md + backlog/{tasks,done}/. A task in both
// tasks/ and done/ counts once, as done (done wins). Guards against stale copies.
function epicRows() {
  if (!exists(EPICS)) return `<tr><td colspan="6">No epics defined</td></tr>`;
  const files = fs.readdirSync(EPICS).filter(f => f.endsWith(".md")).sort();
  if (!files.length) return `<tr><td colspan="6">No epics defined</td></tr>`;
  const taskFm = (dir) => exists(dir)
    ? fs.readdirSync(dir).filter(f => f.endsWith(".md")).map(f => ({ fm: frontmatter(path.join(dir, f)) }))
    : [];
  const byId = new Map();
  for (const t of [...taskFm(TASKS), ...taskFm(DONE)]) {
    const id = t.fm.id;
    const status = t.fm.status;
    const prev = byId.get(id);
    if (!prev || (prev.status !== "done" && status === "done")) byId.set(id, { epic: t.fm.epic, status });
  }
  return files.map(f => {
    const fm = frontmatter(path.join(EPICS, f));
    const id = fm.id || f.replace(/\.md$/, "");
    const mine = [...byId.values()].filter(t => t.epic === id);
    const doneN = mine.filter(t => t.status === "done").length;
    const total = mine.length;
    const risk = esc(fm.risk_level || fm.risk);
    const stateLabel =
      fm.status === "done" ? "Done" :
      fm.status === "in-progress" ? "In progress" :
      fm.status === "ready" ? "Ready" : esc(fm.status || "Planned");
    return `<tr><td>${esc(id)}</td><td>${esc(fm.slice || "—")}</td><td>${total || "—"}</td><td>${doneN || "—"}</td><td>${risk}</td><td>${stateLabel}</td></tr>`;
  }).join("\n");
}

function metricsRows() {
  const combos = (s.metrics && s.metrics.combos) || [];
  if (!combos.length) return `<tr><td colspan="7">No sessions logged yet</td></tr>`;
  return combos.map(c => {
    const graded = c.gate_pass + c.gate_fail;
    const rate   = graded ? `${c.gate_pass_rate ?? "—"}% (${c.gate_pass}/${graded})` : "—";
    const avg    = c.avg_session_min != null ? `${c.avg_session_min} min` : "—";
    const conf   = c.low_n ? `<span class="pill wait">⚠ low-n</span>` : `<span class="pill pass">ok</span>`;
    return `<tr><td>${esc(c.harness)}</td><td>${esc(c.model)}</td><td>${esc(c.role)}</td><td>${c.sessions ?? "—"}</td><td>${rate}</td><td>${avg}</td><td>${conf}</td></tr>`;
  }).join("\n");
}

// ---------- CSS (lifted faithfully from the v6.1 style block) ----------
const CSS = `
:root {
  --bg:#080b12; --surface:#111827; --surface-2:#172033; --card:#131c2d; --card-2:#0e1625;
  --ink:#f4f7fb; --muted:#9aa7b8; --soft:#cad5e4; --border:#26344b; --border-2:#344966;
  --green:#11c986; --green-soft:rgba(17,201,134,.12);
  --cyan:#38c7ff; --cyan-soft:rgba(56,199,255,.12);
  --violet:#a78bfa; --violet-soft:rgba(167,139,250,.14);
  --amber:#f7c948; --amber-soft:rgba(247,201,72,.12);
  --red:#fb7185; --red-soft:rgba(251,113,133,.12);
  --shadow:rgba(0,0,0,.38);
  --mono:"SFMono-Regular",Consolas,"Liberation Mono",monospace;
  --sans:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  --page-gap:10px; --panel-radius:14px; --topbar-h:58px; --sidebar-w:clamp(235px,16vw,310px);
}
*{box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:calc(var(--topbar-h) + 18px)}
body{margin:0;min-height:100dvh;background:radial-gradient(circle at 0 0,rgba(56,199,255,.10),transparent 34rem),radial-gradient(circle at 82% 0,rgba(167,139,250,.09),transparent 34rem),var(--bg);color:var(--ink);font-family:var(--sans);line-height:1.58;font-size:15px}
a{color:var(--cyan);text-decoration:none}
a:hover{text-decoration:underline}
code{font-family:var(--mono);font-size:.92em;background:#0a111d;border:1px solid var(--border);padding:.12rem .35rem;border-radius:.38rem;color:#6ee7b7}
pre{background:#050914;border:1px solid var(--border);border-radius:12px;padding:14px;overflow:auto;max-height:620px}
pre code{background:transparent;border:0;padding:0;color:#d9e7ff;font-size:13px;line-height:1.55;white-space:pre}
h1,h2,h3{letter-spacing:-.035em;line-height:1.1}
h1{font-size:clamp(34px,4.8vw,68px);margin:.45rem 0 .75rem}
h2{font-size:26px;margin:0 0 10px;color:#dff7ff}
h3{font-size:18px;margin:20px 0 8px;color:#fff}
p{color:var(--muted);margin:0 0 10px}
ul,ol{color:var(--muted);padding-left:1.15rem;margin:0 0 12px}
li{margin:.28rem 0}
.shell{width:calc(100dvw - (var(--page-gap) * 2));max-width:none;margin:0 auto;padding:var(--page-gap) 0 32px}
.topbar{position:sticky;top:0;z-index:80;background:rgba(8,11,18,.88);backdrop-filter:blur(18px);border-bottom:1px solid var(--border)}
.top-inner{width:calc(100dvw - (var(--page-gap) * 2));max-width:none;height:var(--topbar-h);margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:1rem}
.brand{display:flex;align-items:center;gap:.65rem;color:var(--ink);font-weight:900;font-size:17px}
.mark{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;color:#06100c;background:linear-gradient(135deg,var(--green),var(--cyan));font-weight:950;box-shadow:0 10px 26px rgba(17,201,134,.22)}
.eyebrow{display:inline-flex;align-items:center;gap:.4rem;border:1px solid var(--border);background:#0d1524;border-radius:999px;color:var(--green);font-family:var(--mono);font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;padding:.35rem .72rem}
.tabs{border:1px solid var(--border);border-radius:var(--panel-radius);background:linear-gradient(180deg,rgba(23,32,51,.92),rgba(17,24,39,.92));box-shadow:0 14px 44px var(--shadow);overflow:visible}
.tab-list{display:flex;gap:8px;overflow-x:auto;background:#0d1422;border:1px solid var(--border);border-radius:var(--panel-radius) var(--panel-radius) 0 0;padding:8px;position:sticky;top:var(--topbar-h);z-index:60}
.tab-btn{border:1px solid transparent;border-radius:10px;background:transparent;color:var(--muted);font:inherit;font-weight:750;cursor:pointer;padding:8px 13px;white-space:nowrap}
.tab-btn:hover{background:rgba(255,255,255,.035);color:var(--ink)}
.tab-btn[aria-selected="true"]{background:var(--card);color:var(--green);border-color:var(--border-2)}
.panel{display:none;padding:0;overflow:visible}
.panel.active{display:block;overflow:visible}
.layout{display:grid;grid-template-columns:var(--sidebar-w) minmax(0,1fr);gap:12px;align-items:start;padding:12px;overflow:visible}
.sidebar{position:sticky;top:calc(var(--topbar-h) + 48px);align-self:start;max-height:calc(100dvh - var(--topbar-h) - 62px);overflow:auto;overscroll-behavior:contain;border:1px solid var(--border);border-radius:13px;background:rgba(8,13,22,.82);backdrop-filter:blur(12px);padding:10px;scrollbar-width:thin}
.sidebar strong{display:block;color:var(--green);font-family:var(--mono);font-size:10.5px;text-transform:uppercase;letter-spacing:.09em;margin:3px 8px 8px}
.sidebar a{display:block;color:var(--muted);padding:7px 9px;border-radius:9px;font-size:12.8px;line-height:1.25}
.sidebar a:hover,.sidebar a.active{background:var(--surface-2);color:#fff;text-decoration:none}
.section{border:1px solid var(--border);border-radius:var(--panel-radius);background:linear-gradient(180deg,rgba(23,32,51,.92),rgba(17,24,39,.92));box-shadow:0 14px 44px var(--shadow);padding:20px 22px;margin-bottom:12px;overflow:visible}
.section h2{padding-bottom:8px;border-bottom:1px solid var(--border)}
.grid-2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.grid-3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.card{background:linear-gradient(180deg,rgba(19,28,45,.95),rgba(14,22,37,.95));border:1px solid var(--border);border-radius:13px;padding:15px}
.card strong{display:block;color:#fff;margin-bottom:7px}
.card p{font-size:13.5px}
.notice{border-left:4px solid var(--green);background:var(--green-soft);border-radius:9px;padding:12px 14px;margin:12px 0;color:#dff7ec}
.notice.info{border-left-color:var(--cyan);background:var(--cyan-soft);color:#d9f5ff}
.notice.warn{border-left-color:var(--amber);background:var(--amber-soft);color:#fdf3cc}
.notice.danger{border-left-color:var(--red);background:var(--red-soft);color:#ffe4e9}
.notice.violet{border-left-color:var(--violet);background:var(--violet-soft);color:#ede8ff}
.table-wrap{overflow:auto;border:1px solid var(--border);border-radius:12px;margin:12px 0}
table{width:100%;border-collapse:collapse;background:#0f1828}
th,td{text-align:left;vertical-align:top;border-bottom:1px solid var(--border);padding:10px 12px;color:var(--muted);font-size:13.4px}
th{background:#172033;color:#e8f3ff;font-family:var(--mono);font-size:10.5px;text-transform:uppercase;letter-spacing:.075em}
tr:last-child td{border-bottom:0}
.codebox{margin:14px 0}
.code-head{display:flex;align-items:center;justify-content:space-between;margin:0 0 7px;gap:10px}
.code-title{font-family:var(--mono);font-size:12px;color:#a9b8ca}
.kbd{font-family:var(--mono);font-size:12px;border:1px solid var(--border);border-bottom-width:2px;background:#0c1320;padding:.1rem .38rem;border-radius:.35rem;color:#e5eefb}
.db-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin:14px 0}
.db-stat{background:rgba(8,13,22,.85);border:1px solid var(--border);border-radius:12px;padding:14px 16px}
.db-stat .label{font-size:11px;font-family:var(--mono);color:var(--muted);text-transform:uppercase;letter-spacing:.08em}
.db-stat .value{font-size:28px;font-weight:900;letter-spacing:-.04em;color:var(--ink);margin:4px 0 2px;line-height:1}
.db-stat .sub{font-size:12px;color:var(--muted)}
.db-stat.green-accent{border-color:rgba(17,201,134,.28);background:rgba(17,201,134,.05)}
.db-stat.cyan-accent{border-color:rgba(56,199,255,.25);background:rgba(56,199,255,.04)}
.db-stat.amber-accent{border-color:rgba(247,201,72,.25);background:rgba(247,201,72,.04)}
.db-stat.violet-accent{border-color:rgba(167,139,250,.25);background:rgba(167,139,250,.04)}
.handoff-queue{background:rgba(8,13,22,.85);border:1px solid var(--border);border-radius:12px;overflow:hidden;margin:14px 0}
.hq-head{display:grid;grid-template-columns:110px 1fr 120px 90px;gap:8px;background:#172033;padding:8px 14px;font-family:var(--mono);font-size:10.5px;color:#e8f3ff;text-transform:uppercase;letter-spacing:.06em}
.hq-row{display:grid;grid-template-columns:110px 1fr 120px 90px;gap:8px;padding:10px 14px;border-top:1px solid var(--border);align-items:center;font-size:13px;color:var(--muted)}
.hq-row strong{color:var(--ink);font-family:var(--mono);font-size:12px}
.hq-type{font-family:var(--mono);font-size:11px;padding:.2rem .5rem;border-radius:6px;display:inline-block;font-weight:700}
.hq-type.review{background:var(--cyan-soft);color:var(--cyan)}
.hq-type.session{background:var(--violet-soft);color:var(--violet)}
.hq-type.task{background:var(--green-soft);color:var(--green)}
.hq-type.rework{background:var(--amber-soft);color:var(--amber)}
.pill{display:inline-flex;align-items:center;gap:.3rem;font-family:var(--mono);font-size:10.5px;padding:.22rem .52rem;border-radius:999px;font-weight:700}
.pill.pass{background:var(--green-soft);color:var(--green)}
.pill.wait{background:var(--amber-soft);color:var(--amber)}
.pill.block{background:var(--red-soft);color:var(--red)}
.checklist{list-style:none;padding:0;margin:10px 0}
.checklist li{display:flex;align-items:flex-start;gap:10px;padding:7px 0;border-bottom:1px solid var(--border);color:var(--muted);font-size:13.5px}
.checklist li:last-child{border-bottom:0}
.checklist .ck{width:18px;height:18px;border-radius:5px;border:1px solid var(--border-2);background:rgba(17,201,134,.08);display:grid;place-items:center;flex-shrink:0;margin-top:1px}
.checklist .ck.done{background:var(--green-soft);border-color:var(--green)}
.checklist .ck.done::after{content:"✓";color:var(--green);font-size:11px;font-weight:900}
.lane{display:grid;grid-template-columns:120px 1fr;gap:10px;border:1px solid var(--border);border-radius:11px;padding:12px 14px;margin:10px 0;background:rgba(8,13,22,.55)}
.lane .who{font-family:var(--mono);font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--cyan);padding-top:2px}
.lane.human .who{color:var(--amber)}
.lane.agent .who{color:var(--green)}
.lane.script .who{color:var(--violet)}
.signal{display:grid;grid-template-columns:24px 1fr;gap:10px;align-items:start;padding:9px 0;border-bottom:1px solid var(--border);font-size:13.6px;color:var(--soft)}
.signal:last-child{border-bottom:0}
.signal .ic{width:22px;height:22px;border-radius:6px;display:grid;place-items:center;font-size:12px;font-weight:900;flex-shrink:0}
.signal .ic.good{background:var(--green-soft);color:var(--green);border:1px solid rgba(17,201,134,.4)}
.signal .ic.bad{background:var(--red-soft);color:var(--red);border:1px solid rgba(251,113,133,.4)}
.signal code{font-size:12px}
.ug{border-left:4px solid var(--violet);background:var(--violet-soft);border-radius:9px;padding:14px 16px;margin:14px 0;color:#ede8ff}
.ug strong{color:#fff}
.ug .ug-tag{display:inline-block;font-family:var(--mono);font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--violet);border:1px solid var(--border-2);border-radius:999px;padding:.15rem .5rem;margin-bottom:8px}
.tagrow{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 2px}
@media(max-width:900px){.layout{grid-template-columns:1fr}.sidebar{position:relative;top:auto;max-height:none}.hq-head,.hq-row{grid-template-columns:90px 1fr 100px 80px}}
@media(max-width:760px){:root{--page-gap:8px}.section{padding:16px}.grid-2,.grid-3{grid-template-columns:1fr}.top-inner{height:56px}.brand{font-size:15px}.hq-head,.hq-row{grid-template-columns:1fr 1fr}.hq-head span:nth-child(3),.hq-head span:nth-child(4),.hq-row span:nth-child(3),.hq-row span:nth-child(4){display:none}}
`;

// ---------- TAB 1: Build Dashboard panel ----------
const dashboardPanel = `
    <section class="panel active" data-panel="dashboard">
      <div class="layout">
        <aside class="sidebar">
          <strong>Dashboard</strong>
          <a href="#db-overview">Project Overview</a>
          <a href="#db-handoff-q">Handoff Queue</a>
          <a href="#db-progress">Progress Tracker</a>
          <a href="#db-agent-log">Agent Log</a>
          <a href="#db-performance">Harness Performance</a>
        </aside>
        <div>
          <section id="db-overview" class="section">
            <h2>Project Overview</h2>
            <p style="color:var(--amber)">This is the <strong>generated live Build Dashboard</strong>. <code>scripts/render-dashboard.mjs</code> stamps it from <code>project-state/STATE.json</code> on every <code>os.sh render</code>. Null or absent fields render as <code>—</code>. For the full operating manual, see <code>OPERATING_MANUAL.md</code>.</p>
            <div class="db-grid">
              <div class="db-stat green-accent"><div class="label">Active Epic</div><div class="value" style="font-size:16px;margin-top:8px">${dash(get("current.epic"))}</div><div class="sub">from STATE.json · current.epic</div></div>
              <div class="db-stat cyan-accent"><div class="label">Active Slice</div><div class="value" style="font-size:16px;margin-top:8px">${dash(get("current.slice"))}</div><div class="sub">from STATE.json · current.slice</div></div>
              <div class="db-stat violet-accent"><div class="label">Active Task</div><div class="value" style="font-size:16px;margin-top:8px">${dash(get("current.task"))}</div><div class="sub">from STATE.json · current.task</div></div>
              <div class="db-stat amber-accent"><div class="label">Current Agent</div><div class="value" style="font-size:16px;margin-top:8px">${dash(get("current.agent"))}</div><div class="sub">from STATE.json · current.agent</div></div>
              <div class="db-stat"><div class="label">Epics Total</div><div class="value">${dash(s.counts?.epics_total)}</div><div class="sub">derived · backlog/epics/</div></div>
              <div class="db-stat"><div class="label">Tasks Open</div><div class="value">${dash(s.counts?.tasks_open)}</div><div class="sub">derived · status: ready | in-progress</div></div>
              <div class="db-stat"><div class="label">Tasks Done</div><div class="value">${dash(s.counts?.tasks_done)}</div><div class="sub">derived · backlog/done/</div></div>
              <div class="db-stat"><div class="label">Pending Handoffs</div><div class="value">${dash(s.counts?.handoffs_pending)}</div><div class="sub">derived · STATE.json · handoff_queue[]</div></div>
            </div>
            <div class="notice info"><strong>Completion:</strong> ${esc((s.completion && s.completion.summary) || "—")}</div>
            ${s.completion && s.completion.blocked && s.completion.blocked !== "none" ? `<div class="notice warn"><strong>Blocked:</strong> ${esc(s.completion.blocked)}</div>` : ""}
          </section>

          <section id="db-handoff-q" class="section">
            <h2>Handoff Queue</h2>
            <p>Pending handoffs live in <code>STATE.json · handoff_queue[]</code>. <code>HANDOFF_QUEUE.md</code> is the generated Markdown view of the same list.</p>
            <div class="handoff-queue">
              <div class="hq-head"><span>ID</span><span>Purpose</span><span>Type</span><span>Status</span></div>
              ${handoffQueueRows()}
            </div>
          </section>

          <section id="db-progress" class="section">
            <h2>Progress Tracker</h2>
            <p>Derived from <code>backlog/epics/</code> + <code>backlog/{tasks,done}/</code> frontmatter. A task present in both <code>tasks/</code> and <code>done/</code> counts once (done wins).</p>
            <div class="table-wrap"><table>
              <thead><tr><th>Epic</th><th>Slice</th><th>Tasks</th><th>Done</th><th>Risk</th><th>State</th></tr></thead>
              <tbody>
                ${epicRows()}
              </tbody>
            </table></div>
          </section>

          <section id="db-agent-log" class="section">
            <h2>Agent Log</h2>
            <p>Every session appends a structured entry to <code>project-state/AGENT_LOG.md</code> (auto-rotated monthly into <code>memory/agent-log/</code>). This is the audit trail of who did what, when, and what state was left behind.</p>
            <div class="notice info"><strong>Read it directly:</strong> <code>project-state/AGENT_LOG.md</code>. (The log is append-only and potentially long, so it is not inlined here — open the file.)</div>
          </section>

          <section id="db-performance" class="section">
            <h2>Harness / Model Performance</h2>
            <p>Aggregated from <code>project-state/SESSION_LEDGER.jsonl</code> by <code>render-metrics.mjs</code> into <code>STATE.json.metrics</code>. Gate pass rate is externally computed by <code>verify-task.sh</code> — not self-reported.</p>
            <div class="table-wrap"><table>
              <thead><tr><th>Harness</th><th>Model</th><th>Role</th><th>Sessions</th><th>Gate pass rate</th><th>Avg session</th><th>Confidence</th></tr></thead>
              <tbody>
                ${metricsRows()}
              </tbody>
            </table></div>
            <div class="notice warn"><strong>Read this honestly.</strong> At solo-dev volume these numbers are <em>directional, not statistically significant</em> — any combo under five sessions is flagged <code>⚠ low-n</code>. Use them to spot a combo that is clearly weak, not to split hairs between two strong ones.</div>
          </section>
        </div>
      </div>
    </section>`;

// ---------- TAB 2: User Guide panel ----------
const guidePanel = `
    <section class="panel" data-panel="guide">
      <div class="layout">
        <aside class="sidebar">
          <strong>User Guide</strong>
          <a href="#ug-who">Who Does What</a>
          <a href="#ug-mental">The Mental Model</a>
          <a href="#ug-start">Project Start</a>
          <a href="#ug-day">A Day In The Loop</a>
          <a href="#ug-git">Git Workflow</a>
          <a href="#ug-verify">Verify &amp; Recover</a>
        </aside>
        <div>
          <section id="ug-who" class="section">
            <h2>Who Does What</h2>
            <p>Solo Dev OS has three actors. The whole system is designed so that <strong>you, the human, never have to babysit the agent</strong> — instead you read a few generated files and let the Git gate reject anything that skipped a step.</p>
            <div class="lane human"><div class="who">Human (you)</div><div>Owns intent and the irreversible decisions: the Project Spine, schema/auth/billing/infra/secrets approvals, and the final merge. You do not write state files by hand — you <em>read</em> the generated ones and trust the gate to stop bad work.</div></div>
            <div class="lane agent"><div class="who">Agent</div><div>Any harness — Claude Code, Codex, OpenCode, Cursor, Warp, Gemini CLI. Implements one bounded task, writes <strong>one</strong> canonical state update, creates handoffs by path. Temporary by definition; nothing important lives only in its chat.</div></div>
            <div class="lane script"><div class="who">Scripts + Git</div><div>The enforcement layer. <code>verify-task.sh</code> runs in a pre-push hook and in CI. It does not trust the agent's word — it recomputes scope, slop scores, handoff presence, and protected-path approval, and it <strong>fails the push</strong> if any are wrong.</div></div>
            <div class="ug"><span class="ug-tag">Why this matters</span><strong>The single biggest change in v6.1:</strong> the rules that mattered are now checks in Git. <em>A clean <code>git push</code> means the gate passed; a rejected push tells you exactly which rule was skipped.</em></div>
          </section>

          <section id="ug-mental" class="section">
            <h2>The Mental Model</h2>
            <p>Three sentences hold the whole system together.</p>
            <div class="grid-3">
              <div class="card"><strong>Artifacts are permanent. Agents are temporary.</strong><p>Every durable fact lives in a repo file. Chat is a scratchpad you can throw away mid-thought without losing anything.</p></div>
              <div class="card"><strong>One source of truth, everything else generated.</strong><p><code>STATE.json</code> is the only place state is written. <code>CURRENT_STATE.md</code> and this dashboard are <em>rendered</em> from it — you never edit them, so they can never disagree with it.</p></div>
              <div class="card"><strong>Rules fail closed.</strong><p>If a rule matters, it is a check that blocks the merge. If it is only prose, treat it as advice. v6.1 moved the rules that matter into the gate.</p></div>
            </div>
          </section>

          <section id="ug-start" class="section">
            <h2>Project Start</h2>
            <p>Project start is a <strong>six-phase gated pipeline</strong>. The first three capture durable <em>intent</em>; the last three <em>elicit</em> the things that cannot be guessed — your design taste, your content structure, and the exact UI. Each phase is fail-closed.</p>
            <div class="notice info"><strong>Why split intent from elicitation:</strong> the manifesto, charter, PRD are elaborations of decisions you already made — an agent can draft them from the brief. A design system, content structure, and UI map are <em>not</em> in the brief; if an agent drafts them from intent it is guessing at your taste.</div>
            <ul>
              <li><strong>P1 — Write the brief (you):</strong> <code>bash scripts/intake.sh brief</code> scaffolds <code>00-original-intent.md</code>; fill every section, set <code>status: ready</code>.</li>
              <li><strong>P2 — The interview (agent asks, you answer):</strong> <code>bash scripts/intake.sh interview</code>; a planning agent fills <code>INTAKE-INTERVIEW.md</code> with genuine gaps; answer each; set <code>status: answered</code>.</li>
              <li><strong>P3 — Hydrate the spine (agent drafts, you review):</strong> once <code>bash scripts/intake.sh ready</code> prints <strong>READY</strong>, the agent drafts intent files <code>00–09</code> from the brief + interview. No design/content/UI invented here.</li>
              <li><strong>P4 — Design system (you answer + show; agent generates):</strong> <code>design.sh questionnaire</code> + screenshots/links in <code>references/design/</code>; <code>design.sh ready</code>; agent generates <code>10-design-system.md</code> + a rendered <code>10-design-system.html</code>; <code>design.sh preview</code>, inspect in a browser, iterate, then set <code>status: approved</code>.</li>
              <li><strong>P5 — Content strategy &amp; structure (gated on design approved):</strong> <code>content.sh questionnaire</code>; agent generates <code>11-content-strategy.md</code> with the sitemap + per-page content + inventory; approve.</li>
              <li><strong>P6 — UI element map (gated on content approved):</strong> <code>ui.sh questionnaire</code> + element refs in <code>references/ui/</code>; agent generates <code>12-ui-element-map.md</code> mapping every block to an exact element; approve.</li>
            </ul>
          </section>

          <section id="ug-day" class="section">
            <h2>A Day In The Loop</h2>
            <div class="notice warn"><strong>Read this first:</strong> nothing is a background daemon. "AGENT" steps still require <em>you</em> to have a session open and tell it what to do. The two steps entirely on you are <strong>launching the cross-model review</strong> and <strong>triggering rework</strong> — most likely to get skipped.</div>
            <div class="table-wrap"><table>
              <thead><tr><th>Phase</th><th>Who</th><th>What happens</th></tr></thead>
              <tbody>
                <tr><td>A — Start</td><td>Agent</td><td><code>branch.sh start EPIC-XXX</code> cuts a feature branch off <code>dev</code>; <code>os.sh start</code> reads STATE, renders views, loads handoffs, writes the session lock; agent identifies Epic → Slice → Task and writes a checklist.</td></tr>
                <tr><td>B — Implement &amp; close</td><td>Agent</td><td>Agent edits inside <code>files_allowed</code> only; <code>os.sh end</code> runs the gate, writes one STATE update, renders, logs, creates handoffs; <code>git push</code> runs <code>verify-task.sh</code> against <code>dev</code>.</td></tr>
                <tr><td>C — Review</td><td><strong>You</strong></td><td><em>Not automatic.</em> Open a different model family, point it at <code>handoffs/review/HANDOFF-REVIEW-TASK-XXX.md</code>; it writes <code>.agents/reviews/REVIEW-TASK-XXX.md</code> with a decision.</td></tr>
                <tr><td>D — Rework (if not satisfied)</td><td><strong>You</strong></td><td><code>rework.sh open TASK-XXX "issue"</code> per issue; agent resolves each (<code>rework.sh resolve</code>); the gate stays red while any item is open; you <code>rework.sh close</code> once satisfied.</td></tr>
                <tr><td>E — Merge &amp; clean up</td><td><strong>You</strong></td><td>Confirm the PR check is green; merge into <code>dev</code>; <code>branch.sh cleanup feature/EPIC-XXX</code>; periodically <code>branch.sh promote</code> for <code>dev → main</code>.</td></tr>
              </tbody>
            </table></div>
          </section>

          <section id="ug-git" class="section">
            <h2>Git Workflow</h2>
            <p>Three branches. Agents never commit to a shared trunk.</p>
            <div class="lane script"><div class="who">main</div><div>Protected production. Only moves via a reviewed, fully-verified <code>dev → main</code> promotion. Tagged releases live here. No agent ever pushes to it.</div></div>
            <div class="lane human"><div class="who">dev</div><div>Integration branch. Feature branches merge here after the gate passes and a review is in. This is where you do most of your merging.</div></div>
            <div class="lane agent"><div class="who">feature/*</div><div>One branch per epic: <code>feature/EPIC-XXX</code> (or <code>-SLICE-Y</code> for large epics). Agents branch off <code>dev</code> and run the task → handoff chain here.</div></div>
            <div class="ug"><span class="ug-tag">Why epic-level, not per-task</span>A slice owns the test plan, handoff chain, and review; tasks within a slice hand off on the same branch. Per-task branches would force a merge between every handoff — the exact ceremony the OS removes.</div>
          </section>

          <section id="ug-verify" class="section">
            <h2>Verify &amp; Recover</h2>
            <div class="signal"><div class="ic good">✓</div><div><strong>State continuity:</strong> <code>bash scripts/os.sh check</code> prints <code>state: consistent</code>. If it prints <code>state: DRIFT</code>, STATE.json disagrees with a task's frontmatter — the gate blocks on this; never override it.</div></div>
            <div class="signal"><div class="ic good">✓</div><div><strong>Quality gates:</strong> if <code>git push</code> succeeded, scope / risk-matched proof / slop score / protected-path / handoff presence all passed. You only investigate on rejection — never <code>--no-verify</code>.</div></div>
            <div class="signal"><div class="ic good">✓</div><div><strong>Cross-model review:</strong> a <code>REVIEW-TASK-XXX.md</code> exists, written by a reviewer whose family differs from the executor. Solo dev degrades to <code>reviewer: human</code>; the review file is still required.</div></div>
            <div class="signal"><div class="ic bad">✕</div><div><strong>Push rejected:</strong> read the FAIL line — it names the rule. Fix that one thing and push again.</div></div>
            <div class="signal"><div class="ic bad">✕</div><div><strong>State files disagree:</strong> someone hand-edited a generated file. Run <code>os.sh render</code> to rebuild from <code>STATE.json</code>, then <code>os.sh check</code>.</div></div>
            <div class="signal"><div class="ic bad">✕</div><div><strong>Session crashed:</strong> a stale <code>ACTIVE_SESSION.lock</code> with no matching state triggers a recover/discard prompt on the next <code>os.sh start</code>.</div></div>
          </section>
        </div>
      </div>
    </section>`;

// ---------- tab-switching + sidebar scroll-spy JS ----------
const SCRIPT = `
  document.querySelectorAll('[data-tabs]').forEach(tabs => {
    const buttons = tabs.querySelectorAll(':scope > .tab-list .tab-btn');
    const panels = tabs.querySelectorAll(':scope > .panel');
    buttons.forEach(btn => btn.addEventListener('click', () => {
      const id = btn.dataset.tab;
      buttons.forEach(b => b.setAttribute('aria-selected', b === btn ? 'true' : 'false'));
      panels.forEach(p => p.classList.toggle('active', p.dataset.panel === id));
      window.scrollTo({ top: tabs.offsetTop - 80, behavior: 'smooth' });
    }));
  });
  const updateActiveSideLink = () => {
    const activePanel = document.querySelector('.panel.active');
    if (!activePanel) return;
    const links = [...activePanel.querySelectorAll('.sidebar a[href^="#"]')];
    const sections = links.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
    let current = sections[0];
    for (const sec of sections) if (sec.getBoundingClientRect().top <= 128) current = sec;
    links.forEach(l => l.classList.toggle('active', current && l.getAttribute('href') === '#' + current.id));
  };
  document.addEventListener('scroll', updateActiveSideLink, { passive: true });
  window.addEventListener('load', updateActiveSideLink);
  document.querySelectorAll('.sidebar a[href^="#"]').forEach(l => l.addEventListener('click', () => setTimeout(updateActiveSideLink, 300)));
`;

const html = `<!-- generated — do not edit; source: project-state/STATE.json · run scripts/render-dashboard.mjs -->
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Build Dashboard — Solo Dev OS</title>
<style>
${CSS}
</style>
</head>
<body>
<header class="topbar"><div class="top-inner"><a class="brand" href="#top"><span class="mark">DS</span><span>Solo Dev OS</span></a><span class="eyebrow">v6.1 · Build Dashboard</span></div></header>
<main id="top" class="shell">
  <div class="tabs" data-tabs>
    <div class="tab-list" role="tablist">
      <button class="tab-btn" aria-selected="true"  data-tab="dashboard">Build Dashboard</button>
      <button class="tab-btn" aria-selected="false" data-tab="guide">User Guide</button>
    </div>
${dashboardPanel}
${guidePanel}
  </div>
</main>
<script>
${SCRIPT}
</script>
</body>
</html>
`;

fs.writeFileSync(OUT, html);
console.log(`[dashboard] wrote ${OUT} — epics:${s.counts?.epics_total ?? "—"} done:${s.counts?.tasks_done ?? "—"} open:${s.counts?.tasks_open ?? "—"} combos:${(s.metrics?.combos || []).length}`);
