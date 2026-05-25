/* ═══════════════════════════════════════════════════════
   CODA FACTION STANDING TABLE BOOTSTRAP

   The `coda_faction_standing` table is new on this branch
   and no drizzle migration ships with it yet — the
   migration journal has drifted (see CLAUDE.md "db:migrate"),
   so production schema is enforced by bootstrap IIFEs at
   cold start. This bootstrap matches the dreamerAwareness,
   chatReports, pvpRatings, etc. patterns.

     - Fresh DB → table is created.
     - DB that already has the table → no-op (CREATE IF NOT EXISTS).
     - DB pool unconfigured (tests / local without MySQL) → no-op.
   ═══════════════════════════════════════════════════════ */
import { sql } from "drizzle-orm";
import { getDb } from "../db";
import { logger } from "../logger";

const CODA_FACTION_STANDING_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`coda_faction_standing\` (
  \`userId\` INT NOT NULL,
  \`tier\` ENUM('unknown','noticed','client','operative','lieutenant','inner_circle') NOT NULL DEFAULT 'unknown',
  \`vexCodaTrust\` INT NOT NULL DEFAULT 0,
  \`missionsCompleted\` INT NOT NULL DEFAULT 0,
  \`reconciliationArcs\` INT NOT NULL DEFAULT 0,
  \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`userId\`),
  CONSTRAINT \`coda_faction_standing_userId_fk\`
    FOREIGN KEY (\`userId\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`;

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapCodaFactionStandingTable(): Promise<void> {
  if (!bootstrapPromise) {
    bootstrapPromise = run();
  }
  return bootstrapPromise;
}

async function run(): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    await db.execute(sql.raw(CODA_FACTION_STANDING_TABLE_SQL));
    logger.info("[CodaFactionStandingBootstrap] table ensured");
  } catch (err) {
    logger.error("[CodaFactionStandingBootstrap] failed to ensure table", err);
  }
}
