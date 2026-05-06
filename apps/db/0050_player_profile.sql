-- Player Psychological Profile — game-wide style profile.
--
-- Two tables:
--   * `player_profile` — one row per user, the current snapshot of
--     all seven style axes, plus a counter of how many events have
--     been folded in. Reads are cheap (single PK lookup); writes
--     happen in the same transaction as the originating action
--     (e.g. a chess mind-game choice updates the profile and
--     records the choice atomically).
--
--   * `player_profile_events` — append-only audit log. Every event
--     that wrote to the profile is logged with its source id, the
--     payload that triggered it, and the actual delta applied.
--     Lets the Game Master surface SPECIFIC past events ("you
--     spared the Programmer in Act 1") instead of just aggregate
--     numbers, and gives us a debugging trail for profile drift.
--
-- See `apps/shared/playerProfile.ts` for axis definitions and
-- value semantics, and `apps/shared/playerProfileSources.ts` for
-- the standard delta per source id.
--
-- Migration numbering: 0050 because 0044-0047 each have two files
-- on this main branch (parallel feature work pre-merge), and 0049
-- was the most recent single. This branch follows the same orphan
-- convention used by `0043_chess_persistence.sql` and is folded
-- into the journal at the next clean drizzle-kit generate.

-- Axes are stored as INT in the range [-100, 100]. The repo
-- convention (see schema.ts line 4426) is to avoid FLOAT columns;
-- whole-unit precision is enough for these axes — the magnitude
-- buckets (`magnitudeOf` in playerProfile.ts) are at ±11/±34/±67.
CREATE TABLE `player_profile` (
  `userId` INT NOT NULL PRIMARY KEY,
  `aggression` INT NOT NULL DEFAULT 0,
  `mercy` INT NOT NULL DEFAULT 0,
  `curiosity` INT NOT NULL DEFAULT 0,
  `conformity` INT NOT NULL DEFAULT 0,
  `vigilance` INT NOT NULL DEFAULT 0,
  `vulnerability` INT NOT NULL DEFAULT 0,
  `wit` INT NOT NULL DEFAULT 0,
  `eventCount` INT NOT NULL DEFAULT 0,
  `lastUpdatedAt` TIMESTAMP NULL DEFAULT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint

CREATE TABLE `player_profile_events` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `source` VARCHAR(64) NOT NULL,
  `payload` JSON NULL,
  `deltas` JSON NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint

-- Hot path: "give me this user's most recent N events", used by
-- the GM to cite SPECIFIC past events.
CREATE INDEX `idx_player_profile_events_user_created`
  ON `player_profile_events` (`userId`, `createdAt` DESC);
--> statement-breakpoint

-- Secondary: "give me all events of this source for this user",
-- used when the GM wants to read back e.g. all draw offers.
CREATE INDEX `idx_player_profile_events_user_source`
  ON `player_profile_events` (`userId`, `source`);
