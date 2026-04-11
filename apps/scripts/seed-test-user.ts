#!/usr/bin/env tsx
/* ═══════════════════════════════════════════════════════
   SEED TEST USER — for Playwright E2E auth bypass

   Creates (or no-ops on) a user row with a known openId so
   the `TEST_AUTH_BYPASS_OPEN_ID` env var + fixture in
   apps/e2e/fixtures/authFixture.ts can authenticate without
   going through Google OAuth.

   USAGE

       TEST_AUTH_BYPASS_OPEN_ID=e2e-test-user \\
         tsx apps/scripts/seed-test-user.ts

   Idempotent — safe to run on every CI job. Skipped when the
   DB is unavailable (so dev envs without MySQL don't crash).

   The seeded user has role=user and loginMethod=test so it's
   distinguishable from real rows. Do NOT run in production.
   ═══════════════════════════════════════════════════════ */
import { getDb } from "../server/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

async function main() {
  if (process.env.NODE_ENV === "production") {
    console.error("[seed-test-user] Refusing to run in production");
    process.exit(1);
  }

  const openId = process.env.TEST_AUTH_BYPASS_OPEN_ID;
  if (!openId) {
    console.error("[seed-test-user] TEST_AUTH_BYPASS_OPEN_ID must be set");
    process.exit(1);
  }

  const db = await getDb();
  if (!db) {
    console.warn("[seed-test-user] DB unavailable — skipping seed");
    process.exit(0);
  }

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  if (existing.length > 0) {
    console.log(`[seed-test-user] User ${openId} already exists (id=${existing[0].id})`);
    return;
  }

  await db.insert(users).values({
    openId,
    email: `${openId}@test.dischordian.local`,
    name: `E2E Test User (${openId})`,
    loginMethod: "test",
    role: "user",
  });

  const [created] = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  console.log(`[seed-test-user] Created user ${openId} (id=${created?.id ?? "?"})`);
}

main().catch(err => {
  console.error("[seed-test-user] Failed:", err);
  process.exit(1);
});
