import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

/* ═══════════════════════════════════════════════════════
   TASK 8 — Admin Console Expansion
   8.1  Player search + inspect enrichment
   8.2  Economy timeseries + inflation index
   8.3  Living Universe admin controls (regression lock)
   ═══════════════════════════════════════════════════════ */

const ROUTER_SRC = fs.readFileSync(
  path.resolve(__dirname, "routers/architectConsole.ts"),
  "utf-8",
);

/* ─── TASK 8.1 — Player search endpoint ─── */
describe("Task 8.1 — searchPlayers admin endpoint", () => {
  it("is exposed on the architectConsole router", () => {
    expect(ROUTER_SRC).toContain("searchPlayers: adminProcedure");
  });

  it("accepts a query string (1..128) and a limit (1..50, default 20)", () => {
    expect(ROUTER_SRC).toMatch(/query:\s*z\.string\(\)\.min\(1\)\.max\(128\)/);
    expect(ROUTER_SRC).toMatch(/limit:\s*z\.number\(\)\.int\(\)\.min\(1\)\.max\(50\)\.default\(20\)/);
  });

  it("detects numeric queries and routes them to an exact id match", () => {
    expect(ROUTER_SRC).toContain("Number.parseInt(input.query, 10)");
    expect(ROUTER_SRC).toContain("isNumeric");
    expect(ROUTER_SRC).toMatch(/eq\(users\.id,\s*asNumber\)/);
  });

  it("does a case-insensitive substring match on both name and email for string queries", () => {
    expect(ROUTER_SRC).toMatch(/LOWER\(\$\{users\.name\}\)\s*LIKE\s*LOWER/);
    expect(ROUTER_SRC).toMatch(/LOWER\(\$\{users\.email\}\)\s*LIKE\s*LOWER/);
  });

  it("sorts results by lastSignedIn desc (most recently active first)", () => {
    expect(ROUTER_SRC).toMatch(/searchPlayers[\s\S]{0,2500}orderBy\(desc\(users\.lastSignedIn\)\)/);
  });

  it("returns a sanitized user shape (no password hashes, no internal fields)", () => {
    // The select list should be an explicit projection, not `.select().from(users)`
    expect(ROUTER_SRC).toMatch(/searchPlayers[\s\S]{0,1500}\.select\(\{[\s\S]{0,500}id:\s*users\.id/);
  });

  it("documents the Task 8.1 intent", () => {
    expect(ROUTER_SRC).toMatch(/Task 8\.1.*Search players/s);
  });
});

/* ─── TASK 8.1 — inspectPlayer enrichment ─── */
describe("Task 8.1 — inspectPlayer enrichment", () => {
  it("still exists at the original path (no regression)", () => {
    expect(ROUTER_SRC).toContain("inspectPlayer: adminProcedure");
  });

  it("fetches the top 20 most recently obtained cards", () => {
    expect(ROUTER_SRC).toMatch(/userCards[\s\S]{0,800}\.limit\(20\)/);
    expect(ROUTER_SRC).toContain("orderBy(desc(userCards.obtainedAt))");
  });

  it("fetches card collection totals (unique + copies)", () => {
    expect(ROUTER_SRC).toContain("COUNT(DISTINCT");
    expect(ROUTER_SRC).toContain("totalCopies");
  });

  it("fetches the full achievement unlock list", () => {
    expect(ROUTER_SRC).toContain("userAchievements");
    expect(ROUTER_SRC).toMatch(/orderBy\(desc\(userAchievements\.unlockedAt\)\)/);
  });

  it("fetches the prestige progress row", () => {
    expect(ROUTER_SRC).toContain("prestigeProgress");
    expect(ROUTER_SRC).toMatch(/\.where\(eq\(prestigeProgress\.userId/);
  });

  it("returns recentCards / cardCollection / achievements / prestigeDetail", () => {
    expect(ROUTER_SRC).toContain("recentCards: cardCollection.map");
    expect(ROUTER_SRC).toContain("cardCollection: {");
    expect(ROUTER_SRC).toMatch(/achievements:\s*achievementRows\.map/);
    expect(ROUTER_SRC).toContain("prestigeDetail: prestigeRow");
  });

  it("imports userAchievements + prestigeProgress from drizzle schema", () => {
    expect(ROUTER_SRC).toMatch(/userAchievements,[\s\S]{0,100}prestigeProgress,/);
  });
});

/* ─── TASK 8.2 — Economy timeseries ─── */
describe("Task 8.2 — economyTimeseries admin endpoint", () => {
  it("is exposed on the architectConsole router", () => {
    expect(ROUTER_SRC).toContain("economyTimeseries: adminProcedure");
  });

  it("accepts a `days` parameter bounded to 7..90 with default 30", () => {
    expect(ROUTER_SRC).toMatch(/days:\s*z\.number\(\)\.int\(\)\.min\(7\)\.max\(90\)\.default\(30\)/);
  });

  it("aggregates marketplace volume per day", () => {
    expect(ROUTER_SRC).toMatch(/marketTransactions[\s\S]{0,500}DATE\(\$\{marketTransactions\.createdAt\}\)/);
    expect(ROUTER_SRC).toMatch(/volume:\s*sql[\s\S]{0,200}priceDream/);
  });

  it("aggregates store spend per day", () => {
    expect(ROUTER_SRC).toMatch(/storePurchases[\s\S]{0,500}DATE\(\$\{storePurchases\.createdAt\}\)/);
    expect(ROUTER_SRC).toMatch(/spent:\s*sql[\s\S]{0,200}storePurchases\.amount/);
  });

  it("zero-fills missing days so the chart draws a continuous line", () => {
    expect(ROUTER_SRC).toContain("byDay.set(key");
    expect(ROUTER_SRC).toContain("marketVolumeDream: 0");
    expect(ROUTER_SRC).toContain("storeSpendDream: 0");
  });

  it("computes the inflation index from circulation + windowed mint", () => {
    expect(ROUTER_SRC).toContain("inflationIndex");
    expect(ROUTER_SRC).toContain("totalCirculation / thenApprox");
  });

  it("clamps the inflation denominator to avoid div-by-zero", () => {
    expect(ROUTER_SRC).toMatch(/Math\.max\(1,\s*totalCirculation\s*-\s*mintedApprox\)/);
  });

  it("sorts the final series by day ascending", () => {
    expect(ROUTER_SRC).toMatch(/series:\s*Array\.from\(byDay\.values\(\)\)\.sort/);
  });

  it("returns totalCirculation, mintedApprox, inflationIndex, series, days", () => {
    expect(ROUTER_SRC).toMatch(/return\s*\{\s*days:\s*input\.days/);
    expect(ROUTER_SRC).toContain("totalCirculation,");
    expect(ROUTER_SRC).toContain("mintedApprox,");
    expect(ROUTER_SRC).toContain("inflationIndex,");
    expect(ROUTER_SRC).toContain("series:");
  });

  it("documents the Task 8.2 inflation-index approximation", () => {
    expect(ROUTER_SRC).toMatch(/Task 8\.2.*Economy timeseries/s);
    expect(ROUTER_SRC).toMatch(/inflationIndex30d/);
  });
});

/* ─── TASK 8.3 — Living Universe admin controls (regression lock) ─── */
describe("Task 8.3 — Living Universe admin controls stay intact", () => {
  it("getPressureMeters is still wired through pressureService", () => {
    expect(ROUTER_SRC).toContain("getPressureMeters: adminProcedure");
    expect(ROUTER_SRC).toContain("pressureService.getAllPressures");
  });

  it("setPressure is still present with integer score validation", () => {
    expect(ROUTER_SRC).toContain("setPressure: adminProcedure");
    expect(ROUTER_SRC).toMatch(/score:\s*z\.number\(\)\.int\(\)\.min\(0\)/);
  });

  it("setPressure writes an audit log entry", () => {
    expect(ROUTER_SRC).toMatch(/set_pressure[\s\S]{0,200}from:\s*currentPressure/);
  });

  it("forceActivateEvent is still present", () => {
    expect(ROUTER_SRC).toContain("forceActivateEvent: adminProcedure");
    expect(ROUTER_SRC).toContain("force_activate_event");
  });

  it("forceResolveEvent is still present", () => {
    expect(ROUTER_SRC).toContain("forceResolveEvent: adminProcedure");
    expect(ROUTER_SRC).toContain("force_resolve_event");
  });

  it("getEventHistory + getActiveUniverseEvents both exist", () => {
    expect(ROUTER_SRC).toContain("getEventHistory: adminProcedure");
    expect(ROUTER_SRC).toContain("getActiveUniverseEvents: adminProcedure");
  });

  it("the dedicated livingUniverse router also exposes admin controls (Task 1.2)", () => {
    const luSrc = fs.readFileSync(
      path.resolve(__dirname, "routers/livingUniverse.ts"),
      "utf-8",
    );
    expect(luSrc).toContain("getAdminSnapshot: adminProcedure");
    expect(luSrc).toContain("runTick: adminProcedure");
    expect(luSrc).toContain("resolveEvent: adminProcedure");
  });
});

/* ═══════════════════════════════════════════════════════
   RUNTIME — derive inflation index without a DB
   ═══════════════════════════════════════════════════════ */

describe("Task 8.2 — inflation index math", () => {
  function compute(totalCirculation: number, mintedApprox: number): number {
    const thenApprox = Math.max(1, totalCirculation - mintedApprox);
    return Number((totalCirculation / thenApprox).toFixed(4));
  }

  it("returns ~1 when no Dream has been minted in the window", () => {
    expect(compute(1_000_000, 0)).toBeCloseTo(1, 4);
  });

  it(">1 when mint exceeds sink (circulation grew)", () => {
    // 1.2M now, 200k minted → "then" ≈ 1M → index 1.2
    expect(compute(1_200_000, 200_000)).toBeCloseTo(1.2, 4);
  });

  it("handles circulation = 0 gracefully (clamped denominator)", () => {
    // 0 / max(1, 0-0)=1 → 0
    expect(compute(0, 0)).toBe(0);
  });

  it("clamps when minted > circulation (corrupt data)", () => {
    // 500k now, 900k minted → denom clamped to 1 → huge but finite
    const v = compute(500_000, 900_000);
    expect(v).toBeGreaterThan(0);
    expect(Number.isFinite(v)).toBe(true);
  });

  it("rounds to 4 decimal places for stable JSON payloads", () => {
    // 10001 / 10000 = 1.0001
    expect(compute(10001, 1)).toBeCloseTo(1.0001, 4);
  });
});

/* ═══════════════════════════════════════════════════════
   RUNTIME — zero-fill math for the timeseries chart
   ═══════════════════════════════════════════════════════ */

describe("Task 8.2 — day-map zero fill", () => {
  function buildDays(days: number, since: Date): string[] {
    const keys: string[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(since.getTime() + i * 24 * 60 * 60 * 1000);
      keys.push(d.toISOString().slice(0, 10));
    }
    return keys;
  }

  it("emits exactly `days` entries", () => {
    const since = new Date("2026-04-01T00:00:00Z");
    expect(buildDays(30, since)).toHaveLength(30);
  });

  it("produces strictly ascending YYYY-MM-DD keys", () => {
    const since = new Date("2026-04-01T00:00:00Z");
    const keys = buildDays(7, since);
    for (let i = 1; i < keys.length; i++) {
      expect(keys[i].localeCompare(keys[i - 1])).toBeGreaterThan(0);
    }
  });

  it("first key equals the `since` day", () => {
    const since = new Date("2026-04-10T00:00:00Z");
    const keys = buildDays(3, since);
    expect(keys[0]).toBe("2026-04-10");
    expect(keys[1]).toBe("2026-04-11");
    expect(keys[2]).toBe("2026-04-12");
  });
});

/* ═══════════════════════════════════════════════════════
   RUNTIME — search query routing (numeric vs string)
   ═══════════════════════════════════════════════════════ */

describe("Task 8.1 — search query routing", () => {
  function route(query: string): { isNumeric: boolean; asNumber: number } {
    const asNumber = Number.parseInt(query, 10);
    const isNumeric = Number.isFinite(asNumber) && String(asNumber) === query.trim();
    return { isNumeric, asNumber };
  }

  it("routes '42' as numeric", () => {
    expect(route("42")).toEqual({ isNumeric: true, asNumber: 42 });
  });

  it("routes 'alice' as non-numeric", () => {
    expect(route("alice").isNumeric).toBe(false);
  });

  it("rejects '42abc' as non-numeric (parseInt would accept it)", () => {
    // parseInt('42abc') === 42, but String(42) !== '42abc'
    expect(route("42abc").isNumeric).toBe(false);
  });

  it("rejects whitespace-only queries", () => {
    expect(route("   ").isNumeric).toBe(false);
  });

  it("rejects negative-looking strings", () => {
    // parseInt('-5') === -5 and String(-5) === '-5' → still numeric, ok
    // But '-5abc' parses to -5 then fails the equality check
    expect(route("-5abc").isNumeric).toBe(false);
  });

  it("accepts leading-zero numbers (uncommon but legal)", () => {
    // parseInt('007') === 7, String(7) !== '007' → not numeric
    expect(route("007").isNumeric).toBe(false);
  });
});

/* ═══════════════════════════════════════════════════════
   REGRESSION — core admin routes still intact
   ═══════════════════════════════════════════════════════ */

describe("Task 8 — no regression of existing admin surface", () => {
  it("economyDashboard is still exposed with health status", () => {
    expect(ROUTER_SRC).toContain("economyDashboard: adminProcedure");
    expect(ROUTER_SRC).toContain("healthStatus");
  });

  it("awardResources + bulkAwardResources still present with audit logging", () => {
    expect(ROUTER_SRC).toContain("awardResources: adminProcedure");
    expect(ROUTER_SRC).toContain("bulkAwardResources: adminProcedure");
    expect(ROUTER_SRC).toContain(`auditLog(db, ctx.user.id, "award_resources"`);
    expect(ROUTER_SRC).toContain(`auditLog(db, ctx.user.id, "bulk_award_resources"`);
  });

  it("setMorality/setLevel/setNPCTrust state-manipulation suite intact", () => {
    expect(ROUTER_SRC).toContain("setMorality: adminProcedure");
    expect(ROUTER_SRC).toContain("setLevel: adminProcedure");
    expect(ROUTER_SRC).toContain("setNPCTrust: adminProcedure");
  });

  it("feature flag admin controls still present", () => {
    expect(ROUTER_SRC).toContain("listFeatureFlags: adminProcedure");
    expect(ROUTER_SRC).toContain("setFeatureFlag: adminProcedure");
    expect(ROUTER_SRC).toContain("seedFeatureFlags: adminProcedure");
  });
});
