/* ═══════════════════════════════════════════════════════
   APPRENTICE PEDAGOGY — TABLE BOOTSTRAP

   Six tables backing the doctrine / audit / forge / memory /
   cohort / mission system shipped in apps/shared/apprentice*.ts.

   Migration journal is currently drifted (see
   apps/db/migrations/migration-drift.baseline.json), so new
   tables get the same idempotent CREATE-IF-NOT-EXISTS
   bootstrap pattern that announcements / chatReports /
   communityDiscoveryEvents use. Every statement is a no-op
   when the table already exists; safe to run on every
   cold-boot.
   ═══════════════════════════════════════════════════════ */
import { sql } from "drizzle-orm";
import { getDb } from "../db";
import { logger } from "../logger";

const DOCTRINE_SELECTIONS_SQL = `
CREATE TABLE IF NOT EXISTS \`apprentice_doctrine_selections\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`userId\` INT NOT NULL,
  \`apprenticeId\` VARCHAR(64) NOT NULL,
  \`doctrineId\` VARCHAR(32) NOT NULL,
  \`mentorProfessorId\` VARCHAR(32),
  \`mechronisHouseId\` VARCHAR(32),
  \`initialArchitectInfluence\` INT NOT NULL DEFAULT 0,
  \`pickedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uq_apprentice_doctrine_user_apprentice\` (\`userId\`, \`apprenticeId\`),
  INDEX \`idx_apprentice_doctrine_user\` (\`userId\`),
  CONSTRAINT \`fk_apprentice_doctrine_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`;

const AUDIT_LOG_SQL = `
CREATE TABLE IF NOT EXISTS \`apprentice_mechronis_audit_log\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`userId\` INT NOT NULL,
  \`apprenticeId\` VARCHAR(64) NOT NULL,
  \`auditDay\` INT NOT NULL,
  \`classification\` VARCHAR(16) NOT NULL,
  \`publicTranscript\` TEXT NOT NULL,
  \`privateTranscript\` TEXT NOT NULL,
  \`bondDelta\` INT NOT NULL DEFAULT 0,
  \`corruptionDelta\` INT NOT NULL DEFAULT 0,
  \`architectInfluenceDelta\` INT NOT NULL DEFAULT 0,
  \`inheritedLineFired\` TINYINT NOT NULL DEFAULT 0,
  \`ranAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uq_apprentice_audit_user_apprentice_day\` (\`userId\`, \`apprenticeId\`, \`auditDay\`),
  INDEX \`idx_apprentice_audit_user\` (\`userId\`),
  CONSTRAINT \`fk_apprentice_audit_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`;

const SIGNATURE_CARDS_SQL = `
CREATE TABLE IF NOT EXISTS \`apprentice_signature_cards\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`userId\` INT NOT NULL,
  \`apprenticeId\` VARCHAR(64) NOT NULL,
  \`cardId\` VARCHAR(96) NOT NULL,
  \`doctrineId\` VARCHAR(32) NOT NULL,
  \`pickedSlotId\` VARCHAR(64) NOT NULL,
  \`bondAtForge\` INT NOT NULL,
  \`corruptionAtForge\` INT NOT NULL,
  \`architectInfluenceAtForge\` INT NOT NULL,
  \`architectCoopted\` TINYINT NOT NULL DEFAULT 0,
  \`cardPayload\` JSON NOT NULL,
  \`forgedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uq_signature_card_user_apprentice\` (\`userId\`, \`apprenticeId\`),
  UNIQUE KEY \`uq_signature_card_user_cardid\` (\`userId\`, \`cardId\`),
  INDEX \`idx_signature_card_user\` (\`userId\`),
  CONSTRAINT \`fk_signature_card_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`;

