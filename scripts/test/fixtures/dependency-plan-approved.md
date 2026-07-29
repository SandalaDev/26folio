---
id: "DEP-TEST-approved"
mode: "initial"
status: "approved"
human_approval: "approved"
purpose: "exercise dependency plan validation"
opensrc_cli: "0.7.2"
created_at: "2026-07-29T00:00:00Z"
packages:
  - "yaml@2.9.0"
---

# Approved dependency test fixture

## Candidate evidence

The version-matched manifest requires Node 14.6 or newer, has no runtime or peer
dependencies, and exposes the Node entry used by the OS.

## Cross-package compatibility matrix

The only candidate is compatible with the OS Node 18+ runtime and existing
CommonJS/ESM loading behavior.

## Combined architecture and best-practice conclusion

Use the package only as the canonical YAML frontmatter parser.

## Package-manager compatibility result

The test invokes npm's package-lock-only, ignore-scripts, dry-run resolver.

## Verification after installation

Run state rendering, skill validation, and the dependency regression tests.
