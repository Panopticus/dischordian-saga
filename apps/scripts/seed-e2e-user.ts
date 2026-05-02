/**
 * Seed a deterministic test user for Playwright auth-gated specs.
 *
 * Creates a user with the openId specified by `E2E_AUTH_OPEN_ID` (or
 * a default `e2e-test-user` constant) so the global-setup.ts can mint
 * a JWT pointing at a real DB row. Idempotent — re-running just
 * confirms the user exists.
 *
 * Invoked as `pnpm tsx apps/scripts/seed-e2e-user.ts` in the CI e2e
 * job before Playwright starts.
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

main().catch((err) => {
  console.error("[seed-e2e-user] failed:", err);
  process.exit(1);
});
