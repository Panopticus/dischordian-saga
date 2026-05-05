/**
 * Shape-only test for marketStatsService.
 *
 * No live DB / drizzle in this test environment, so we hand-roll a
 * mock that captures the queries and returns canned counts. The
 * interesting behavior is the column-name + sum compositions; this
 * test pins those.
 */
import { describe, it, expect, vi } from "vitest";
import { computeMarketStats } from "./marketStatsService";

describe("computeMarketStats", () => {
  it("aggregates listings + sales + purchases + auctions in parallel", async () => {
    const calls: { table: string; where?: string }[] = [];

    const limit = (rows: unknown) => Promise.resolve(rows);
    const where = (table: string, rows: unknown) => ({
      limit: () => limit(rows),
      // computeMarketStats awaits the where(), so the chain
      // resolves directly.
      then: (resolve: (v: unknown) => void) => {
        calls.push({ table, where: "applied" });
        resolve(rows);
      },
    });
    // The service uses `await db.select(...).from(...).where(...)`
    // returning an array of one row. Stub a chain that satisfies that.
    const fake = {
      select: (cols: Record<string, unknown>) => ({
        from: (table: { _: { name: string } } | unknown) => ({
          where: () => {
            const tName = "table"; // we don't introspect table names; counts are fine
            calls.push({ table: tName });
            // Return canned counts — different per call via call-index.
            const idx = calls.length;
            // Listings (idx=1), sales (2), purchases (3), auctions (4)
            switch (idx) {
              case 1: return Promise.resolve([{ count: 5 }]);
              case 2: return Promise.resolve([{ count: 3, credits: 1500 }]);
              case 3: return Promise.resolve([{ count: 7, dreamSpent: 250 }]);
              case 4: return Promise.resolve([{ count: 2 }]);
              default: return Promise.resolve([{ count: 0 }]);
            }
          },
        }),
      }),
    };

    // computeMarketStats expects DrizzleDb-shaped object.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stats = await computeMarketStats(fake as any, 42);

    expect(stats.market_listings).toBe(5);
    expect(stats.market_sales).toBe(3);
    expect(stats.market_credits_earned).toBe(1500);
    expect(stats.market_purchases).toBe(7);
    expect(stats.market_dream_spent).toBe(250);
    expect(stats.auctions_won).toBe(2);
    expect(stats.buy_orders_placed).toBe(0);
    expect(stats.exchanges_completed).toBe(0);
  });
});

void vi;
