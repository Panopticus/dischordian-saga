-- Phase 6 Infrastructure Deliverable 4 — per-NPC ask-topics + dialog
-- tree state.
--
-- Adds two tables that back Phase 6's BioWare-depth dialog systems:
--   * npc_ask_topic_history — one row per (user, topic) ask event;
--> statement-breakpoint
--     drives "you've already asked this" re-entry responses + cooldown.
--   * npc_dialog_tree_state — one row per (user, tree);
--> statement-breakpoint supports
--     tree-resume across sessions when a player closes a multi-turn
--     conversation mid-walk.
--
-- See apps/shared/npcs/askTopics.ts (AskTopic registry) +
-- apps/shared/npcs/dialogTrees/ (per-NPC trees) +
-- apps/shared/npcs/conversationRunner.ts (state machine).
--
-- Idempotent: CREATE TABLE IF NOT EXISTS so re-runs are no-ops.
-- ORPHAN STATUS: per apps/db/README.md §"Known journal drift", this
-- migration is added to disk but not yet wired into _journal.json.
-- A later devops cleanup commit will reconcile the journal.

CREATE TABLE IF NOT EXISTS `npc_ask_topic_history` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `npcKey` VARCHAR(64) NOT NULL,
  `topicId` VARCHAR(256) NOT NULL,
  `askedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_npc_ask_topic_history_user_id` (`userId`),
  INDEX `idx_npc_ask_topic_history_user_topic` (`userId`, `npcKey`, `topicId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `npc_dialog_tree_state` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `npcKey` VARCHAR(64) NOT NULL,
  `treeId` VARCHAR(256) NOT NULL,
  `currentNodeId` VARCHAR(256) DEFAULT NULL,
  `completedAt` TIMESTAMP NULL DEFAULT NULL,
  `startedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_npc_dialog_tree_state_user_id` (`userId`),
  UNIQUE INDEX `uniq_npc_dialog_tree_state_user_npc_tree` (`userId`, `npcKey`, `treeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
