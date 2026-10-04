#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { state, options, assertOwner, atomicJSON, hash, read, now, transaction } from './runtime.mjs';
import { interviewCommand } from './interviews.mjs';
import { usageCommand, captureCurrent } from './usage.mjs';
import { nextAction, implementationGuard } from './workflow.mjs';

export async function control(root,args) {
  const [cmd,...rest]=args;
  if(cmd==='owner'){assertOwner(root);return;}
  if(cmd==='gate')return implementationGuard(root,rest[0]);
  if(cmd==='next')return nextAction(root);
  if(cmd==='interview')return interviewCommand(root,rest);
  if(cmd==='usage')return usageCommand(root,rest);
  if(cmd==='refresh') {
    // Import only the sources explicitly configured for this project.
    const usage=[(()=>{try{return captureCurrent(root);}catch(e){return {error:e.message};}})(),...usageCommand(root,['sync'])];
    execFileSync(process.execPath,[path.join(root,'scripts/render-state.mjs')],{cwd:root,stdio:'inherit'});
    const receipt={at:now(),source_revision:state(root).revision??0,artifacts:Object.fromEntries(['dashboard.html','guide.html','project-state/current-state.md','project-state/metrics.md'].map(f=>[f,fs.existsSync(path.join(root,f))?hash(read(path.join(root,f))):null])),usage,next:nextAction(root)};
    atomicJSON(path.join(root,'.agent-os-cache/refresh.json'),receipt);return receipt.next;
  }
  if(cmd==='project') {
    const {flags}=options(rest);assertOwner(root);if(!flags.name||typeof flags.name!=='string')throw new Error('os project --name "Project name"');
    transaction(root,s=>{s.project={...(s.project||{}),name:flags.name};});return {name:flags.name};
  }
  if(cmd==='guard-hook') {
    const input=JSON.parse(fs.readFileSync(0,'utf8')||'{}'), tool=input.tool_name||input.tool||'';
    const mutating=/write|edit|patch|bash|shell|terminal|agent|task/i.test(tool);
    const command=input.tool_input?.command||input.tool_input?.cmd||'';
    const recovery=/^(?:bash scripts\/os\.sh|node scripts\/control\.mjs) (?:interview|next|status|doctor|context|map|locate|refresh|start|onboard|end|checkpoint|switch|usage report)(?: [a-zA-Z0-9 _./:"'-]+)?$/.test(command)&&!/[;&|`$<>\r\n]/.test(command);
    if(mutating&&!recovery){try{implementationGuard(root,input.task_id||state(root).current?.task);}catch(e){
      if(input.hook_event_name==='PreToolUse')return {hookSpecificOutput:{hookEventName:'PreToolUse',permissionDecision:'deny',permissionDecisionReason:e.message}};
      throw e;
    }}
    return input.hook_event_name==='PreToolUse'?{hookSpecificOutput:{hookEventName:'PreToolUse',permissionDecision:'allow'}}:{allowed:true,assurance:'tool-name gate; shell commands blocked conservatively during pending interviews'};
  }
  if(cmd==='work'||cmd==='review'||cmd==='skills'||cmd==='verify-task') {
    const {workCommand}=await import('./work.mjs');return workCommand(root,cmd,rest);
  }
  if(cmd==='map'||cmd==='locate'||cmd==='briefing') {
    const {mapCommand}=await import('./code-map.mjs');return mapCommand(root,cmd,rest);
  }
  throw new Error('Unknown control command');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  try {const result=await control(process.cwd(),process.argv.slice(2));if(result!==undefined)console.log(JSON.stringify(result,null,2));}
  catch(e){console.error(`[os] ${e.message}`);process.exitCode=1;}
}
