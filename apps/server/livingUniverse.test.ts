import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

/* ═══════════════════════════════════════════════════════
   TASK 1.2: LIVING UNIVERSE EVENTS — router, service, schema
   ═══════════════════════════════════════════════════════ */

/* ─── ROUTER STRUCTURE ─── */
describe("Living Universe Router", () => {
  const routerSrc = fs.readFileSync(
    path.resolve(__dirname, "routers/livingUniverse.ts"),
    "utf-8"
  );

  describe("Router exports", () => {
    it("exports livingUniverseRouter", () => {
      expect(routerSrc).toContain("export const livingUniverseRouter");
    });

    it("re-exports pressureService for downstream callers", () => {
      expect(routerSrc).toContain("export { pressureService }");
    });

    it("exports runUniverseTick for the scheduled job", () => {
      expect(routerSrc).toContain("export async function runUniverseTick");
    });
  });

  describe("Public procedures", () => {
    it("has getActivePressure public query", () => {
      expect(routerSrc).toMatch(/getActivePressure:\s*publicProcedure\.query/);
    });

    it("has getActiveEvents public query", () => {
      expect(routerSrc).toMatch(/getActiveEvents:\s*publicProcedure\.query/);
    });

    it("has getEventHistory public query", () => {
      expect(routerSrc).toMatch(/getEventHistory:\s*publicProcedure/);
    });

    it("has getPreview public query", () => {
      expect(routerSrc).toMatch(/getPreview:\s*publicProcedure\.query/);
    });
  });

  describe("Protected mutations", () => {
    it("has recordParticipation mutation for authenticated users", () => {
      expect(routerSrc).toMatch(/recordParticipation:\s*protectedProcedure/);
    });

    it("has incrementPressure mutation for cross-router use", () => {
      expect(routerSrc).toMatch(/incrementPressure:\s*protectedProcedure/);
    });
  });

  describe("Admin procedures", () => {
    it("has resolveEvent admin mutation", () => {
      expect(routerSrc).toMatch(/resolveEvent:\s*adminProcedure/);
    });

    it("has runTick admin mutation", () => {
      expect(routerSrc).toMatch(/runTick:\s*adminProcedure/);
    });

    it("has getAdminSnapshot admin query", () => {
      expect(routerSrc).toMatch(/getAdminSnapshot:\s*adminProcedure\.query/);
    });
  });

  describe("Schema integration", () => {
    it("reads from universeEventState table", () => {
      expect(routerSrc).toContain("universeEventState");
    });

    it("reads from universeEventHistory table", () => {
      expect(routerSrc).toContain("universeEventHistory");
    });

    it("delegates writes to pressureService", () => {
      expect(routerSrc).toContain("pressureService.increment");
      expect(routerSrc).toContain("pressureService.resolveEvent");
      expect(routerSrc).toContain("pressureService.tick");
    });
  });

  describe("Input validation", () => {
    it("uses zod for all mutation inputs", () => {
      expect(routerSrc).toContain("z.object");
    });

    it("clamps getEventHistory limit to 1-100", () => {
      expect(routerSrc).toMatch(/\.min\(1\)\.max\(100\)/);
    });

    it("validates resolution kind", () => {
      expect(routerSrc).toContain("community_success");
      expect(routerSrc).toContain("community_failure");
      expect(routerSrc).toContain("expired");
    });
  });
});

