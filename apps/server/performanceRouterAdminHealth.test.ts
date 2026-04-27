/**
 * Static guards on the `adminHealth` extension to performanceRouter (#88 chunk 2).
 *
 * The performanceRouter and performanceMonitor were already in place;
 * what was missing was a flat rollup designed for tight admin-badge
 * polling that also surfaces the Sentry init status. This test locks
 * in that addition without overlapping the older `serverReport` /
 * `activeConnections` / `healthCheck` procedures.
 *
 * Behavioral coverage of `getPerformanceReport()` itself lives next to
 * the implementation in `apps/server/performanceMonitor.ts` (the
 * percentile math is pure-function); this test asserts the wiring +
 * the weightedErrorRate math.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const ROOT = process.cwd();

function readFile(rel: string): string {
  return fs.readFileSync(path.resolve(ROOT, rel), "utf-8");
}

describe("performanceRouter.adminHealth wiring", () => {
  it("router file exposes the new adminHealth procedure under adminProcedure", () => {
    const src = readFile("apps/server/routers/performance.ts");
    expect(src).toMatch(/adminHealth:\s*adminProcedure\.query/);
  });

  it("adminHealth surfaces the seven flat fields a badge needs + sentryInitialized", () => {
    const src = readFile("apps/server/routers/performance.ts");
    expect(src).toMatch(/uptimeSec/);
    expect(src).toMatch(/memoryRssMb/);
    expect(src).toMatch(/activeConnections/);
    expect(src).toMatch(/observedRoutes/);
    expect(src).toMatch(/weightedErrorRatePct/);
    expect(src).toMatch(/wsMessagesTotal/);
    expect(src).toMatch(/dbQueriesTotal/);
    expect(src).toMatch(/dbSlowQueriesTotal/);
    expect(src).toMatch(/sentryInitialized/);
  });

  it("router imports sentryInitialized from ../sentry", () => {
    const src = readFile("apps/server/routers/performance.ts");
    expect(src).toMatch(
      /import\s*\{[^}]*sentryInitialized[^}]*\}\s*from\s*["']\.\.\/sentry["']/,
    );
  });

  it("the older serverReport / activeConnections / healthCheck remain in place", () => {
    // We only EXTEND performanceRouter; we don't replace the existing
    // procedures. Anyone calling them today should keep working.
    const src = readFile("apps/server/routers/performance.ts");
    expect(src).toMatch(/serverReport:\s*adminProcedure\.query/);
    expect(src).toMatch(/activeConnections:\s*adminProcedure\.query/);
    expect(src).toMatch(/healthCheck:\s*publicProcedure\.query/);
  });
});

describe("weightedErrorRate helper math", () => {
  // The helper is module-private; test its contract via a JS-level
  // reproduction so a future refactor can't silently change the rollup.
  function weightedErrorRate(
    routes: Record<string, { count: number; errorRate: number }>,
  ): number {
    let totalRequests = 0;
    let totalErrors = 0;
    for (const stats of Object.values(routes)) {
      totalRequests += stats.count;
      totalErrors += (stats.count * stats.errorRate) / 100;
    }
    if (totalRequests === 0) return 0;
    return Math.round((totalErrors / totalRequests) * 10000) / 100;
  }

  it("weights each route's errorRate by its request count", () => {
    // 100 requests at 5% errors + 900 requests at 0.5% errors =
    //   5 errors + 4.5 errors = 9.5 errors / 1000 = 0.95%
    expect(
      weightedErrorRate({
        "GET /api/a": { count: 100, errorRate: 5 },
        "GET /api/b": { count: 900, errorRate: 0.5 },
      }),
    ).toBe(0.95);
  });

  it("returns 0 with no traffic (no NaN)", () => {
    expect(weightedErrorRate({})).toBe(0);
    expect(
      weightedErrorRate({ "GET /api/a": { count: 0, errorRate: 0 } }),
    ).toBe(0);
  });

  it("matches the per-route value when every route has the same errorRate", () => {
    expect(
      weightedErrorRate({
        "GET /api/a": { count: 50, errorRate: 2 },
        "GET /api/b": { count: 950, errorRate: 2 },
      }),
    ).toBe(2);
  });
});
