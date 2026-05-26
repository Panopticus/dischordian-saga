#!/usr/bin/env npx tsx
/**
 * Fresh-DB smoke test.
 *
 * Post-0071_baseline_v1 cutover this script verifies that
 * `drizzle-kit migrate` against a clean MySQL 8 instance produces
 * the schema shapes the server actually queries against. Designed
 * to run in CI against a service-container MySQL, after the
 * migrate step in .github/workflows/ci.yml.
 *
 * What this script verifies:
 *   1. `getDb()` returns a connected pool (DATABASE_URL is set + reachable).
 *   2. `__drizzle_migrations` has a row tagged for the baseline —
 *      proof that drizzle-kit migrate actually ran end-to-end.
 *   3. The full set of critical tables exists (sampled below).
 *   4. The query-critical columns the server relies on exist.
 *
 * Why this matters: it catches the case where db:migrate exits 0
 * but the resulting schema doesn't match schema.ts — a corrupted
 * baseline, a partially-applied migration, or a wrong DATABASE_URL
 * pointed at an un-migrated environment. Pre-cutover, this script
 * also exercised ~30 fire-and-forget bootstrap* IIFEs that
 * compensated for journal drift; those are gone now (see
 * apps/db/migrations/README.md).
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

interface CheckResult {
  name: string;
  ok: boolean;
  detail?: string;
}

type Db = NonNullable<Awaited<ReturnType<typeof getDb>>>;
type CountRow = { c: number | string };

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

/**
 * Sample of query-critical tables and columns. Not an exhaustive
 * list — schema.ts has 322 tables. These are the ones whose
 * absence 500s a hot path: auth, citizen state, billing
 * idempotency, replays, ranked PvP, daily-cap ledgers.
 */
const REQUIRED_TABLES = [
  "users",
  "user_sessions",
  "user_blocks",
  "user_two_factor",
  "user_agreements",
  "announcements",
  "announcement_views",
  "citizen_characters",
  "processed_webhook_events",
  "purchase_grants",
  "battle_pass_progress",
  "casino_state",
  "game_replays",
  "pvp_ratings",
  "chat_reports",
  "support_impersonation_grants",
  "dreamer_awareness",
  "nemesis_state",
  "npc_memory",
  "shadow_tongue_redactions",
  "tick_events",
] as const;

const REQUIRED_COLUMNS: ReadonlyArray<readonly [string, string]> = [
  ["users", "signupWeek"],
  ["users", "dateOfBirth"],
  ["users", "ageVerificationCountry"],
  ["users", "ageVerifiedAt"],
  ["citizen_characters", "foundation"],
  ["game_replays", "shareToken"],
  ["game_replays", "matchId"],
  ["battle_pass_progress", "dailyXpLedger"],
  ["casino_state", "dailyLost"],
  ["casino_state", "dailyVoidCasesOpened"],
];

async function main(): Promise<void> {
  const checks: CheckResult[] = [];

  if (!process.env.DATABASE_URL) {
    console.error("[db-fresh-smoke] FAIL: DATABASE_URL is not set");
    process.exit(1);
    return;
  }

  const db = await getDb();
  if (!db) {
    console.error("[db-fresh-smoke] FAIL: getDb() returned null — pool did not connect");
    process.exit(1);
    return;
  }
  checks.push({ name: "getDb() returns connected pool", ok: true });

  // drizzle-kit migrate must have left at least the baseline row
  // in __drizzle_migrations. Post-cutover this is required: if
  // the row is missing, db:migrate either didn't run or didn't
  // see this DB.
  try {
    const migCount = await countQuery(
      db,
      "SELECT COUNT(*) AS c FROM `__drizzle_migrations`",
    );
    if (migCount > 0) {
      checks.push({ name: "__drizzle_migrations has rows", ok: true });
    } else {
      checks.push({
        name: "__drizzle_migrations has rows",
        ok: false,
        detail: "table exists but is empty — did db:migrate run?",
      });
    }
  } catch (err) {
    checks.push({
      name: "__drizzle_migrations has rows",
      ok: false,
      detail:
        "__drizzle_migrations table does not exist — db:migrate did not run: " +
        (err instanceof Error ? err.message : String(err)),
    });
  }

  for (const tableName of REQUIRED_TABLES) {
    const ok = await tableExists(db, tableName);
    checks.push({ name: `${tableName} table exists`, ok });
  }

  for (const [tableName, columnName] of REQUIRED_COLUMNS) {
    const ok = await columnExists(db, tableName, columnName);
    checks.push({ name: `${tableName}.${columnName} column exists`, ok });
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
