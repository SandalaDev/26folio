#!/usr/bin/env node
// OpenSrc-backed dependency evidence workflow.
//
// OpenSrc supplies version-matched source. It does not solve dependency graphs
// or prove compatibility, so this workflow also requires package metadata,
// cross-package notes, the package manager's resolver, project checks, and
// explicit human approval before its install command will run.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const OPENSRC_VERSION = "0.7.2";
const OS_BASELINE_SPECS = ["yaml@2.9.0"];
const PLAN_DIR = process.env.AGENT_OS_DEP_PLAN_DIR
  ? path.resolve(process.env.AGENT_OS_DEP_PLAN_DIR)
  : path.join(ROOT, "planning", "dependencies");
const BASELINE = path.join(ROOT, "docs", "dependencies", "os-runtime.md");
const isWindows = process.platform === "win32";

const fail = message => {
  console.error(`[deps] ${message}`);
  process.exit(1);
};

const safeSpec = spec => /^[A-Za-z0-9@/_.:#=+-]+$/.test(spec);
const exactVersion = version => /^v?\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version);

function splitSpec(spec) {
  if (!safeSpec(spec)) fail(`unsafe package or repository spec: ${spec}`);
  const prefixed = spec.match(/^(pypi|pip|python|crates|cargo|rust):(.+)$/);
  const body = prefixed ? prefixed[2] : spec;
  const at = body.lastIndexOf("@");
  const name = at > 0 ? body.slice(0, at) : body;
  const version = at > 0 ? body.slice(at + 1) : "";
  const registry = prefixed
    ? (["pypi", "pip", "python"].includes(prefixed[1]) ? "pypi" : "crates")
    : (body.includes("/") && !body.startsWith("@") ? "repo" : "npm");
  return { spec, registry, name, version };
}

function requirePinned(spec, mode) {
  const parsed = splitSpec(spec);
  if (mode === "architecture" && parsed.registry === "repo") {
    if (!parsed.version || /^(latest|main|master|head|dev|develop)$/i.test(parsed.version)) {
      fail(`architecture repository evidence requires a release tag or commit, not '${spec}'`);
    }
    return parsed;
  }
  if (!exactVersion(parsed.version)) {
    fail(`${mode} plans require exact versions; use name@x.y.z, not '${spec}'`);
  }
  return parsed;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    encoding: "utf8",
    shell: isWindows && command.endsWith(".cmd"),
    ...options,
  });
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || result.error?.message || "").trim();
    throw new Error(`${command} failed${detail ? `: ${detail}` : ""}`);
  }
  return (result.stdout || "").trim();
}

function opensrc(args) {
  const installedProbe = spawnSync("opensrc", ["--version"], { encoding: "utf8" });
  if (installedProbe.status === 0) return run("opensrc", args);
  const npx = isWindows ? "npx.cmd" : "npx";
  return run(npx, ["-y", `opensrc@${OPENSRC_VERSION}`, ...args]);
}

function opensrcPath(spec) {
  const output = opensrc(["path", spec, "--cwd", ROOT]);
  const source = output.split(/\r?\n/).filter(Boolean).at(-1);
  if (!source || !fs.existsSync(source)) throw new Error(`OpenSrc returned no readable source for ${spec}`);
  return source;
}

