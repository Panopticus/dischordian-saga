/**
 * Seed a deterministic test user for Playwright auth-gated specs.
 *
 * Creates a user with the openId specified by `E2E_AUTH_OPEN_ID` (or
 * a default `e2e-test-user` constant) so the global-setup.ts can mint
 * a JWT pointing at a real DB row. Idempotent — re-running just
 * confirms the user exists.
 *
 * Self-bootstraps the `users` table via CREATE TABLE IF NOT EXISTS
 * before reading. Because the e2e CI job runs `db:migrate:prod`
 * with `continue-on-error: true` (journal-drift tolerated), the
 * users table is not guaranteed to exist when the seed runs. Using
 * a bootstrap here mirrors the pattern the server itself follows
 * for orphan-migration recovery (apps/server/services/*Bootstrap.ts).
 *
 * Invoked as `pnpm tsx apps/scripts/seed-e2e-user.ts` in the CI e2e
 * job before Playwright starts.
 */
import { eq, sql } from "drizzle-orm";

const DEFAULT_OPEN_ID = "e2e-test-user";
const DEFAULT_NAME = "E2E Test User";
const DEFAULT_EMAIL = "e2e@dischordia.test";

const USERS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`openId\` VARCHAR(64) NOT NULL,
  \`name\` TEXT NULL,
  \`email\` VARCHAR(320) NULL,
  \`loginMethod\` VARCHAR(64) NULL,
  \`role\` ENUM('user', 'moderator', 'admin') NOT NULL DEFAULT 'user',
  \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  \`lastSignedIn\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`deletedAt\` TIMESTAMP NULL,
  \`signupWeek\` VARCHAR(8) NULL,
  \`installSource\` VARCHAR(32) NULL,
  \`abVariant\` VARCHAR(64) NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`users_openId_unique\` (\`openId\`),
  KEY \`idx_users_created_at\` (\`createdAt\`),
  KEY \`idx_users_last_signed_in\` (\`lastSignedIn\`),
  KEY \`idx_users_signup_week\` (\`signupWeek\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`;

async function main(): Promise<void> {
  const openId = process.env.E2E_AUTH_OPEN_ID || DEFAULT_OPEN_ID;
  const { getDb } = await import("../server/db");
  const { users } = await import("../db/schema");

  const db = await getDb();
  if (!db) {
    console.error("[seed-e2e-user] DB unavailable — DATABASE_URL likely unset");
    process.exit(1);
  }

  // Bootstrap the users table. Idempotent — CREATE TABLE IF NOT
  // EXISTS is a no-op when the table is already there from a
  // successful drizzle-kit migrate.
  try {
    await db.execute(sql.raw(USERS_TABLE_SQL));
  } catch (err) {
    console.warn("[seed-e2e-user] users-table bootstrap warning:", err);
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
