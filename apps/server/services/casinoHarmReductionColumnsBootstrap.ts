/* audit/16 GA4 + GA2 — harm-reduction columns on casino_state.
   Idempotent ALTER TABLE; treats "Duplicate column" errors as
   already-applied. Two new int counters reset daily by
   ensureCasinoState() in apps/server/routers/casino.ts:
     - dailyLost          — net Dream lost today (GA4 cap = 1000)
     - dailyVoidCasesOpened — case count today (GA2 cap = 5)

   Pattern follows ageVerificationColumnsBootstrap.ts. */
import { sql } from "drizzle-orm";
import { getDb } from "../db";
import { logger } from "../logger";

const STATEMENTS: { name: string; sql: string }[] = [
  {
    name: "casino_state.dailyLost",
    sql: "ALTER TABLE `casino_state` ADD COLUMN `dailyLost` INT NOT NULL DEFAULT 0",
  },
  {
    name: "casino_state.dailyVoidCasesOpened",
    sql: "ALTER TABLE `casino_state` ADD COLUMN `dailyVoidCasesOpened` INT NOT NULL DEFAULT 0",
  },
];

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapCasinoHarmReductionColumns(): Promise<void> {
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
        logger.warn("[CasinoHarmReductionColumnsBootstrap] failed", { name, error: msg });
      }
    }
  }
  if (added > 0 || skipped > 0) {
    logger.info(`[CasinoHarmReductionColumnsBootstrap] added ${added}, skipped ${skipped}`);
  }
}
