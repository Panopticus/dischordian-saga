-- Chess persistence tables: puzzle progress + tournament state.
--
-- Previously the chess router tracked puzzle solves and tournament
-- participants/pairings in process-local Maps that reset on every
-- server restart. That was fine for the MVP landing of puzzles and
-- tournaments, but it meant:
--   - Players could re-claim the same puzzle reward after a deploy
--   - A mid-tournament restart wiped standings entirely
--
-- This migration persists that state. Scores/tie-breaks are stored
-- as INT representing 2x the actual value so we avoid MySQL decimal
-- columns (e.g. score=3 → 1.5 points). The application translates.

CREATE TABLE `chess_puzzle_progress` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `puzzleId` VARCHAR(32) NOT NULL,
  `solvedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `attempts` INT NOT NULL DEFAULT 1
);

CREATE UNIQUE INDEX `idx_chess_puzzle_progress_user_puzzle`
  ON `chess_puzzle_progress` (`userId`, `puzzleId`);
CREATE INDEX `idx_chess_puzzle_progress_user`
  ON `chess_puzzle_progress` (`userId`);

CREATE TABLE `chess_tournament_participants` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tournamentId` INT NOT NULL,
  `userId` INT NOT NULL,
  `userName` VARCHAR(128) NOT NULL,
  `score` INT NOT NULL DEFAULT 0,
  `tieBreak` INT NOT NULL DEFAULT 0,
  `active` BOOLEAN NOT NULL DEFAULT TRUE,
  `joinedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX `idx_chess_tournament_participants_tourney_user`
  ON `chess_tournament_participants` (`tournamentId`, `userId`);
CREATE INDEX `idx_chess_tournament_participants_tournament`
  ON `chess_tournament_participants` (`tournamentId`);
CREATE INDEX `idx_chess_tournament_participants_user`
  ON `chess_tournament_participants` (`userId`);

CREATE TABLE `chess_tournament_pairings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tournamentId` INT NOT NULL,
  `round` INT NOT NULL,
  `whiteId` INT NOT NULL,
  `blackId` INT NOT NULL,
  `whiteResult` ENUM('win', 'loss', 'draw') DEFAULT NULL,
  `reported` BOOLEAN NOT NULL DEFAULT FALSE,
  `gameId` INT DEFAULT NULL,
  `deadlineAt` TIMESTAMP NULL DEFAULT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX `idx_chess_tournament_pairings_tournament`
  ON `chess_tournament_pairings` (`tournamentId`);
CREATE INDEX `idx_chess_tournament_pairings_tournament_round`
  ON `chess_tournament_pairings` (`tournamentId`, `round`);
