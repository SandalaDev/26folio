import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { classify } from './resolve.mjs';
const digest=x=>crypto.createHash('sha256').update(x).digest('hex');
const walk=(dir,base=dir)=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.name==='.git'?[]:e.isSymbolicLink()?(()=>{throw new Error('Template contains a symlink');})():e.isDirectory()?walk(path.join(dir,e.name),base):[path.relative(base,path.join(dir,e.name)).replaceAll('\\','/')]);
function destination(root,rel){if(path.isAbsolute(rel)||rel.split(/[\\/]/).includes('..'))throw new Error('Unsafe distribution path');const full=path.resolve(root,rel);if(!full.startsWith(path.resolve(root)+path.sep))throw new Error('Distribution path escapes root');let p=full;while(!fs.existsSync(p))p=path.dirname(p);const real=fs.realpathSync(p),base=fs.realpathSync(root);if(real!==base&&!real.startsWith(base+path.sep))throw new Error('Distribution path traverses an external symlink');return full;}
export function updatePlan(root,stage,ref,baseFiles={}){
 const manifest=JSON.parse(fs.readFileSync(path.join(stage,'scripts/distribution/manifest.json'),'utf8')),project=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
 if(project.dependencies?.yaml!=='2.9.0')throw new Error('Resolve yaml@2.9.0 compatibility before updating; no files changed');
 const receiptFile=path.join(root,'project-state/distribution-receipts.jsonl'),receipts=fs.existsSync(receiptFile)?fs.readFileSync(receiptFile,'utf8').trim().split(/\r?\n/).filter(Boolean).map(JSON.parse):[];
 const previous=receipts.at(-1)?.files||baseFiles,files={},actions=[],profile=receipts.at(-1)?.profile||JSON.parse(fs.readFileSync(path.join(root,'project-state/state.json'),'utf8')).distribution?.profile||'frontend';
 for(const rel of walk(stage)){
  const c=classify(manifest,rel);if(c.category!=='machinery'||(profile==='core'&&rel.startsWith('pack-frontend/')))continue;
  if(['package.json','package-lock.json','.gitignore','.gitattributes'].includes(rel))continue;
  const dest=destination(root,rel),incoming=digest(fs.readFileSync(path.join(stage,rel))),local=fs.existsSync(dest)?digest(fs.readFileSync(dest)):null;
  const action=local===incoming?'unchanged':local===null?'add':previous[rel]===local?'update':'preserve-customized';
  actions.push({path:rel,action,before:local,after:incoming});files[rel]=action==='preserve-customized'?(previous[rel]||null):incoming;
 }
 for(const [rel,oldHash] of Object.entries(previous)){
  if(Object.hasOwn(files,rel)||!oldHash||/^(project-state|project-spine|planning|backlog|memory|handoffs)\//.test(rel)||['package.json','package-lock.json','.gitignore','.gitattributes'].includes(rel))continue;
  const dest=destination(root,rel);if(!fs.existsSync(dest))continue;const local=digest(fs.readFileSync(dest));actions.push({path:rel,action:local===oldHash?'retire':'preserve-customized',before:local,after:null});if(local!==oldHash)files[rel]=oldHash;
 }
 return {ref,profile,at:new Date().toISOString(),actions,files};
}
export function applyUpdate(root,stage,plan){
 for(const a of plan.actions){const file=destination(root,a.path),current=fs.existsSync(file)?digest(fs.readFileSync(file)):null;if(current!==a.before)throw new Error('Project changed after update planning');}
 for(const a of plan.actions){const dest=destination(root,a.path);if(a.action==='retire')fs.unlinkSync(dest);else if(['add','update'].includes(a.action)){fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(stage,a.path),dest);}}
 fs.appendFileSync(path.join(root,'project-state/distribution-receipts.jsonl'),JSON.stringify(plan)+'\n');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 let temporary;
 try{
  const args=process.argv.slice(2),from=args[args.indexOf('--from')+1],ref=args.includes('--ref')?args[args.indexOf('--ref')+1]:'main',dry=args.includes('--dry-run');
  if(!args.includes('--from')||!from||from.startsWith('-'))throw new Error('update-from-template.sh --from path-or-url [--ref ref] [--dry-run]');
  const root=process.cwd();temporary=fs.mkdtempSync(path.join(os.tmpdir(),'agent-os-update-'));const stage=path.join(temporary,'template');
  execFileSync('git',['clone','--quiet','--no-checkout','--',from,stage],{stdio:'pipe'});
  const resolved=execFileSync('git',['rev-parse','--verify',`${ref}^{commit}`],{cwd:stage,encoding:'utf8'}).trim();execFileSync('git',['checkout','--quiet','--detach',resolved],{cwd:stage});
  const s=JSON.parse(fs.readFileSync(path.join(root,'project-state/state.json'),'utf8')),old=s.distribution?.template_ref,base={};
  if(old&&/^[a-f0-9]{40}$/.test(old)){try{const m=JSON.parse(execFileSync('git',['show',`${old}:scripts/distribution/manifest.json`],{cwd:stage,encoding:'utf8',stdio:['ignore','pipe','ignore']}));const names=execFileSync('git',['ls-tree','-r','--name-only',old],{cwd:stage,encoding:'utf8'}).trim().split('\n');for(const name of names)if(classify(m,name).category==='machinery')base[name]=digest(execFileSync('git',['show',`${old}:${name}`],{cwd:stage}));}catch{}}
  const plan=updatePlan(root,stage,resolved,base);if(!dry)applyUpdate(root,stage,plan);console.log(JSON.stringify({mode:dry?'dry-run':'applied',resolved_template_commit:resolved,actions:plan.actions},null,2));
 }catch(e){console.error(`[update] ${e.message}`);process.exitCode=1;}
 finally{if(temporary&&path.resolve(path.dirname(temporary))===path.resolve(os.tmpdir())&&path.basename(temporary).startsWith('agent-os-update-'))fs.rmSync(temporary,{recursive:true,force:true});}
}
