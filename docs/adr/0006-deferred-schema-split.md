# ADR-0006 — Deferred schema split

Status: accepted (deferred)

## Context

`apps/db/schema.ts` is 6300+ LOC of Drizzle table definitions. The
audit recommends splitting by domain (auth / cards / economy /
gameplay / narrative / social) into one file per domain.

We considered doing it as part of the current security pass, but:

- Drizzle migrations are tracked by import-graph diff. A bulk move
  triggers spurious "rename" warnings from `drizzle-kit generate`
  that we'd then have to manually triage.
- `relations.ts` mirrors the layout; it would need re-splitting too.
- Importers across 100+ files would need updates simultaneously
  unless we re-export everything from a barrel — adding the barrel
  alone isn't worth it without breaking the file in two.
- The risk of accidentally breaking the orphan-bootstrap chain at
  `apps/server/_core/index.ts` is real; that code references
  schema by name in raw SQL strings.

## Decision

Defer the split. Add it as a single dedicated PR that:

1. Splits `schema.ts` into `schema/auth.ts`, `schema/cards.ts`,
   `schema/economy.ts`, `schema/gameplay.ts`, `schema/narrative.ts`,
   `schema/social.ts`.
2. Re-exports everything from `schema/index.ts` (path
   `apps/db/schema.ts` becomes a one-line `export * from "./schema/"`
   for back-compat).
3. Splits `relations.ts` to match.
4. Re-runs `drizzle-kit generate` and adopts the resulting diff.
5. Runs the full test suite + `pnpm db:smoke` against MySQL.

## Consequences

- The 6300-LOC file stays for now. Annoying to navigate, but
  navigable via grep / IDE.
- New tables added during the deferral period live in `schema.ts`
  and will move during the split.
- The longer we wait, the bigger the diff — but this is a refactor,
  not a feature, so calendar pressure is low.

## Alternatives considered

- **Do it now alongside the security pass** — bundles a
  high-attention-needed refactor into a high-risk PR. Bad idea.
- **Skip the split entirely** — the file will keep growing. Defer
  != skip.
