/* ═══════════════════════════════════════════════════════
   BATTLE PASS DAILY-XP LEDGER BOOTSTRAP

   Balance F2: battlePass.addXpFromAction was a client-trusted,
   unbounded XP faucet — the declared per-source `dailyCap`
   (battlePassConfig.XP_SOURCES) was never enforced because there
   was nowhere durable to count a source's awards-per-UTC-day.

   schema.ts now declares `battle_pass_progress.dailyXpLedger`
   (JSON). Like the other schema-first columns in this codebase the
   journaled `drizzle-kit migrate` path won't always land it (see
   apps/db/README.md §"Known journal drift"), and Drizzle emits the
   full column list on every SELECT — so a missing column would 500
   every battle_pass_progress read. We add it on startup, guarded by
   an INFORMATION_SCHEMA check so it's a no-op where it already
   exists. Failure is logged, not thrown (matches the other
   bootstraps): the cap then degrades to the rate-limit-only bound
   rather than taking the process down.
   ═══════════════════════════════════════════════════════ */
import { sql } from "drizzle-orm";
import { getDb } from "../db";
import { logger } from "../logger";

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapBattlePassLedger(): Promise<void> {
  if (!bootstrapPromise) {
    bootstrapPromise = run();
  }
  return bootstrapPromise;
}

async function run(): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    const result = (await db.execute(
      sql.raw(
        "SELECT COUNT(*) AS c FROM information_schema.columns " +
          "WHERE table_schema = DATABASE() " +
          "AND table_name = 'battle_pass_progress' " +
          "AND column_name = 'dailyXpLedger'",
      ),
    )) as unknown as [Array<{ c: number | string }>, unknown];
    const rows = Array.isArray(result)
      ? result[0]
      : (result as unknown as Array<{ c: number | string }>);
    const count = Number(rows?.[0]?.c ?? 0);

    if (count === 0) {
      await db.execute(
        sql.raw(
          "ALTER TABLE `battle_pass_progress` " +
            "ADD COLUMN `dailyXpLedger` JSON NULL",
        ),
      );
      logger.info(
        "[BattlePassLedgerBootstrap] added battle_pass_progress.dailyXpLedger",
      );
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn("[BattlePassLedgerBootstrap] ensure failed:", msg);
  }
}
