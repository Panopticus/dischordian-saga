-- Chess User State — per-user UI breadcrumbs that need to survive
-- across devices (the localStorage-based versions cannot).
--
-- First column: lastVisitAt. Drives the "welcome back" daily
-- banner on chess pages — when a player loads any chess page,
-- the previous value of lastVisitAt is read to compute
-- days-since-last-visit, then the column is stamped to NOW().
--
-- Future per-user chess UI breadcrumbs (e.g. "last seen tier",
-- "preferred opening", "muted GM voice") can be added here as
-- additional columns without churning a hotter table like users.
--
-- Migration numbering: 0055, following 0054 (citizen_foundation).

CREATE TABLE `chess_user_state` (
  `userId` INT NOT NULL PRIMARY KEY,
  `lastVisitAt` TIMESTAMP NULL DEFAULT NULL,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX `idx_chess_user_state_last_visit`
  ON `chess_user_state` (`lastVisitAt`);
