/* G27 — cohort columns on users (migration 0070).
   Idempotent ALTER TABLE; treats "Duplicate column" errors as
   already-applied. Backfills signupWeek for legacy rows. */
import { sql } from "drizzle-orm";
import { getDb } from "../db";
import { logger } from "../logger";

const STATEMENTS: { name: string; sql: string }[] = [
  { name: "users.signupWeek", sql: "ALTER TABLE `users` ADD COLUMN `signupWeek` VARCHAR(8) NULL" },
  { name: "users.installSource", sql: "ALTER TABLE `users` ADD COLUMN `installSource` VARCHAR(32) NULL" },
  { name: "users.abVariant", sql: "ALTER TABLE `users` ADD COLUMN `abVariant` VARCHAR(64) NULL" },
  { name: "users.signupWeekIdx", sql: "ALTER TABLE `users` ADD INDEX `idx_users_signup_week` (`signupWeek`)" },
];

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapCohortColumns(): Promise<void> {
  if (!bootstrapPromise) bootstrapPromise = run();
  return bootstrapPromise;
}

async function run(): Promise<void> {
  const db = await getDb();
  if (!db) return;
  let added = 0;
  let skipped = 0;
  for (const { name, sql: ddl } of STATEMENTS) {
    try {
      await db.execute(sql.raw(ddl));
      added++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (/duplicate column|already exists|errno: 1060|errno: 1061/i.test(msg)) {
        skipped++;
      } else {
        logger.warn("[CohortColumnsBootstrap] failed", { name, error: msg });
      }
    }
  }
  // Backfill signupWeek for any legacy rows missing it.
  try {
    await db.execute(sql.raw(
      "UPDATE `users` SET `signupWeek` = DATE_FORMAT(`createdAt`, '%x-W%v') WHERE `signupWeek` IS NULL",
    ));
  } catch (err) {
    logger.warn("[CohortColumnsBootstrap] backfill failed", { error: err instanceof Error ? err.message : String(err) });
  }
  if (added > 0 || skipped > 0) {
    logger.info(`[CohortColumnsBootstrap] added ${added}, skipped ${skipped}`);
  }
}
