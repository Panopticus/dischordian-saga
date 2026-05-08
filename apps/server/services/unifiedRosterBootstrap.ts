/* ═══════════════════════════════════════════════════════
   UNIFIED ROSTER BOOTSTRAP

   Replaces the journal-orphaned 0078_unified_roster.sql
   with idempotent DDL run at server startup. Adds the
   crew_members columns + supporting tables required by
   the unified-roster work (Resurrection Protocols, Hellbox,
   apprentice trial graduation, NPC tier-5 recruitment).

   Every statement is `CREATE TABLE IF NOT EXISTS` or
   `ALTER TABLE … ADD COLUMN IF NOT EXISTS`, so the
   bootstrap is a no-op on a DB that already has them.
   ═══════════════════════════════════════════════════════ */
import { sql } from "drizzle-orm";
import { getDb } from "../db";
import { logger } from "../logger";

/** ALTER TABLE statements for the new crew_members columns. We add
 *  columns in dependent order; each statement uses ADD COLUMN IF NOT
 *  EXISTS so re-runs are no-ops. MySQL 8 supports IF NOT EXISTS for
 *  ADD COLUMN. */
const CREW_MEMBERS_COLUMNS_SQL: string[] = [
  "ALTER TABLE `crew_members` ADD COLUMN IF NOT EXISTS `productionPath` VARCHAR(16) NULL",
  "ALTER TABLE `crew_members` ADD COLUMN IF NOT EXISTS `archetype` VARCHAR(24) NULL",
  "ALTER TABLE `crew_members` ADD COLUMN IF NOT EXISTS `biography` JSON NOT NULL",
  "ALTER TABLE `crew_members` ADD COLUMN IF NOT EXISTS `personalQuestStage` INT NOT NULL DEFAULT 0",
  "ALTER TABLE `crew_members` ADD COLUMN IF NOT EXISTS `personalQuestResolution` VARCHAR(16) NULL",
  "ALTER TABLE `crew_members` ADD COLUMN IF NOT EXISTS `cloneDegradation` INT NOT NULL DEFAULT 0",
  "ALTER TABLE `crew_members` ADD COLUMN IF NOT EXISTS `resurrectedFromId` VARCHAR(64) NULL",
  "ALTER TABLE `crew_members` ADD COLUMN IF NOT EXISTS `boundStoneId` VARCHAR(64) NULL",
  "ALTER TABLE `crew_members` ADD COLUMN IF NOT EXISTS `corruption` INT NOT NULL DEFAULT 0",
  "ALTER TABLE `crew_members` ADD COLUMN IF NOT EXISTS `linkedNpcKey` VARCHAR(32) NULL",
];

const BLOOD_WEAVE_ALIGNMENT_SQL = `
CREATE TABLE IF NOT EXISTS \`blood_weave_alignment\` (
  \`id\` INT AUTO_INCREMENT NOT NULL,
  \`userId\` INT NOT NULL,
  \`resurrectionsPerformed\` INT NOT NULL DEFAULT 0,
  \`alignmentValue\` INT NOT NULL DEFAULT 0,
  \`revealedEntries\` JSON NOT NULL,
  \`strippedEntries\` JSON NOT NULL,
  \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT \`blood_weave_alignment_id\` PRIMARY KEY(\`id\`),
  CONSTRAINT \`blood_weave_alignment_userId_unique\` UNIQUE(\`userId\`),
  CONSTRAINT \`blood_weave_alignment_userId_users_id_fk\`
    FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
)
`;

const APPRENTICE_PERSONAL_QUEST_PROGRESS_SQL = `
CREATE TABLE IF NOT EXISTS \`apprentice_personal_quest_progress\` (
  \`id\` INT AUTO_INCREMENT NOT NULL,
  \`userId\` INT NOT NULL,
  \`memberKey\` VARCHAR(64) NOT NULL,
  \`archetype\` VARCHAR(24) NOT NULL,
  \`stage\` INT NOT NULL DEFAULT 0,
  \`resolution\` VARCHAR(16) NULL,
  \`stageStartedAt\` JSON NOT NULL,
  \`flags\` JSON NOT NULL,
  \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT \`apprentice_personal_quest_progress_id\` PRIMARY KEY(\`id\`),
  CONSTRAINT \`uq_apq_user_member\` UNIQUE(\`userId\`, \`memberKey\`),
  CONSTRAINT \`apq_userId_users_id_fk\`
    FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
  INDEX \`idx_apq_user\` (\`userId\`)
)
`;

const APPRENTICE_GIFT_LOG_SQL = `
CREATE TABLE IF NOT EXISTS \`apprentice_gift_log\` (
  \`id\` INT AUTO_INCREMENT NOT NULL,
  \`userId\` INT NOT NULL,
  \`memberKey\` VARCHAR(64) NOT NULL,
  \`giftId\` VARCHAR(64) NOT NULL,
  \`bondDelta\` INT NOT NULL,
  \`reaction\` VARCHAR(16) NOT NULL,
  \`givenAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT \`apprentice_gift_log_id\` PRIMARY KEY(\`id\`),
  CONSTRAINT \`agl_userId_users_id_fk\`
    FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
  INDEX \`idx_agl_user_member\` (\`userId\`, \`memberKey\`)
)
`;

