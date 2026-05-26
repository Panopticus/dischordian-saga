-- ─────────────────────────────────────────────────────────────────
-- Global Light/Dark alignment meter (NARRATIVE_ARCHITECTURE.md §0).
-- Singleton row tracking community-wide alignment balance.
-- ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `global_alignment` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `lightTotal` INT NOT NULL DEFAULT 0,
  `darkTotal` INT NOT NULL DEFAULT 0,
  `playerCount` INT NOT NULL DEFAULT 0,
  `computedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `phase` ENUM('light_dominant','balanced','dark_dominant') NOT NULL DEFAULT 'balanced',
  CONSTRAINT `global_alignment_id` PRIMARY KEY(`id`)
);

-- Seed the singleton row at id=1 so the aggregator can UPDATE rather than INSERT.
INSERT INTO `global_alignment` (`id`, `lightTotal`, `darkTotal`, `playerCount`, `phase`)
VALUES (1, 0, 0, 0, 'balanced');
