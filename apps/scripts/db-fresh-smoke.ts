#!/usr/bin/env npx tsx
/**
 * Fresh-DB smoke test.
 *
 * Exercises the same bootstrap path the production server runs on every
 * boot, against an empty MySQL instance, after `drizzle-kit migrate` has
 * applied the journal-tracked migrations. Designed to run in CI against
 * a service-container MySQL.
 *
 * What this script verifies:
 *   1. `getDb()` returns a connected pool (DATABASE_URL is set + reachable).
 *   2. Both server-startup bootstraps for orphaned migrations succeed:
 *        - bootstrapAnnouncementsTables (mirrors orphan migration 0049)
 *        - bootstrapCitizenSchema       (mirrors orphan migration 0054)
 *   3. The bootstrap-targeted DDL actually landed:
 *        - `announcements` table exists
 *        - `announcement_views` table exists
 *        - `citizen_characters.foundation` column exists (only checked
 *          if the citizen_characters table itself exists; orphan
 *          migrations earlier in the chain may not have run)
 *   4. drizzle-kit migrate left rows in `__drizzle_migrations`
 *      (i.e. the journal-tracked migrations were applied).
 *
 * Why this matters: orphaned migrations (see apps/db/README.md) are
 * invisible to drizzle-kit. The server boots them on startup but there
 * has been no automated guard catching the case where a clean deploy
 * fails because (a) a journal-tracked migration breaks, (b) a bootstrap
 * function regresses, or (c) a new orphan is added without a matching
 * bootstrap. This script is that guard.
 *
 * Usage:
 *   DATABASE_URL=mysql://... pnpm tsx apps/scripts/db-fresh-smoke.ts
 *
 * Exit codes:
 *   0 — all checks passed
 *   1 — at least one check failed; details printed to stderr
 */

import { sql } from "drizzle-orm";
import { getDb } from "../server/db";
import { bootstrapAnnouncementsTables } from "../server/services/announcementsBootstrap";
import { bootstrapCitizenSchema } from "../server/services/citizenSchemaBootstrap";
import { bootstrapWebhookEventsTable } from "../server/services/webhookEventsBootstrap";

interface CheckResult {
  name: string;
  ok: boolean;
  detail?: string;
}

type Db = NonNullable<Awaited<ReturnType<typeof getDb>>>;
type CountRow = { c: number | string };

// Match the canonical pattern in apps/server/services/citizenSchemaBootstrap.ts:
// drizzle's mysql2 db.execute() may surface [rows, fields] or just rows
// depending on the call shape; this narrowing handles both.
async function countQuery(db: Db, query: string): Promise<number> {
  const result = (await db.execute(sql.raw(query))) as unknown as
    | [Array<CountRow>, unknown]
    | Array<CountRow>;
  const rows = Array.isArray(result) && Array.isArray(result[0])
    ? (result[0] as Array<CountRow>)
    : (result as unknown as Array<CountRow>);
  return Number(rows?.[0]?.c ?? 0);
}

async function tableExists(db: Db, name: string): Promise<boolean> {
  const safe = name.replace(/'/g, "''");
  const c = await countQuery(
    db,
    `SELECT COUNT(*) AS c FROM information_schema.tables
     WHERE table_schema = DATABASE() AND table_name = '${safe}'`,
  );
  return c > 0;
}

async function columnExists(db: Db, table: string, column: string): Promise<boolean> {
  const t = table.replace(/'/g, "''");
  const col = column.replace(/'/g, "''");
  const c = await countQuery(
    db,
    `SELECT COUNT(*) AS c FROM information_schema.columns
     WHERE table_schema = DATABASE() AND table_name = '${t}' AND column_name = '${col}'`,
  );
  return c > 0;
}

async function migrationsTableHasRows(db: Db): Promise<boolean> {
  try {
    const c = await countQuery(db, "SELECT COUNT(*) AS c FROM `__drizzle_migrations`");
    return c > 0;
  } catch {
    return false;
  }
}

async function main(): Promise<void> {
  const checks: CheckResult[] = [];

  if (!process.env.DATABASE_URL) {
    console.error("[db-fresh-smoke] FAIL: DATABASE_URL is not set");
    process.exit(1);
  }

  // 1. Pool reachability
  const db = await getDb();
  if (!db) {
    console.error("[db-fresh-smoke] FAIL: getDb() returned null — pool did not connect");
    process.exit(1);
  }
  checks.push({ name: "getDb() returns connected pool", ok: true });

  // 2. drizzle-kit migrate applied something
  const migrationsApplied = await migrationsTableHasRows(db);
  checks.push({
    name: "__drizzle_migrations has rows",
    ok: migrationsApplied,
    detail: migrationsApplied
      ? undefined
      : "table missing or empty — drizzle-kit migrate did not run before this script",
  });

  // 3. Run the orphan-migration bootstraps the server runs on boot
  try {
    await bootstrapAnnouncementsTables();
    checks.push({ name: "bootstrapAnnouncementsTables() succeeded", ok: true });
  } catch (e) {
    checks.push({
      name: "bootstrapAnnouncementsTables() succeeded",
      ok: false,
      detail: e instanceof Error ? e.message : String(e),
    });
  }
  try {
    await bootstrapCitizenSchema();
    checks.push({ name: "bootstrapCitizenSchema() succeeded", ok: true });
  } catch (e) {
    checks.push({
      name: "bootstrapCitizenSchema() succeeded",
      ok: false,
      detail: e instanceof Error ? e.message : String(e),
    });
  }
  try {
    await bootstrapWebhookEventsTable();
    checks.push({ name: "bootstrapWebhookEventsTable() succeeded", ok: true });
  } catch (e) {
    checks.push({
      name: "bootstrapWebhookEventsTable() succeeded",
      ok: false,
      detail: e instanceof Error ? e.message : String(e),
    });
  }

  // 4. Verify the bootstrap-targeted DDL landed
  for (const tableName of ["announcements", "announcement_views", "processed_webhook_events"]) {
    const ok = await tableExists(db, tableName);
    checks.push({ name: `${tableName} table exists`, ok });
  }

  // citizen_characters itself ships in an orphan migration earlier in the
  // chain; only check the bootstrap-added column if the table is present.
  const citizenTableExists = await tableExists(db, "citizen_characters");
  if (citizenTableExists) {
    const foundationOk = await columnExists(db, "citizen_characters", "foundation");
    checks.push({
      name: "citizen_characters.foundation column exists",
      ok: foundationOk,
    });
  } else {
    checks.push({
      name: "citizen_characters table present (skipped — table not in fresh DB)",
      ok: true,
      detail: "table ships in an earlier orphan migration; bootstrap is no-op without it",
    });
  }

  const failed = checks.filter((c) => !c.ok);
  for (const c of checks) {
    const tag = c.ok ? "PASS" : "FAIL";
    const detail = c.detail ? ` — ${c.detail}` : "";
    console.log(`[db-fresh-smoke] ${tag}: ${c.name}${detail}`);
  }

  if (failed.length > 0) {
    console.error(`[db-fresh-smoke] ${failed.length} check(s) failed`);
    process.exit(1);
  }
  console.log(`[db-fresh-smoke] all ${checks.length} checks passed`);
  process.exit(0);
}

main().catch((e) => {
  console.error("[db-fresh-smoke] unexpected error:", e);
  process.exit(1);
});
