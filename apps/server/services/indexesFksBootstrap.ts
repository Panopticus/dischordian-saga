/* G16/G17 — composite indexes + FKs on new tables.
   Idempotent on second run: ALTER TABLE … ADD INDEX/CONSTRAINT
   that's already present is logged as "skipped". */
import { sql } from "drizzle-orm";
import { getDb } from "../db";
import { logger } from "../logger";

const STATEMENTS: { name: string; sql: string }[] = [
  {
    name: "idx_pvp_lb_last_match_at",
    sql: "ALTER TABLE `pvp_leaderboard` ADD INDEX `idx_pvp_lb_last_match_at` (`last_match_at`)",
  },
  {
    name: "idx_card_trades_pair",
    sql: "ALTER TABLE `card_trades` ADD INDEX `idx_card_trades_pair` (`buyer_user_id`, `seller_user_id`, `created_at`)",
  },
  {
    name: "idx_crafting_log_user_created",
    sql: "ALTER TABLE `crafting_log` ADD INDEX `idx_crafting_log_user_created` (`user_id`, `created_at`)",
  },
  {
    name: "idx_analytics_events_name_created",
    sql: "ALTER TABLE `analytics_events` ADD INDEX `idx_analytics_events_name_created` (`event_name`, `created_at`)",
  },
  {
    name: "fk_user_agreements_user",
    sql: "ALTER TABLE `user_agreements` ADD CONSTRAINT `fk_user_agreements_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
  },
  {
    name: "fk_user_two_factor_user",
    sql: "ALTER TABLE `user_two_factor` ADD CONSTRAINT `fk_user_two_factor_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
  },
  {
    name: "fk_user_sessions_user",
    sql: "ALTER TABLE `user_sessions` ADD CONSTRAINT `fk_user_sessions_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
  },
];

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapIndexesAndFks(): Promise<void> {
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
      if (/duplicate|already exists|errno: 121|errno: 1061/i.test(msg)) {
        skipped++;
      } else {
        // FK addition can fail if the parent table doesn't exist yet
        // (table creation order). Treat as recoverable for the
        // bootstrap path; the migration file is the authoritative
        // copy.
        logger.warn("[IndexesFksBootstrap] failed adding object", { name, error: msg });
      }
    }
  }
  if (added > 0 || skipped > 0) {
    logger.info(`[IndexesFksBootstrap] added ${added} new, ${skipped} already present`);
  }
}
