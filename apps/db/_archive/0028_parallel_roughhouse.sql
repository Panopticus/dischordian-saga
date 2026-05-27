ALTER TABLE `character_sheets` ADD `moralityScore` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `character_sheets` ADD `activeShipTheme` varchar(128);--> statement-breakpoint
ALTER TABLE `character_sheets` ADD `activeCharacterTheme` varchar(128);