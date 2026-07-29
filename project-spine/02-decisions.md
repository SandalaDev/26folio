# Initial decisions

This lean record summarizes accepted foundations. Detailed rationale remains in
the preserved legacy spine and task history; new decisions are appended through
`project-state/decisions.md`.

- sandala.dev remains a static-first portfolio with no database, CMS, or
  authentication.
- Scrumtrulescent Magazine remains a separate product and codebase. Portfolio
  integration is read-only and failure tolerant.
- Next.js App Router, strict TypeScript, Tailwind CSS, and accessible component
  composition remain the application foundation.
- Motion must communicate hierarchy or interaction, respect reduced-motion
  preferences, and have one owning animation library per behavior.
- The repository uses feature branches into `dev`, then reviewed integration
  from `dev` into `main`.
- The legacy Agent OS is replaced by Agent OS v1. Historical spine, backlog,
  slice, content, and task artifacts remain available by path; obsolete gates
  and duplicate runtime state do not.
