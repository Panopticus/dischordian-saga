CREATE TABLE `linked_wallets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`walletAddress` varchar(42) NOT NULL,
	`chain` varchar(32) NOT NULL DEFAULT 'ethereum',
	`verificationSignature` text,
	`linkedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `linked_wallets_id` PRIMARY KEY(`id`),
	CONSTRAINT `linked_wallets_walletAddress_unique` UNIQUE(`walletAddress`)
);
--> statement-breakpoint
CREATE TABLE `nft_claims` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tokenId` int NOT NULL,
	`claimerWallet` varchar(42) NOT NULL,
	`claimerUserId` int NOT NULL,
	`cardId` varchar(128),
	`metadataSnapshot` json,
	`cardImageUrl` text,
	`claimedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `nft_claims_id` PRIMARY KEY(`id`),
	CONSTRAINT `nft_claims_tokenId_unique` UNIQUE(`tokenId`)
);
--> statement-breakpoint
CREATE TABLE `nft_metadata_cache` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tokenId` int NOT NULL,
	`name` varchar(256),
	`imageUrl` text,
	`nftClass` varchar(64),
	`weapon` varchar(128),
	`background` varchar(128),
	`specie` varchar(64),
	`gender` varchar(32),
	`level` int,
	`body` varchar(64),
	`attributes` json,
	`currentOwner` varchar(42),
	`lastRefreshed` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `nft_metadata_cache_id` PRIMARY KEY(`id`),
	CONSTRAINT `nft_metadata_cache_tokenId_unique` UNIQUE(`tokenId`)
);
