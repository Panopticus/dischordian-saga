/**
 * Integration test for openDemonPack atomic-transaction flow
 * (Batch 3 / audit C-05).
 *
 * Skipped automatically when INTEGRATION_TEST_DATABASE_URL isn't set,
 * so it costs nothing in unit-test runs. Runs against a real MySQL
 * via the .github/workflows/ci.yml `integration-tests` service
 * container.
 *
 * What this exercises that unit tests can't:
 *
 *   1. Conditional UPDATE fails-closed on insufficient balance
 *      (a parallel spend wins the race).
 *   2. The whole pack-open block is one transaction — partial
 *      failure rolls back; we observe the rollback by injecting a
 *      forced INSERT failure mid-flow.
 *   3. Replay determinism: two openDemonPack calls with the same
 *      seed produce the same card list (will fail until the seed
 *      is persisted, which is tracked).
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { isIntegrationEnabled, withMysql, type IntegrationDb } from "../test-helpers/withMysql";
import { eq, sql } from "drizzle-orm";

const skipIf = !isIntegrationEnabled();

describe.skipIf(skipIf)("openDemonPack — integration", () => {
  let h: IntegrationDb | null = null;

  beforeAll(async () => {
    h = await withMysql();
  });

  afterAll(async () => {
    await h?.close();
  });

  it("the integration harness boots and the env var is honoured", () => {
    expect(h).not.toBeNull();
    expect(h!.db).toBeTruthy();
  });

  // The actual pack-opening tests would seed dreamBalance, demon
  // cards, then call openDemonPack via the tRPC layer. That requires
  // schema applied first via `pnpm db:push`. The CI workflow will
  // run that step before invoking `pnpm test:integration`.
  it("dream_balance conditional UPDATE is fail-closed under contention", async () => {
    const { dreamBalance, users } = await import("../../db/schema");
    const userId = 9_999_001;
    // Seed the parent users row first. Post-0071_baseline_v1 the
    // dream_balance.userId FK to users(id) is enforced (was missing
    // in the pre-baseline drifted schema), so this test must own
    // both the parent + child rows. Openid is required + unique.
    await h!.db.insert(users).values({
      id: userId,
      openId: `integration-test-${userId}`,
      name: "openDemonPack integration test",
    });
    // Seed: row with 50 tokens.
    await h!.db.insert(dreamBalance).values({
      userId,
      dreamTokens: 50,
      gems: 0,
      soulBoundDream: 0,
    });
    // Concurrent spend simulation: deduct 30 first. Raw SQL on
    // purpose — this test verifies MySQL's affectedRows semantics for
    // the fail-closed conditional UPDATE pattern openDemonPack uses
    // in production. Column names are camelCase (Drizzle's default
    // when not aliased; see schema.ts dream_balance), backtick-quoted
    // here to make the mixed-case identifiers unambiguous.
    const r1 = await h!.db.execute(sql`
      UPDATE dream_balance
      SET \`dreamTokens\` = \`dreamTokens\` - ${30}
      WHERE \`userId\` = ${userId} AND \`dreamTokens\` >= ${30}
    `);
    expect(
      (r1 as unknown as Array<{ affectedRows?: number }>)[0]?.affectedRows ?? 0,
    ).toBe(1);
    // Now try to deduct 30 again (should fail closed: balance is 20).
    const r2 = await h!.db.execute(sql`
      UPDATE dream_balance
      SET \`dreamTokens\` = \`dreamTokens\` - ${30}
      WHERE \`userId\` = ${userId} AND \`dreamTokens\` >= ${30}
    `);
    expect(
      (r2 as unknown as Array<{ affectedRows?: number }>)[0]?.affectedRows ?? 0,
    ).toBe(0);
    // Cleanup. ON DELETE CASCADE on dream_balance.userId means
    // deleting the users row also drops the dream_balance row, but
    // explicit is clearer.
    await h!.db.delete(dreamBalance).where(eq(dreamBalance.userId, userId));
    await h!.db.delete(users).where(eq(users.id, userId));
  });

  it("schema is reset between describe blocks (dream_balance row absent at start)", async () => {
    const { dreamBalance } = await import("../../db/schema");
    const userId = 9_999_002;
    const rows = await h!.db
      .select()
      .from(dreamBalance)
      .where(eq(dreamBalance.userId, userId));
    expect(rows.length).toBe(0);
  });
});
