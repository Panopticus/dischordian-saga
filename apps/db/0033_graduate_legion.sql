-- Graduate Legion: deployment tracking table

CREATE TABLE `graduate_deployments` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `graduateId` varchar(128) NOT NULL,
  `graduateName` varchar(128) NOT NULL,
  `archetype` varchar(64) NOT NULL,
  `rarity` varchar(32) NOT NULL,
  `role` varchar(64) NOT NULL,
  `active` boolean NOT NULL DEFAULT true,
  `bonuses` json,
  `payload` json,
  `deployedAt` timestamp NOT NULL DEFAULT (now()),
  `recalledAt` timestamp,
  CONSTRAINT `graduate_deployments_id` PRIMARY KEY(`id`)
);

CREATE INDEX `idx_graduate_deployments_user` ON `graduate_deployments` (`userId`);
CREATE INDEX `idx_graduate_deployments_role` ON `graduate_deployments` (`role`);
