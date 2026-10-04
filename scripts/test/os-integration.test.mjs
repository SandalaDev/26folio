import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {renderMarkdown} from '../md.mjs';
execFileSync(process.execPath,['scripts/render-state.mjs'],{stdio:'pipe'});
const dashboard=fs.readFileSync('dashboard.html','utf8'),guide=fs.readFileSync('guide.html','utf8');
for(const expected of ['What happens next','Models and usage','guide.html'])assert.ok(dashboard.includes(expected),expected);
assert.ok(dashboard.indexOf('id="next"')<dashboard.indexOf('id="overview"'));
// Product projects display their own identity, rather than the template's name.
const state=JSON.parse(fs.readFileSync('project-state/state.json','utf8'));
const projectName=state.project?.name||path.basename(process.cwd());
const escapedName=projectName.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
assert.ok(dashboard.includes(`<strong class="brand">${escapedName}</strong>`));
for(const expected of ['Give your agent a prompt','How interviews work','Understand usage','confirm or correct'])assert.ok(guide.includes(expected),expected);
assert.ok(!guide.includes('set status: answered'));assert.ok(!guide.includes('finish 00-brief.md'));
for(const workflow of ['Create a new project','Update an existing project','Diagnose and recover','Switch agents and delegate work','Command reference and glossary'])assert.ok(guide.includes(workflow),workflow);
// Shell and JSON examples must survive rendering byte-for-byte (HTML escaped).
const literal='echo `pwd` && echo "**literal**" < input\n["node", "--test", "test/*.mjs"]';
const rendered=renderMarkdown('```bash\n'+literal+'\n```');
assert.equal(rendered,'<pre><code>'+literal.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')+'</code></pre>');
assert.ok(!guide.includes('<pre><code><code>'));
assert.ok(guide.includes('class="copy-code"'));
for(const html of [dashboard,guide]){const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);for(const m of html.matchAll(/href="#([^"]+)"/g))assert.ok(ids.includes(m[1]),'missing anchor '+m[1]);}
console.log('generated artifacts: identity, action priority, conversation UX and link integrity pass');
