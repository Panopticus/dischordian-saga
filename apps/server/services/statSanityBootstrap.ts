/* ═══════════════════════════════════════════════════════
   STAT SANITY CHECK CONSTRAINTS BOOTSTRAP

   Migration 0064 adds non-negativity CHECK constraints on the
   primary currency / score columns. Bootstrapped on startup since
   `_journal.json` drift means new migrations don't always land
   via drizzle-kit migrate.

   IF NOT EXISTS isn't supported on ADD CONSTRAINT in MySQL, so
   we parse and swallow "Duplicate constraint" / "Duplicate key"
   errors. Idempotent on second run.

   CHECK constraints require MySQL 8.0.16+. Older versions ignore
   them silently (the ALTER still succeeds; the constraint just
   doesn't enforce). The application-level conditional UPDATEs
   added in G4 are the primary defense; this is defense-in-depth.
   ═══════════════════════════════════════════════════════ */
import { sql } from "drizzle-orm";
import { getDb } from "../db";
import { logger } from "../logger";

const STATEMENTS: { name: string; sql: string }[] = [
  {
    name: "chk_dream_tokens_nonneg",
    sql: "ALTER TABLE `dream_balance` ADD CONSTRAINT `chk_dream_tokens_nonneg` CHECK (`dream_tokens` >= 0)",
  },
  {
    name: "chk_memory_energy_nonneg",
    sql: "ALTER TABLE `memory_energy_balance` ADD CONSTRAINT `chk_memory_energy_nonneg` CHECK (`memory_energy` >= 0)",
  },
  {
    name: "chk_memory_total_spent_nonneg",
    sql: "ALTER TABLE `memory_energy_balance` ADD CONSTRAINT `chk_memory_total_spent_nonneg` CHECK (`total_spent` >= 0)",
  },
  {
    name: "chk_user_progress_level_floor",
    sql: "ALTER TABLE `user_progress` ADD CONSTRAINT `chk_user_progress_level_floor` CHECK (`level` >= 1)",
  },
  {
    name: "chk_user_progress_xp_nonneg",
    sql: "ALTER TABLE `user_progress` ADD CONSTRAINT `chk_user_progress_xp_nonneg` CHECK (`xp` >= 0)",
  },
  {
    name: "chk_user_progress_points_nonneg",
    sql: "ALTER TABLE `user_progress` ADD CONSTRAINT `chk_user_progress_points_nonneg` CHECK (`points` >= 0)",
  },
];

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapStatSanityConstraints(): Promise<void> {
  if (!bootstrapPromise) {
    bootstrapPromise = run();
  }
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
      // MySQL: 1826 = Duplicate constraint name. We also see
      // "already exists" wording across versions.
      if (/duplicate|already exists|exists/i.test(msg)) {
        skipped++;
      } else {
        logger.warn("[StatSanityBootstrap] failed adding constraint", {
          name,
          error: msg,
        });
      }
    }
  }
  if (added > 0 || skipped > 0) {
    logger.info(`[StatSanityBootstrap] added ${added} new, ${skipped} already present`);
  }
}
