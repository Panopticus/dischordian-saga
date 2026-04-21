-- Chess Game Reviews — persisted post-game Stockfish analysis.
--
-- When a player finishes a casual chess game, the client runs
-- the PGN through Stockfish at depth 18 and extracts the top
-- mistakes. Those review packets land here so the Celebration
-- Game Master can later reference "you did this three times
-- last week — it is a pattern, not an accident."
--
-- Fields:
--   pgn        — the full game text
--   playerSide — which side the player played
--   mistakes   — JSON array of ReviewMistake shapes (see
--                apps/client/src/components/ChessPostGameReview.tsx)
--   summary    — short one-line takeaway for list views
--
-- Migration numbering: 0052, following 0050 (player_profile)
-- and 0051 (chess_climb). Same orphan convention as 0043.

CREATE TABLE `chess_game_reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `pgn` TEXT NOT NULL,
  `playerSide` ENUM('white', 'black') NOT NULL,
  `mistakes` JSON NOT NULL,
  `summary` VARCHAR(255) NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX `idx_chess_game_reviews_user_created`
  ON `chess_game_reviews` (`userId`, `createdAt` DESC);
