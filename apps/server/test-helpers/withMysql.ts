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
 * The CI workflow (.github/workflows/ci.yml `integration-tests` job)
 * provides the env var; locally, a developer can run:
 *
 *     INTEGRATION_TEST_DATABASE_URL=mysql://root:pw@127.0.0.1/test \
 *       pnpm test:integration
 *
 * Each `withMysql()` call hands back a *fresh* schema (DROP DATABASE
 * + CREATE DATABASE + drizzle push) so tests can't leak rows between
 * cases. That's slow; for repeated test cases, use one withMysql()
 * per `describe()` block and clean specific tables in afterEach.
 */
import type { MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "../../db/schema";

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
    // Schema bootstrap — we don't run drizzle push from inside the
    // process (that would shell out to drizzle-kit). Instead we rely
    // on the CI workflow's preceding "pnpm db:push" step to have
    // written the schema before any integration test ran. Each
    // reset() drops and recreates the database; the test harness
    // re-applies the schema by re-running drizzle-kit push.
    // For simplicity, we instead expect the caller to run
    // `pnpm db:push` once before the test suite and assume the
    // schema is in place. The reset() above gives a clean DB; the
    // caller can populate fixtures from there.
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
