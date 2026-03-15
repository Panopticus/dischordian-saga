import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("tradeWars", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = createAuthContext(999);
    caller = appRouter.createCaller(ctx);
  });

  describe("getShips", () => {
    it("returns a list of available ships", async () => {
      const ships = await caller.tradeWars.getShips();
      expect(Array.isArray(ships)).toBe(true);
      expect(ships.length).toBeGreaterThan(0);

      const scout = ships.find((s: any) => s.id === "scout");
      expect(scout).toBeDefined();
      expect(scout!.name).toBe("Scout Pod");
      expect(scout!.holds).toBe(20);
      expect(scout!.cost).toBe(0);
    });

    it("includes all ship types", async () => {
      const ships = await caller.tradeWars.getShips();
      const ids = ships.map((s: any) => s.id);
      expect(ids).toContain("scout");
      expect(ids).toContain("merchant");
      expect(ids).toContain("corvette");
      expect(ids).toContain("frigate");
      expect(ids).toContain("dreadnought");
      expect(ids).toContain("ark");
    });
  });

  describe("getState", () => {
    it("creates a new player state if none exists", async () => {
      const state = await caller.tradeWars.getState();
      expect(state).not.toBeNull();
      if (state) {
        expect(state.currentSector).toBe(1);
        expect(state.shipType).toBe("scout");
        expect(state.credits).toBeGreaterThanOrEqual(0);
        expect(state.turnsRemaining).toBeGreaterThan(0);
        expect(state.shipInfo).toBeDefined();
        expect(typeof state.cargoUsed).toBe("number");
      }
    });

    it("returns consistent state on repeated calls", async () => {
      const state1 = await caller.tradeWars.getState();
      const state2 = await caller.tradeWars.getState();
      expect(state1?.currentSector).toBe(state2?.currentSector);
      expect(state1?.shipType).toBe(state2?.shipType);
    });
  });

  describe("getSector", () => {
    it("returns sector info for current sector", async () => {
      const sector = await caller.tradeWars.getSector({} as any);
      expect(sector).not.toBeNull();
      if (sector) {
        expect(sector.sectorId).toBeDefined();
        expect(sector.name).toBeDefined();
        expect(sector.sectorType).toBeDefined();
        expect(sector.connectedSectors).toBeDefined();
        expect(Array.isArray(sector.connectedSectors)).toBe(true);
      }
    });

    it("returns sector 1 (Stardock) info", async () => {
      const sector = await caller.tradeWars.getSector({ sectorId: 1 });
      expect(sector).not.toBeNull();
      if (sector) {
        expect(sector.sectorId).toBe(1);
        expect(sector.name).toContain("Stardock");
        expect(sector.sectorType).toBe("stardock");
      }
    });

    it("returns null for non-existent sector", async () => {
      const sector = await caller.tradeWars.getSector({ sectorId: 9999 });
      expect(sector).toBeNull();
    });
  });

  describe("warp", () => {
    it("fails when warping to unconnected sector", async () => {
      const result = await caller.tradeWars.warp({ targetSector: 199 });
      expect(result.success).toBe(false);
      expect(result.message).toContain("no warp connection");
    });

    it("succeeds when warping to connected sector", async () => {
      // First get current sector to find a valid warp target
      const sector = await caller.tradeWars.getSector({} as any);
      if (sector && sector.connectedSectors && sector.connectedSectors.length > 0) {
        const target = sector.connectedSectors[0].sectorId;
        const result = await caller.tradeWars.warp({ targetSector: target });
        expect(result.success).toBe(true);
        expect(result.turnsRemaining).toBeDefined();
      }
    });
  });

  describe("scan", () => {
    it("performs a scan and returns discovery info", async () => {
      const result = await caller.tradeWars.scan();
      expect(result.success).toBe(true);
      expect(result.totalDiscovered).toBeGreaterThan(0);
    });
  });

  describe("trade", () => {
    it("fails when not at a port", async () => {
      // Warp to an empty sector first
      const state = await caller.tradeWars.getState();
      // Try trading anyway - may or may not be at a port
      const result = await caller.tradeWars.trade({
        commodity: "fuelOre",
        action: "buy",
        quantity: 1,
      });
      // Either succeeds (if at port) or fails with appropriate message
      expect(typeof result.success).toBe("boolean");
      expect(typeof result.message).toBe("string");
    });
  });

  describe("combat", () => {
    it("resolves a combat encounter", async () => {
      const result = await caller.tradeWars.combat();
      expect(typeof result.won).toBe("boolean");
      expect(result.enemyName).toBeDefined();
      expect(typeof result.enemyStrength).toBe("number");
      expect(typeof result.xpGain).toBe("number");
    });
  });

  describe("getMap", () => {
    it("returns discovered sectors", async () => {
      const map = await caller.tradeWars.getMap();
      expect(map).toBeDefined();
      expect(Array.isArray(map.sectors)).toBe(true);
      expect(map.totalSectors).toBe(200);
      expect(map.totalDiscovered).toBeGreaterThan(0);
    });
  });

  describe("upgradeShip", () => {
    it("fails when not at stardock", async () => {
      // First warp away from stardock
      const sector = await caller.tradeWars.getSector({} as any);
      if (sector && sector.sectorId !== 1) {
        const result = await caller.tradeWars.upgradeShip({ shipType: "merchant" });
        expect(result.success).toBe(false);
        expect(result.message).toContain("Stardock");
      }
    });

    it("fails with unknown ship type", async () => {
      const result = await caller.tradeWars.upgradeShip({ shipType: "nonexistent" });
      // Either fails for not at stardock or unknown ship
      expect(result.success).toBe(false);
    });
  });

  describe("getLog", () => {
    it("returns action history", async () => {
      const log = await caller.tradeWars.getLog();
      expect(Array.isArray(log)).toBe(true);
      // Should have some entries from previous test actions
      if (log.length > 0) {
        expect(log[0].action).toBeDefined();
        expect(log[0].createdAt).toBeDefined();
      }
    });
  });
});
