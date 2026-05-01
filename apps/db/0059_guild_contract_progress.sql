-- Guild contract progress (F.2 weekly contract loop)
-- One row per (userId, weekId, contractId). Upsert pattern in
-- apps/server/services/guildContractProgress.ts increments
-- progressCount as source events fire; completedAt is stamped by
-- the explicit completeContract mutation once progress >= target.

CREATE TABLE `guild_contract_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`weekId` varchar(16) NOT NULL,
	`contractId` varchar(64) NOT NULL,
	`progressCount` int NOT NULL DEFAULT 0,
	`completedAt` timestamp NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `guild_contract_progress_id` PRIMARY KEY(`id`),
	CONSTRAINT `uniq_guild_contract_user_week_contract` UNIQUE(`userId`,`weekId`,`contractId`)
);
--> statement-breakpoint
CREATE INDEX `idx_guild_contract_user_week` ON `guild_contract_progress` (`userId`,`weekId`);
