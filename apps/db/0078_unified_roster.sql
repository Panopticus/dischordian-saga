-- ─────────────────────────────────────────────────────────────────
-- Unified Roster — wires apprentices, cloning, demon summoning, and
-- NPC tier-5 recruitment through the existing crew_members table.
-- See plan: /root/.claude/plans/add-in-the-cloning-compressed-hare.md
-- ─────────────────────────────────────────────────────────────────

-- 1. Extend crew_members with the production-path discriminator and
--    per-path metadata. All columns nullable / defaulted for back-compat
--    so pre-migration rows continue to behave as "bred".
ALTER TABLE `crew_members`
  ADD COLUMN `productionPath` VARCHAR(16) NULL,
  ADD COLUMN `archetype` VARCHAR(24) NULL,
  ADD COLUMN `biography` JSON NOT NULL DEFAULT (JSON_ARRAY()),
  ADD COLUMN `personalQuestStage` INT NOT NULL DEFAULT 0,
  ADD COLUMN `personalQuestResolution` VARCHAR(16) NULL,
  ADD COLUMN `cloneDegradation` INT NOT NULL DEFAULT 0,
  ADD COLUMN `resurrectedFromId` VARCHAR(64) NULL,
  ADD COLUMN `boundStoneId` VARCHAR(64) NULL,
  ADD COLUMN `corruption` INT NOT NULL DEFAULT 0,
  ADD COLUMN `linkedNpcKey` VARCHAR(32) NULL,
  ADD INDEX `idx_crew_member_production_path` (`productionPath`),
  ADD INDEX `idx_crew_member_linked_npc` (`linkedNpcKey`);

-- 2. Per-user Blood Weave alignment (Resurrection Protocol Stage 3).
CREATE TABLE IF NOT EXISTS `blood_weave_alignment` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `userId` INT NOT NULL,
  `resurrectionsPerformed` INT NOT NULL DEFAULT 0,
  `alignmentValue` INT NOT NULL DEFAULT 0,
  `revealedEntries` JSON NOT NULL DEFAULT (JSON_ARRAY()),
  `strippedEntries` JSON NOT NULL DEFAULT (JSON_ARRAY()),
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `blood_weave_alignment_id` PRIMARY KEY(`id`),
  CONSTRAINT `blood_weave_alignment_userId_unique` UNIQUE(`userId`),
  CONSTRAINT `blood_weave_alignment_userId_users_id_fk`
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- 3. Per-crew-member personal-quest progress.
CREATE TABLE IF NOT EXISTS `apprentice_personal_quest_progress` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `userId` INT NOT NULL,
  `memberKey` VARCHAR(64) NOT NULL,
  `archetype` VARCHAR(24) NOT NULL,
  `stage` INT NOT NULL DEFAULT 0,
  `resolution` VARCHAR(16) NULL,
  `stageStartedAt` JSON NOT NULL DEFAULT (JSON_OBJECT()),
  `flags` JSON NOT NULL DEFAULT (JSON_OBJECT()),
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `apprentice_personal_quest_progress_id` PRIMARY KEY(`id`),
  CONSTRAINT `uq_apq_user_member` UNIQUE(`userId`, `memberKey`),
  CONSTRAINT `apq_userId_users_id_fk`
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_apq_user` (`userId`)
);

-- 4. Gift log (likes/dislikes give-bond-delta history).
CREATE TABLE IF NOT EXISTS `apprentice_gift_log` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `userId` INT NOT NULL,
  `memberKey` VARCHAR(64) NOT NULL,
  `giftId` VARCHAR(64) NOT NULL,
  `bondDelta` INT NOT NULL,
  `reaction` VARCHAR(16) NOT NULL,
  `givenAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `apprentice_gift_log_id` PRIMARY KEY(`id`),
  CONSTRAINT `agl_userId_users_id_fk`
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_agl_user_member` (`userId`, `memberKey`)
);

-- 5. NPC world-death state — locks canonical NPC dialog/quests when
--    their recruited crew instance dies (the painful-death tier).
CREATE TABLE IF NOT EXISTS `npc_world_death_state` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `userId` INT NOT NULL,
  `npcKey` VARCHAR(32) NOT NULL,
  `killedMemberKey` VARCHAR(64) NOT NULL,
  `diedAtCycle` INT NOT NULL,
  `diedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `npc_world_death_state_id` PRIMARY KEY(`id`),
  CONSTRAINT `uq_nwds_user_npc` UNIQUE(`userId`, `npcKey`),
  CONSTRAINT `nwds_userId_users_id_fk`
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_nwds_user` (`userId`)
);

-- 6. Romance archetype-arc state.
CREATE TABLE IF NOT EXISTS `apprentice_romance_arc` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `userId` INT NOT NULL,
  `memberKeyA` VARCHAR(64) NOT NULL,
  `memberKeyB` VARCHAR(64) NOT NULL,
  `stage` VARCHAR(16) NOT NULL DEFAULT 'spark',
  `loredexEntryId` VARCHAR(96) NULL,
  `startedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `apprentice_romance_arc_id` PRIMARY KEY(`id`),
  CONSTRAINT `uq_ara_user_pair` UNIQUE(`userId`, `memberKeyA`, `memberKeyB`),
  CONSTRAINT `ara_userId_users_id_fk`
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_ara_user` (`userId`)
);
