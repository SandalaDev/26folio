import fs from 'node:fs';
import path from 'node:path';
import { git, hash, atomicJSON, read, safePath, document, options, state } from './runtime.mjs';

const excluded = /(^|\/)(node_modules|\.git|\.agent-os-cache|archive|opensrc|project-state|handoffs)(\/|$)|^(planning\/|dashboard\.html$|guide\.html$)/;
export function codeMap(root) {
  const names = git(root,['ls-files','--cached','--others','--exclude-standard','-z']).split('\0').filter(Boolean);
  const files = [...new Set(names)].filter(f=>!excluded.test(f)).sort().flatMap(file=>{
    const full=safePath(root,file);if(!fs.existsSync(full)||!fs.statSync(full).isFile())return [];
    const size=fs.statSync(full).size;if(size>500000)return [{file,size,skipped:'large file'}];
    const source=read(full),imports=[...source.matchAll(/(?:from\s*|import\s*|require\(\s*)["']([^"']+)["']/g)].map(m=>m[1]);
    const symbols=[...source.matchAll(/(?:export\s+)?(?:async\s+)?(?:function|class)\s+([\w$]+)/g)].map(m=>m[1]);
    return [{file,size,digest:hash(source),imports:[...new Set(imports)],symbols:[...new Set(symbols)],test:/[./_-]test[s]?[./_-]|\.spec\./.test(file)}];
  });
  return {schema:'agent-os.map.v1',revision:hash(files),method:'file inventory and lexical imports; not a call graph',files};
}
export function mapCommand(root,cmd,args) {
  const {positional:p,flags:f}=options(args),map=codeMap(root);
  if(cmd==='map'){atomicJSON(path.join(root,'.agent-os-cache/code-map.json'),map);return {revision:map.revision,files:map.files.length,artifact:'.agent-os-cache/code-map.json',method:map.method};}
  if(cmd==='locate'){const terms=p.join(' ').toLowerCase().split(/\s+/).filter(Boolean);return map.files.filter(x=>terms.every(t=>[x.file,...(x.symbols||[])].join(' ').toLowerCase().includes(t))).slice(0,40);}
  const id=p[0]||state(root).current?.task;
  if(!id)throw new Error('os context <TASK> [--budget 4000]');
  const task=['backlog/tasks/','backlog/done/'].map(d=>safePath(root,`${d}${path.basename(id,'.md')}.md`)).find(fs.existsSync);
  if(!task)throw new Error('Task not found');
  const meta=document(task).data,focus=meta.files_allowed||[],limit=Number(f.budget||4000);
  if(!Number.isFinite(limit)||limit<200||limit>32000)throw new Error('Context budget must be 200..32000 estimated tokens');
  const selected=map.files.filter(x=>focus.some(a=>x.file===a||x.file.startsWith(a.replace(/\*.*$/,'').replace(/\/$/,'')+'/')));
  let packet={task:path.relative(root,task),task_contract:read(task),map_revision:map.revision,method:map.method,files:[],omitted:0,budget:limit,token_measurement:'estimate: UTF-8 bytes / 4; harness tokenizer may differ'};
  for(const item of selected){if(Buffer.byteLength(JSON.stringify({...packet,files:[...packet.files,item]}))/4>limit){packet.omitted++;continue;}packet.files.push(item);}
  if(Buffer.byteLength(JSON.stringify(packet))/4>limit){packet.task_contract='Read the task file by path; contract exceeds packet budget.';}
  return packet;
}
