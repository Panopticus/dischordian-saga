/* ═══════════════════════════════════════════════════════
   NEMESIS TABLES BOOTSTRAP

   The three Nemesis tables (nemesis_state, nemesis_memory,
   nemesis_plans) are new on this branch; no drizzle migration
   ships with them yet, so a fresh-DB deploy would lose the
   substrate that powers the cohort-rival system. This
   bootstrap runs the idempotent DDL on server startup as the
   safety net (matching the announcementsBootstrap,
   citizenSchemaBootstrap, dreamerAwarenessBootstrap,
   pvp_ratings, chat_reports, and purchase_grants patterns).

     - Fresh DB → tables are created.
     - DB that already has them → no-op.
     - DB where they were applied manually → no-op (matching
       schema).

   If the DB pool isn't configured (tests / local without
   MySQL) the bootstrap short-circuits.

   The DDL mirrors the Drizzle schema in apps/db/schema.ts
   (the three exports `nemesisState`, `nemesisMemory`,
   `nemesisPlans`). If those schemas change, update the DDL
   here in lock-step.
   ═══════════════════════════════════════════════════════ */
import { sql } from "drizzle-orm";
import { getDb } from "../db";
import { logger } from "../logger";

const NEMESIS_STATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`nemesis_state\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`nemesisId\` VARCHAR(64) NOT NULL,
  \`userId\` INT NOT NULL,
  \`cohortNumber\` INT NOT NULL,
  \`apprenticeArchetype\` VARCHAR(32) NOT NULL,
  \`nemesisArchetype\` VARCHAR(32) NOT NULL,
  \`archetypeTitle\` VARCHAR(64) NOT NULL,
  \`properName\` VARCHAR(96) NOT NULL,
  \`nameRevealed\` INT NOT NULL DEFAULT 0,
  \`politicianTic\` VARCHAR(64) NOT NULL,
  \`rank\` TINYINT NOT NULL DEFAULT 1,
  \`grudgeTier\` TINYINT NOT NULL DEFAULT 0,
  \`preferredSurface\` VARCHAR(32) NOT NULL,
  \`alignedFaction\` VARCHAR(32) NOT NULL DEFAULT 'hierarchy',
  \`retired\` INT NOT NULL DEFAULT 0,
  \`lieutenantOfNemesisId\` VARCHAR(64) NULL,
  \`spawnedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`lastEncounterAt\` TIMESTAMP NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_nemesis_state_nemesis_id\` (\`nemesisId\`),
  UNIQUE KEY \`uniq_nemesis_state_user_cohort\` (\`userId\`, \`cohortNumber\`),
  KEY \`idx_nemesis_state_user\` (\`userId\`),
  KEY \`idx_nemesis_state_user_active\` (\`userId\`, \`retired\`),
  KEY \`idx_nemesis_state_faction\` (\`alignedFaction\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`;

/** Idempotent ALTERs for older deploys whose nemesis_state
 *  was created before Phase K columns shipped. Each ALTER
 *  uses IF NOT EXISTS where MySQL supports it; otherwise
 *  the failure is swallowed (column already present). */
const NEMESIS_STATE_PHASE_K_ALTERS = [
  "ALTER TABLE `nemesis_state` ADD COLUMN `alignedFaction` VARCHAR(32) NOT NULL DEFAULT 'hierarchy'",
  "ALTER TABLE `nemesis_state` ADD COLUMN `retired` INT NOT NULL DEFAULT 0",
  "ALTER TABLE `nemesis_state` ADD COLUMN `lieutenantOfNemesisId` VARCHAR(64) NULL",
  // Phase K Wave 4
  "ALTER TABLE `nemesis_state` ADD COLUMN `nemesisSequence` INT NOT NULL DEFAULT 1",
  "ALTER TABLE `nemesis_state` ADD COLUMN `nameRevealAcknowledged` INT NOT NULL DEFAULT 0",
  "ALTER TABLE `nemesis_state` ADD INDEX `idx_nemesis_state_user_active` (`userId`, `retired`)",
  "ALTER TABLE `nemesis_state` ADD INDEX `idx_nemesis_state_faction` (`alignedFaction`)",
];

const NEMESIS_POWER_UP_EFFECTS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`nemesis_power_up_effects\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`effectId\` VARCHAR(96) NOT NULL,
  \`userId\` INT NOT NULL,
  \`nemesisId\` VARCHAR(64) NOT NULL,
  \`planId\` VARCHAR(96) NOT NULL,
  \`effectKind\` VARCHAR(64) NOT NULL,
  \`payload\` JSON,
  \`expiresAt\` TIMESTAMP NOT NULL,
  \`consumedAt\` TIMESTAMP NULL,
  \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_nemesis_power_up_effect_id\` (\`effectId\`),
  KEY \`idx_nemesis_power_up_user_active\` (\`userId\`, \`expiresAt\`),
  KEY \`idx_nemesis_power_up_kind_user\` (\`effectKind\`, \`userId\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`;

