# Persistence & Determinism — Audit

## Persona briefing

Persistence & Determinism Engineer pass over the Dischordian Saga
monorepo (commit state of 2026-05-16). Scope: whether the
deliberately-unaudited "application cold-boot enforces schema"
compensation scheme, the typeless `userProgress.gameData` save blob,
the TCG replay/verification system, server RNG, and economic
transaction wrapping actually hold together — or whether they hide
data-loss / drift / non-determinism landmines that surface as broken
playthroughs and corrupted saves.

The team already knows the migration journal is drifted (50 orphan
`.sql` files, 9 prefix collisions, all grandfathered in
`migration-drift.baseline.json`; CI runs `db:migrate` with
continue-on-error; ~30 `bootstrap*` IIFEs in
`apps/server/_core/index.ts` re-apply the orphaned DDL on every
boot). Restating that is not the deliverable. The deliverable is
*which specific drifts or design choices can actually lose player
data or desync replays*.

Environment note: this sandbox has no MySQL, so `pnpm db:smoke`
cannot run end-to-end (it correctly aborts on absent `DATABASE_URL`).
Findings that depend on live DB behavior are flagged
`suspected-needs-runtime`; everything else is `confirmed-read-source`.

`pnpm ship:check` was run after `pnpm install`. Relevant rows:

```
DB foreign-key coverage                368  368  0  PASS
Economic surfaces are transactional     13   13  0  PASS
Per-procedure rate limits                5    5  0  PASS
Observability wiring                     7    7  0  PASS
```

There is **no `replay determinism` row** in the ship:check table at
all, despite CLAUDE.md listing "replay determinism" as a subsystem
landing under the gate. `grep -niE "replay|determinism|rulesVersion"
apps/shared/_completeness/registry.ts` returns nothing. This is
itself a finding (F1) — the highest-stakes determinism contract in
the codebase is mechanically unguarded.

## Files audited

- `apps/db/migrations/README.md`, `migration-drift.baseline.json`
- `apps/server/migrations.test.ts` (hygiene guard)
- `apps/scripts/db-fresh-smoke.ts`
- `scripts/guard-db-migrate-prod.ts`, `scripts/guard-db-push.ts`
- `apps/server/_core/index.ts` (lines 380–970, bootstrap block + listen)
- `apps/server/services/citizenSchemaBootstrap.ts`
- `apps/server/services/statSanityBootstrap.ts`
- `apps/server/db/missingTable.ts`
- `apps/server/routers.ts` (`saveProgress` / `getProgress`)
- `apps/server/services/entitlementService.ts`
- `apps/server/services/mysteryService.ts` (`JSON_SET` flag write)
- `apps/server/services/playerExpansionState.ts`
- `apps/shared/saveSlots.ts`
- `apps/shared/tcg-core/engine/version.ts`, `engine/rng.ts`
- `apps/shared/tcg-core/replay/replay.ts`, `replay.test.ts`
- `apps/server/services/replayVerification.ts`,
  `apps/server/replayVerification.test.ts`
- `apps/server/routers/casino.ts`, `apps/server/routers/store.ts`
- `apps/shared/_completeness/checks/economicTransactionCoverage.ts`
- `apps/shared/_completeness/registry.ts`

## Findings

### F1 — Replay "version pinning" is documentation-only; a MINOR RULES_VERSION bump silently desyncs every prior replay. (P1, confirmed-read-source)

`apps/shared/tcg-core/engine/version.ts:9-21` documents a contract:
MINOR bumps mean "replays need the pinned engine they were recorded
against; current engine shows 'archived' on mismatch."
`apps/shared/tcg-core/replay/replay.ts:86-137` computes
`versionCompatible = isReplayCompatible(input.rulesVersion,
RULES_VERSION)` — but then **unconditionally replays through the
current live `reduce` / `createMatchState`** imported from
`../index` (lines 24-35, 92-126). There is no pinned historical
engine anywhere in the tree (`apps/shared/tcg-core/replay/` contains
only `replay.ts`, `viewer.ts`, `replayExport.ts`). The
`versionCompatible` boolean is computed and returned but never gates
execution.

