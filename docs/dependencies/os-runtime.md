# Reviewed OS runtime dependency baseline

This is the template's pre-reviewed bootstrap set. `setup.sh` uses OpenSrc to
re-fetch these exact sources and checks the package-manager graph before it
downloads project dependencies.

Reviewed: 2026-07-29
OpenSrc CLI used: `0.7.2`

The CLI pin is deliberate: `opensrc@0.7.2` declares Node.js `>=18.0.0`, matching
the template baseline. The next release, `0.7.3`, declares Node.js `>=24`, so it
must not replace this pin until the template runtime is raised and reverified.

## `yaml@2.9.0`

Purpose: parse the repository's YAML frontmatter in render, validation, planning,
and doctor scripts.

OpenSrc evidence command:

```bash
opensrc path yaml@2.9.0 --cwd .
```

Reviewed source:

- `package.json`
- `README.md`
- `docs/01_intro.md`
- `docs/03_options.md`
- `docs/08_errors.md`
- `docs/SECURITY.md`

Compatibility findings:

- Requires Node.js `>=14.6`; Agent OS requires Node.js 18 or newer.
- Has no runtime dependencies and no peer dependencies, so there is no
  cross-package peer range to reconcile in the OS bootstrap set.
- Provides Node and browser export conditions; Agent OS loads its Node entry.
- Its included type declarations support TypeScript 3.9 or newer, but the OS
  calls it from JavaScript and does not require TypeScript.
- `YAML.parse()` supports the frontmatter structures used by this repository.

Decision: pin `yaml@2.9.0`. A later version is not adopted merely because it is
newer. Changing this pin requires a fresh OpenSrc evidence plan, compatibility
review, state/render regression checks, and human approval.

## Cross-reference conclusion

The bootstrap set contains one project package. Its compatibility surface is
therefore Node.js plus the OS scripts rather than another library. The declared
engine range covers the OS runtime, it has no peer or transitive runtime package
constraints, and the render/validation tests exercise the APIs the OS uses.

OpenSrc supplies the version-matched source; the npm lockfile, npm dry-run
resolver, and OS regression checks supply separate compatibility evidence.
