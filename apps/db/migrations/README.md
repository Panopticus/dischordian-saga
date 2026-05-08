# Migration journal — current state and cutover plan

This directory exists for `pnpm db:generate` to land migration `.sql`
files alongside the `meta/_journal.json` ordering record. Drizzle-kit
treats both as a unit: `pnpm db:migrate` walks the journal, applies
each `.sql` in order, and stops if either side is missing or out of
order.

The repo's actual migration files currently live one level up at
`apps/db/*.sql` because `drizzle.config.ts` sets `out: "./apps/db"`.
The journal is at `apps/db/meta/_journal.json`.

## Current state — drifted

CONNECTION_AUDIT 2026-05-07 §3.4 originally claimed the migration
journal was empty; that was an overclaim. Reality:

- **81 `.sql` files** in `apps/db/`
- **39 entries** in `apps/db/meta/_journal.json` (entries 0000–0035 plus
  0037 and 0040)
- **42 orphan `.sql`** files that exist but have no journal entry
  (0036, 0038, 0039, all of 0041–0070, plus extras at colliding prefixes)
- **9 prefix collisions** where two or more `.sql` files share the same
  ordering number: 0037, 0043, 0044, 0045, 0046, 0047, 0055, 0058, 0059

All 42 orphans + 9 collisions are grandfathered in
`migration-drift.baseline.json`. The hygiene guard at
`apps/server/migrations.test.ts` blocks new entries beyond the baseline.

## Why the drift happened

The team's day-to-day workflow has been `pnpm db:push` — the destructive,
non-journal-tracked Drizzle command that diffs the schema against the
target DB and applies changes directly. That workflow does NOT touch the
journal, so changes shipped via `db:push` never landed in the journal.

The orphan `.sql` files were authored by hand (or by `db:generate` runs
that weren't checked in alongside their journal entries). Some shipped
duplicate migration numbers because two PRs concurrently authored
against the same baseline and merged out of order.

## Why this isn't actively breaking ship

`db:push` doesn't read or write the journal; it just diffs. So the
production DBs are in their actual current shape regardless of journal
state. The journal would only become load-bearing if the team switched
to `db:migrate` — which requires the journal to match the .sql files
exactly, and would refuse to apply against a DB that's already been
push-evolved past the journal's last recorded state.

## Cutover plan — switching to journaled migrations

The goal: every future schema change lands via `pnpm db:generate`
(which writes BOTH a .sql AND a journal entry), and `pnpm db:migrate`
becomes the production deploy command. The cutover is multi-step and
needs a window where no schema-touching PR is in flight.

### Step 1 — freeze + audit (1 day)

- Stop merging schema-touching PRs for 24h.
- Run `pnpm db:smoke` against a fresh empty DB. The smoke script at
  `apps/scripts/db-fresh-smoke.ts` already documents the orphan tables
  / columns the bootstrap path adds; treat its output as the canonical
  "what's missing from the journal" list.

### Step 2 — generate the baseline (1 hour)

- Spin up a fresh empty MySQL.
- Run `pnpm db:generate` against the current schema with that DB
  configured. This will produce a single `.sql` covering everything in
  `schema.ts` from scratch, plus a clean journal.
- Commit the new files; this becomes migration `0071_baseline_v1` (or
  whatever next number drizzle picks).
- Delete the 42 orphan `.sql` files and rename any colliding pairs.
  At this point `migration-drift.baseline.json` should be:
  `{"driftedSqlFiles": [], "knownPrefixCollisions": []}`.

### Step 3 — mark applied on existing environments (1 hour per env)

Existing production / staging DBs are already past the new baseline's
state. Drizzle stores applied-migration tags in a `__drizzle_migrations`
table. To mark the baseline as already-applied without running it
against a live DB:

```sql
INSERT INTO __drizzle_migrations (hash, created_at)
VALUES ('<hash from meta/_journal.json>', UNIX_TIMESTAMP() * 1000);
```

(Drizzle computes the hash deterministically from the migration content;
read it out of the new journal entry.)

After this insert, `pnpm db:migrate` against that DB will be a no-op.

### Step 4 — switch CI / deploy command

- Update CI to run `pnpm db:migrate` instead of `pnpm db:push` on
  release.
- Keep `pnpm db:push` callable for local dev (it's still the fastest
  iteration loop), but document that production-bound changes must
  go through `db:generate` so the journal stays in sync.
- Tighten `apps/server/migrations.test.ts` to require the baseline be
  empty (no orphans, no collisions) once the cutover lands. That makes
  the journal authoritative for the next decade of schema changes.

### Step 5 — re-enable schema-touching PRs

After CI is green on the new flow, unfreeze PRs. New schema work goes
through `pnpm db:generate` exclusively.

## Until the cutover happens

- Run `pnpm db:push` locally as before (still works).
- The hygiene guard at `apps/server/migrations.test.ts` will refuse PRs
  that add new orphan `.sql` files or new prefix collisions. New
  migrations must land via `pnpm db:generate` so they get a journal
  entry — that's the immediate ratchet.
- The 42 grandfathered orphans + 9 collisions in the baseline don't
  block anything. They're a TODO to clean up at cutover time.

## Files in this directory

- `README.md` — this file.
- `migration-drift.baseline.json` — grandfathered orphan + collision
  list. Maintained by the hygiene guard. PRs cannot add entries; they
  can only remove them as orphans get resolved.
- `.gitkeep` — placeholder so the empty directory stays in git.

The `.sql` and journal files themselves still live one level up at
`apps/db/` per `drizzle.config.ts`. Moving them into this subdirectory
is a Step-2 decision; doing it before the cutover would just relocate
the drift.

## Step 2 cutover — runbook

The mechanical part of Step 2 is automated by
`scripts/generate-baseline-migration.ts`. The script:

1. Verifies the target DB is empty (refuses to clobber a populated DB).
2. Runs `pnpm drizzle-kit push` to apply the current schema.
3. Captures the resulting schema via `mysqldump --no-data` and writes
   `apps/db/0071_baseline_v1.sql`.
4. Appends an entry to `apps/db/meta/_journal.json` for the new
   baseline.
5. Prints a manual follow-up checklist (archive old .sql files, reset
   migration-drift.baseline.json, mark-as-applied on prod-shaped DBs,
   drop the bootstrap* IIFEs, switch CI to `db:migrate`).

Run on a separate branch (recommended `db/baseline-0071`):

```bash
# 1. Spin up an empty MySQL.
docker run --rm -d --name baseline-mysql \
  -e MYSQL_ROOT_PASSWORD=baseline_pw \
  -e MYSQL_DATABASE=loredex_baseline \
  -p 3307:3306 mysql:8.0
# Wait for it to come up.

# 2. Generate the baseline migration.
DATABASE_URL=mysql://root:baseline_pw@127.0.0.1:3307/loredex_baseline \
  pnpm tsx scripts/generate-baseline-migration.ts

# 3. Commit apps/db/0071_baseline_v1.sql + meta/_journal.json on a
# branch, NOT main. The follow-up PR archives 0000-0070.sql and
# resets the drift baseline.
```

The script is idempotent in spirit — running it twice produces the
same SQL (modulo MySQL ordering quirks) — but committing the second
run on top of the first would create a duplicate journal entry, so
revert one before re-committing if the schema changes mid-cutover.