The server-side verifier is worse:
`apps/server/services/replayVerification.ts:79-198` (`verifyReplay`)
**never reads `rulesVersion` from the row at all** — no field for it
in `VerifiableReplay` (lines 40-50), no branch on it. It always runs
the current `reduce` (line 167) and compares against the stored
`finalStateHash` (line 182). Its own docstring (lines 9-13) admits
"the reducer changes between rulesVersions" yet does nothing about
it.

Concrete scenario: CLAUDE.md instructs that any change altering
`reduce()` output is "at least a MINOR bump." The day someone lands
such a change and bumps `RULES_VERSION` 1.1.0 → 1.2.0, **every
pre-existing persisted replay** (`game_replays` rows) fails
`verifyReplay` with `reason: "hash-mismatch"` — the exact same
signal the system uses for *tampering / leaderboard fraud* (lines
182-189; the result type comment at 56-62 says hash-mismatch should
"Page an admin"). Replay playback in the client viewer diverges
mid-timeline with no "archived" affordance because nothing consumes
`versionCompatible` to switch to action-log-only mode. The "bump +
replay-pin" discipline in CLAUDE.md is **convention enforced by
nobody** — there is no pinned engine to pin to.

### F2 — No parity test pins a replay hash; replay.test.ts is a hollow guard. (P1, confirmed-read-source)

`apps/shared/tcg-core/replay/replay.test.ts:1-15` docstring claims
"assert the final state hash matches a pinned literal. Bumping
RULES_VERSION ... updating these snapshots IS the deliberate
version-bump review gate." The actual assertions (lines 57-77) only
check `r1.finalStateHash === r2.finalStateHash` (self-consistency,
trivially true for any deterministic function), that a seed change
changes the hash, and a regex on the version string. **No hash
literal is pinned.** A semantics change to any `effect.op` handler
that alters `reduce()` output would NOT fail this test. Combined
with F1's absent ship:check row, replay determinism has *zero*
mechanical regression protection — precisely the
information-asymmetry the ship:check gate exists to close (CLAUDE.md
"Rules for Claude" §4). `apps/server/replayVerification.test.ts` is
all pre-flight/parse-error branches plus a zero-action happy path;
it never exercises a non-trivial action log nor a version mismatch.

### F3 — `saveProgress` is a whole-blob client-authoritative overwrite that races server-side JSON_SET writers; paid entitlements and narrative flags can be silently erased. (P0, confirmed-read-source)

`apps/server/routers.ts:368-412` (`saveProgress`) accepts
`gameData: z.record(z.string(), z.unknown()).optional()` and writes
it with a blind `UPDATE userProgress SET gameData = <client blob>`
(lines 389-399). No schema, no version field, no merge, no
optimistic-lock / `updatedAt` check. The client is the source of
truth for the entire blob.

Meanwhile other server paths write *sub-keys* of the same column
out-of-band:
- `apps/server/services/entitlementService.ts:50-90` (`setEntitlement`)
  read-modify-writes `gameData.entitlements.{foundingAuthor,
  authorsEditionS2}` — **these are paid SKU entitlements**
  (`apps/server/services/playerExpansionState.ts:13-14`,
  `entitlementService.ts:5`). Granted by the Stripe webhook path.
- `apps/server/services/mysteryService.ts:351-361` writes
  `gameData.narrativeFlags.<flag>` via `JSON_SET`. These flags gate
  card unlocks (`expansionUnlockService.ts`) and act progression
  (`playerExpansionState.ts:67`).

