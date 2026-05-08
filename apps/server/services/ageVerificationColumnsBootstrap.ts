/* audit/15.R4 — age-verification columns on users.
   Idempotent ALTER TABLE; treats "Duplicate column" / "Duplicate key"
   errors as already-applied. The schema declared these columns ahead
   of any journaled migration, so production tables built from earlier
   bootstraps are missing them and the OAuth upsert fails with
   "Unknown column" on first login. */
import { sql } from "drizzle-orm";
import { getDb } from "../db";
import { logger } from "../logger";

const STATEMENTS: { name: string; sql: string }[] = [
  { name: "users.dateOfBirth", sql: "ALTER TABLE `users` ADD COLUMN `dateOfBirth` VARCHAR(10) NULL" },
  { name: "users.ageVerificationCountry", sql: "ALTER TABLE `users` ADD COLUMN `ageVerificationCountry` VARCHAR(2) NULL" },
  { name: "users.ageVerifiedAt", sql: "ALTER TABLE `users` ADD COLUMN `ageVerifiedAt` TIMESTAMP NULL" },
  { name: "users.ageVerifiedIdx", sql: "ALTER TABLE `users` ADD INDEX `idx_users_age_verified` (`ageVerifiedAt`)" },
];

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapAgeVerificationColumns(): Promise<void> {
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
        logger.warn("[AgeVerificationColumnsBootstrap] failed", { name, error: msg });
      }
    }
  }
  if (added > 0 || skipped > 0) {
    logger.info(`[AgeVerificationColumnsBootstrap] added ${added}, skipped ${skipped}`);
  }
}
