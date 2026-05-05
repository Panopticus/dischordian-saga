# Schema foreign-key audit

The DB audit flagged 241 tables with zero `references()` /
`foreignKey()` declarations on user-attributed child columns. The
new tables added in G8/G14/G15 (userAgreements, userTwoFactor,
userSessions) ship with FKs in migration 0067; the historical
schema does not.

This doc tracks the cleanup-then-add pattern so a single dedicated
PR can finish the rest.

## Procedure for each table

1. **Find orphans.** For a child table T with column `userId`
   referencing `users.id`:

   ```sql
   SELECT COUNT(*) FROM T LEFT JOIN users ON T.userId = users.id
   WHERE users.id IS NULL;
   ```

   If the count is non-zero, decide:
   - delete the orphans (best for transient state),
   - re-link to a "deleted user" sentinel (best for financial /
     audit-log rows),
   - or skip the FK on this table for now (acceptable for tables
     where keeping orphans is intentional — e.g. anonymised match
     archives).

2. **Add the FK.** Once orphan-free:

   ```sql
   ALTER TABLE T
     ADD CONSTRAINT fk_T_user
       FOREIGN KEY (userId) REFERENCES users(id)
       ON DELETE CASCADE;  -- or SET NULL where appropriate
   ```

   Use CASCADE for transient state (decks, drafts, daily quests).
   Use SET NULL for content authored by the user that should
   survive deletion (chat history with `[deleted user]` author).
   Use RESTRICT for financial records that must never be
   auto-deleted (storePurchases — these stay 7 years for tax).

3. **Update the Drizzle schema.** Add the matching `references()`
   call in `apps/db/schema.ts`.

## High-priority targets (next PR)

These tables ship with monetary or identity-bearing data; FK
integrity matters most:

- `dream_balance.userId`
- `memory_energy_balance.userId`
- `user_cards.userId`
- `user_progress.userId`
- `character_sheets.userId`
- `cosmetic_purchases.userId`
- `store_purchases.userId` (use RESTRICT, not CASCADE)
- `user_titles.userId`
- `user_achievements.userId`
- `battle_pass_progress.userId`

## Medium priority

- `crew_members.crewId` → `crews.id`
- `guild_members.guildId` → `guilds.id`
- `pvp_matches.player1Id`, `player2Id`
- `chess_games.whitePlayerId`, `blackPlayerId`

## Low priority / skip

- Append-only audit / log tables — orphans are tolerable.
- Soft-deleted match archives — keep as-is for historical analysis.
