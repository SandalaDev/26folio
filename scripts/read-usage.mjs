#!/usr/bin/env node
// read-usage.mjs — read the ephemeral .session-usage.json drop-file and emit
// inline JSON fields for the ledger, or an explicit "unknown" set if absent/invalid.
// Extracted to its own file to avoid fragile inline-node shell-escaping.
//
// Output (no trailing newline): "tokens_in":N,"tokens_out":N,"cost_usd":N,
//   where N is the number, or the literal string "unknown".
import fs from "node:fs";

const FILE = ".session-usage.json";
const num = (x) => (Number.isFinite(+x) ? (+x) : "unknown");

let fields = '"tokens_in":"unknown","tokens_out":"unknown","cost_usd":"unknown",';
if (fs.existsSync(FILE)) {
  try {
    const u = JSON.parse(fs.readFileSync(FILE, "utf8"));
    fields = `"tokens_in":${num(u.tokens_in)},"tokens_out":${num(u.tokens_out)},"cost_usd":${num(u.cost_usd)},`;
  } catch {
    // malformed drop-file -> honest "unknown", don't crash os end
  }
}
process.stdout.write(fields);
