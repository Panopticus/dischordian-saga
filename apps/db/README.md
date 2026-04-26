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

## Known journal drift (post-0035)

After the reconciliation described above, several concurrent feature
branches landed hand-written migrations at colliding indices without
updating `_journal.json`. As of the pet system extension commit, the
following files exist on disk but are **orphaned** from the journal:

- `0036_admin_approval_requests.sql`
- `0037_dead_mans_circuit_lifecycle.sql`
- `0037_pet_system_extension.sql` — renamed to `0048_pet_system_extension.sql`
  to at least unblock deploys that numerically collide with the other
  0037s. Journal entry still pending.
- `0038_premium_currency_gems.sql`
- `0039_pvp_decay_tracking.sql`
- `0041_casino_and_xmas_july.sql`
- `0042_casino_xmas_refinements.sql`
- `0043_casino_wins_counter.sql`, `0043_chess_persistence.sql`
- `0044_casino_cosmetics_inventory.sql`, `0044_palimpsest_state.sql`
- `0045_casino_equipped_cosmetics.sql`
- `0046_casino_notification_preferences.sql`
- `0047_casino_milestone_opt_out.sql`
- `0048_pet_system_extension.sql`

The journal currently lists: 0035, 0037 (`dischordia_cycle`), 0040
(`crew_tables`), 0045 (`arena_essences`). Snapshots exist up through
0040; the 0045 entry has no corresponding snapshot file.

Impact: these orphaned migrations are invisible to `drizzle-kit migrate`
and will not be applied automatically on deploy. Teams have been relying
on manual `drizzle-kit generate` runs against live DBs (which re-derive
drift from `schema.ts`) to apply the changes — a pattern that works as
long as the target schema is idempotent on re-run. Hand-written
migrations in this range should use `INFORMATION_SCHEMA` guards (see
`0048_pet_system_extension.sql` for the stored-procedure pattern) so
they are safe to re-execute.

**Full reconciliation** — adding every orphan to the journal with a
matching snapshot — is scoped to a dedicated devops cleanup commit and
should NOT be bundled into a feature PR. Until that lands, any new
hand-written migration should:

1. Pick an index past the highest file on disk (currently 0048).
2. Use `INFORMATION_SCHEMA` / `IF NOT EXISTS` guards so re-runs are no-ops.
3. Document its orphaned status in this section of the README.

## Startup bootstraps for critical orphan migrations

When an orphan migration introduces a column that `schema.ts` already
references in `SELECT *` queries, the only way to keep the server
functional is to run the same DDL on boot. Each bootstrap is
idempotent (INFORMATION_SCHEMA / IF NOT EXISTS guards) and logs a
warning — not a crash — on failure so the process stays up.

Current startup bootstraps (see `apps/server/_core/index.ts`):

- `bootstrapAnnouncementsTables` — mirrors `0049_title_screen_announcements.sql`.
- `bootstrapCitizenSchema` — mirrors `0054_citizen_foundation.sql`
  (`citizen_characters.foundation`). Without this the Awakening handoff
  breaks on deploys that haven't had a manual `drizzle-kit generate` pass.

Each of these should be removed once the corresponding migration is
added to `_journal.json` and the matching snapshot exists in `meta/`.

## CI guard — fresh-DB smoke test

`apps/scripts/db-fresh-smoke.ts` (run via `pnpm db:smoke`, executed by
the `db-smoke` job in `.github/workflows/ci.yml`) spins a clean MySQL 8
service container, runs `drizzle-kit migrate`, then exercises the
production-server bootstrap path against it:

1. `getDb()` returns a connected pool.
2. `__drizzle_migrations` carries rows (i.e. drizzle-kit migrate did
   apply at least the journal-tracked entries).
3. `bootstrapAnnouncementsTables()` succeeds.
4. `bootstrapCitizenSchema()` succeeds.
5. `announcements` and `announcement_views` tables exist post-bootstrap.
6. `citizen_characters.foundation` column exists, *if* the
   `citizen_characters` table itself is present (its base table ships in
   an earlier orphan migration; the bootstrap is a no-op without it).

The smoke test is the automated guard the journal-drift situation
deserves. It catches regressions in:

- any drizzle-kit-tracked migration in `_journal.json`
- either of the two startup bootstraps for orphan migrations 0049 / 0054
- new orphans added without a matching bootstrap (the assertions will
  flag the gap because the bootstrap-targeted DDL won't land)

When the full reconciliation eventually folds the orphans into the
journal, the bootstrap functions and the `bootstrap*` checks in the
smoke script come down together — the journal-tracked checks (steps
1–2 above plus a `__drizzle_migrations` row count assertion) remain.
