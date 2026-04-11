CREATE TABLE `auction_bids` (
	`id` int AUTO_INCREMENT NOT NULL,
	`auctionId` int NOT NULL,
	`bidderId` int NOT NULL,
	`bidAmount` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auction_bids_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `battle_pass_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`seasonId` int NOT NULL,
	`currentXp` int NOT NULL DEFAULT 0,
	`currentTier` int NOT NULL DEFAULT 0,
	`isPremium` boolean NOT NULL DEFAULT false,
	`claimedFreeTiers` json,
	`claimedPremiumTiers` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `battle_pass_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `battle_pass_seasons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`seasonNumber` int NOT NULL,
	`name` varchar(256) NOT NULL,
	`description` text,
	`totalTiers` int NOT NULL DEFAULT 50,
	`xpPerTier` int NOT NULL DEFAULT 1000,
	`premiumPriceDream` int NOT NULL DEFAULT 500,
	`premiumPriceUsd` int NOT NULL DEFAULT 499,
	`tierRewards` json,
	`status` enum('active','upcoming','ended') NOT NULL DEFAULT 'upcoming',
	`startsAt` timestamp NOT NULL,
	`endsAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `battle_pass_seasons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `currency_exchange` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`sellCurrency` enum('dream','credits') NOT NULL,
	`sellAmount` int NOT NULL,
	`buyCurrency` enum('dream','credits') NOT NULL,
	`buyAmount` int NOT NULL,
	`filledAmount` int NOT NULL DEFAULT 0,
	`status` enum('active','filled','cancelled') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `currency_exchange_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `daily_quests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`questId` varchar(128) NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text,
	`questType` enum('fight','card_battle','trade','craft','explore','social') NOT NULL,
	`targetCount` int NOT NULL DEFAULT 1,
	`currentCount` int NOT NULL DEFAULT 0,
	`rewardDream` int NOT NULL DEFAULT 0,
	`rewardXp` int NOT NULL DEFAULT 0,
	`rewardCredits` int NOT NULL DEFAULT 0,
	`bonusReward` varchar(256),
	`claimed` boolean NOT NULL DEFAULT false,
	`questDate` varchar(10) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `daily_quests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `disenchant_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`cardId` varchar(128) NOT NULL,
	`cardName` varchar(256) NOT NULL,
	`cardRarity` varchar(32) NOT NULL,
	`materialsReceived` json,
	`dreamReceived` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `disenchant_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `guild_chat` (
	`id` int AUTO_INCREMENT NOT NULL,
	`guildId` int NOT NULL,
	`userId` int NOT NULL,
	`userName` varchar(128) NOT NULL,
	`message` text NOT NULL,
	`messageType` enum('chat','system','war_update') NOT NULL DEFAULT 'chat',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `guild_chat_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `guild_invites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`guildId` int NOT NULL,
	`invitedUserId` int NOT NULL,
	`invitedBy` int NOT NULL,
	`status` enum('pending','accepted','declined') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `guild_invites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `guild_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`guildId` int NOT NULL,
	`userId` int NOT NULL,
	`role` enum('leader','officer','member') NOT NULL DEFAULT 'member',
	`contributionXp` int NOT NULL DEFAULT 0,
	`donatedDream` int NOT NULL DEFAULT 0,
	`donatedCredits` int NOT NULL DEFAULT 0,
	`warPoints` int NOT NULL DEFAULT 0,
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `guild_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `guilds` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(64) NOT NULL,
	`tag` varchar(5) NOT NULL,
	`description` text,
	`leaderId` int NOT NULL,
	`faction` enum('empire','insurgency','neutral') NOT NULL DEFAULT 'neutral',
	`emblem` varchar(64) DEFAULT 'default',
	`maxMembers` int NOT NULL DEFAULT 30,
	`memberCount` int NOT NULL DEFAULT 1,
	`level` int NOT NULL DEFAULT 1,
	`xp` int NOT NULL DEFAULT 0,
	`treasuryDream` int NOT NULL DEFAULT 0,
	`treasuryCredits` int NOT NULL DEFAULT 0,
	`totalWarPoints` int NOT NULL DEFAULT 0,
	`motd` text,
	`isRecruiting` boolean NOT NULL DEFAULT true,
	`minLevelToJoin` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `guilds_id` PRIMARY KEY(`id`),
	CONSTRAINT `guilds_name_unique` UNIQUE(`name`),
	CONSTRAINT `guilds_tag_unique` UNIQUE(`tag`)
);
--> statement-breakpoint
CREATE TABLE `login_calendar` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`currentStreak` int NOT NULL DEFAULT 0,
	`longestStreak` int NOT NULL DEFAULT 0,
	`lastLoginDate` varchar(10),
	`totalDays` int NOT NULL DEFAULT 0,
	`monthClaims` json,
	`currentMonth` varchar(7),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `login_calendar_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `market_auctions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sellerId` int NOT NULL,
	`itemType` enum('card','material','crafted_item') NOT NULL,
	`itemId` varchar(128) NOT NULL,
	`itemName` varchar(256) NOT NULL,
	`rarity` varchar(32),
	`quantity` int NOT NULL DEFAULT 1,
	`startingBid` int NOT NULL DEFAULT 1,
	`currentBid` int NOT NULL DEFAULT 0,
	`highestBidderId` int,
	`bidIncrement` int NOT NULL DEFAULT 1,
	`buyoutPrice` int NOT NULL DEFAULT 0,
	`status` enum('active','ended','cancelled') NOT NULL DEFAULT 'active',
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`endsAt` timestamp NOT NULL,
	CONSTRAINT `market_auctions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `market_buy_orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`buyerId` int NOT NULL,
	`itemType` enum('card','material','crafted_item') NOT NULL,
	`itemId` varchar(128) NOT NULL,
	`itemName` varchar(256) NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`maxPriceDream` int NOT NULL DEFAULT 0,
	`maxPriceCredits` int NOT NULL DEFAULT 0,
	`filledQuantity` int NOT NULL DEFAULT 0,
	`status` enum('active','filled','cancelled','expired') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	CONSTRAINT `market_buy_orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `market_listings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sellerId` int NOT NULL,
	`itemType` enum('card','material','crafted_item') NOT NULL,
	`itemId` varchar(128) NOT NULL,
	`itemName` varchar(256) NOT NULL,
	`rarity` varchar(32),
	`quantity` int NOT NULL DEFAULT 1,
	`priceDream` int NOT NULL DEFAULT 0,
	`priceCredits` int NOT NULL DEFAULT 0,
	`status` enum('active','sold','cancelled','expired') NOT NULL DEFAULT 'active',
	`category` varchar(64),
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`expiresAt` timestamp,
	CONSTRAINT `market_listings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `market_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`listingId` int,
	`buyOrderId` int,
	`sellerId` int NOT NULL,
	`buyerId` int NOT NULL,
	`itemType` enum('card','material','crafted_item') NOT NULL,
	`itemId` varchar(128) NOT NULL,
	`itemName` varchar(256) NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`priceDream` int NOT NULL DEFAULT 0,
	`priceCredits` int NOT NULL DEFAULT 0,
	`taxDream` int NOT NULL DEFAULT 0,
	`taxCredits` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `market_transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('trade_offer','trade_accepted','trade_declined','pvp_challenge','pvp_result','auction_outbid','auction_won','auction_ended','market_sold','market_buy_filled','faction_war','guild_invite','guild_message','daily_reset','battle_pass_reward','system') NOT NULL,
	`title` varchar(256) NOT NULL,
	`message` text NOT NULL,
	`isRead` boolean NOT NULL DEFAULT false,
	`actionUrl` varchar(256),
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
