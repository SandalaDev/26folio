// scripts/distribution/atomic-write.mjs — write-then-rename so a crash
// mid-write can never leave a half-written file. Shared by the migration
// workflow (RC-FIX-04); nothing here is migration-specific.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export function atomicWriteFileSync(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp-${crypto.randomBytes(4).toString("hex")}`;
  fs.writeFileSync(tmp, content);
  fs.renameSync(tmp, file);
}

export function atomicWriteJSONSync(file, value) {
  atomicWriteFileSync(file, JSON.stringify(value, null, 2) + "\n");
}
