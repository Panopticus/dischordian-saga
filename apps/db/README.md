# Drizzle migrations

Schema is defined in `schema.ts`. Migrations live in this directory.

## Tooling

- `drizzle-kit generate` — compares `schema.ts` to the latest snapshot in
  `meta/` and produces a new migration file + snapshot for any drift.
- `drizzle-kit migrate` — reads `meta/_journal.json` and applies any
  entries that the DB's `__drizzle_migrations` table hasn't yet seen.

`pnpm db:push` runs both, in order. The Railway deploy runs `pnpm db:push`
before `pnpm start` (see `railway.toml`).

## Hand-written migrations (0030–0035)

Migrations `0030_daily_brief_system.sql` through
`0035_store_purchase_stripe_idempotency.sql` were authored by hand rather
than via `drizzle-kit generate`. That is fine for surgical changes, but
until this reconciliation they were invisible to drizzle-kit: `_journal.json`
stopped at 0029, so `drizzle-kit migrate` would not apply them, and
`drizzle-kit generate` would see the tables they create as "drift" and try
to re-create them on every run.

They are now listed in `_journal.json` (indices 30–35) and each has a
snapshot file in `meta/`. The latest snapshot (`0035_snapshot.json`)
reflects the current `schema.ts` state, so future
`drizzle-kit generate` invocations start from a clean baseline.

**Intermediate snapshots** (`0030_snapshot.json`..`0034_snapshot.json`) are
stubs: they share the same table definitions as `0035_snapshot.json` with
a valid `id`/`prevId` chain. drizzle-kit only reads the highest-numbered
snapshot when computing drift, so the stubs exist purely to satisfy the
tool's file layout — they do NOT accurately represent the historical
schema state at each intermediate migration.

## Adding new migrations

**Preferred:** `drizzle-kit generate` (automatic, keeps snapshots in sync).

**Hand-written OK for:**
- Backfills or data migrations that touch no DDL
- One-off fixes that drizzle-kit can't express cleanly (unique index over
  NULLable column, etc.)

If you hand-write one, remember to:
1. Pick the next available index (e.g. `0036_foo.sql`).
2. Add an entry to `_journal.json`.
3. Copy the latest snapshot to `meta/00NN_snapshot.json` with a fresh UUID
   in `id` and the previous snapshot's UUID in `prevId`, **and** update
   `tables` to reflect the new DB state. If you only touched a column,
   it's simpler to run `drizzle-kit generate` afterwards and accept its
   snapshot overwrite.
