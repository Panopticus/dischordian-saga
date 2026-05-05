# ADR-0001 — Drizzle ORM over Prisma

Status: accepted

## Context

The server needs typed access to MySQL. We considered:

- **Prisma** — most popular Node ORM. Excellent DX. Heavy runtime,
  separate query engine binary, slow cold start, schema-as-DSL
  rather than TypeScript, code-gen step required for every change.
- **Drizzle** — TypeScript-first ORM with SQL-flavoured query
  builder. Schema is plain TypeScript. No code-gen runtime, no
  binary, fast cold start. Smaller community but rapidly growing.
- **Knex / raw SQL** — most flexible, least typed. Out — we want
  type safety on every column and join.

## Decision

Use Drizzle.

## Consequences

- Schema lives in `apps/db/schema.ts` as plain TypeScript. Adding a
  column doesn't trigger a code-gen.
- `drizzle-kit generate` produces SQL migrations from the schema
  diff. We've had drift between `_journal.json` and the migrations
  directory; some tables are bootstrapped at server startup
  (`apps/server/services/*Bootstrap.ts`) until reconciliation.
- Cold start is ~50ms; Prisma's would be ~500ms+.
- The downside: smaller ecosystem of plugins. We've not hit a wall.

## Alternatives considered

- **Prisma** — fast DX is real, but the binary footprint and the
  schema DSL felt heavyweight for this project's "everything in
  TypeScript" stance.
- **TypeORM** — too much magic, decorators-as-config approach
  fights newer Node module systems.
