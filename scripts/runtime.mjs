import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import YAML from 'yaml';

export const hash = value => crypto.createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
export const now = () => new Date().toISOString();
export const json = file => JSON.parse(fs.readFileSync(file, 'utf8'));
export const read = file => fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
export function git(root, args) { try { return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore','pipe','ignore'] }).trim(); } catch { return ''; } }
export function safePath(root, rel) {
  if (!rel || path.isAbsolute(rel) || /(^|[\\/])\.\.([\\/]|$)/.test(rel)) throw new Error(`Expected a project-relative path: ${rel}`);
  const base = path.resolve(root), dest = path.resolve(base, rel);
  if (!dest.startsWith(base + path.sep)) throw new Error('Path escapes project');
  let parent = dest;
  while (!fs.existsSync(parent)) parent = path.dirname(parent);
  const realBase = fs.realpathSync(base), real = fs.realpathSync(parent);
  if (real !== realBase && !real.startsWith(realBase + path.sep)) throw new Error('Symlink escapes project');
  return dest;
}
export function atomic(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = `${file}.tmp-${crypto.randomUUID()}`;
  try { fs.writeFileSync(temp, value); fs.renameSync(temp, file); }
  finally { if (fs.existsSync(temp)) fs.unlinkSync(temp); }
}
export const atomicJSON = (file, value) => atomic(file, JSON.stringify(value, null, 2) + '\n');
export function state(root = process.cwd()) { const s=json(path.join(root, 'project-state/state.json'));if(!s||typeof s!=='object'||Array.isArray(s))throw new Error('State must be an object');return s; }
export function transaction(root, update, expectedRevision) {
  assertOwner(root);
  const file = path.join(root, 'project-state/state.json'), lock = file + '.write-lock';
  let fd;
  for (let attempt = 0; attempt < 80; attempt++) {
    try { fd = fs.openSync(lock, 'wx'); break; }
    catch (e) {
      if (e.code !== 'EEXIST') throw e;
      const owner = (() => { try { return json(lock); } catch { return null; } })();
      if (owner?.host === os.hostname()) {
        try { process.kill(owner.pid, 0); } catch (err) { if (err.code === 'ESRCH') { try { fs.unlinkSync(lock); } catch {} continue; } }
      }
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 25);
    }
  }
  if (fd === undefined) throw new Error('State is being written by another process; retry after it finishes.');
  try {
    fs.writeFileSync(fd, JSON.stringify({ pid: process.pid, host: os.hostname(), at: now() }));
    const current = state(root), revision = current.revision ?? 0;
    if(!Number.isSafeInteger(revision)||revision<0)throw new Error('Invalid state revision');
    if (expectedRevision !== undefined && revision !== expectedRevision) throw new Error('State changed while computing this update; retry.');
    update(current);
    current.revision = revision + 1; current.updated = now();
    atomicJSON(file, current); return current;
  } finally { fs.closeSync(fd); fs.unlinkSync(lock); }
}
export function document(file) {
  const source = read(file), match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n)?/);
  return { data: match ? YAML.parse(match[1]) || {} : {}, body: match ? source.slice(match[0].length) : source };
}
export function writeDocument(file, data, body) { atomic(file, `---\n${YAML.stringify(data)}---\n${body}`); }
export function identity() {
  const e = process.env;
  const harness = e.HARNESS_NAME || e.AGENT_NAME || (e.CODEX_THREAD_ID || e.CODEX_ENVIRONMENT ? 'codex' : e.CLAUDECODE || e.CLAUDE_CODE ? 'claude-code' : e.OPENCODE ? 'opencode' : 'unknown');
  return { harness, model: e.MODEL_NAME || 'unknown', role: e.AGENT_ROLE || 'executor',
    owner: e.OS_OWNER_ID || (e.CODEX_THREAD_ID ? hash(e.CODEX_THREAD_ID) : e.CLAUDE_SESSION_ID ? hash(e.CLAUDE_SESSION_ID) : null) };
}
export function journal(root = process.cwd()) {
  const source = read(path.join(root, 'project-state/session.lock'));
  if (!source) return null;
  try { return YAML.parse(source); } catch { return { invalid: true }; }
}
export function assertOwner(root) {
  if (process.env.OS_WORKER_ID) throw new Error('Workers return results; only the coordinator writes project state.');
  const lock = journal(root), owner = identity().owner;
  if (lock?.owner && owner !== lock.owner) throw new Error('Session belongs to a different owner. Use a handoff; do not overwrite its journal.');
}
export function append(root, relative, record) {
  const file = safePath(root, relative); fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.appendFileSync(file, JSON.stringify(record) + '\n');
}
export function rows(file) {
  return read(file).split(/\r?\n/).filter(Boolean).map((line, i) => {
    try { return JSON.parse(line); } catch { throw new Error(`Invalid JSON at ${file}:${i + 1}`); }
  });
}
export function options(args) {
  const positional = [], flags = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) flags[args[i].slice(2)] = args[i + 1] && !args[i + 1].startsWith('--') ? args[++i] : true;
    else positional.push(args[i]);
  }
  return { positional, flags };
}
