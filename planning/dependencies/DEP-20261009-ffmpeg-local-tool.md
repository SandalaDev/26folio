---
id: "DEP-20261009-ffmpeg-local-tool"
mode: "add"
status: "installed"
human_approval: "approved"
purpose: "Encode the EPIC-029 card and hero video loops locally"
created_at: "2026-10-09"
installed_at: "2026-10-09"
packages:
  - "Gyan.FFmpeg@9.0.2 (winget, machine tool, not an npm package)"
---

# Dependency evidence: ffmpeg as a local clip tool

## What and why

EPIC-029 puts a muted video loop on every `/work` card and project hero. The
owner records the engineering clips; the agent builds the four brand-project
clips from existing stills (TASK-135) and trims and encodes every clip to the
agreed budget (MP4 H.264 and WebM, about 1 MB per card clip, 3 MB per hero
clip, poster frame). That needs an encoder. None was installed.

## Candidate

- Package: `Gyan.FFmpeg` 9.0.2 via winget, the 64-bit static "full" build
  from gyan.dev. This is the Windows build that ffmpeg.org links to.
- Licence: GPL-3.0. Acceptable because ffmpeg runs only on the owner's
  machine; no ffmpeg code or binary ships with the site.
- Codecs needed: libx264 (MP4) and libvpx-vp9 (WebM). Both are in the full
  build.

## Effect on the project

- `package.json` and the lockfile do not change. No runtime dependency.
- The deployed Cloudflare Worker never calls ffmpeg. Only the encoded files in
  `public/` ship.
- Clip-building scripts run from a scratch directory, not from `package.json`
  scripts, matching how EPIC-026 used `sharp`.

## Alternatives

- Owner encodes every clip: set aside at the kickoff (owner chose "mixed").
- An npm wrapper such as `ffmpeg-static`: adds a package to the project for a
  task that is local only.

## Approval

The owner said in chat on 2026-10-09: "install ffmpeg and any other dependency
you need". No other dependency was found to be needed: screen captures use the
built-in browser, and image work uses the existing `sharp`.

## Installed

`winget install --id Gyan.FFmpeg --exact --version 9.0.2` on 2026-10-09.
Verified: `ffmpeg version 9.0.2-full_build-www.gyan.dev`, with the `libx264`
and `libvpx-vp9` encoders present. Binary under
`%LOCALAPPDATA%\Microsoft\WinGet\Packages\Gyan.FFmpeg_*\ffmpeg-9.0.2-full_build\bin\`;
winget added `ffmpeg`, `ffprobe` and `ffplay` aliases. Shells opened before
the install need a restart to see them on PATH.
