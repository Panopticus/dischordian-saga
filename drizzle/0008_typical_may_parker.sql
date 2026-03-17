ALTER TABLE `tw_player_state` ADD `faction` enum('empire','insurgency') DEFAULT 'empire';--> statement-breakpoint
ALTER TABLE `tw_player_state` ADD `tutorialStep` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `tw_player_state` ADD `discoveredRelics` json;--> statement-breakpoint
ALTER TABLE `tw_player_state` ADD `researchPoints` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `tw_player_state` ADD `unlockedTech` json;