function walkFiles(root, maxDepth = 5) {
  const out = [];
  const visit = (dir, depth) => {
    if (depth > maxDepth) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if ([".git", "node_modules", "target", ".next"].includes(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(full, depth + 1);
      else out.push(full);
      if (out.length > 5000) return;
    }
  };
  visit(root, 0);
  return out;
}

function packageManifest(source, packageName) {
  const candidates = walkFiles(source, 4).filter(file => path.basename(file) === "package.json");
  for (const file of candidates) {
    try {
      const manifest = JSON.parse(fs.readFileSync(file, "utf8"));
      if (manifest.name === packageName) return { file, manifest };
    } catch { /* ignore unrelated malformed fixtures */ }
  }
  try {
    const file = path.join(source, "package.json");
    return { file, manifest: JSON.parse(fs.readFileSync(file, "utf8")) };
  } catch {
    return { file: null, manifest: {} };
  }
}

function evidenceFor(spec) {
  const parsed = splitSpec(spec);
  const source = opensrcPath(spec);
  const files = walkFiles(source);
  const docs = files.filter(file => {
    const rel = path.relative(source, file).replace(/\\/g, "/");
    return /(^|\/)(readme|changelog|changes|migration|migrating|upgrade|security)(\.|$)/i.test(rel)
      || /(^|\/)docs?\/.*\.(md|mdx|txt)$/i.test(rel);
  }).slice(0, 40).map(file => path.relative(source, file).replace(/\\/g, "/"));
  const { file: manifestFile, manifest } = packageManifest(source, parsed.name);
  return {
    ...parsed,
    source,
    docs,
    manifestFile: manifestFile ? path.relative(source, manifestFile).replace(/\\/g, "/") : null,
    manifest,
  };
}

const yamlValue = value => JSON.stringify(value);
const jsonInline = value => JSON.stringify(value ?? {});

function renderPlan(mode, purpose, evidence, resolution) {
  const stamp = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  const id = `DEP-${stamp.replace(/[-:]/g, "").replace("T", "-").replace("Z", "")}-${mode}`;
  const pairs = [];
  for (let i = 0; i < evidence.length; i++) {
    for (let j = i + 1; j < evidence.length; j++) {
      pairs.push(`| ${evidence[i].spec} | ${evidence[j].spec} | TODO(REQUIRED): shared runtime, peer, build, API, or configuration constraints |`);
    }
  }
  const sections = evidence.map(item => `
### ${item.spec}

- OpenSrc command: \`opensrc path ${item.spec} --cwd .\`
- Evidence cache used for this review: \`${item.source.replace(/\\/g, "/")}\`
- Package manifest: ${item.manifestFile ? `\`${item.manifestFile}\`` : "not found at repository root"}
- Engines: \`${jsonInline(item.manifest.engines)}\`
- Peer dependencies: \`${jsonInline(item.manifest.peerDependencies)}\`
- Peer dependency metadata: \`${jsonInline(item.manifest.peerDependenciesMeta)}\`
- Exports/runtime entry points: \`${jsonInline(item.manifest.exports)}\`
- Documentation inventory: ${item.docs.length ? item.docs.map(doc => `\`${doc}\``).join(", ") : "none detected automatically"}

#### Docs and source findings

TODO(REQUIRED): record the relevant README/docs, migration or changelog guidance,
supported runtimes, configuration assumptions, and implementation details.

#### Project fit and risks

TODO(REQUIRED): explain why this exact version fits the project and what could
conflict with the other candidates, existing stack, deployment target, or data.
`).join("\n");

  return `---
id: ${yamlValue(id)}
mode: ${yamlValue(mode)}
status: "evidence-collected"
human_approval: "pending"
purpose: ${yamlValue(purpose)}
opensrc_cli: ${yamlValue(OPENSRC_VERSION)}
created_at: ${yamlValue(stamp)}
packages:
${evidence.map(item => `  - ${yamlValue(item.spec)}`).join("\n")}
---

# Dependency evidence: ${purpose}

OpenSrc fetched the exact candidate sources before project packages were
installed. OpenSrc is evidence access, not proof of compatibility.

## Candidate evidence
${sections}

## Cross-package compatibility matrix

| Candidate A | Candidate B | Compatibility evidence and constraints |
|---|---|---|
${pairs.length ? pairs.join("\n") : `| ${evidence[0]?.spec || "single candidate"} | project runtime and existing dependencies | TODO(REQUIRED): record engine, module, platform, and existing-stack compatibility |`}

## Combined architecture and best-practice conclusion

TODO(REQUIRED): reconcile the packages' prescribed patterns. State which package
owns overlapping responsibilities, where their guidance conflicts, and the
system-wide conventions this project will follow.

## Package-manager compatibility result

The pre-install resolver ran while this plan was created. It installed no package
payloads.

- Result: **${resolution.ok ? "accepted" : "rejected"}**
- Exit status: \`${resolution.status}\`
- Standard output: ${resolution.stdout ? `\`${resolution.stdout.replace(/\s+/g, " ").slice(0, 1200).replace(/`/g, "'")}\`` : "none"}
- Warnings/errors: ${resolution.stderr ? `\`${resolution.stderr.replace(/\s+/g, " ").slice(0, 1200).replace(/`/g, "'")}\`` : "none"}

TODO(REQUIRED): interpret the resolver result and warnings in the context of the
source evidence. A successful resolution does not by itself prove runtime fit.

## Verification after installation

TODO(REQUIRED): list the smallest build, type, test, or runtime probes that will
show this package set works in this project.

## Human decision

