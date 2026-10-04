import fs from 'node:fs';
import path from 'node:path';
import { hash, now, state, transaction, document, writeDocument, read, safePath, assertOwner } from './runtime.mjs';

// The agent asks these in conversation. These are decision topics, not forms
// the operator must edit. Extra project-specific questions can be added.
export const KINDS = {
  discovery: { purpose: 'Understand the project before choosing technologies.', fields: {
    project_name: 'What should this project be called?',
    users: 'Who uses it, and what job must it help them do?',
    problem: 'What problem makes this worth building?',
    scope: 'What must the first useful release do, and what is excluded?',
    constraints: 'What budget, deployment, privacy, existing-system or technology constraints matter?',
    success: 'What observable outcome means the first release works?' } },
  delivery: { purpose: 'Agree scope and delivery expectations immediately after hydration.', fields: {
    scope: 'Which outcomes belong in the first release?',
    estimates: 'Here is the weighted work and uncertainty. What scope should we change?',
    capacity: 'What delivery capacity can we assume? Unknown is valid; it means no forecast yet.',
    target: 'Is there a real target date, or should we work without a calendar promise?',
    exit_criteria: 'What will you inspect before calling the release ready?' } },
  capabilities: { purpose: 'Choose skills, harnesses, usage accounting and quality work for this project.', fields: {
    harnesses: 'Which harnesses, model providers and subscriptions will you use?',
    costs: 'Should we show API-equivalent usage only, or allocate a stated project share of subscriptions too?',
    skills: 'Based on this project, here are the relevant skills. Which should we use?',
    testing: 'Which failures matter most and what checks will demonstrate correct behavior?',
    review: 'What review providers and spending limits may the agent use?' } },
  architecture: { purpose: 'Resolve a consequential technical choice from requirements and source evidence.', fields: {
    decision: 'What choice must be made?', constraints: 'Which constraints decide the tradeoff?',
    alternatives: 'What does the source evidence show about the candidates?', choice: 'Which option do you accept and why?' } },
  design: { purpose: 'Agree how the frontend should feel and behave before building it.', fields: {
    audience: 'Who is using this interface and in what setting?',
    flows: 'Walk through the main user journey and the important failure states.',
    direction: 'Which visual references, brand constraints and accessibility needs should guide the design?',
    acceptance: 'What will you inspect in the preview before accepting this design direction?' } },
  content: { purpose: 'Agree content priorities and voice for the frontend.', fields: {
    message: 'What should the user understand and do on each important screen?',
    evidence: 'Which claims and source materials are approved for use?',
    voice: 'What tone and terminology fit this audience?',
    acceptance: 'Which content examples and sensitive claims need your review?' } },
  ui: { purpose: 'Resolve interface behavior from the agreed design and content.', fields: {
    components: 'Which interactions and reusable elements support the main journey?',
    states: 'What must happen for loading, empty, error, success and permission states?',
    access: 'Which keyboard, screen-reader and responsive behaviors are required?',
    acceptance: 'Does the demonstrated interaction match the expected behavior?' } },
  epic: { purpose: 'Align on this epic before implementation starts.', fields: {
    outcome: 'What should work when this epic is finished?', scope: 'What is included and excluded?',
    examples: 'Walk through the important normal and failure scenarios.',
    dependencies: 'Which prior decisions or deliverables does this depend on?',
    acceptance: 'What will demonstrate that it matches your expectations?' } },
  change: { purpose: 'Resolve changed understanding before affected work continues.', fields: {
    change: 'What changed?', impact: 'What existing decisions and work does it affect?', choice: 'What revised direction do you accept?' } },
  closeout: { purpose: 'Demonstrate delivered behavior and reconcile it with your understanding.', fields: {
    demonstration: 'Here is what the epic does. Does this match your understanding?',
    departures: 'Which departures or remaining risks do you accept?', acceptance: 'Is the epic accepted, or what remains?' } },
  release: { purpose: 'Check release evidence with the human.', fields: {
    evidence: 'Here is the evidence against each release criterion. What remains?',
    exceptions: 'Are any explicit exceptions accepted?', decision: 'Accept the release or return it for more work?' } },
};
const validID = id => /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,95}$/.test(id);
const location = (root, id) => { if (!validID(id)) throw new Error('Invalid interview ID'); return safePath(root, `planning/interviews/${id}.md`); };
export function interviews(root = process.cwd()) {
  const dir = path.join(root, 'planning/interviews');
  return fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort().map(f => ({ ...document(path.join(dir, f)).data, file: `planning/interviews/${f}` })) : [];
}
export function interviewDigest(i) { return hash({ kind:i.kind, scope:i.scope, questions:i.questions, answers:i.answers, depends_on:i.depends_on }); }
function write(root, i) {
  const body = `# ${i.kind}: ${i.scope}\n\n${KINDS[i.kind].purpose}\n\n` + Object.entries(i.questions).map(([key,q]) => `## ${key}\n${q.text}\n\n${i.answers[key] || '(awaiting a conversational answer)'}\n`).join('\n');
  writeDocument(location(root, i.id), i, body);
}
function load(root, id) { const f = location(root, id); if (!fs.existsSync(f)) throw new Error(`Interview not found: ${id}`); return document(f).data; }
export function complete(i, all = [], seen = new Set()) {
  if (!i || seen.has(i.id) || i.status !== 'complete' || i.confirmation?.digest !== interviewDigest(i)) return false;
  seen.add(i.id);
  return Object.entries(i.questions || {}).every(([key,q]) => !q.required || meaningful(i.answers?.[key])) &&
    Object.entries(i.depends_on || {}).every(([id,digest]) => {
      const dep = all.find(x => x.id === id); return dep && interviewDigest(dep) === digest && complete(dep, all, new Set(seen));
    });
}
const meaningful = x => typeof x === 'string' && x.trim().length > 1 && !/^(tbd|todo|\.\.\.|\(.*\)|\[.*\])$/i.test(x.trim());
export function startInterview(root, kind, scope = 'project', deps = []) {
  assertOwner(root);
  if (!KINDS[kind]) throw new Error(`Unknown interview kind. Choose ${Object.keys(KINDS).join(', ')}`);
  const id = `${kind}-${scope}`;
  if(kind==='discovery') transaction(root,s=>{s.workflow={...(s.workflow||{}),version:2,enforcement:'commands'};});
  if (fs.existsSync(location(root, id))) return load(root, id);
  if(!deps.length)deps=({delivery:['discovery-project'],capabilities:['discovery-project'],design:['discovery-project'],content:['design-project'],ui:['design-project','content-project'],epic:['delivery-project','capabilities-project']})[kind]||[];
  const all = interviews(root), depends_on = {};
  for (const d of deps) { const dep = all.find(x=>x.id===d); if (!complete(dep,all)) throw new Error(`Prerequisite interview incomplete: ${d}`); depends_on[d] = interviewDigest(dep); }
  const i = { id, kind, scope, status: 'interviewing', revision: 1, created: now(), depends_on,
    questions: Object.fromEntries(Object.entries(KINDS[kind].fields).map(([key,text])=>[key,{ text, required:true, after:[] }])), answers:{}, confirmation:null };
  write(root, i); return i;
}
export function recordAnswer(root, id, key, answer) {
  assertOwner(root); const i = load(root, id);
  if (!Object.hasOwn(i.questions,key)) throw new Error(`Unknown decision: ${key}`);
  if (!meaningful(answer)) throw new Error('Record an actual answer, or explain why this topic does not apply.');
  i.answers[key] = answer.trim(); i.revision++; i.status = 'interviewing'; i.confirmation = null;
  write(root, i); return packet(root, id);
}
export function packet(root, id) {
  const all = interviews(root), order=Object.keys(KINDS);
  const i = id ? load(root,id) : [...all].sort((a,b)=>order.indexOf(a.kind)-order.indexOf(b.kind)).find(x=>!complete(x,all));
  if (!i) return { action:'start', command:'os interview start discovery', explanation:'Begin the project conversation.' };
  const missing = Object.entries(i.questions).filter(([key,q]) => q.required && !meaningful(i.answers[key]));
  const frontier = missing.filter(([,q]) => (q.after || []).every(key=>meaningful(i.answers[key]))).slice(0,3);
  return { id:i.id, purpose:KINDS[i.kind].purpose, scope:i.scope, status:complete(i,all)?'complete':missing.length?'interviewing':'awaiting-confirmation',
    instructions:'Interview in the active chat. Research facts yourself. Ask up to three independent decisions, explain a recommended answer, then wait. Record the user’s answer; never invent approval.',
    confirmed_answers:i.answers, next_questions:frontier.map(([key,q])=>({key,question:q.text})),
    remaining:missing.length, digest:interviewDigest(i), evidence_file:`planning/interviews/${i.id}.md`,
    readback:missing.length?null:'Read every decision back to the user. Ask whether this exact summary matches their intent; confirm only after their explicit answer.' };
}
export function confirmInterview(root, id, digest, evidence) {
  assertOwner(root); const i = load(root,id), all=interviews(root);
  if (!meaningful(evidence)) throw new Error('Confirmation needs the explicit user answer or its message reference.');
  if (digest !== interviewDigest(i)) throw new Error('The interview changed since readback. Present the new summary.');
  if (Object.entries(i.questions).some(([key,q])=>q.required&&!meaningful(i.answers[key]))) throw new Error('Required decisions are unanswered.');
  for (const [dep,d] of Object.entries(i.depends_on || {})) { const parent=all.find(x=>x.id===dep); if(!complete(parent,all)||interviewDigest(parent)!==d) throw new Error('An upstream decision changed. Revisit this interview.'); }
  i.status='complete'; i.confirmation={ digest, evidence, at:now(), assurance:'human-answer-recorded-by-agent' }; write(root,i);
  if (i.kind==='discovery') {
    transaction(root,s=> { s.project={...(s.project||{}),name:i.answers.project_name}; s.workflow={...(s.workflow||{}),version:2,enforcement:'commands'}; });
    // Hydration is based only on confirmed intent. Never fabricate a release date.
    const charter=path.join(root,'project-spine/01-charter.md');
    if (!fs.existsSync(charter)) writeDocument(charter,{hydrated:now(),interview_ref:`planning/interviews/${id}.md`},`# ${i.answers.project_name}\n\n## Purpose\n${i.answers.problem}\n\n## Users\n${i.answers.users}\n\n## Scope\n${i.answers.scope}\n\n## Constraints\n${i.answers.constraints}\n\n## Success\n${i.answers.success}\n`);
    const decisions=path.join(root,'project-spine/02-decisions.md');
    if(!fs.existsSync(decisions)) writeDocument(decisions,{},'# Decisions\n\nThe durable decision log is `project-state/decisions.md`. Interview evidence is under `planning/interviews/`.\n');
    const roadmap=path.join(root,'project-spine/03-roadmap.md');
    if(!fs.existsSync(roadmap)) writeDocument(roadmap,{release:{id:'RC-001',title:'First useful release',status:'draft',scope_refs:[],exit_criteria:[]},roadmap:[]},'# Roadmap\n\nComplete the delivery interview before proposing scope weights or calendar dates.\n');
    startInterview(root,'delivery','project',[id]); startInterview(root,'capabilities','project',[id]);
  }
  return packet(root,id);
}
export function gate(root, task) {
  const s=state(root), all=interviews(root);
  if (s.workflow?.version!==2) return { allowed:true, assurance:'legacy-instruction-only', blockers:[] };
  const taskFile=task && ['backlog/tasks/','backlog/done/'].map(d=>safePath(root,`${d}${path.basename(task,'.md')}.md`)).find(fs.existsSync);
  const fm=taskFile?document(taskFile).data:{};
  const epic=path.basename(String(fm.epic_ref||s.current?.epic||''),'.md');
  const required=['discovery-project','delivery-project','capabilities-project'];
  if(epic) required.push(`epic-${epic}`);
  const blockers=required.filter(id=>!complete(all.find(i=>i.id===id),all)).map(id=>({id,reason:'Required conversation is missing, incomplete, or invalidated.'}));
  for(const i of all) if((i.scope==='project'||i.scope===epic||i.scope===task)&&!complete(i,all)&&!blockers.some(b=>b.id===i.id)) blockers.push({id:i.id,reason:'Decision requires confirmation.'});
  return {allowed:blockers.length===0,assurance:s.workflow.enforcement||'commands',blockers};
}
export function interviewCommand(root,args) {
  const [op,id,key,...rest]=args;
  if(op==='start') return packet(root,startInterview(root,id,key).id);
  if(op==='record') return recordAnswer(root,id,key,rest.join(' '));
  if(op==='confirm') return confirmInterview(root,id,key,rest.join(' '));
  if(op==='packet'||op==='review'||!op) return packet(root,id);
  if(op==='status') return interviews(root).map(i=>({id:i.id,scope:i.scope,complete:complete(i,interviews(root))}));
  if(op==='ask') {
    assertOwner(root); const i=load(root,id); if(!validID(key)||i.questions[key]) throw new Error('Use a new question key.');
    const question=JSON.parse(rest.join(' ')); if(!meaningful(question.text)) throw new Error('Question text required');
    if((question.after||[]).some(k=>!i.questions[k])) throw new Error('Unknown prerequisite question');
    i.questions[key]={text:question.text,after:question.after||[],required:question.required!==false};i.revision++;i.status='interviewing';i.confirmation=null;write(root,i);return packet(root,id);
  }
  if(op==='revisit') { assertOwner(root);const i=load(root,id),all=interviews(root);for(const dep of Object.keys(i.depends_on||{})){const parent=all.find(x=>x.id===dep);if(!complete(parent,all))throw new Error('Finish upstream interview first');i.depends_on[dep]=interviewDigest(parent);}i.status='interviewing';i.confirmation=null;i.revision++;write(root,i);return packet(root,id); }
  if(op==='gate') return gate(root,id);
  if(op==='ready'){if(state(root).workflow?.version!==2)throw new Error('Start discovery and record confirmed decisions first');if(id&&!complete(load(root,id),interviews(root)))throw new Error(`Interview incomplete: ${id}`);const result=gate(root);if(!result.allowed)throw new Error(`Unanswered interviews: ${result.blockers.map(b=>b.id).join(', ')}`);return result;}
  if(op==='after-done'){
    if(state(root).workflow?.version!==2)return {action:'legacy'};
    const done=safePath(root,`backlog/done/${path.basename(id,'.md')}.md`),epic=path.basename(String(document(done).data.epic_ref||''),'.md');
    const active=path.join(root,'backlog/tasks');const remaining=fs.existsSync(active)?fs.readdirSync(active).filter(f=>f.endsWith('.md')).some(f=>path.basename(String(document(path.join(active,f)).data.epic_ref||''),'.md')===epic):false;
    if(epic&&!remaining)return packet(root,startInterview(root,'closeout',epic,[`epic-${epic}`]).id);
    return {remaining};
  }
  throw new Error('Usage: os interview start|packet|record|review|confirm|ask|revisit|status|gate');
}
