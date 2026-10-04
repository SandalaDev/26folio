import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { hash, now, state, transaction, rows, append, options, assertOwner, read, journal } from './runtime.mjs';

const count = n => typeof n === 'number' && Number.isFinite(n) && n >= 0 ? n : null;
const value = (o,...keys) => { for(const k of keys) if(count(o?.[k])!==null) return o[k]; return null; };
const amount = n => count(n);
const sumKnown = values => values.some(v=>v!==null) ? values.reduce((a,b)=>a+(b??0),0) : null;
function nativeTokens(u, source) {
  let input=value(u,'input_tokens','inputTokens','input'), cached=value(u,'cached_input_tokens','cachedInputTokens','cache_read_input_tokens');
  cached ??= value(u?.input_tokens_details,'cached_tokens'); cached ??= count(u?.cache?.read);
  const write=value(u,'cache_creation_input_tokens') ?? count(u?.cache?.write);
  const output=value(u,'output_tokens','outputTokens','output'), reasoning=value(u,'reasoning_output_tokens','reasoning_tokens','reasoning') ?? count(u?.output_tokens_details?.reasoning_tokens);
  // Codex input includes cached input. Anthropic/OpenCode report cache separately.
  if(source==='codex' && input!==null && cached!==null) {
    if(cached>input) throw new Error('Cached input exceeds total input'); input-=cached;
  }
  return { input_uncached:input, input_cached_read:cached, input_cache_write:write,
    output, reasoning_output:reasoning, reasoning_in_output:source!=='opencode' };
}
function flattenOTel(data) {
  const result=[];
  const val=v=>v?.stringValue??(v?.intValue!==undefined?Number(v.intValue):v?.doubleValue??v?.boolValue);
  for(const resource of data.resourceLogs||[]) for(const scope of resource.scopeLogs||[]) for(const log of scope.logRecords||[]) {
    const attrs=Object.fromEntries([...(resource.resource?.attributes||[]),...(log.attributes||[])].map(a=>[a.key,val(a.value)]));
    if(attrs.input_tokens!==undefined||attrs.output_tokens!==undefined) result.push({ type:'otel',...attrs,usage:attrs,
      id:attrs['request.id']||attrs.request_id||hash({time:log.timeUnixNano,attrs}), model:attrs.model,
      cost_usd:attrs.cost_usd, timestamp:log.timeUnixNano?new Date(Number(BigInt(log.timeUnixNano)/1000000n)).toISOString():undefined });
  }
  return result;
}
export function normalizeUsage(harness, data, binding) {
  if(!binding.task||!binding.session) throw new Error('Usage imports require explicit task and session bindings.');
  if(!['codex','claude-code','opencode','gemini-cli','normalized'].includes(harness)) throw new Error('Unsupported usage adapter');
  let records=Array.isArray(data)?data:data.resourceLogs?flattenOTel(data):data.messages||[data];
  let model=binding.model||null, previous=null; const out=[];
  records.forEach((r,index)=>{
    if(r.type==='turn_context') model=r.payload?.model||model;
    const info=r.info||r, message=r.message||info, payload=r.payload||r;
    if(harness==='normalized') {
      if(!r.event_id||!r.tokens) throw new Error('Normalized event requires event_id and tokens');
      records[index]=r; // Still pass through the allowlisted writer below.
    }
    let u=harness==='normalized'?r.tokens:r.usage||message.usage||info.tokens;
    let cumulative=false;
    if(harness==='codex'&&payload.type==='token_count') {
      u=payload.info?.total_token_usage; cumulative=true;
      if(!u) u=payload.info?.last_token_usage, cumulative=false;
    }
    if(harness==='gemini-cli') u=r.usage||r.stats?.tokens;
    if(!u) return;
    // Claude final result summarizes earlier assistant messages: use messages if
    // present, otherwise import the summary as a single observation.
    if(harness==='claude-code'&&r.type==='result'&&records.some(x=>x.message?.usage)) return;
    if(cumulative) {
      const current={...u};
      const reset=previous && Object.entries(current).some(([k,v])=>count(v)!==null&&count(previous[k])!==null&&v<previous[k]);
      if(previous&&!reset) u=Object.fromEntries(Object.entries(current).map(([k,v])=>[k,count(v)!==null?Math.max(0,v-(count(previous[k])??0)):v]));
      previous=current;
    }
    model=message.model||info.modelID||r.model||model;
    const tokens=harness==='normalized'?Object.fromEntries(['input_uncached','input_cached_read','input_cache_write','output','reasoning_output'].map(k=>[k,count(u[k])])):nativeTokens(u,harness);
    if(harness==='normalized') tokens.reasoning_in_output=r.tokens.reasoning_in_output!==false;
    const nativeId=r.event_id||r.id||message.id||info.id||payload.id||`${index}`;
    const event={schema:'agent-os.usage.v1',event_id:hash([harness,binding.session,nativeId]),source_event_id:String(nativeId),
      adapter:harness,adapter_version:1,observed_at:r.timestamp||binding.observed_at||now(),
      task_id:path.basename(binding.task,'.md'),session_id:binding.session,worker_id:binding.worker||null,parent_session_id:binding.parent||null,
      harness,control_surface:binding.surface||harness,provider:info.providerID||binding.provider||null,
      account_id:binding.account||null,
      requested_model:binding.model||null,resolved_model:model,role:binding.role||'executor',work_type:binding.type||'unclassified',
      source_scope:binding.scope||'exclusive',tokens,
      coverage:Object.values(tokens).some(v=>typeof v==='number')?'measured':'unavailable',
      missing_reason:Object.values(tokens).some(v=>typeof v==='number')?null:'Source contains no supported token counts',
      billed_cost:harness==='normalized'?amount(r.billed_cost):null,
      // Harness cost fields normally use public rate cards, not the invoice.
      provider_estimate:amount(r.cost_usd??r.total_cost_usd??info.cost??r.api_equivalent_cost),currency:'USD'};
    if(!['exclusive','inclusive'].includes(event.source_scope)) throw new Error('source scope must be exclusive or inclusive');
    out.push(event);
  });
  return out;
}
export function importUsage(root,harness,file,binding) {
  assertOwner(root);
  const source=read(file);if(!source)throw new Error('Usage source is empty or missing');
  let data;try{data=JSON.parse(source);}catch{data=source.split(/\r?\n/).filter(Boolean).map((x,i)=>{try{return JSON.parse(x);}catch{throw new Error(`Invalid source JSON on line ${i+1}`);}});}
  const events=normalizeUsage(harness,data,binding), existing=new Map(rows(path.join(root,'project-state/usage.jsonl')).map(r=>[r.event_id,r]));
  let imported=0;
  for(const e of events){
    const old=existing.get(e.event_id);
    const signature=x=>hash({...x,observed_at:null,imported_at:null});
    if(old&&signature(old)===signature(e))continue;
    if(old&&old.task_id!==e.task_id)throw new Error('An event is already attributed to another task; use a new source binding or correct its original receipt.');
    append(root,'project-state/usage.jsonl',{...e,imported_at:now()});existing.set(e.event_id,e);imported++;
  }
  return {imported,observations:events.length,coverage:events.length?'supported records found':'no supported records; usage remains unknown'};
}
export function captureCurrent(root) {
  assertOwner(root);
  const lock=journal(root),task=state(root).current?.task;
  if(!lock||!task)return {coverage:'unattributed',reason:'No active task/session. Usage is not assigned by guess.'};
  const session=process.env.CODEX_THREAD_ID;
  let file=process.env.OS_USAGE_FILE,harness=process.env.HARNESS_NAME;
  if(!file&&session&&/^[a-f0-9-]+$/i.test(session)){
    const base=path.join(process.env.CODEX_HOME||path.join(os.homedir(),'.codex'),'sessions');
    const find=(dir,depth=0)=>{if(depth>4||!fs.existsSync(dir))return null;for(const entry of fs.readdirSync(dir,{withFileTypes:true})){if(entry.isSymbolicLink())continue;const candidate=path.join(dir,entry.name);if(entry.isFile()&&entry.name.endsWith(`-${session}.jsonl`))return candidate;if(entry.isDirectory()){const found=find(candidate,depth+1);if(found)return found;}}return null;};
    try{file=find(base);harness='codex';}catch(e){return {coverage:'unavailable',reason:e.code||e.message};}
  }
  if(!file)return {coverage:'unavailable',reason:'No matching current-session source. Set OS_USAGE_FILE for a native export; no transcript guessing.'};
  // Bind a thread once. A later task switch must not reattribute its earlier calls.
  const nativeSession=session||process.env.CLAUDE_SESSION_ID||lock.id;
  const binding={task,session:nativeSession,role:lock.role||'executor',type:'implementation'};
  const source=read(file);let records;try{records=JSON.parse(source);}catch{const lines=source.split(/\r?\n/);if(lines.at(-1)?.trim())lines.pop();records=lines.filter(Boolean).map(x=>JSON.parse(x));}
  const normalized=normalizeUsage(harness||lock.harness,records,binding);
  const existing=new Map(rows(path.join(root,'project-state/usage.jsonl')).map(x=>[x.event_id,x]));
  let added=0;
  const start=Math.max(Date.parse(lock.started)||0,Date.parse(state(root).current?.claimed_at)||0);
  for(const e of normalized){if(existing.has(e.event_id)||!Number.isFinite(Date.parse(e.observed_at))||Date.parse(e.observed_at)<start)continue;append(root,'project-state/usage.jsonl',{...e,imported_at:now()});existing.set(e.event_id,e);added++;}
  return {coverage:normalized.length?'measured':'unavailable',imported:added,adapter:harness||lock.harness};
}
function estimatedCost(event,cards) {
  const card=cards.filter(c=>c.model===event.resolved_model&&(!c.provider||c.provider===event.provider)&&c.effective_from<=event.observed_at&&(!c.effective_to||event.observed_at<c.effective_to)).sort((a,b)=>b.effective_from.localeCompare(a.effective_from))[0];
  if(!card)return {value:event.provider_estimate,source:event.provider_estimate!==null?'harness-estimate':null};
  const t=event.tokens,components=['input_uncached','input_cached_read','input_cache_write','output'];
  if(t.reasoning_in_output===false)components.push('reasoning_output');
  let total=0;
  for(const key of components) {
    if(t[key]===null){if(key==='input_cache_write')continue;return {value:null,source:card.id,reason:`Missing ${key}`};}
    if(t[key]===0)continue;
    if(count(card.per_million?.[key])===null)return {value:null,source:card.id,reason:`Missing price for ${key}`};
    total+=t[key]*card.per_million[key]/1e6;
  }
  return {value:total,source:card.id};
}
export function usageModel(root=process.cwd()) {
  const s=state(root), raw=rows(path.join(root,'project-state/usage.jsonl'));
  const latest=[...new Map(raw.map(r=>[r.event_id,r])).values()];
  // An inclusive parent is only displayed as inclusive. Do not add children on
  // top of it. Select top-level inclusive scope consistently for reconciliation.
  const inclusive=new Set(latest.filter(e=>e.source_scope==='inclusive').map(e=>e.session_id));
  const excluded=latest.filter(e=>e.parent_session_id&&inclusive.has(e.parent_session_id));
  const events=latest.filter(e=>!excluded.includes(e)).map(e=>({...e,estimate:estimatedCost(e,s.usage?.rate_cards||[])}));
  const groups=new Map();
  for(const e of events){const key=[e.task_id,e.harness,e.resolved_model,e.work_type].join(' / '),g=groups.get(key)||{task:e.task_id,harness:e.harness,model:e.resolved_model||'unknown',work_type:e.work_type,events:0,tokens:0,billed:[],estimated:[],allocated:0};g.events++;g.tokens+=['input_uncached','input_cached_read','input_cache_write','output'].reduce((n,k)=>n+(e.tokens[k]??0),0)+(e.tokens.reasoning_in_output===false?(e.tokens.reasoning_output??0):0);g.billed.push(e.billed_cost);g.estimated.push(e.estimate.value);groups.set(key,g);}
  const allocations=[];
  for(const plan of s.usage?.subscriptions||[]) {
    if(count(plan.paid_amount)===null||count(plan.project_share)===null){allocations.push({id:plan.id,name:plan.name||plan.id,budget:plan.budget_amount??null,currency:plan.currency||'USD',start:plan.start,end:plan.end,paid:plan.paid_amount??null,project_budget:null,allocated:null,unallocated:null,coverage:'unknown',basis:plan.basis,reason:'Payment or project share not supplied; budget is not an invoice.'});continue;}
    const sameHarnessPlans=(s.usage?.subscriptions||[]).filter(p=>p.harness===plan.harness&&p.start<plan.end&&plan.start<p.end);
    const observed=events.filter(e=>(!plan.harness||e.harness===plan.harness)&&(!plan.account||e.account_id===plan.account||(sameHarnessPlans.length===1&&!e.account_id))&&e.observed_at>=plan.start&&e.observed_at<plan.end);
    const budget=plan.paid_amount*plan.project_share;
    const basis=e=>plan.basis==='api-equivalent'?e.estimate.value:sumKnown(Object.entries(e.tokens).filter(([k,v])=>typeof v==='number'&&(k!=='reasoning_output'||e.tokens.reasoning_in_output===false)).map(([,v])=>v));
    const known=observed.filter(e=>basis(e)!==null), total=known.reduce((a,e)=>a+basis(e),0);
    // The project share is explicitly designated, not inferred from incomplete
    // visibility of other projects on the same subscription.
    for(const e of known){const g=groups.get([e.task_id,e.harness,e.resolved_model,e.work_type].join(' / '));g.allocated+=total>0?budget*basis(e)/total:0;}
    allocations.push({id:plan.id,paid:plan.paid_amount,project_budget:budget,allocated:total>0?budget:0,unallocated:total>0?plan.paid_amount-budget:plan.paid_amount,coverage:`${known.length}/${observed.length}`,basis:plan.basis});
  }
  const outcomes=[...new Map(rows(path.join(root,'project-state/outcomes.jsonl')).map(r=>[r.task,r])).values()];
  const comparisons=outcomes.map(o=>{const observed=events.filter(e=>e.task_id===o.task),models=[...new Set(observed.map(e=>e.resolved_model).filter(Boolean))];return {...o,models,attribution:models.length===1?'single observed model':'mixed or unknown; no model winner inferred',events:observed.length,api_equivalent_cost:sumKnown(observed.map(e=>e.estimate.value)),billed_cost:sumKnown(observed.map(e=>e.billed_cost)),estimate_coverage:`${observed.filter(e=>e.estimate.value!==null).length}/${observed.length}`,comparison_group:[o.work_type,o.complexity].join(' / ')};});
  return {events:events.length,excluded_inclusive_children:excluded.length,known_models:events.filter(e=>e.resolved_model).length,comparisons,
    estimated_coverage:events.filter(e=>e.estimate.value!==null).length,billed_cost:sumKnown(events.map(e=>e.billed_cost)),api_equivalent_cost:sumKnown(events.map(e=>e.estimate.value)),
    groups:[...groups.values()].map(g=>({...g,billed:sumKnown(g.billed),estimated:sumKnown(g.estimated)})),allocations,
    note:'API-equivalent estimates are not invoices. Subscription shares are explicit project budgets. Mixed-model outcomes need human acceptance evidence; no winner is inferred.'};
}
export function usageCommand(root,args) {
  const {positional:p,flags:f}=options(args),[op,harness,file]=p;
  if(op==='import')return importUsage(root,harness,file,f);
  if(op==='report'||!op)return usageModel(root);
  if(op==='capture')return captureCurrent(root);
  if(op==='outcome'){
    assertOwner(root);const input=JSON.parse(read(harness));
    if(!input.task||!input.work_type||!input.complexity||!['accepted','rework','unknown'].includes(input.acceptance)||!input.evidence||!Number.isInteger(input.retries)||input.retries<0)throw new Error('Outcome needs task, work_type, complexity, acceptance accepted|rework|unknown, evidence and nonnegative retries');
    const record={task:input.task,work_type:input.work_type,complexity:input.complexity,acceptance:input.acceptance,evidence:input.evidence,retries:input.retries,verification:input.verification||null,at:now()};append(root,'project-state/outcomes.jsonl',record);return record;
  }
  if(op==='sync') {
    return (state(root).usage?.sources||[]).map(source=>{try{return {id:source.id,...importUsage(root,source.harness,source.file,source.binding)};}catch(e){return {id:source.id,error:e.message};}});
  }
  if(op==='source'||op==='rate'||op==='subscription') {
    assertOwner(root);const input=JSON.parse(read(harness));if(!input.id)throw new Error('Configuration needs a stable id.');
    const field={source:'sources',rate:'rate_cards',subscription:'subscriptions'}[op];
    if(op==='source'&&(!input.file||!input.harness||!input.binding?.task||!input.binding?.session))throw new Error('Source requires file, harness and explicit task/session binding.');
    if(op==='rate'&&(!input.model||!input.effective_from||!input.source_url||!input.per_million))throw new Error('Rate needs model, effective date, source URL and per_million categories.');
    if(op==='subscription'&&(!(input.start<input.end)||!Number.isFinite(Date.parse(input.start))||!Number.isFinite(Date.parse(input.end))||(input.paid_amount!=null&&count(input.paid_amount)===null)||(input.project_share!=null&&(count(input.project_share)===null||input.project_share>1))||(count(input.paid_amount)===null&&count(input.budget_amount)===null)||!['api-equivalent','tokens'].includes(input.basis)||(input.currency&&input.currency!=='USD')))throw new Error('Subscription needs a valid interval, USD payment or budget, optional project_share 0..1 and api-equivalent|tokens basis.');
    transaction(root,s=>{s.usage||={};const all=s.usage[field]||[];
      if(op==='subscription'&&all.some(x=>x.id!==input.id&&(x.account||x.harness)===(input.account||input.harness)&&input.start<x.end&&x.start<input.end))throw new Error('Overlapping subscription periods would allocate twice.');
      s.usage[field]=[...all.filter(x=>x.id!==input.id),input];});return {saved:input.id,type:op};
  }
  throw new Error('Usage: os usage import <harness> <file> --task ID --session ID [--model ID] | source|rate|subscription <json-file> | sync | report');
}