AGENT: after completing every required field, change \`status\` to
\`review-ready\`.

HUMAN: review the evidence and exact versions. If approved, change \`status\` to
\`approved\` and \`human_approval\` to \`approved\`. The OS install command will
not run this plan until then. Direct package-manager commands remain available
because the OS does not gate pushes.
`;
}

async function parsePlan(file) {
  if (!fs.existsSync(file)) fail(`plan not found: ${file}`);
  const source = fs.readFileSync(file, "utf8");
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) fail(`plan has no YAML frontmatter: ${file}`);
  let YAML;
  try { ({ default: YAML } = await import("yaml")); }
  catch { fail("the OS yaml dependency is missing; run setup.sh first"); }
  let fm;
  try { fm = YAML.parse(match[1]) ?? {}; }
  catch (error) { fail(`invalid plan frontmatter: ${error.message}`); }
  return { source, fm };
}

function npmCompatibility(specs) {
  if (!specs.length) {
    return {
      ok: true,
      status: 0,
      stdout: "No npm candidates; use the relevant ecosystem resolver.",
      stderr: "",
    };
  }
  const npm = isWindows ? "npm.cmd" : "npm";
  const result = spawnSync(npm, [
    "install", "--package-lock-only", "--ignore-scripts", "--dry-run",
    "--save-exact", ...specs,
  ], {
    cwd: ROOT,
    encoding: "utf8",
    shell: isWindows,
  });
  return {
    ok: result.status === 0,
    status: result.status ?? 1,
    stdout: (result.stdout || "").trim(),
    stderr: (result.stderr || result.error?.message || "").trim(),
  };
}

const resolverDetail = result => [result.stdout, result.stderr].filter(Boolean).join("\n")
  || "accepted (no warnings)";

async function checkPlan(file, { requireApproval = false } = {}) {
  const { source, fm } = await parsePlan(file);
  if (!["initial", "add", "architecture"].includes(fm.mode)) fail(`invalid plan mode: ${fm.mode}`);
  if (!Array.isArray(fm.packages) || !fm.packages.length) fail("plan has no packages");
  for (const spec of fm.packages) requirePinned(String(spec), fm.mode);
  if (/TODO\(REQUIRED\)/.test(source)) fail("required research fields are incomplete");
  if (!["review-ready", "approved", "installed"].includes(fm.status)) {
    fail(`plan status must be review-ready or approved after research; found ${fm.status || "missing"}`);
  }
  if (requireApproval && (fm.status !== "approved" || fm.human_approval !== "approved")) {
    fail("human approval is pending; set status and human_approval to approved after review");
  }
  const npmSpecs = fm.packages.map(String).filter(spec => splitSpec(spec).registry === "npm");
  const result = npmCompatibility(npmSpecs);
  if (!result.ok) fail(`npm dry-run resolver rejected the candidate set:\n${resolverDetail(result)}`);
  console.log(`[deps] evidence complete: ${file}`);
  console.log(`[deps] npm dry-run resolver: ${resolverDetail(result)}`);
  if (!requireApproval && (fm.status !== "approved" || fm.human_approval !== "approved")) {
    console.log("[deps] resolver accepted the exact set; human approval is still pending.");
  }
  return { fm, source };
}

function directNpmSpecs() {
  if (!fs.existsSync("package-lock.json")) fail("package-lock.json is required for the OS baseline");
  const lock = JSON.parse(fs.readFileSync("package-lock.json", "utf8"));
  return OS_BASELINE_SPECS.map(spec => {
    const { name, version } = splitSpec(spec);
    const declared = lock.packages?.[""]?.dependencies?.[name];
    if (declared !== version) fail(`package-lock root must pin ${spec}; found ${declared || "missing"}`);
    const exact = lock.packages?.[`node_modules/${name}`]?.version;
    if (!exact) fail(`lockfile has no exact version for ${name}`);
    if (exact !== version) fail(`lockfile resolves ${name}@${exact}; reviewed baseline is ${spec}`);
    return spec;
  });
}