const NEMESIS_MEMORY_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`nemesis_memory\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`memoryId\` VARCHAR(96) NOT NULL,
  \`nemesisId\` VARCHAR(64) NOT NULL,
  \`userId\` INT NOT NULL,
  \`sequence\` INT NOT NULL,
  \`encounterKind\` VARCHAR(64) NOT NULL,
  \`source\` VARCHAR(32) NOT NULL,
  \`quoteOpening\` TEXT NOT NULL,
  \`playerContext\` JSON,
  \`renderedAt\` TIMESTAMP NULL,
  \`choiceFlag\` VARCHAR(96) NULL,
  \`recordedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_nemesis_memory_id\` (\`memoryId\`),
  UNIQUE KEY \`uniq_nemesis_memory_nemesis_seq\` (\`nemesisId\`, \`sequence\`),
  KEY \`idx_nemesis_memory_nemesis_id\` (\`nemesisId\`),
  KEY \`idx_nemesis_memory_user_kind\` (\`userId\`, \`encounterKind\`),
  KEY \`idx_nemesis_memory_user_pending\` (\`userId\`, \`renderedAt\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`;

const NEMESIS_MEMORY_PHASE_K_ALTERS = [
  "ALTER TABLE `nemesis_memory` ADD COLUMN `renderedAt` TIMESTAMP NULL",
  "ALTER TABLE `nemesis_memory` ADD COLUMN `choiceFlag` VARCHAR(96) NULL",
  "ALTER TABLE `nemesis_memory` ADD INDEX `idx_nemesis_memory_user_pending` (`userId`, `renderedAt`)",
];

const NEMESIS_PLANS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`nemesis_plans\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`planId\` VARCHAR(96) NOT NULL,
  \`nemesisId\` VARCHAR(64) NOT NULL,
  \`userId\` INT NOT NULL,
  \`sequence\` INT NOT NULL,
  \`kind\` VARCHAR(64) NOT NULL,
  \`targetSurface\` VARCHAR(32) NOT NULL,
  \`targetDetail\` VARCHAR(128) NOT NULL,
  \`loreTitle\` VARCHAR(256) NOT NULL,
  \`rewardOnSuccess\` VARCHAR(64) NOT NULL,
  \`status\` VARCHAR(16) NOT NULL DEFAULT 'spawned',
  \`spawnedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`ticksAt\` TIMESTAMP NOT NULL,
  \`resolvedAt\` TIMESTAMP NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_nemesis_plans_plan_id\` (\`planId\`),
  UNIQUE KEY \`uniq_nemesis_plans_nemesis_seq\` (\`nemesisId\`, \`sequence\`),
  KEY \`idx_nemesis_plans_nemesis_id\` (\`nemesisId\`),
  KEY \`idx_nemesis_plans_user_status\` (\`userId\`, \`status\`),
  KEY \`idx_nemesis_plans_status_ticks\` (\`status\`, \`ticksAt\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`;

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapNemesisTables(): Promise<void> {
  if (!bootstrapPromise) {
    bootstrapPromise = run();
  }
  return bootstrapPromise;
}

async function run(): Promise<void> {
  const db = await getDb();
  if (!db) return;

  for (const [name, ddl] of [
    ["nemesis_state", NEMESIS_STATE_TABLE_SQL],
    ["nemesis_memory", NEMESIS_MEMORY_TABLE_SQL],
    ["nemesis_plans", NEMESIS_PLANS_TABLE_SQL],
    ["nemesis_power_up_effects", NEMESIS_POWER_UP_EFFECTS_TABLE_SQL],
  ] as const) {
    try {
      await db.execute(sql.raw(ddl));
      logger.info(`[NemesisBootstrap] ${name} ensured`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.warn(
        `[NemesisBootstrap] ${name} ensure failed — Nemesis system may be unavailable:`,
        msg,
      );
    }
  }

  // Phase K columns on nemesis_state — ALTERs that fail
  // because the column/index already exists are expected
  // and silently skipped.
  for (const alter of NEMESIS_STATE_PHASE_K_ALTERS) {
    try {
      await db.execute(sql.raw(alter));
    } catch (_err) {
      // Column/index already present; ignore.
    }
  }
  // Phase K Wave 6 — nemesis_memory.renderedAt + choiceFlag.
  for (const alter of NEMESIS_MEMORY_PHASE_K_ALTERS) {
    try {
      await db.execute(sql.raw(alter));
    } catch (_err) {
      // Column/index already present; ignore.
    }
  }
}
