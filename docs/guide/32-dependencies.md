## Dependencies: OpenSrc before installation

The dependency workflow separates three questions:

1. What do the package's exact-version documentation and source prescribe?
2. Are the selected packages compatible with each other and this project?
3. Has a human approved the resulting technical and operational trade-off?

OpenSrc answers the first question by fetching version-matched source. It does
not solve peer ranges, certify compatibility, scan security, or prove that a
package set works in this project.

:::system Bootstrap dependency

`setup.sh` uses a pinned OpenSrc CLI through `npx` before `npm install`. It
fetches the reviewed `yaml@2.9.0` source, verifies its source metadata and docs
are available, and runs npm's no-payload dry-run resolver. OpenSrc is cached as
a tool under the user's cache; it is not added to the project dependencies.
:::

### Initial application stack

After intake and lean-context hydration, choose exact candidate versions before
running a framework scaffold or package install:

```bash
bash scripts/os.sh deps plan initial "initial web application stack" \
  next@15.4.0 react@19.1.0 react-dom@19.1.0
```

The command rejects `latest`, caret ranges, tilde ranges, and missing versions.
It fetches every exact source through OpenSrc, runs npm's no-payload resolver,
and records that initial resolver output in an evidence artifact under
`planning/dependencies/`.

:::agent Complete the generated evidence

For every prescribed package, read its manifest, README, relevant docs,
migration/changelog guidance, examples, tests, and implementation where public
docs are ambiguous. Complete every `TODO(REQUIRED)`. Then cross-reference every
package pair plus the existing runtime, build system, deployment target, and
project constraints. Interpret the recorded resolver result. When complete, set
the artifact status to `review-ready`, then run:

```bash
bash scripts/os.sh deps check planning/dependencies/DEP-....md
```

`check` rejects incomplete required fields and unpinned candidates, then asks
npm to resolve the full graph again with
`--package-lock-only --ignore-scripts --dry-run`. It installs no package
payloads and does not require approval, so the result is available to the human
who reviews the plan.
:::

The cross-reference must cover:

- engine, language, and module-format requirements;
- peer and optional-peer ranges;
- framework/plugin and provider expectations;
- overlapping responsibilities and which package owns them;
- configuration and deployment assumptions;
- breaking changes and migration requirements;
- prescribed best practices that conflict across packages;
- the post-install checks that could expose a bad assumption.

:::human Approve exact versions

Read the evidence artifact. If the package set and trade-offs are acceptable,
change both `status` and `human_approval` in its frontmatter to `approved`.
Do not approve an artifact with unresolved uncertainty disguised as certainty.
:::

Then install:

```bash
bash scripts/os.sh deps install planning/dependencies/DEP-....md
```

`install` reruns the evidence and resolver check, refuses missing human approval,
and currently supports approved npm plans. It installs the exact versions with
`--save-exact`.

### Adding or upgrading packages later

Use mode `add` before changing `package.json`:

```bash
bash scripts/os.sh deps plan add "add form validation" \
  react-hook-form@7.60.0 zod@4.0.5
```

The evidence must cross-reference the candidates with each other and with the
already installed stack. An upgrade is treated as a package addition decision:
read migration guidance, examine changed implementation assumptions, and rerun
the project's relevant checks after installation.

### System-wide technical choices

Use mode `architecture` before choosing or replacing foundations such as a
framework, authentication, ORM/data access, state management, validation, API
layer, build system, deployment adapter, or observability:

```bash
bash scripts/os.sh deps plan architecture "authentication foundation" \
  better-auth@1.3.4 authjs/next-auth@v5.0.0-beta.29
```

Architecture plans are evidence and are never installable. After human
acceptance, record the durable decision with `os decide` and reference the plan
path rather than copying its content.

### Other ecosystems

OpenSrc can fetch PyPI and crates.io sources:

```bash
bash scripts/os.sh deps plan add "HTTP client" pypi:requests@2.32.4
bash scripts/os.sh deps plan add "serialization" crates:serde@1.0.219
```

The evidence workflow is the same. The automatic installer intentionally
supports npm only; use the approved exact version with the relevant ecosystem's
resolver and lockfile tooling.

:::check A dependency decision is ready when

Every candidate is exact, every package's documentation and source findings are
recorded, pairwise constraints are reconciled, the ecosystem resolver accepts
the graph, post-install checks are named, and the human has approved the
artifact. A successful OpenSrc fetch alone proves none of these.
:::
