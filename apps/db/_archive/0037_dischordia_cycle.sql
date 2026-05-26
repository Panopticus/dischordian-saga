CREATE TABLE `dischordia_cycle_state` (
	`id` int NOT NULL,
	`phase` varchar(32) NOT NULL DEFAULT 'dawn',
	`phaseStartedAt` timestamp NOT NULL DEFAULT (now()),
	`cycleNumber` int NOT NULL DEFAULT 1,
	`lightEnergy` int NOT NULL DEFAULT 0,
	`darkEnergy` int NOT NULL DEFAULT 0,
	`vortexProximity` int NOT NULL DEFAULT 0,
	`energyBalance` varchar(32) NOT NULL DEFAULT 'balanced',
	`history` json,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dischordia_cycle_state_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dischordia_energy_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`actionId` varchar(128) NOT NULL,
	`lightDelta` int NOT NULL DEFAULT 0,
	`darkDelta` int NOT NULL DEFAULT 0,
	`vortexDelta` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dischordia_energy_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `idx_dischordia_energy_created` ON `dischordia_energy_events` (`createdAt`);--> statement-breakpoint
CREATE INDEX `idx_dischordia_energy_user` ON `dischordia_energy_events` (`userId`);