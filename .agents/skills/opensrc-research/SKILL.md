---
name: opensrc-research
description: Research exact dependency versions with Vercel OpenSrc before installation, cross-check package documentation, source, engines, peer ranges, migrations, and overlapping conventions, then record a compatibility decision. Use when selecting the initial project stack, adding or upgrading packages, investigating dependency behavior, or making system-wide and far-reaching technical choices whose best practices depend on library implementations.
---

# OpenSrc Dependency Research

Use OpenSrc as the version-matched evidence layer. Do not treat it as a package
resolver, compatibility certificate, security scanner, or substitute for the
package manager and project checks.

## Workflow

1. Start from the project intent, runtime, deployment target, existing lockfile,
   and the purpose of the proposed dependency or architecture choice.
2. Choose exact candidate versions. Do not default to `latest`, a caret range, or
   a tilde range. Explain why each version is a candidate.
3. Create the evidence artifact before installation:

   ```bash
   bash scripts/os.sh deps plan initial "initial application stack" package@1.2.3 ...
   bash scripts/os.sh deps plan add "purpose of this addition" package@1.2.3 ...
   bash scripts/os.sh deps plan architecture "far-reaching choice" package@1.2.3 owner/repo@tag ...
   ```

4. For every candidate, read the OpenSrc-fetched package or repository:

   - package manifest, exports, engines, dependencies, peer dependencies, and
     optional peer metadata;
   - README and relevant documentation;
   - migration, upgrade, changelog, and security guidance when present;
   - examples, tests, and implementation where public docs leave behavior
     ambiguous;
   - framework, runtime, module-format, deployment, and configuration assumptions.

5. Cross-reference every candidate against every other candidate and against the
   existing project. Reconcile peer ranges, runtime and language requirements,
   duplicate responsibilities, provider ownership, plugin expectations, build
   tooling, state/data models, and prescribed best practices.
6. Complete every `TODO(REQUIRED)` in the generated artifact. Interpret the
   resolver result recorded during plan creation. State conflicts and
   uncertainty; do not manufacture compatibility.
7. Define the smallest post-install verification that can expose integration
   failure. Set the plan status to `review-ready`.
8. Re-run the package-manager resolver and validate the completed evidence
   without installing package payloads:

   ```bash
   bash scripts/os.sh deps check planning/dependencies/DEP-....md
   ```

9. Ask the human to review the evidence, resolver result, risks, and exact
   versions. Only the human changes `status` from `review-ready` to `approved`
   and changes `human_approval` to `approved`.
10. For an approved npm plan, install the exact set through:

   ```bash
   bash scripts/os.sh deps install planning/dependencies/DEP-....md
   ```

   For PyPI or crates.io, use the approved artifact and the ecosystem's exact
   version syntax; the current automatic installer intentionally supports npm
   only.

## Far-reaching Technical Choices

Use architecture mode before choosing or replacing frameworks, authentication,
ORM/data access, state management, validation, API layers, build systems,
deployment adapters, observability, or other foundations with multiple
downstream consumers.

Read upstream source and docs for the versions under consideration. Compare
their intended architecture and extension points, not just their feature lists.
Record the decision durably with `os decide` after the human accepts it, linking
the dependency evidence artifact by path.

## Existing Packages

Use `bash scripts/os.sh deps path <spec>` to retrieve exact source while
debugging, reviewing upgrades, or checking best practices. With an existing npm
lockfile, OpenSrc can resolve the installed version when invoked without an
explicit version, but dependency selection plans must still use exact versions.

## Evidence Rules

- OpenSrc source plus public docs is one evidence class.
- Package-manager peer resolution and lockfile output is another.
- Project build, type, test, and runtime probes are another.
- Human judgment owns intent, operational risk, and final approval.

Do not claim “compatible” from a successful fetch, matching release dates, or
independent package documentation. Compatibility requires a reconciled set of
constraints and a verification plan.
