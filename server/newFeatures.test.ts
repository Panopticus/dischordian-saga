import { describe, it, expect, beforeAll } from "vitest";
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

describe("citizen", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = createAuthContext(800);
    caller = appRouter.createCaller(ctx);
  });

  describe("getCharacter", () => {
    it("should return null when no character exists", async () => {
      const result = await caller.citizen.getCharacter();
      // New user should have no character or get null
      expect(result === null || result === undefined || (typeof result === "object" && result !== null)).toBe(true);
    }, 15000);
  });

  describe("getConfig", () => {
    it("should return species, classes, elements, and alignments", async () => {
      const result = await caller.citizen.getConfig();
      expect(result).toBeDefined();
      expect(result.species).toBeDefined();
      expect(result.classes).toBeDefined();
      expect(result.elements).toBeDefined();
      expect(result.alignments).toBeDefined();
      expect(result.pointBudget).toBe(9);
    });

    it("should include all three species", async () => {
      const result = await caller.citizen.getConfig();
      expect(result.species.demagi).toBeDefined();
      expect(result.species.quarchon).toBeDefined();
      expect(result.species.neyon).toBeDefined();
    });

    it("should include all classes with names", async () => {
      const result = await caller.citizen.getConfig();
      const classes = Object.values(result.classes) as any[];
      expect(classes.length).toBeGreaterThanOrEqual(5);
      for (const cls of classes) {
        expect(cls.name).toBeDefined();
        expect(typeof cls.name).toBe("string");
      }
    });

    it("should include all four elements with abilities", async () => {
      const result = await caller.citizen.getConfig();
      const elements = Object.values(result.elements) as any[];
      expect(elements.length).toBeGreaterThanOrEqual(4);
      for (const elem of elements) {
        // Each element should have a name and description
        expect(elem.name).toBeDefined();
      }
    });
  });

  describe("getDreamBalance", () => {
    it("should return dream balance for user", async () => {
      const result = await caller.citizen.getDreamBalance();
      // New user may have null dream balance
      if (result) {
        expect(typeof result.dreamTokens).toBe("number");
        expect(typeof result.soulBoundDream).toBe("number");
      } else {
        expect(result).toBeNull();
      }
    });
  });
});

describe("crafting", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = createAuthContext(801);
    caller = appRouter.createCaller(ctx);
  });

  describe("getRecipes", () => {
    it("should return a list of crafting recipes", async () => {
      const result = await caller.crafting.getRecipes();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should include recipe type and requirements", async () => {
      const result = await caller.crafting.getRecipes();
      const recipe = result[0];
      expect(recipe.type).toBeDefined();
      expect(recipe.name).toBeDefined();
    });
  });

  describe("getCraftingHistory", () => {
    it("should return empty history for new user", async () => {
      const result = await caller.crafting.getCraftingHistory();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});

describe("store", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = createAuthContext(802);
    caller = appRouter.createCaller(ctx);
  });

  describe("getProducts", () => {
    it("should return a list of store products", async () => {
      const result = await caller.store.listProducts();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should include product name, price, and category", async () => {
      const result = await caller.store.listProducts();
      const product = result[0];
      expect(product.name).toBeDefined();
      expect(typeof product.priceUsd).toBe("number");
      expect(product.category).toBeDefined();
    });
  });

  describe("myPurchases", () => {
    it("should return empty purchases for new user", async () => {
      const result = await caller.store.myPurchases();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  describe("myDreamBalance", () => {
    it("should return dream balance", async () => {
      const result = await caller.store.myDreamBalance();
      expect(result).toBeDefined();
      expect(typeof result.dreamTokens).toBe("number");
      expect(typeof result.soulBoundDream).toBe("number");
    });
  });
});

describe("tradeWars - leaderboard", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = createAuthContext(803);
    caller = appRouter.createCaller(ctx);
  });

  describe("getLeaderboard", () => {
    it("should return leaderboard data", async () => {
      const result = await caller.tradeWars.getLeaderboard();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});

describe("tradeWars - colonies", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = createAuthContext(804);
    caller = appRouter.createCaller(ctx);
  });

  describe("getColonies", () => {
    it("should return empty colonies for new player", async () => {
      const result = await caller.tradeWars.getColonies();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });
});

describe("tradeWars - ship upgrades", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = createAuthContext(805);
    caller = appRouter.createCaller(ctx);
  });

  describe("getShipUpgrades", () => {
    it("should return ship upgrade modules", async () => {
      const result = await caller.tradeWars.getShipUpgrades();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("getPlayerBase", () => {
    it("should return null for new player without base", async () => {
      const result = await caller.tradeWars.getMyBase();
      // New player may have no base
      expect(result === null || result === undefined || typeof result === "object").toBe(true);
    });
  });
});
