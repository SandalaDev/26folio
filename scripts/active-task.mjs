import fs from "node:fs";
try {
  const s = JSON.parse(fs.readFileSync("project-state/STATE.json","utf8"));
  const t = s.current?.task;
  if (t && t !== "TASK-XXX") {
    const p = `backlog/tasks/${t}.md`;
    if (fs.existsSync(p)) process.stdout.write(p);
  }
} catch {}