Concrete scenario: player loads the client (client caches its
`gameData` snapshot). While playing, the Stripe webhook fires and
`setEntitlement` flips `gameData.entitlements.foundingAuthor = true`
in the DB. The player then triggers any client autosave →
`saveProgress` overwrites the *entire* `gameData` with the stale
client copy that predates the grant → **the paid Founding Author
entitlement is silently erased**. Same mechanism erases
server-written `narrativeFlags` (mystery completion, act unlocks),
producing "I finished that arc but the next one is still locked"
broken playthroughs. `setEntitlement` short-circuits on no-op
(`changed: false`, line 68) so on webhook retry it does NOT
re-grant — the loss is permanent without manual support
intervention. This is the canonical last-writer-wins data-loss bug
and it is reachable in entirely normal play (autosave + concurrent
webhook is routine).

### F4 — Casino currency deduction is a read-check-then-unconditional-write (TOCTOU); double-spend is gated only by a bootstrap-applied CHECK that silently no-ops on MySQL < 8.0.16. (P1, confirmed-read-source; P0 if CHECK absent)

`apps/server/routers/casino.ts:388-432`: inside the transaction it
reads `balance = await ensureDreamBalance(tx, userId)` (line 390),
does a JS guard `if (balance.dreamTokens < bet) throw` (line 427),
then issues an **unconditional** `UPDATE dream_balance SET
dream_tokens = dream_tokens - ${bet}` (lines 429-431). There is no
`WHERE dream_tokens >= bet` and no `SELECT ... FOR UPDATE`. Under
MySQL's default REPEATABLE READ, two concurrent casino plays both
read the same balance, both pass the JS check, both decrement →
negative balance / spend money the player doesn't have.

Contrast `apps/server/routers/store.ts:173-207` and `226-240`,
which do this **correctly**: atomic `UPDATE dream_balance SET
dream_tokens = dream_tokens - ${cost} WHERE user_id = ? AND
dream_tokens >= ${cost}` then `affectedRows === 0 → throw`. The
casino path is the inconsistent one.

