/**
 * MySQL integration-test harness.
 *
 * Audit/C-09 — the unit tests admitted "transactional + idempotent
 * paths require a real MySQL fixture; those land in a follow-up
 * integration test once the harness has one." This module IS the
 * harness.
 *
 * Two operating modes:
 *
 *   1. INTEGRATION_TEST_DATABASE_URL is unset
 *      → withMysql() returns null. Callers use vitest's `it.skipIf`
 *      to opt out cleanly. Unit-test runs are unaffected.
 *
 *   2. INTEGRATION_TEST_DATABASE_URL is set
 *      → withMysql() returns a Drizzle handle whose schema has been
 *      synchronized via drizzle-kit push at fixture bootstrap, and a
 *      cleanup function the caller calls in afterAll/afterEach.
 *
 * The CI workflow (.github/workflows/ci.yml `db-smoke` job) provides
 * the env var; locally, a developer can run:
 *
 *     INTEGRATION_TEST_DATABASE_URL=mysql://root:pw@127.0.0.1/test \
 *       pnpm test:integration
 *
 * Each `withMysql()` call hands back a *fresh* schema (DROP DATABASE
 * + CREATE DATABASE + drizzle-kit push) so tests can't leak rows
 * between cases. reset() reprovisions the schema itself — it does NOT
 * depend on a preceding CI `pnpm db:push`, because dozens of
 * schema.ts tables (dream_balance, season_clock_state, the trade_*
 * family) are journal orphans `drizzle-kit migrate` can't rebuild.
 * That's slow; for repeated test cases, use one withMysql() per
 * `describe()` block and clean specific tables in afterEach.
 */
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import type { MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "../../db/schema";

// drizzle.config.ts lives at the repo root; resolve it relative to
// this file (apps/server/test-helpers/) so reset() works regardless
// of the vitest cwd.
const REPO_ROOT = fileURLToPath(new URL("../../../", import.meta.url));
const DRIZZLE_KIT_BIN = fileURLToPath(
  new URL("../../../node_modules/.bin/drizzle-kit", import.meta.url),
);

const ENV_KEY = "INTEGRATION_TEST_DATABASE_URL";

/** True iff the integration harness should run. */
export function isIntegrationEnabled(): boolean {
  return !!process.env[ENV_KEY];
}

export interface IntegrationDb {
  db: MySql2Database<typeof schema>;
  /** Drops + recreates the schema. Use sparingly (slow). */
  reset: () => Promise<void>;
  /** Closes the pool. Call in afterAll. */
  close: () => Promise<void>;
}

/**
 * Open a fresh integration DB. Returns null if the env var isn't set,
 * so the caller can `it.skipIf(!withMysqlReady, ...)`.
 *
 * Lazy-loads mysql2 + drizzle-orm/mysql2 so unit tests that never call
 * this don't pay the startup cost.
 */
export async function withMysql(): Promise<IntegrationDb | null> {
  const url = process.env[ENV_KEY];
  if (!url) return null;

  // Dynamic imports keep the unit-test module graph free of mysql2.
  const mysql = await import("mysql2/promise");
  const { drizzle } = await import("drizzle-orm/mysql2");

  // Parse the URL so we can connect to the *server* (not the named
  // database) for the DROP/CREATE bootstrap. We then connect again
  // to the named database for the actual queries.
  const u = new URL(url);
  const databaseName = u.pathname.replace(/^\//, "") || "integration_test";
  const adminPool = mysql.createPool({
    host: u.hostname,
    port: u.port ? parseInt(u.port, 10) : 3306,
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    multipleStatements: true,
  });

  const reset = async () => {
    await adminPool.query(`DROP DATABASE IF EXISTS \`${databaseName}\``);
    await adminPool.query(`CREATE DATABASE \`${databaseName}\``);
    // Re-apply the full Drizzle schema into the freshly-created DB.
    // The migration journal has drifted — dozens of schema.ts tables
    // (dream_balance, season_clock_state, the trade_* family) have no
    // journaled migration — so `drizzle-kit migrate` can't rebuild
    // the schema. `drizzle-kit push` diffs schema.ts → DB and applies
    // it; against the empty DB we just created every change is an
    // additive CREATE TABLE, so the run is non-interactive (no
    // data-loss prompts). Invoked directly (not via `pnpm db:push`)
    // to skip the guard/tsx wrapper and to point drizzle-kit at this
    // integration DB through DATABASE_URL. execFileSync throws on a
    // non-zero exit with stdout/stderr attached, so a push failure
    // fails the test loudly instead of surfacing as ER_NO_SUCH_TABLE.
    execFileSync(DRIZZLE_KIT_BIN, ["push"], {
      cwd: REPO_ROOT,
      env: { ...process.env, DATABASE_URL: url },
      stdio: "pipe",
    });
  };

  await reset();

  const pool = mysql.createPool({
    host: u.hostname,
    port: u.port ? parseInt(u.port, 10) : 3306,
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: databaseName,
    multipleStatements: true,
  });
  const db = drizzle(pool, { schema, mode: "default" });

  return {
    db: db as MySql2Database<typeof schema>,
    reset,
    close: async () => {
      await pool.end();
      await adminPool.end();
    },
  };
}
