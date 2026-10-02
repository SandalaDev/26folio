import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import YAML from 'yaml';
import { atomic, identity, journal, now, append, git, state, assertOwner, rows, transaction } from './runtime.mjs';
const [op,...args]=process.argv.slice(2),root=process.cwd();
if(op==='lock') {
  assertOwner(root);const old=journal(root),[branch,task,next,files,started]=args,id=identity();
  const touched=git(root,['status','--porcelain','--untracked-files=all']).split('\n').filter(Boolean).map(l=>l.slice(3));
  atomic(path.join(root,'project-state/session.lock'),YAML.stringify({id:old?.id||crypto.randomUUID(),owner:old?.owner||id.owner,ownership:id.owner?'bound':'instruction-only',started:started||now(),heartbeat:now(),harness:id.harness,model:id.model,role:id.role,branch,task,next_step:next,last_verification:old?.last_verification||'unknown',files_touched:touched.join(' ')}));
  transaction(root,s=>{s.current||={};s.current.session_status='active';});
}else if(op==='ledger') {
  const [status,started,harness,model,role,branch,task,gate]=args,lock=journal(root);
  const ended=now(),delta=(Date.parse(ended)-Date.parse(started))/60000;
  if(!lock?.id||!rows(path.join(root,'project-state/ledger.jsonl')).some(r=>r.session_id===lock.id&&r.status===status))append(root,'project-state/ledger.jsonl',{session_id:lock?.id||null,started:started||null,ended,harness,model,role,branch,task:task||'none',gate,status,duration_min:Number.isFinite(delta)&&delta>=0?Math.round(delta):null});
}else if(op==='crash') {
  const old=YAML.parse(fs.readFileSync(args[0],'utf8')),ended=old.heartbeat||null;
  const delta=(Date.parse(ended)-Date.parse(old.started))/60000;
  append(root,'project-state/ledger.jsonl',{session_id:old.id||null,started:old.started||null,ended,recovered_at:now(),harness:old.harness||'unknown',model:old.model||'unknown',role:old.role||'executor',branch:old.branch||null,task:old.task||'none',gate:'skipped',status:'crashed',duration_min:Number.isFinite(delta)&&delta>=0?Math.round(delta):null,duration_basis:'last observed heartbeat; idle time before recovery excluded'});
}else throw new Error('Unknown session IO operation');