The only backstop is the `chk_dream_tokens_nonneg` CHECK constraint
from `apps/server/services/statSanityBootstrap.ts:24-26`. Its own
header (lines 13-16) states: "CHECK constraints require MySQL
8.0.16+. Older versions ignore them silently (the ALTER still
succeeds; the constraint just doesn't enforce)." So on an older
MySQL the casino TOCTOU is a true P0 double-spend with no backstop;
on 8.0.16+ the constraint aborts the transaction (degrades to a
play-failure, not corruption — P1). Additionally the constraint is
applied by a fire-and-forget bootstrap (see F5/F6) whose failure is
only logged.

### F5 — The entire schema-compensating bootstrap block is fire-and-forget and runs AFTER `server.listen()`; routes serve requests against not-yet-migrated schema during the boot window. (P1, confirmed-read-source)

`apps/server/_core/index.ts:666-943`: ~30 `bootstrap*()` calls are
each invoked as `bootstrapX().catch(e => console.error(...))` —
**not awaited**, and the whole cluster is inside an `if
(process.env.NODE_ENV !== "test")` block that is *not* awaited before
`server.listen(port, ...)` at line 967. (The only awaited startup
gates are `waitForSentry()` / `waitForOTel()` at lines 400-406.)

Consequence: the HTTP/tRPC server begins accepting requests while
`bootstrapCitizenSchema`, `bootstrapStatSanityConstraints`,
`bootstrapWebhookEventsTable`, `bootstrapReplayMatchId`, etc. are
still in flight (each does an `information_schema` probe + DDL — tens
of round-trips total on a cold DB). During this window:
- Queries against orphan-migration tables/columns fail. The
  graceful-degradation predicate
  `apps/server/db/missingTable.ts:34-55` (`isMissingTableError`)
  only matches `ER_NO_SUCH_TABLE` / errno 1146 / "doesn't exist".
  It does **not** match `ER_BAD_FIELD_ERROR` / errno 1054 ("Unknown
  column") — which is exactly the failure
  `citizenSchemaBootstrap.ts:13-16` describes for the missing
  `foundation` column. So a request that hits
  `citizen.getCharacter` before that bootstrap finishes throws a
  hard, un-tolerated error → "Character creation failed" → player
  stuck at the cryo bay (the bootstrap's own docstring scenario,
  just with a timing window the bootstrap was supposed to close).
- `processed_webhook_events` (idempotency table,
  `_core/index.ts:825-834`) not yet present → a Stripe
  credit/dream-purchase webhook arriving in the boot window has its
  event-level idempotency check "fail open" (its own comment,
  831-833) → **a retried webhook can double-fulfill currency** if
  it lands before `bootstrapWebhookEventsTable` completes.

Railway sends SIGTERM and redeploys frequently; every redeploy
reopens this window. Severity is P1 (narrow window, mostly
self-heals) but the webhook-idempotency sub-case is a latent P0
double-grant.

### F6 — Bootstrap failures are swallowed to log-only; a regressed/failed bootstrap degrades to silent permanent schema drift on that environment. (P1, confirmed-read-source)

Every bootstrap follows the `citizenSchemaBootstrap.ts:62-68`
pattern: catch, `logger.warn`, **do not throw** — "let the server
keep serving other routes." Combined with F5's `.catch(console.error)`
at the call sites, a bootstrap that fails (DDL error, perms, a
schema-drift edge like the `AFTER \`element\`` clause at
`citizenSchemaBootstrap.ts:56-57` failing because column order /
presence differs from `schema.ts` on a push-evolved DB) produces
**no startup failure, no health-check failure, no ship:check
failure** — just one log line that is easily lost in deploy noise.
The environment then runs indefinitely with a column/table that
`schema.ts` declares but the real DB lacks. Because Drizzle emits
the full column list from `schema.ts` on every SELECT, *every* query
against that table then 500s for all users until someone notices the
log. There is no automated guard catching "a bootstrap silently
failed on prod" — `db-fresh-smoke.ts` only runs in CI against a
*fresh* DB, not against the live push-evolved prod shape, and it
itself documents (lines 117-141) that it downgrades migrate failure
to a non-fatal info line.

### F7 — `userProgress.gameData` has no schema and no version field anywhere; old saves are reinterpreted, never migrated. (P1, confirmed-read-source)

`apps/db/schema.ts:235`:
`gameData: json("gameData").$type<Record<string, unknown>>()` — a
typeless blob. Every reader (`playerExpansionState.ts:66-120`,
`entitlementService.ts:64`, `mysteryClosureResolver.ts:105-109`,
`saveSlots.ts`) does ad-hoc `(gameData.x ?? default) as SomeShape`
casts. There is no `gameData.version` / `schemaVersion` field
written anywhere (grep across server + shared confirms none). The
save-slot system (`apps/shared/saveSlots.ts:1-30`) explicitly stores
full snapshots of `gameData` *inside* `gameData.saveSlots[].data`
"so no DB migration is needed" — i.e. nested, also unversioned,
snapshots.

Scenario: a future change renames or restructures a `gameData`
sub-key (e.g. `narrativeFlags` shape, `bloodlineGenerations`,
`completedMysteryEpisodes` — the latter already has
read-side defensive handling for "string-or-array" drift at
`playerExpansionState.ts:105-110`, evidence the shape has already
drifted once). Old saves are not migrated; they are silently
reinterpreted by best-effort casts. Mismatches don't crash — they
**silently read as defaults**, so a player's progression flags /
bloodline / completed episodes can evaporate on the next engine
revision with no error and no audit trail. The
`completedMysteryEpisodes` dual-shape handling is a confirmed
instance that this class of drift has already occurred and is being
patched reactively per-field rather than via a versioned migration.

### F8 — The ship:check "Economic surfaces are transactional" guard is file-level, not procedure-level, and ignores `services/`; PASS 13/13 is false confidence. (P2, confirmed-read-source)

`apps/shared/_completeness/checks/economicTransactionCoverage.ts:65-103`:
a router file passes if it contains *any* currency-mutation token
*and* the substring `db.transaction(` *anywhere in the file*. It
does not verify the *mutating procedure* is the one wrapped. A
router with one transactional procedure and several unwrapped
currency mutations passes. It also only walks `apps/server/routers/`
(line 27), so `entitlementService.setEntitlement` (a currency-
adjacent paid-entitlement write, F3) and `mysteryService`'s
`JSON_SET` are entirely outside its scope. The gate showing
"Economic surfaces are transactional 13 13 0 PASS" is therefore not
evidence that the casino TOCTOU (F4) or the gameData-clobber (F3)
are safe — it cannot see either. This is exactly the kind of
"pattern inferred from file structure ≠ pattern read from source"
gap CLAUDE.md §4 warns the gate is supposed to eliminate.

### F9 — Pack-opening uses unseeded `Math.random()`; pulls are non-reproducible and non-auditable (unlike casino). (P2, confirmed-read-source)

`apps/server/routers/store.ts:476-485`: card-pack grants pull cards
with `pool[Math.floor(Math.random() * pool.length)]` and immediately
`INSERT` into `userCards`. No server seed is generated or stored.
Contrast the casino (`casino.ts:434`, `randomSeed()` +
`createRng(seed)` with the seed persisted to `casinoResults.seed`
for audit/reproducibility, and the engine RNG
`apps/shared/tcg-core/engine/rng.ts` which is correctly seedrandom
state-serializable). Pack RNG cannot be replayed, audited, or
disputed; a "I paid for a pack and the grant crashed mid-loop"
(the loop at store.ts:476 is inside the tx, so it rolls back — but
a partial-then-retry yields a *different* random set, no idempotency
on the pull itself). Not a desync; a fairness/auditability and
weak-idempotency gap on a paid surface. P2.

### F10 — Migration drift tracking is internally consistent (no phantom/untracked orphans). (informational, confirmed-read-source)

Cross-checked: `apps/db/` has 89 `.sql` files, `meta/_journal.json`
has 39 entries, 50 orphans, all 50 present in
`migration-drift.baseline.json`, zero baseline entries lacking a
`.sql` file, zero orphans missing from the baseline. The hygiene
guard `apps/server/migrations.test.ts` correctly blocks new
orphans/collisions. So the *tracking* is sound — the risk is not
"untracked drift" but the *runtime compensation* for the tracked
drift (F5/F6). The README/baseline list is trustworthy; the danger
is downstream of it. The guards `guard-db-push.ts` /
`guard-db-migrate-prod.ts` are reasonable but heuristic (host
substring matching) and opt-out-able via env var — acceptable.

## Top concern

**F3 — `saveProgress` whole-blob client overwrite racing server-side
`JSON_SET`/read-modify-write paths is a reachable P0 that silently
and permanently destroys paid entitlements and narrative
progression.** It needs no exotic timing: a routine client autosave
landing after the Stripe webhook's `setEntitlement` (or any
`mysteryService` flag write) overwrites the server-authoritative
sub-keys with the client's stale blob, and the no-op short-circuit
in `setEntitlement` means a webhook retry will *not* repair it. The
column has no version, no merge, and no optimistic lock, so the
loss is undetectable and unrecoverable without manual DB surgery.
Closely behind it: F1/F2 — replay determinism has no pinned engine,
no pinned-hash test, and no ship:check row, so the first MINOR
`RULES_VERSION` bump (which CLAUDE.md actively expects) will desync
every stored replay and report it as tampering, and nothing in CI
will have warned. Both are *latent today, guaranteed on the next
schema/engine change* — the migration-drift bootstrap scheme (F5/F6)
is the third tier: currently-working but a single swallowed
bootstrap failure away from a site-wide outage with only a log line
as warning.
