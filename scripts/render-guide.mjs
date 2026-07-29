#!/usr/bin/env node
// Generate the standalone, self-contained guide.html from docs/guide/*.md.
import fs from "node:fs";
import path from "node:path";
import { renderMarkdown } from "./md.mjs";

const SOURCE = "docs/guide";
const OUT = "guide.html";
const esc = value => String(value ?? "").replace(/[&<>"]/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;",
}[char]));
const slug = value => String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

if (!fs.existsSync(SOURCE)) {
  console.error(`[guide] missing ${SOURCE}`);
  process.exit(1);
}

const chapters = fs.readdirSync(SOURCE).filter(file => file.endsWith(".md")).sort().map(file => {
  const markdown = fs.readFileSync(path.join(SOURCE, file), "utf8");
  const title = markdown.match(/^##\s+(.+)$/m)?.[1] || path.basename(file, ".md");
  return { file, title, id: slug(path.basename(file, ".md")), html: renderMarkdown(markdown) };
});

const nav = chapters.map(chapter =>
  `<a href="#${chapter.id}" data-guide-link>${esc(chapter.title)}</a>`).join("");
const content = chapters.map(chapter =>
  `<section class="chapter" id="${chapter.id}" data-search="${esc(chapter.title.toLowerCase())}">${chapter.html}</section>`).join("\n");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Agent OS · Complete usage guide</title>
<style>
:root{--bg:#f3f1eb;--paper:#fffefa;--ink:#20231f;--muted:#666b63;--line:#d8d4c9;--brand:#245548;--human:#a64225;--agent:#225da8;--system:#59615a;--check:#29733d}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.65 Inter,ui-sans-serif,system-ui,sans-serif}
header{position:sticky;top:0;z-index:4;background:var(--brand);color:white;padding:13px 22px;display:flex;gap:18px;align-items:center;box-shadow:0 2px 8px #0002}
header strong{font-size:17px}.top-link{margin-left:auto;color:white;text-decoration:none;border:1px solid #92b1a7;border-radius:6px;padding:6px 10px;font-weight:750;font-size:13px}
.layout{display:grid;grid-template-columns:280px minmax(0,820px);gap:34px;max-width:1180px;margin:auto;padding:28px 24px 70px}
aside.sidebar{position:sticky;top:82px;align-self:start;max-height:calc(100vh - 100px);overflow:auto}.sidebar input{width:100%;border:1px solid var(--line);border-radius:6px;padding:9px 10px;background:white;margin-bottom:12px}
.sidebar nav{display:grid;gap:3px}.sidebar nav a{color:var(--ink);text-decoration:none;padding:7px 9px;border-radius:5px;font-size:13px}.sidebar nav a:hover{background:#e3ebe6;color:var(--brand)}
.legend{margin-top:18px;border-top:1px solid var(--line);padding-top:14px}.legend span{display:block;font-size:11px;font-weight:850;letter-spacing:.05em;margin:7px 0}.human-text{color:var(--human)}.agent-text{color:var(--agent)}.system-text{color:var(--system)}.check-text{color:var(--check)}
.chapter{background:var(--paper);border:1px solid var(--line);border-radius:10px;padding:26px 30px;margin-bottom:18px;scroll-margin-top:78px}.chapter h2{font-size:25px;line-height:1.2;margin:0 0 18px;color:var(--brand)}.chapter h3{font-size:17px;margin:25px 0 7px}.chapter p{margin:8px 0}.chapter li{margin:5px 0}
code{background:#efede6;border-radius:4px;padding:2px 5px;font:12px ui-monospace,SFMono-Regular,Consolas,monospace}pre{background:#222722;color:#f4f2eb;border-radius:7px;padding:13px 15px;overflow:auto}pre code{background:none;color:inherit;padding:0}
table{border-collapse:collapse;width:100%;font-size:13px}th,td{border-bottom:1px solid var(--line);padding:8px;text-align:left}th{color:var(--muted)}
.callout{border:1px solid;border-left-width:6px;border-radius:8px;padding:12px 15px;margin:16px 0}.callout p:last-child{margin-bottom:0}.callout-title{font-size:12px;font-weight:900;letter-spacing:.06em;text-transform:uppercase}.callout.human{border-color:#dfa58f;background:#fff1eb}.callout.human .callout-title{color:var(--human)}.callout.agent{border-color:#9dbce2;background:#edf5ff}.callout.agent .callout-title{color:var(--agent)}.callout.system{border-color:#bfc3bf;background:#f0f1ef}.callout.system .callout-title{color:var(--system)}.callout.check{border-color:#9fc9a9;background:#edf8ef}.callout.check .callout-title{color:var(--check)}
.no-results{display:none;background:#fff1eb;border:1px solid #dfa58f;border-radius:8px;padding:16px}
@media(max-width:800px){header{position:static}.layout{grid-template-columns:1fr;padding:18px 14px}.sidebar{position:static;max-height:none}.chapter{padding:21px 18px}}
@media print{header,.sidebar{display:none}.layout{display:block;padding:0}.chapter{break-inside:avoid;border:0}}
</style>
</head>
<body>
<header><strong>Agent OS · complete usage guide</strong><span>Human intervention is labelled, not implied.</span><a class="top-link" href="dashboard.html">Back to dashboard</a></header>
<div class="layout">
  <aside class="sidebar">
    <input id="guide-search" type="search" placeholder="Filter chapters…" aria-label="Filter guide chapters">
    <nav>${nav}</nav>
    <div class="legend">
      <span class="human-text">HUMAN — judgment or approval required</span>
      <span class="agent-text">AGENT — ask any compatible coding agent</span>
      <span class="system-text">AUTOMATIC — generated by scripts</span>
      <span class="check-text">VERIFY — observable success condition</span>
    </div>
  </aside>
  <main>
    <div class="no-results" id="no-results">No chapter contains that phrase.</div>
    ${content}
  </main>
</div>
<script>
const search = document.getElementById("guide-search");
const chapters = [...document.querySelectorAll(".chapter")];
const links = [...document.querySelectorAll("[data-guide-link]")];
search.addEventListener("input", () => {
  const query = search.value.trim().toLowerCase();
  let visible = 0;
  chapters.forEach((chapter, index) => {
    const show = !query || chapter.textContent.toLowerCase().includes(query);
    chapter.hidden = !show;
    links[index].hidden = !show;
    if (show) visible++;
  });
  document.getElementById("no-results").style.display = visible ? "none" : "block";
});
</script>
</body>
</html>`;

fs.writeFileSync(OUT, html);
console.log(`[guide] wrote ${OUT} (${chapters.length} chapters)`);
