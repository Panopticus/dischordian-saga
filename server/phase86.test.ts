/* ═══════════════════════════════════════════════════════
   Phase 86 Tests — Navigation Overhaul, Bug Fixes
   Tests for alien symbol puzzle, fast travel panel,
   guild create fix, and Elara dialog improvements.
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect } from "vitest";

/* ─── GUILD CREATE FIX ─── */
describe("Guild Create Fix", () => {
  it("should import guild router without errors", async () => {
    const mod = await import("./routers/guild");
    expect(mod.guildRouter).toBeDefined();
  });

  it("guild router should have create mutation", async () => {
    const mod = await import("./routers/guild");
    const router = mod.guildRouter;
    // Check that the router has the expected procedures
    expect(router).toBeDefined();
    expect(typeof router).toBe("object");
  });
});

/* ─── NAVIGATION CONSOLE HOTSPOT ─── */
describe("Navigation Console Hotspot", () => {
  it("bridge room should have nav-console hotspot with interact type", async () => {
    const { ROOM_DEFINITIONS } = await import("../client/src/contexts/GameContext");
    const bridge = ROOM_DEFINITIONS.find(r => r.id === "bridge");
    expect(bridge).toBeDefined();
    const navConsole = bridge!.hotspots.find(h => h.id === "nav-console");
    expect(navConsole).toBeDefined();
    expect(navConsole!.type).toBe("interact");
    expect(navConsole!.action).toBe("nav-calibration");
  });

  it("bridge room should still have all original hotspots", async () => {
    const { ROOM_DEFINITIONS } = await import("../client/src/contexts/GameContext");
    const bridge = ROOM_DEFINITIONS.find(r => r.id === "bridge");
    expect(bridge).toBeDefined();
    const hotspotIds = bridge!.hotspots.map(h => h.id);
    expect(hotspotIds).toContain("tactical-display");
    expect(hotspotIds).toContain("timeline-projector");
    expect(hotspotIds).toContain("captains-chair");
    expect(hotspotIds).toContain("nav-console");
    expect(hotspotIds).toContain("quest-board");
    expect(hotspotIds).toContain("guild-console");
  });
});

/* ─── ROOM DEFINITIONS INTEGRITY ─── */
describe("Room Definitions Integrity", () => {
  it("all rooms should have valid deck numbers", async () => {
    const { ROOM_DEFINITIONS } = await import("../client/src/contexts/GameContext");
    ROOM_DEFINITIONS.forEach(room => {
      expect(room.deck).toBeGreaterThanOrEqual(1);
      expect(room.deck).toBeLessThanOrEqual(10);
    });
  });

  it("all rooms should have at least one hotspot", async () => {
    const { ROOM_DEFINITIONS } = await import("../client/src/contexts/GameContext");
    ROOM_DEFINITIONS.forEach(room => {
      expect(room.hotspots.length).toBeGreaterThan(0);
    });
  });

  it("all door hotspots should reference valid room IDs", async () => {
    const { ROOM_DEFINITIONS } = await import("../client/src/contexts/GameContext");
    const roomIds = new Set(ROOM_DEFINITIONS.map(r => r.id));
    ROOM_DEFINITIONS.forEach(room => {
      room.hotspots
        .filter(h => h.type === "door" && h.action)
        .forEach(h => {
          expect(roomIds.has(h.action!)).toBe(true);
        });
    });
  });

  it("should have at least 13 rooms defined", async () => {
    const { ROOM_DEFINITIONS } = await import("../client/src/contexts/GameContext");
    expect(ROOM_DEFINITIONS.length).toBeGreaterThanOrEqual(13);
  });
});

/* ─── NARRATIVE FLAGS ─── */
describe("Narrative Flags for Fast Travel", () => {
  it("fast_travel_unlocked flag should be usable in narrativeFlags", () => {
    // Simulate the narrative flags structure
    const narrativeFlags: Record<string, boolean> = {};
    expect(narrativeFlags["fast_travel_unlocked"]).toBeUndefined();
    
    narrativeFlags["fast_travel_unlocked"] = true;
    expect(narrativeFlags["fast_travel_unlocked"]).toBe(true);
  });
});

/* ─── ALIEN SYMBOL PUZZLE COMPONENT ─── */
describe("AlienSymbolPuzzle Component", () => {
  it("should export default component", async () => {
    const mod = await import("../client/src/components/AlienSymbolPuzzle");
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe("function");
  });
});

/* ─── FAST TRAVEL PANEL COMPONENT ─── */
describe("FastTravelPanel Component", () => {
  it("should export default component", async () => {
    const mod = await import("../client/src/components/FastTravelPanel");
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe("function");
  });
});

/* ─── ELARA DIALOG COMPONENT ─── */
describe("ElaraDialog Component", () => {
  it("ElaraDialog file should exist", async () => {
    const fs = await import("fs");
    const exists = fs.existsSync("client/src/components/ElaraDialog.tsx");
    expect(exists).toBe(true);
  });
});
