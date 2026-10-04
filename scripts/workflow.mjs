import fs from 'node:fs';
import path from 'node:path';
import { state, journal, document, git } from './runtime.mjs';
import { gate, interviews, complete } from './interviews.mjs';

export function nextAction(root=process.cwd(),snapshot=null,time=new Date()) {
  const action=(code,why,command,prompt,owner='AGENT')=>({code,why,command,prompt,owner,observed_at:time.toISOString()});
  let s;try{s=snapshot||state(root);}catch(e){return action('state-unreadable',e.message,'os doctor','Inspect the unreadable state and recover its last valid snapshot.');}
  const lock=journal(root), age=lock?(time-new Date(lock.heartbeat||lock.started))/60000:0;
  if(lock&&(lock.invalid||!Number.isFinite(age)||age>=Number(process.env.OS_LOCK_TTL_MIN||120)))return action('recovery-needed','The session heartbeat is stale or invalid; this does not prove the owner stopped.','os onboard','Check whether the previous agent stopped, preserve its journal, and recover the unfinished work.');
  const task=s.current?.task;
  if(s.workflow?.version===2){
    const g=gate(root,task);if(!g.allowed){const id=g.blockers[0].id,all=interviews(root),i=all.find(x=>x.id===id);const parts=id.split('-');const kind=parts.shift();return {...action('interview-required',g.blockers[0].reason,i?`os interview packet ${id}`:`os interview start ${kind} ${parts.join('-')}`,`Conduct the ${kind} interview here in chat. Use existing evidence and ask the unresolved decisions.`,'HUMAN + AGENT'),blocked_scope:i?.scope||parts.join('-'),interview:id};}
  }else if(!fs.existsSync(path.join(root,'project-spine/01-charter.md'))){return action('discovery-needed','Project intent has not been captured.','os interview start discovery','Interview me about this project and record my answers as we go.','HUMAN + AGENT');}
  if(!task){const all=interviews(root),closeout=all.find(i=>i.kind==='closeout'&&!complete(i,all));if(closeout)return action('closeout-ready',`Implementation of ${closeout.scope} is ready for a human walkthrough.`,`os interview packet ${closeout.id}`,'Show the delivered behavior, explain remaining limitations, and record my corrections or acceptance.','HUMAN + AGENT');}
  const pending=(s.handoff_queue||[]).find(h=>h.status==='pending');if(pending)return action('handoff-pending',`Read ${pending.file||pending.id} before proceeding.`,'os context','Read the pending handoff and reconcile it with the current work.');
  if(task){
    const file=path.join(root,`backlog/tasks/${task}.md`);
    if(!fs.existsSync(file))return action('claim-mismatch','The claimed task is not in the active backlog.','os release','Reconcile the stale task claim with its completion evidence.');
    const branch=git(root,['branch','--show-current']);
    if(s.current.branch&&branch!==s.current.branch)return action('branch-mismatch',`Claim belongs to ${s.current.branch}; checkout is ${branch}.`,'os status','Reconcile the current branch and task before editing.');
    const fm=document(file).data;
    for(const dep of fm.depends_on||[])if(!fs.existsSync(path.join(root,`backlog/done/${dep}.md`)))return action('dependency-pending',`${dep} is unfinished.`,'os context',`Inspect the prerequisite ${dep} before continuing ${task}.`);
    if(!lock)return action('session-needed',`${task} has no active session.`,'os start','Start the task session and inspect its acceptance criteria.');
    return action('continue-task',lock.next_step||`Continue ${task} against its acceptance criteria.`,'os context',lock.next_step||`Continue ${task}, recording verification evidence and the next unfinished step.`);
  }
  return action('choose-work','No task is currently claimed.','os context','Select the next ready task, check its interview and prerequisites, and assess whether parallel work would help.');
}
export function implementationGuard(root,task) {
  const result=gate(root,task);
  if(!result.allowed)throw new Error(`Interview gate: ${result.blockers.map(b=>b.id).join(', ')}. Conduct the conversation in chat; record and confirm its decisions before implementation.`);
  return result;
}
