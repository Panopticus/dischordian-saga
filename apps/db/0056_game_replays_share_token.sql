-- Migration 0056 — game_replays.shareToken
--
-- Replay sharing as primary acquisition channel (#6 / #46 from the
-- AAA review roadmap). The deterministic reducer + state-hash already
-- support reproducing any match from `moveData + seed + rulesVersion`,
-- but the `id` PK on `game_replays` is autoincrement-int — enumerable
-- by anyone with /replay/1, /replay/2, … URLs. A 16-byte URL-safe
-- random token gives unguessable share-links so a player can post
-- their cool match without leaking neighbouring matches.
--
-- This migration is hand-written. It is orphaned from `_journal.json`
-- following the existing pattern for new migrations under the journal-
-- drift situation (see apps/db/README.md §"Known journal drift");
--> statement-breakpoint the
-- matching startup bootstrap is `bootstrapReplayShareToken()` in
-- apps/server/services/replaysBootstrap.ts. The bootstrap also runs
-- the same DDL idempotently on every startup so a fresh DB or a DB
-- where this migration was applied manually both end up consistent.
--
-- Idempotent: the bootstrap variant uses an information_schema check
-- before ALTER. This file uses the simplest form for hand-application;
--> statement-breakpoint
-- prefer the bootstrap path in production.

ALTER TABLE `game_replays`
  ADD COLUMN `shareToken` VARCHAR(32) NULL,
  ADD UNIQUE KEY `uq_game_replays_share_token` (`shareToken`);
