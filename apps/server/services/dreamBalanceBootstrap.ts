/* ═══════════════════════════════════════════════════════
   DREAM_BALANCE.DIFFICULTYMODIFIER COLUMN BOOTSTRAP

   Migration 0057 (apps/db/0057_dream_balance_difficulty_modifier.sql)
   adds a `difficultyModifier INT NOT NULL DEFAULT 0` column to
   `dream_balance` for the hidden Game-Master difficulty scalar
   read by apps/shared/tcg-core/story/encounter.ts. Like 0054-0056,
   this migration is orphaned from `_journal.json` under the journal-
   drift situation in apps/db/README.md, so `drizzle-kit migrate`
   skips it on Railway deploys.

   The bootstrap below runs the same idempotent DDL on server
   startup. Without it, every `select()` against `dream_balance`
   fails with "Unknown column 'difficultyModifier'" — including
   `myDreamBalance` and the boss-difficulty read in the encounter
   builder — which surfaces as a load-time error on the Bridge,
   store, and character-sheet panels.

   - A fresh DB has no `difficultyModifier` → ALTER runs → column
     added with a 0 default for existing rows.
   - A DB that already has the column → information_schema hit
     short-circuits → no-op.
   - DB pool not configured (tests / local without MySQL) →
     short-circuit at `getDb()`.
   ═══════════════════════════════════════════════════════ */
import { sql } from "drizzle-orm";
import { getDb } from "../db";
import { logger } from "../logger";

const COLUMN_PROBE_SQL = `
SELECT COUNT(*) AS present
FROM information_schema.columns
WHERE table_schema = DATABASE()
  AND table_name = 'dream_balance'
  AND column_name = 'difficultyModifier'
`;

const ADD_COLUMN_SQL = `
ALTER TABLE \`dream_balance\`
  ADD COLUMN \`difficultyModifier\` INT NOT NULL DEFAULT 0 AFTER \`totalDreamEarned\`
`;

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapDreamBalanceDifficultyModifier(): Promise<void> {
  if (!bootstrapPromise) {
    bootstrapPromise = run();
  }
  return bootstrapPromise;
}

async function run(): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    const probe = (await db.execute(sql.raw(COLUMN_PROBE_SQL))) as unknown as
      | [Array<{ present: number | bigint }>, unknown]
      | { rows: Array<{ present: number | bigint }> };
    const rows: Array<{ present: number | bigint }> = Array.isArray(probe)
      ? probe[0]
      : probe.rows;
    const present = Number(rows[0]?.present ?? 0);
    if (present > 0) {
      logger.info("[DreamBalanceBootstrap] difficultyModifier column already present");
      return;
    }

    await db.execute(sql.raw(ADD_COLUMN_SQL));
    logger.info("[DreamBalanceBootstrap] difficultyModifier column added");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn(
      "[DreamBalanceBootstrap] difficultyModifier column ensure failed — myDreamBalance reads may error: " +
        msg,
    );
  }
}
