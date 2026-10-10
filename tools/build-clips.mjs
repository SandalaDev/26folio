#!/usr/bin/env node
/**
 * Build the /work preview loops from a project's existing stills (EPIC-029
 * TASK-135). Local tool only: needs ffmpeg (planning/dependencies/
 * DEP-20261009-ffmpeg-local-tool.md) and the `sharp` already in node_modules.
 *
 *   node tools/build-clips.mjs [slug ...]      # default: every slug in clips.json
 *
 * Every frame is cut from the owner's own artwork: eased zooms, pans and
 * crossfades between stills, nothing generated. Each clip starts and ends on the
 * same framing of the cover, so the loop seam is invisible. Writes
 * public/videos/projects/<slug>/{card,hero}.{mp4,webm} and {card,hero}-poster.webp.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")), "..");
const SPEC = JSON.parse(fs.readFileSync(path.join(ROOT, "tools/clips.json"), "utf8"));
const FPS = 30;
const FADE = 0.6;
const FFMPEG = process.env.FFMPEG ?? "ffmpeg";

const ease = (t) => 0.5 - Math.cos(Math.PI * Math.min(Math.max(t, 0), 1)) / 2;
const lerp = (a, b, t) => a + (b - a) * t;

/** Decode a still once; `contain` pads it to the frame's aspect with its own corner colour. */
async function loadStill(file, fit, aspect) {
  let img = sharp(path.join(ROOT, "public/images/projects", file)).removeAlpha();
  if (fit === "contain") {
    const { width, height } = await img.metadata();
    const { data } = await img.clone().extract({ left: 0, top: 0, width: 1, height: 1 }).raw().toBuffer({ resolveWithObject: true });
    const background = { r: data[0], g: data[1], b: data[2] };
    const w = Math.max(width, Math.round(height * aspect));
    const h = Math.max(height, Math.round(width / aspect));
    img = sharp(await img.extend({
      left: Math.floor((w - width) / 2), right: Math.ceil((w - width) / 2),
      top: Math.floor((h - height) / 2), bottom: Math.ceil((h - height) / 2), background,
    }).toBuffer());
  }
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

/** One frame of a shot: a window of the frame's aspect, zoomed by `z`, centred by focal x/y in 0..1. */
async function shotFrame(still, shot, t, W, H) {
  const k = ease(t);
  const z = lerp(shot.from.z, shot.to.z, k);
  const fx = lerp(shot.from.x ?? 0.5, shot.to.x ?? 0.5, k);
  const fy = lerp(shot.from.y ?? 0.5, shot.to.y ?? 0.5, k);
  const aspect = W / H;
  let bw = still.width;
  let bh = bw / aspect;
  if (bh > still.height) { bh = still.height; bw = bh * aspect; }
  const ww = Math.max(2, Math.round(bw / z));
  const wh = Math.max(2, Math.round(bh / z));
  const left = Math.round(lerp(0, still.width - ww, fx));
  const top = Math.round(lerp(0, still.height - wh, fy));
  return sharp(still.data, { raw: { width: still.width, height: still.height, channels: 3 } })
    .extract({ left, top, width: ww, height: wh })
    .resize(W, H, { kernel: "lanczos3" })
    .raw()
    .toBuffer();
}

function run(args, input) {
  return new Promise((resolve, reject) => {
    const p = spawn(FFMPEG, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: [input ? "pipe" : "ignore", "inherit", "inherit"] });
    p.on("error", reject);
    p.on("close", (code) => (code === 0 ? resolve(p) : reject(new Error(`ffmpeg exited ${code}`))));
    if (input) input(p.stdin);
  });
}

async function buildClip(slug, name, clip) {
  const [W, H] = clip.size;
  const out = path.join(ROOT, "public/videos/projects", slug);
  fs.mkdirSync(out, { recursive: true });
  const stills = await Promise.all(clip.shots.map((s) => loadStill(s.src, s.fit ?? "cover", W / H)));

  // Timeline: each shot overlaps the previous one by FADE seconds.
  const starts = [];
  let t0 = 0;
  for (const s of clip.shots) { starts.push(t0); t0 += s.dur - FADE; }
  const total = t0 + FADE;
  const frames = Math.round(total * FPS);

  const mp4 = path.join(out, `${name}.mp4`);
  let first;
  await run(
    ["-f", "rawvideo", "-pix_fmt", "rgb24", "-s", `${W}x${H}`, "-r", String(FPS), "-i", "-",
      "-c:v", "libx264", "-preset", "slow", "-crf", String(clip.crf ?? 24), "-pix_fmt", "yuv420p",
      "-movflags", "+faststart", "-an", mp4],
    async (stdin) => {
      for (let f = 0; f < frames; f++) {
        const t = f / FPS;
        const active = clip.shots.map((s, i) => ({ s, i })).filter(({ s, i }) => t >= starts[i] && t < starts[i] + s.dur);
        const bufs = await Promise.all(active.map(({ s, i }) => shotFrame(stills[i], s, (t - starts[i]) / s.dur, W, H)));
        let frame = bufs[bufs.length - 1];
        if (bufs.length === 2) {
          const a = Math.min(1, (t - starts[active[1].i]) / FADE);
          frame = Buffer.alloc(bufs[0].length);
          for (let p = 0; p < frame.length; p++) frame[p] = bufs[0][p] * (1 - a) + bufs[1][p] * a;
        }
        if (f === 0) first = frame;
        if (!stdin.write(frame)) await new Promise((r) => stdin.once("drain", r));
      }
      stdin.end();
    },
  );
  await run(["-i", mp4, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", String((clip.crf ?? 24) + 12), "-row-mt", "1", "-deadline", "good", "-an", path.join(out, `${name}.webm`)]);
  await sharp(first, { raw: { width: W, height: H, channels: 3 } }).webp({ quality: 80 }).toFile(path.join(out, `${name}-poster.webp`));
  const kb = (f) => Math.round(fs.statSync(path.join(out, f)).size / 1024);
  console.log(`${slug}/${name}: ${W}x${H} ${total.toFixed(1)}s  mp4 ${kb(`${name}.mp4`)}KB  webm ${kb(`${name}.webm`)}KB`);
}

const slugs = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(SPEC);
for (const slug of slugs) {
  for (const [name, clip] of Object.entries(SPEC[slug])) await buildClip(slug, name, clip);
}