const NPC_WORLD_DEATH_STATE_SQL = `
CREATE TABLE IF NOT EXISTS \`npc_world_death_state\` (
  \`id\` INT AUTO_INCREMENT NOT NULL,
  \`userId\` INT NOT NULL,
  \`npcKey\` VARCHAR(32) NOT NULL,
  \`killedMemberKey\` VARCHAR(64) NOT NULL,
  \`diedAtCycle\` INT NOT NULL,
  \`diedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT \`npc_world_death_state_id\` PRIMARY KEY(\`id\`),
  CONSTRAINT \`uq_nwds_user_npc\` UNIQUE(\`userId\`, \`npcKey\`),
  CONSTRAINT \`nwds_userId_users_id_fk\`
    FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
  INDEX \`idx_nwds_user\` (\`userId\`)
)
`;

const APPRENTICE_ROMANCE_ARC_SQL = `
CREATE TABLE IF NOT EXISTS \`apprentice_romance_arc\` (
  \`id\` INT AUTO_INCREMENT NOT NULL,
  \`userId\` INT NOT NULL,
  \`memberKeyA\` VARCHAR(64) NOT NULL,
  \`memberKeyB\` VARCHAR(64) NOT NULL,
  \`stage\` VARCHAR(16) NOT NULL DEFAULT 'spark',
  \`loredexEntryId\` VARCHAR(96) NULL,
  \`startedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT \`apprentice_romance_arc_id\` PRIMARY KEY(\`id\`),
  CONSTRAINT \`uq_ara_user_pair\` UNIQUE(\`userId\`, \`memberKeyA\`, \`memberKeyB\`),
  CONSTRAINT \`ara_userId_users_id_fk\`
    FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
  INDEX \`idx_ara_user\` (\`userId\`)
)
`;

const RECRUITMENT_QUEST_PROGRESS_SQL = `
CREATE TABLE IF NOT EXISTS \`recruitment_quest_progress\` (
  \`id\` INT AUTO_INCREMENT NOT NULL,
  \`userId\` INT NOT NULL,
  \`npcKey\` VARCHAR(32) NOT NULL,
  \`currentStageId\` VARCHAR(64) NULL,
  \`choiceHistory\` JSON NOT NULL,
  \`flagsSet\` JSON NOT NULL,
  \`outcome\` VARCHAR(32) NULL,
  \`recruitModifiers\` JSON NULL,
  \`startedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`resolvedAt\` TIMESTAMP NULL,
  \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT \`recruitment_quest_progress_id\` PRIMARY KEY(\`id\`),
  CONSTRAINT \`uq_rqp_user_npc\` UNIQUE(\`userId\`, \`npcKey\`),
  CONSTRAINT \`rqp_userId_users_id_fk\`
    FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
  INDEX \`idx_rqp_user\` (\`userId\`)
)
`;

export async function bootstrapUnifiedRosterTables(): Promise<void> {
  const db = await getDb();
  if (!db) {
    logger.info(
      "[unifiedRosterBootstrap] DB not configured; skipping bootstrap",
    );
    return;
  }
  try {
    for (const stmt of CREW_MEMBERS_COLUMNS_SQL) {
      try {
        await db.execute(sql.raw(stmt));
      } catch (e) {
        // Some MySQL versions don't support IF NOT EXISTS on ADD COLUMN.
        // The error is non-fatal — duplicate-column errors mean we're
        // already migrated. Other errors are logged but don't block boot.
        const msg = (e as Error).message ?? "";
        if (
          !msg.includes("Duplicate column") &&
          !msg.includes("duplicate column")
        ) {
          logger.warn(
            "[unifiedRosterBootstrap] non-fatal column add error",
            { err: msg, stmt },
          );
        }
      }
    }
    await db.execute(sql.raw(BLOOD_WEAVE_ALIGNMENT_SQL));
    await db.execute(sql.raw(APPRENTICE_PERSONAL_QUEST_PROGRESS_SQL));
    await db.execute(sql.raw(APPRENTICE_GIFT_LOG_SQL));
    await db.execute(sql.raw(NPC_WORLD_DEATH_STATE_SQL));
    await db.execute(sql.raw(APPRENTICE_ROMANCE_ARC_SQL));
    await db.execute(sql.raw(RECRUITMENT_QUEST_PROGRESS_SQL));
    logger.info("[unifiedRosterBootstrap] tables ensured");
  } catch (err) {
    logger.error(
      "[unifiedRosterBootstrap] failed",
      { err: (err as Error).message },
    );
  }
}
