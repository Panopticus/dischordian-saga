-- Prestige System: add prestige columns to character_sheets

ALTER TABLE `character_sheets` ADD COLUMN `prestigeTier` int NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE `character_sheets` ADD COLUMN `prestigeState` json;
