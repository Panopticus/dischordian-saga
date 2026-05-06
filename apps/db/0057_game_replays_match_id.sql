-- Migration 0057 — game_replays.matchId
--
-- Adds the originating matchId to `game_replays` so the verification
-- job (#92) can deterministically reconstruct the initial GameState.
-- The tcg-core reducer mints card-instance ids via
-- `makeCardInstance(matchId, counter, …)`, so hashState() over a
-- GameState rebuilt from a different matchId will diverge from the
-- stored finalStateHash even when every action replays identically.
-- Storing matchId closes that gap.
--
-- This migration is hand-written. It is orphaned from `_journal.json`
-- following the existing pattern for new migrations under the journal-
-- drift situation (see apps/db/README.md §"Known journal drift"); the
-- matching startup bootstrap is `bootstrapReplayMatchId()` in
-- apps/server/services/replaysBootstrap.ts.
--
-- Idempotent in the bootstrap path: the bootstrap inspects
-- information_schema.columns before ALTERing, so re-running on a DB
-- that already has the column is a no-op.

ALTER TABLE `game_replays`
  ADD COLUMN `matchId` VARCHAR(64) NULL,
  ADD INDEX `idx_game_replays_match_id` (`matchId`);
