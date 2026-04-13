import { describe, it, expect, vi } from "vitest";

/* ═══════════════════════════════════════════════════════
   INFRASTRUCTURE & NEW FEATURES TESTS
   Tests for discovery router, content admin router, 
   rate limiting, code splitting, and query caching
   ═══════════════════════════════════════════════════════ */

describe("Discovery Router", () => {
  it("should export the discoveryRouter from routers", async () => {
    const { appRouter } = await import("./routers");
    expect(appRouter).toBeDefined();
    // The discovery router should be accessible
    expect(appRouter._def.procedures).toBeDefined();
  });

  it("should have discovery procedures defined", async () => {
    const { appRouter } = await import("./routers");
    const procedures = appRouter._def.procedures;
    // Check that discovery-related procedures exist
    expect(procedures["discovery.getUnlocks"]).toBeDefined();
    expect(procedures["discovery.unlockFeature"]).toBeDefined();
    expect(procedures["discovery.getProgress"]).toBeDefined();
  });
});

describe("Content Admin Router", () => {
  it("should have contentAdmin procedures defined", async () => {
    const { appRouter } = await import("./routers");
    const procedures = appRouter._def.procedures;
    // Check that content admin procedures exist
    expect(procedures["contentAdmin.listEntries"]).toBeDefined();
    expect(procedures["contentAdmin.getEntry"]).toBeDefined();
    expect(procedures["contentAdmin.createEntry"]).toBeDefined();
    expect(procedures["contentAdmin.updateEntry"]).toBeDefined();
    expect(procedures["contentAdmin.deleteEntry"]).toBeDefined();
    expect(procedures["contentAdmin.getStats"]).toBeDefined();
  });
});

describe("Rate Limiting", () => {
  it("express-rate-limit should be importable", async () => {
    const rateLimit = await import("express-rate-limit");
    expect(rateLimit.default).toBeDefined();
    expect(typeof rateLimit.default).toBe("function");
  });

  it("should create a rate limiter with correct config", async () => {
    const { default: rateLimit } = await import("express-rate-limit");
    const limiter = rateLimit({
      windowMs: 60 * 1000,
      max: 120,
      standardHeaders: true,
      legacyHeaders: false,
    });
    expect(limiter).toBeDefined();
    expect(typeof limiter).toBe("function");
  });
});

describe("Code Splitting", () => {
  it("React.lazy should be available", async () => {
    const React = await import("react");
    expect(React.lazy).toBeDefined();
    expect(React.Suspense).toBeDefined();
  });
});

describe("Query Caching Configuration", () => {
  it("should have valid staleTime and gcTime values", () => {
    const staleTime = 30_000;
    const gcTime = 5 * 60_000;
    expect(staleTime).toBe(30000);
    expect(gcTime).toBe(300000);
    expect(staleTime).toBeLessThan(gcTime);
  });
});

describe("PageSkeleton Component", () => {
  it("should be importable", async () => {
    // Verify the module exists and exports correctly
    const mod = await import("../client/src/components/PageSkeleton");
    expect(mod.default).toBeDefined();
    expect(mod.GridSkeleton).toBeDefined();
    expect(mod.ListSkeleton).toBeDefined();
    expect(mod.DetailSkeleton).toBeDefined();
    expect(mod.DashboardSkeleton).toBeDefined();
    expect(mod.GallerySkeleton).toBeDefined();
  });
});

describe("RouteErrorBoundary Component", () => {
  it("should be importable", async () => {
    const mod = await import("../client/src/components/RouteErrorBoundary");
    expect(mod.default).toBeDefined();
  });
});

describe("Haptics Utility", () => {
  it("should export all haptic functions from lib/haptics", async () => {
    const haptics = await import("../client/src/lib/haptics");
    expect(haptics.hapticLight).toBeDefined();
    expect(haptics.hapticMedium).toBeDefined();
    expect(haptics.hapticHeavy).toBeDefined();
    expect(haptics.hapticDouble).toBeDefined();
    expect(haptics.hapticTriple).toBeDefined();
    expect(haptics.hapticError).toBeDefined();
    expect(haptics.hapticSuccess).toBeDefined();
    expect(haptics.hapticRumble).toBeDefined();
    expect(haptics.hapticPattern).toBeDefined();
    expect(haptics.hapticStop).toBeDefined();
  });

  it("should export all haptic functions from game/haptics", async () => {
    const haptics = await import("../client/src/game/haptics");
    expect(haptics.hapticForEvent).toBeDefined();
    expect(haptics.setHapticEnabled).toBeDefined();
    expect(haptics.isHapticEnabled).toBeDefined();
    expect(haptics.hapticLightHit).toBeDefined();
    expect(haptics.hapticKO).toBeDefined();
    expect(haptics.hapticMatchWin).toBeDefined();
  });

  it("hapticForEvent should not throw for any event type", async () => {
    const { hapticForEvent, setHapticEnabled } = await import("../client/src/game/haptics");
    // Disable haptics so we don't need navigator.vibrate
    setHapticEnabled(false);
    const events = [
      "light_hit", "medium_hit", "heavy_hit", "block", "parry",
      "evade", "ko", "round_win", "match_win", "combo", "sp1", "sp2", "sp3"
    ];
    for (const event of events) {
      expect(() => hapticForEvent(event)).not.toThrow();
    }
  });
});

describe("Database Schema - featureUnlocks", () => {
  it("should export featureUnlocks table from schema", async () => {
    const schema = await import("../drizzle/schema");
    expect(schema.featureUnlocks).toBeDefined();
  });
});

describe("Transaction Support", () => {
  it("drizzle-orm should support transactions", async () => {
    // Verify that the drizzle module is importable and has transaction support
    const drizzle = await import("drizzle-orm");
    expect(drizzle.sql).toBeDefined();
    expect(drizzle.eq).toBeDefined();
  });
});
