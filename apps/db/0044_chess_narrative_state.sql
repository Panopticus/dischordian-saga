-- Chess narrative state + per-opponent imprint tables for the
-- "Game Master's Gambit" lore reskin.
--
-- See /root/.claude/plans/frolicking-launching-fiddle.md for the
-- full design. Short version:
--
--   * `chess_narrative_state` is one row per user — meta-state for
--     the 12-act story arc (current act, reveal tier, completed
--     acts, lore flags, NPC encounter flags, epilogue gate).
--
--   * `chess_opponent_imprints` is one row per (user, opponent)
--     pair — the imprint's memory of you. Tracks unlocked state,
--     difficulty tier (bumps on each win, capped at 5 by the app),
--     win/loss record, last result, a JSON "player model" used
--     by the learning AI, relationship flags/score from choice
--     points, and the list of dialog ids already shown so
--     evolving dialog doesn't repeat.
--
-- Raw SQL only — journal regen deferred, matching the convention
-- established by 0036-0043 on this branch (see the comment in
-- 0043_chess_persistence.sql).

CREATE TABLE `chess_narrative_state` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `currentAct` INT NOT NULL DEFAULT 1,
  `revealTier` INT NOT NULL DEFAULT 0,
  `completedActs` JSON DEFAULT NULL,
  `loreFlags` JSON DEFAULT NULL,
  `inventorEncountered` BOOLEAN NOT NULL DEFAULT FALSE,
  `knowledgeEncountered` BOOLEAN NOT NULL DEFAULT FALSE,
  `epilogueUnlocked` BOOLEAN NOT NULL DEFAULT FALSE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX `idx_chess_narrative_state_user`
  ON `chess_narrative_state` (`userId`);

CREATE TABLE `chess_opponent_imprints` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `opponentId` VARCHAR(64) NOT NULL,
  `unlocked` BOOLEAN NOT NULL DEFAULT FALSE,
  `difficultyTier` INT NOT NULL DEFAULT 0,
  `gamesPlayed` INT NOT NULL DEFAULT 0,
  `wins` INT NOT NULL DEFAULT 0,
  `losses` INT NOT NULL DEFAULT 0,
  `draws` INT NOT NULL DEFAULT 0,
  `lastResult` ENUM('win', 'loss', 'draw', 'none') NOT NULL DEFAULT 'none',
  `lastEncounteredAt` TIMESTAMP NULL DEFAULT NULL,
  `playerModel` JSON DEFAULT NULL,
  `relationshipFlags` JSON DEFAULT NULL,
  `relationshipScore` INT NOT NULL DEFAULT 0,
  `dialogSeenIds` JSON DEFAULT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX `idx_chess_opponent_imprints_user_opponent`
  ON `chess_opponent_imprints` (`userId`, `opponentId`);
CREATE INDEX `idx_chess_opponent_imprints_user`
  ON `chess_opponent_imprints` (`userId`);
