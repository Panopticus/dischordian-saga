# Baseline environment notes — 2026-05-07

`node_modules/` is not installed in the audit environment. This means the dynamic checks
(`pnpm ship:check`, `pnpm check`, `pnpm test`, `pnpm build`) cannot be run from here.

Audit consequence: all findings are based on static file inspection + grep/AST patterns.
The DevOps persona must flag this as a portability concern (CI bootstrap should be the
only requirement to audit; needing a fully installed workspace is friction).

Substitute baseline data captured:
- `largest-files.txt` — top 25 files by LOC (745,673 total LOC across apps/)
- `deps.json` — top-level dependency listing (degraded: pnpm could not resolve workspace)
- `ratchet-state.json` — ship-check ground truth, read directly from the repo file