const MEMORY_CARDS_SQL = `
CREATE TABLE IF NOT EXISTS \`apprentice_memory_cards\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`userId\` INT NOT NULL,
  \`memoryCardId\` VARCHAR(96) NOT NULL,
  \`deceasedApprenticeId\` VARCHAR(64) NOT NULL,
  \`deceasedName\` VARCHAR(96) NOT NULL,
  \`archetype\` VARCHAR(32) NOT NULL,
  \`doctrineId\` VARCHAR(32),
  \`finalBond\` INT NOT NULL,
  \`finalCorruption\` INT NOT NULL,
  \`daysSurvived\` INT NOT NULL,
  \`cause\` VARCHAR(256) NOT NULL,
  \`finalArchitectInfluence\` INT NOT NULL DEFAULT 0,
  \`consumedAt\` TIMESTAMP NULL,
  \`consumedByApprenticeId\` VARCHAR(64),
  \`mintedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uq_memory_card_user_cardid\` (\`userId\`, \`memoryCardId\`),
  INDEX \`idx_memory_card_user\` (\`userId\`),
  INDEX \`idx_memory_card_consumed\` (\`consumedByApprenticeId\`),
  CONSTRAINT \`fk_memory_card_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`;

const COHORT_SLOTS_SQL = `
CREATE TABLE IF NOT EXISTS \`apprentice_cohort_slots\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`userId\` INT NOT NULL UNIQUE,
  \`activeApprenticeId\` VARCHAR(64),
  \`activeDoctrineId\` VARCHAR(32),
  \`activeFilledAt\` TIMESTAMP NULL,
  \`trainingAApprenticeId\` VARCHAR(64),
  \`trainingADoctrineId\` VARCHAR(32),
  \`trainingAFilledAt\` TIMESTAMP NULL,
  \`trainingBApprenticeId\` VARCHAR(64),
  \`trainingBDoctrineId\` VARCHAR(32),
  \`trainingBFilledAt\` TIMESTAMP NULL,
  \`totalRecruited\` INT NOT NULL DEFAULT 0,
  \`totalGraduated\` INT NOT NULL DEFAULT 0,
  \`totalFallen\` INT NOT NULL DEFAULT 0,
  \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  INDEX \`idx_cohort_slots_user\` (\`userId\`),
  CONSTRAINT \`fk_cohort_slots_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`;

const MISSION_INSTANCES_SQL = `
CREATE TABLE IF NOT EXISTS \`apprentice_mission_instances\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`userId\` INT NOT NULL,
  \`apprenticeId\` VARCHAR(64) NOT NULL,
  \`missionTypeId\` VARCHAR(64) NOT NULL,
  \`role\` VARCHAR(32) NOT NULL,
  \`stage\` VARCHAR(16) NOT NULL DEFAULT 'briefed',
  \`resolvedChoiceId\` VARCHAR(64),
  \`bondDelta\` INT NOT NULL DEFAULT 0,
  \`corruptionDelta\` INT NOT NULL DEFAULT 0,
  \`architectInfluenceDelta\` INT NOT NULL DEFAULT 0,
  \`rewardMultiplierApplied\` INT NOT NULL DEFAULT 100,
  \`briefedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`resolvedAt\` TIMESTAMP NULL,
  PRIMARY KEY (\`id\`),
  INDEX \`idx_mission_instances_user\` (\`userId\`),
  INDEX \`idx_mission_instances_user_stage\` (\`userId\`, \`stage\`),
  INDEX \`idx_mission_instances_apprentice\` (\`apprenticeId\`),
  CONSTRAINT \`fk_mission_instances_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`;

const TABLES = [
  ["apprentice_doctrine_selections", DOCTRINE_SELECTIONS_SQL],
  ["apprentice_mechronis_audit_log", AUDIT_LOG_SQL],
  ["apprentice_signature_cards", SIGNATURE_CARDS_SQL],
  ["apprentice_memory_cards", MEMORY_CARDS_SQL],
  ["apprentice_cohort_slots", COHORT_SLOTS_SQL],
  ["apprentice_mission_instances", MISSION_INSTANCES_SQL],
] as const;

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapApprenticePedagogyTables(): Promise<void> {
  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      const db = await getDb();
      if (!db) {
        logger.warn("[apprentice-pedagogy-bootstrap] db unavailable; skipping");
        return;
      }
      for (const [name, ddl] of TABLES) {
        try {
          await db.execute(sql.raw(ddl));
        } catch (err) {
          logger.error(
            `[apprentice-pedagogy-bootstrap] failed creating ${name}: ${(err as Error).message}`,
          );
        }
      }
    })();
  }
  return bootstrapPromise;
}
