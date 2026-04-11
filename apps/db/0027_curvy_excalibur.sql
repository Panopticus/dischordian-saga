ALTER TABLE `boss_mastery` MODIFY COLUMN `cosmeticsUnlocked` json;--> statement-breakpoint
ALTER TABLE `donation_reputation` MODIFY COLUMN `weeklyDonations` json;--> statement-breakpoint
ALTER TABLE `event_participation` MODIFY COLUMN `milestonesReached` json;--> statement-breakpoint
ALTER TABLE `friendly_challenges` MODIFY COLUMN `rules` json;--> statement-breakpoint
ALTER TABLE `game_replays` MODIFY COLUMN `tags` json;--> statement-breakpoint
ALTER TABLE `guild_recruitment` MODIFY COLUMN `preferredClasses` json;--> statement-breakpoint
ALTER TABLE `player_quarters` MODIFY COLUMN `unlockedZones` json;--> statement-breakpoint
ALTER TABLE `player_quarters` MODIFY COLUMN `placedItems` json;--> statement-breakpoint
ALTER TABLE `player_quarters` MODIFY COLUMN `ownedItems` json;