async function baseline() {
  if (!fs.existsSync(BASELINE)) fail(`missing reviewed OS dependency baseline: ${BASELINE}`);
  const baselineText = fs.readFileSync(BASELINE, "utf8");
  const specs = directNpmSpecs();
  for (const spec of specs) {
    if (!baselineText.includes(spec)) fail(`OS baseline does not cover ${spec}`);
    const evidence = evidenceFor(spec);
    if (!evidence.docs.some(doc => /^readme/i.test(path.basename(doc)))) {
      fail(`${spec} source has no detected README`);
    }
    if (evidence.manifest.version && evidence.manifest.version !== splitSpec(spec).version) {
      fail(`${spec} source manifest resolved to ${evidence.manifest.version}`);
    }
    console.log(`[deps] OpenSrc evidence ready: ${spec}`);
    console.log(`       engines=${jsonInline(evidence.manifest.engines)} peers=${jsonInline(evidence.manifest.peerDependencies)}`);
  }
  const result = npmCompatibility(specs);
  if (!result.ok) fail(`OS baseline resolver rejected the reviewed set:\n${resolverDetail(result)}`);
  console.log(`[deps] OS baseline resolver: ${resolverDetail(result)}`);
  console.log(`[deps] reviewed baseline: ${path.relative(ROOT, BASELINE).replace(/\\/g, "/")}`);
}

async function main() {
  const [command = "help", ...args] = process.argv.slice(2);
  if (command === "baseline" || command === "preflight") return baseline();
  if (command === "path") {
    if (!args.length) fail("usage: os deps path <package-or-repo> [...]");
    for (const spec of args) console.log(`${spec}\t${opensrcPath(spec)}`);
    return;
  }
  if (command === "plan") {
    const [mode, purpose, ...specs] = args;
    if (!["initial", "add", "architecture"].includes(mode) || !purpose || !specs.length) {
      fail('usage: os deps plan <initial|add|architecture> "<purpose>" <exact-spec> [...]');
    }
    specs.forEach(spec => requirePinned(spec, mode));
    const evidence = specs.map(evidenceFor);
    const npmSpecs = specs.filter(spec => splitSpec(spec).registry === "npm");
    const resolution = npmCompatibility(npmSpecs);
    fs.mkdirSync(PLAN_DIR, { recursive: true });
    const report = renderPlan(mode, purpose, evidence, resolution);
    const id = report.match(/^id:\s*"([^"]+)"/m)?.[1] || `DEP-${Date.now()}`;
    const file = path.join(PLAN_DIR, `${id}.md`);
    fs.writeFileSync(file, report);
    console.log(`[deps] wrote ${path.relative(ROOT, file).replace(/\\/g, "/")}`);
    console.log(`[deps] pre-install resolver: ${resolution.ok ? "accepted" : "rejected"}`);
    console.log("[deps] agent: read every listed source/doc, complete every REQUIRED field, then request human approval.");
    if (!resolution.ok) process.exitCode = 1;
    return;
  }
  if (command === "check") {
    if (args.length !== 1) fail("usage: os deps check <plan.md>");
    await checkPlan(args[0]);
    return;
  }
  if (command === "install") {
    if (args.length !== 1) fail("usage: os deps install <approved-plan.md>");
    const { fm, source } = await checkPlan(args[0], { requireApproval: true });
    if (fm.mode === "architecture") fail("architecture research plans are context, not install plans");
    const specs = fm.packages.map(String);
    const unsupported = specs.filter(spec => splitSpec(spec).registry !== "npm");
    if (unsupported.length) fail(`automatic install currently supports npm only: ${unsupported.join(", ")}`);
    const npm = isWindows ? "npm.cmd" : "npm";
    run(npm, ["install", "--save-exact", ...specs], { stdio: "inherit" });
    for (const spec of specs) opensrcPath(spec);
    const installedAt = new Date().toISOString();
    let updated = source.replace(/^status:\s*["']?approved["']?\s*$/m, 'status: "installed"');
    updated = updated.replace(/\r?\n---\r?\n/, `\ninstalled_at: ${yamlValue(installedAt)}\n---\n`);
    fs.writeFileSync(args[0], updated);
    console.log(`[deps] installed approved exact set: ${specs.join(", ")}`);
    return;
  }

  console.log(`Usage:
  bash scripts/os.sh deps baseline
  bash scripts/os.sh deps path <package-or-repo> [...]
  bash scripts/os.sh deps plan initial "<purpose>" <name@x.y.z> [...]
  bash scripts/os.sh deps plan add "<purpose>" <name@x.y.z> [...]
  bash scripts/os.sh deps plan architecture "<decision>" <package@x.y.z|owner/repo@ref> [...]
  bash scripts/os.sh deps check <plan.md>
  bash scripts/os.sh deps install <approved-plan.md>`);
}

try {
  await main();
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
