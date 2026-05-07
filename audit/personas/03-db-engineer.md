# Database Engineer — Audit

Confirmed: `apps/db/schema.ts` has **450 `*Id"` columns vs 6 `.references()`** (lines 115, 361, 383, 848, 1174, 1177). 258 tables, 81 `.sql` files vs 39 journal entries (42 orphans + 9 prefix collisions grandfathered in `migration-drift.baseline.json`). `0067_indexes_and_fks.sql:9-11` defers historical FKs to "docs/operations/SCHEMA_FK_AUDIT.md" — that file does not exist; this is the residue of the `db.foreign_key_coverage: 301` ratchet.

## Top 6 findings

### F1: cardGame router does economy mutations with zero `db.transaction()`
- file: `apps/server/routers/cardGame.ts:548`, `:1749`, `:1907`
- severity: critical
- category: transaction
- finding: `grep -c 'db.transaction'` on cardGame.ts = **0**. Pack-opening (~1749) does sequential `db.update(dreamBalance)` → `db.update(userCards)` → `db.insert(userCards)` with no atomicity. Crash between deduct and grant duplicates currency or destroys cards. Marketplace's `buyListing` wraps (line 275) — proving the team knows how — but `marketplace.ts:548` (gem bundles) does not: gems deducted, then a separate `update(characterSheets)` for credits, no rollback.
- fix: Wrap mutations touching >1 currency/inventory row in `db.transaction(async (tx) => ...)`. Concrete: cardGame.ts:548, :1749, :1907; marketplace.ts:155 (createListing), :548 (gem bundle), :663 (createAuction), :708 (placeBid). That's 6 of the 12 in the ratchet.

### F2: `users` has 200+ inbound dependents but no cascade
- file: `apps/db/schema.ts:6` and every dependent
- severity: critical
- category: fk_coverage
- finding: `userProgress.userId` (203), `userAchievements.userId` (250), `arkThemes.userId` (265), `characterSheets.userId` (450), `userBlocks.blockerUserId/blockedUserId` (147-148), `supportImpersonationGrants.issuedToAdminId/targetUserId` (178-179) are bare `int().notNull()`. The promised follow-up at `0067_indexes_and_fks.sql:9` never landed.
- fix: Tier 1 cascade (`user_progress`, `ark_themes`, `character_sheets`, `user_achievements`); tier 2 restrict (`pvp_matches`, `card_game_matches`, `game_replays` — already the pattern at 1174/1177); tier 3 restrict (`store_purchases`, `market_transactions`).

### F3: Migration journal is a Potemkin facade — `db:push` is the actual deploy
- file: `apps/db/migrations/README.md:30-49`, `migration-drift.baseline.json`
- severity: high
- category: migration
- finding: 42 of 81 `.sql` files have no journal entry; 9 prefix collisions (0037/0043/0044/0045/0046/0047/0055/0058/0059 each have two files). `pnpm db:migrate` would refuse against any environment that has been `db:push`-evolved — per the README, every env. CLAUDE.md's "production deploys use `db:migrate`" claim is therefore false.
- fix: Execute Step 2 in migrations/README.md (single `0071_baseline_v1` from a fresh DB). Until then, amend CLAUDE.md to say `db:push` is production deploy.

### F4: `bigint(..., { mode: "number" })` truncates above 2^53
- file: `apps/db/schema.ts:5275, :5728, :5730, :5789, :6989, :7045`
- severity: medium
- category: type_choice
- finding: `playerProfileEvents.id` (5275) is autoincrement bigint-as-number; silently misrounds past `Number.MAX_SAFE_INTEGER` ≈ 9×10¹⁵. The 5 ms-since-epoch columns are safe. The autoincrement one is the bug.
- fix: Switch `playerProfileEvents.id` to `mode: "bigint"` and update read paths, OR demote to `int` if event count won't exceed 2.1B.

### F5: Indexes in `0067_indexes_and_fks.sql` have no Drizzle declaration → push will drop them
- file: `apps/db/0067_indexes_and_fks.sql:26-43` vs `schema.ts`
- severity: medium
- category: index
- finding: `idx_card_trades_pair`, `idx_crafting_log_user_created`, `idx_analytics_events_name_created` exist in deployed DB via orphan migration but are absent from `schema.ts`. A `pnpm db:push` diff would propose dropping all three.
- fix: Add the three composite `index()` declarations to the matching tables in `schema.ts`.

### F6: `users.name` is unbounded `text`; `users.email` lacks unique index
- file: `apps/db/schema.ts:9-10`
- severity: medium
- category: type_choice
- finding: `text` username invites multi-KB names; downstream UI assumes short strings. `email` (varchar 320) lacks a unique constraint, so `Foo@x.com` and `foo@x.com` create two accounts. Schema also pins no collation.
- fix: `name: varchar({ length: 64 })`; add `uniqueIndex("uniq_users_email").on(users.email)` filtered on `deletedAt IS NULL`; pin `utf8mb4_0900_ai_ci`.

## FK gap deep-dive — 5 worst tables

By count of bare numeric `int("*Id")` (excluding varchar business ids). Seeds for `db.foreign_key_coverage`:

1. **`users` inbound (line 6)** — 7 unprotected child tables: `userProgress.userId` (203), `userAchievements.userId` (250), `arkThemes.userId` (265), `characterSheets.userId` (450), `userBlocks.blockerUserId/blockedUserId` (147-148), `supportImpersonationGrants.issuedToAdminId/targetUserId` (178-179). 200+ further `userId` columns repeat the pattern.
2. **`market_transactions`** — 4 numeric Ids unreferenced: `listingId`, `buyOrderId`, `sellerId`, `buyerId`. Financial audit row with three dangling FKs.
3. **`pvp_matches` (line 1170)** — `player1Id`/`player2Id` have FKs (1174/1177); `winnerId` (line 1180-area) does not. Should be `references(() => users.id, { onDelete: "set null" })`.
4. **`guild_war_skirmishes`** — 3 numeric Ids: `guildAId`, `guildBId`, `winnerGuildId`. Zero FKs. Guild delete dangles war history.
5. **`game_replays`** — `player1Id`, `player2Id`, `winnerId`, plus orphan varchar `matchId`. Zero FKs; mirrors `pvp_matches` but unprotected.

Honourable mentions: `circuit_pvp_matches`, `cades_pvp_matches`, `chess_tournament_pairings` (4 numeric Ids each, 0 FKs); `trade_oracle_duels` (3, money-sensitive).

## Convergence hints

1. **Security (02):** `support_impersonation_grants` (174) lacks FKs on `issuedToAdminId`/`targetUserId`. Combined with no rate limit, a re-issued admin row becomes a silent privilege bridge.
2. **Staff-eng:** transaction-coverage gap mirrors the absence of a service layer — a `withEconomyTx(ctx, fn)` helper would make the ratchet mechanically enforceable.
3. **Observability:** when FKs land, MySQL will raise `ER_ROW_IS_REFERENCED_2` on cascading deletes — no OTel on DB calls means first signal will be a prod 500.
