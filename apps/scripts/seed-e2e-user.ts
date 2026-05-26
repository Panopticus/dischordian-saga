/**
 * Seed a deterministic test user for Playwright auth-gated specs.
 *
 * Creates a user with the openId specified by `E2E_AUTH_OPEN_ID` (or
 * a default `e2e-test-user` constant) so the global-setup.ts can mint
 * a JWT pointing at a real DB row. Idempotent — re-running just
 * confirms the user exists.
 *
 * Invoked as `pnpm tsx apps/scripts/seed-e2e-user.ts` in the CI e2e
 * job after `pnpm db:migrate` (which provisions the full schema)
 * and before Playwright starts.
 */
import { eq } from "drizzle-orm";

const DEFAULT_OPEN_ID = "e2e-test-user";
const DEFAULT_NAME = "E2E Test User";
const DEFAULT_EMAIL = "e2e@dischordia.test";

async function main(): Promise<void> {
  const openId = process.env.E2E_AUTH_OPEN_ID || DEFAULT_OPEN_ID;
  const { getDb } = await import("../server/db");
  const { users } = await import("../db/schema");

  const db = await getDb();
  if (!db) {
    console.error("[seed-e2e-user] DB unavailable — DATABASE_URL likely unset");
    process.exit(1);
  }

  // Post-0071_baseline_v1 cutover the `users` table and the
  // cohort / age-verification columns are all in the baseline
  // migration. CI runs `pnpm db:migrate` before this script so the
  // schema is already in place; the inline DDL + bootstrap calls
  // this script used to do are no longer needed.

  const existing = await db
    .select({ id: users.id, openId: users.openId })
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  if (existing[0]) {
    console.log(`[seed-e2e-user] User ${openId} already exists (id=${existing[0].id}).`);
    return;
  }

  await db.insert(users).values({
    openId,
    name: DEFAULT_NAME,
    email: DEFAULT_EMAIL,
    loginMethod: "e2e_seed",
    role: "user",
  });
  console.log(`[seed-e2e-user] Created user ${openId}.`);
}

main()
  .then(() => {
    // Force-exit on success. main() resolves once the user row is
    // ensured, but getDb() opened a mysql2 pool (and the *Bootstrap
    // imports register their own handles), so the Node event loop
    // never drains on its own — without this the process hangs until
    // CI force-cancels the step (~24m), so Playwright never runs.
    process.exit(0);
  })
  .catch((err) => {
  // Print every diagnostic field MySQL / Drizzle expose so CI logs
  // surface the actual cause instead of an opaque "exit code 1".
  // The bare `console.error("...failed:", err)` was eating the
  // useful fields when err is a non-Error object.
  console.error("[seed-e2e-user] failed:");
  if (err && typeof err === "object") {
    const e = err as Record<string, unknown>;
    console.error("  message:    ", e.message);
    console.error("  code:       ", e.code);
    console.error("  errno:      ", e.errno);
    console.error("  sqlState:   ", e.sqlState);
    console.error("  sqlMessage: ", e.sqlMessage);
    console.error("  sql:        ", typeof e.sql === "string" ? e.sql.slice(0, 600) : e.sql);
    if (e.cause) console.error("  cause:      ", e.cause);
    if (typeof e.stack === "string") console.error("  stack:\n" + e.stack);
  } else {
    console.error("  (non-object thrown):", err);
  }
  process.exit(1);
});
