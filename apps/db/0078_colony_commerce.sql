-- ─────────────────────────────────────────────────────────────────
-- Colony Commerce — Trade Empire Phase B extension.
--
-- Three normalized tables backing the Veska / Inception-Ark
-- founding-lane surface. See:
--   - apps/shared/tradeEmpire/colonyCommerce.ts (type + economics canon)
--   - apps/server/routers/colonyCommerce.ts (runtime)
--   - apps/db/schema.ts (canonical Drizzle definitions)
--
-- Authored manually because the migration journal is currently
-- drifted (see apps/db/migrations/README.md cutover plan); listed in
-- migration-drift.baseline.json with the existing 42 orphan files.
-- The journal entry will land when the cutover plan executes; until
-- then `pnpm db:push` is the supported application path.
-- ─────────────────────────────────────────────────────────────────

CREATE TABLE `colony_lanes` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `laneId` varchar(192) NOT NULL,
  `sectorId` varchar(128) NOT NULL,
  `vesselClass` varchar(64) NOT NULL,
  `bloodlineKey` varchar(64) NOT NULL,
  `signedAt` bigint NOT NULL,
  `durationMs` bigint NOT NULL,
  `tariffPaid` int NOT NULL DEFAULT 0,
  `status` varchar(24) NOT NULL DEFAULT 'in_voyage',
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `colony_lanes_id` PRIMARY KEY (`id`),
  CONSTRAINT `uniq_colony_lanes_user_lane` UNIQUE (`userId`, `laneId`)
);

CREATE INDEX `idx_colony_lanes_user_id` ON `colony_lanes` (`userId`);
CREATE INDEX `idx_colony_lanes_user_status` ON `colony_lanes` (`userId`, `status`);

ALTER TABLE `colony_lanes`
  ADD CONSTRAINT `colony_lanes_userId_users_id_fk`
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE;

CREATE TABLE `colony_worlds` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `colonyId` varchar(192) NOT NULL,
  `sectorId` varchar(128) NOT NULL,
  `bloodlineKey` varchar(64) NOT NULL,
  `name` varchar(128) NOT NULL,
  `foundedAt` timestamp NOT NULL DEFAULT (now()),
  `currentGeneration` int NOT NULL DEFAULT 1,
  `lastExportAt` bigint,
  `totalExportValue` int NOT NULL DEFAULT 0,
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `colony_worlds_id` PRIMARY KEY (`id`),
  CONSTRAINT `uniq_colony_worlds_user_colony` UNIQUE (`userId`, `colonyId`)
);

CREATE INDEX `idx_colony_worlds_user_id` ON `colony_worlds` (`userId`);
CREATE INDEX `idx_colony_worlds_user_sector` ON `colony_worlds` (`userId`, `sectorId`);

ALTER TABLE `colony_worlds`
  ADD CONSTRAINT `colony_worlds_userId_users_id_fk`
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE;

CREATE TABLE `colony_founder_progress` (
  `userId` int NOT NULL,
  `totalColoniesFounded` int NOT NULL DEFAULT 0,
  `founderTier` int NOT NULL DEFAULT 0,
  `lastTierAt` timestamp,
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `colony_founder_progress_userId` PRIMARY KEY (`userId`)
);

ALTER TABLE `colony_founder_progress`
  ADD CONSTRAINT `colony_founder_progress_userId_users_id_fk`
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE;
