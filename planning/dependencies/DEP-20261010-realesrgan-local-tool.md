---
id: "DEP-20261010-realesrgan-local-tool"
mode: "add"
status: "installed"
human_approval: "approved"
purpose: "AI-upscale the low-resolution OK Pharmacy rasters (EPIC-029 TASK-144)"
created_at: "2026-10-10"
installed_at: "2026-10-10"
packages:
  - "realesrgan-ncnn-vulkan 20220424 (Real-ESRGAN v0.2.5.0 portable Windows build, machine tool, not an npm package)"
---

# Dependency evidence: Real-ESRGAN as a local upscaler

## What and why

The owner judged the OK Pharmacy rasters too low-resolution and asked for them
to be AI-upscaled. The originals in `public/projects/ok/` are small at source
(the cover is 830×830, the LinkedIn mockup 945×1390, the social banner
1100×417), so a larger master cannot be re-exported. An upscaler was needed and
none was installed.

## Candidate

- `realesrgan-ncnn-vulkan-20220424-windows.zip` from the Real-ESRGAN release
  v0.2.5.0 (github.com/xinntao/Real-ESRGAN), 45,474,481 bytes,
  SHA-256 `abc02804e17982a3be33675e4d471e91ea374e65b70167abc09e31acb412802d`.
- Licence: BSD-3-Clause.
- Portable: an exe, its runtime DLLs and the model weights. It runs on the
  owner's Intel HD 630 through Vulkan. Model used: `realesrgan-x4plus`.

## Effect on the project

- `package.json` and the lockfile do not change. No runtime dependency.
- Unzipped into the session scratch directory, not into the repository. Only
  the upscaled, re-encoded WebP files in `public/` ship.

## Alternatives

- Upscayl 2.15.0 via winget: the same engine behind a GUI, AGPL-3.0, installed
  system-wide. Offered; the owner chose the portable build.
- No upscaling, only re-rendering the vector-based images: offered; declined.

## Approval

The owner asked for AI upscaling in chat on 2026-10-10 ("do ai upscaling on the
images") and approved this exact download (file, source and size were stated)
when asked.

## Caveat recorded

AI upscaling invents detail. It is a retouch, which EPIC-026 ruled out for
artwork; this is an explicit owner exception for OK Pharmacy only, and every
output was inspected by eye before it was committed.