/* ─── PRESSURE SERVICE WIRING ─── */
describe("Pressure Service (Living Universe glue)", () => {
  const svcSrc = fs.readFileSync(
    path.resolve(__dirname, "services/pressureService.ts"),
    "utf-8"
  );

  it("imports universeEventHistory so it can archive resolved events", () => {
    expect(svcSrc).toContain("universeEventHistory");
  });

  it("exposes a tick() function", () => {
    expect(svcSrc).toMatch(/async\s+tick\(/);
  });

  it("tick() expires events whose expiresAt has passed", () => {
    expect(svcSrc).toContain("expiresAt");
    expect(svcSrc).toContain("lte(universeEventState.expiresAt");
  });

  it("tick() calls checkThresholds for new activations", () => {
    expect(svcSrc).toContain("this.checkThresholds()");
  });

  it("resolveEvent archives to universeEventHistory", () => {
    expect(svcSrc).toMatch(/db\.insert\(universeEventHistory\)/);
  });

  it("resolveEvent accepts a resolution kind and defaults to admin", () => {
    expect(svcSrc).toMatch(/resolution.*=.*"admin"/);
  });

  it("recordParticipation increments playerParticipation atomically", () => {
    expect(svcSrc).toContain("playerParticipation");
    expect(svcSrc).toMatch(/sql`\$\{universeEventState\.playerParticipation\}\s*\+/);
  });

  it("activation flow sets expiresAt based on typicalCycleDays", () => {
    expect(svcSrc).toContain("computeExpiry");
    expect(svcSrc).toContain("typicalCycleDays");
  });
});

/* ─── SCHEMA ─── */
describe("Living Universe Schema", () => {
  const schemaSrc = fs.readFileSync(
    path.resolve(__dirname, "../db/schema.ts"),
    "utf-8"
  );

  it("universeEventState exposes expiresAt column", () => {
    expect(schemaSrc).toMatch(/universeEventState[\s\S]*expiresAt:\s*timestamp/);
  });

  it("universeEventState exposes playerParticipation column", () => {
    expect(schemaSrc).toMatch(/universeEventState[\s\S]*playerParticipation:\s*int/);
  });

  it("exports universeEventHistory table", () => {
    expect(schemaSrc).toContain("export const universeEventHistory");
  });

  it("universeEventHistory has resolution column", () => {
    expect(schemaSrc).toMatch(/universeEventHistory[\s\S]*resolution:\s*varchar/);
  });

  it("universeEventHistory has totalParticipants column", () => {
    expect(schemaSrc).toMatch(/universeEventHistory[\s\S]*totalParticipants:\s*int/);
  });

  it("universeEventHistory has indexes on eventId and resolvedAt", () => {
    expect(schemaSrc).toMatch(/idxEventId[\s\S]*idx_universe_history_event/);
    expect(schemaSrc).toMatch(/idxResolvedAt[\s\S]*idx_universe_history_resolved/);
  });
});

/* ─── MIGRATION ─── */
describe("Living Universe Migration (0034)", () => {
  const migrationSrc = fs.readFileSync(
    path.resolve(__dirname, "../db/0034_living_universe_expiry_history.sql"),
    "utf-8"
  );

  it("adds expiresAt column to universe_event_state", () => {
    expect(migrationSrc).toMatch(/ALTER TABLE `universe_event_state`[\s\S]*expiresAt/);
  });

  it("adds playerParticipation column to universe_event_state", () => {
    expect(migrationSrc).toMatch(/ALTER TABLE `universe_event_state`[\s\S]*playerParticipation/);
  });

  it("creates universe_event_history table", () => {
    expect(migrationSrc).toContain("CREATE TABLE `universe_event_history`");
  });

  it("universe_event_history has resolution column", () => {
    expect(migrationSrc).toMatch(/`resolution`\s*varchar\(32\)\s*NOT NULL/);
  });

  it("creates index on history.eventId", () => {
    expect(migrationSrc).toContain("idx_universe_history_event");
  });

  it("creates index on history.resolvedAt", () => {
    expect(migrationSrc).toContain("idx_universe_history_resolved");
  });
});

/* ─── SHARED LIBRARY — event definitions + pressure logic ─── */
import {
  ALL_EMERGENT_EVENTS,
  getEmergingEvent,
  DEFAULT_PRESSURE,
  MAX_CONCURRENT_EVENTS,
  type PressureTracker,
} from "../shared/livingUniverseEvents";

describe("Living Universe shared library", () => {
  it("has exactly 5 emergent events", () => {
    expect(ALL_EMERGENT_EVENTS.length).toBe(5);
  });

  it("each event has a typicalCycleDays (used for expiry computation)", () => {
    for (const e of ALL_EMERGENT_EVENTS) {
      expect(e.typicalCycleDays).toBeGreaterThan(0);
      expect(e.typicalCycleDays).toBeLessThanOrEqual(365);
    }
  });

  it("each event has a unique id", () => {
    const ids = ALL_EMERGENT_EVENTS.map(e => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("getEmergingEvent returns null when pressure is low", () => {
    const result = getEmergingEvent({ ...DEFAULT_PRESSURE });
    expect(result).toBeNull();
  });

  it("getEmergingEvent returns the dominant dimension when pressure crosses threshold", () => {
    const pressure: PressureTracker = {
      ...DEFAULT_PRESSURE,
      deaths: 2000, // Necromancer pressure
    };
    const result = getEmergingEvent(pressure);
    expect(result).not.toBeNull();
    expect(result?.eventId).toBe("necromancer_return");
    expect(result?.proximity).toBeGreaterThan(0);
  });

  it("getEmergingEvent prefers higher-pressure dimensions over lower ones", () => {
    const pressure: PressureTracker = {
      ...DEFAULT_PRESSURE,
      deaths: 1500,
      trustGains: 5000, // Dreamer wins
    };
    const result = getEmergingEvent(pressure);
    expect(result?.eventId).toBe("dreamer_awakening");
  });

  it("MAX_CONCURRENT_EVENTS is a sane limit", () => {
    expect(MAX_CONCURRENT_EVENTS).toBeGreaterThanOrEqual(1);
    expect(MAX_CONCURRENT_EVENTS).toBeLessThanOrEqual(5);
  });
});

/* ─── APP ROUTER WIRING ─── */
describe("Living Universe router wiring", () => {
  const routersSrc = fs.readFileSync(
    path.resolve(__dirname, "routers.ts"),
    "utf-8"
  );

  it("imports livingUniverseRouter", () => {
    expect(routersSrc).toContain('import { livingUniverseRouter } from "./routers/livingUniverse"');
  });

  it("mounts livingUniverse on the appRouter", () => {
    expect(routersSrc).toMatch(/livingUniverse:\s*livingUniverseRouter/);
  });
});

/* ─── SCHEDULED TICK JOB ─── */
describe("Living Universe scheduled tick", () => {
  const indexSrc = fs.readFileSync(
    path.resolve(__dirname, "_core/index.ts"),
    "utf-8"
  );

  it("imports runUniverseTick from the router", () => {
    expect(indexSrc).toContain("../routers/livingUniverse");
    expect(indexSrc).toContain("runUniverseTick");
  });

  it("sets up a setInterval for the tick", () => {
    expect(indexSrc).toMatch(/setInterval[\s\S]*runUniverseTick/);
  });

  it("runs an initial tick on startup (no 1h delay)", () => {
    expect(indexSrc).toMatch(/runUniverseTick\(\)\.catch/);
  });

  it("guards the tick job against NODE_ENV=test", () => {
    expect(indexSrc).toMatch(/NODE_ENV\s*!==\s*"test"/);
  });
});

/* ─── DAILY BRIEF CONSISTENCY ─── */
describe("dailyBrief checkEmergingEvents stays consistent with pressureService", () => {
  const dailyBriefSrc = fs.readFileSync(
    path.resolve(__dirname, "routers/dailyBrief.ts"),
    "utf-8"
  );

  it("sets expiresAt when activating an event", () => {
    expect(dailyBriefSrc).toContain("expiresAt");
    expect(dailyBriefSrc).toContain("typicalCycleDays");
  });

  it("resets playerParticipation on activation", () => {
    expect(dailyBriefSrc).toMatch(/playerParticipation:\s*0/);
  });
});
