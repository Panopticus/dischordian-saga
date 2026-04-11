-- Phase C — The Palimpsest: Signal/Noise meter persistence
--
-- Adds the `palimpsest_state` table that backs the Signal/Noise
-- dual meter for "The Palimpsest" (13-episode in-universe reality
-- show arc). One row per user. Matches the shared PalimpsestState
-- shape in apps/shared/palimpsest.ts:
--
--   signal           — Gold ink. Truth / remembering. Builds from
--                      correct quiz answers, solved research
--                      puzzles, crafted truths, and dialog choices
--                      that admit the truth.
--   noise            — Red ink. Corruption / editing. Builds from
--                      wrong answers, craft failures, agreeing
--                      with General Alaric, and ignoring Signal
--                      Beacons.
--   lastDecayAt      — Last time passive Signal decay was applied
--                      (1 per day). Written by palimpsestService
--                      on every get().
--   currentEpisode   — Which Palimpsest episode the user is on
--                      (1..13). Advanced by recordEpisode.
--   hostMaskSlipped  — Whether the Host's mask has visibly slipped
--                      for this user this episode. 0 or 1.
--   history          — JSON array of EpisodeRecord — the user's
--                      completed-episode history.
--
-- Episode completions ALSO land in content_participation with
-- contentType='palimpsest_episode', so cross-device progress is
-- queried there — this table holds the live meter.

CREATE TABLE `palimpsest_state` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `signal` INT NOT NULL DEFAULT 0,
  `noise` INT NOT NULL DEFAULT 0,
  `lastDecayAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `currentEpisode` INT NOT NULL DEFAULT 1,
  `hostMaskSlipped` INT NOT NULL DEFAULT 0,
  `history` JSON DEFAULT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `palimpsest_state_user_id_unique` (`userId`)
);

CREATE INDEX `idx_palimpsest_state_user_id`
  ON `palimpsest_state` (`userId`);
