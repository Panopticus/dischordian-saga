/* ═══════════════════════════════════════════════════════
   TESTS — Potentials Leaderboard, Trait Bonuses, Claim All
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import fs from "fs";
import {
  calculateTraitBonuses,
  CLASS_BONUSES,
  WEAPON_BONUSES,
  SPECIE_BONUSES,
} from "../shared/traitBonuses";

/* ─── Test helpers ─── */
type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext() {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "potentials-test-user",
    email: "potentials-tester@example.com",
    name: "Potentials Tester",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
  return { ctx, user };
}

function createPublicContext() {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
  return { ctx };
}

/* ═══════════════════════════════════════════════════════
   1. POTENTIALS LEADERBOARD
   ═══════════════════════════════════════════════════════ */
describe("Potentials Leaderboard", () => {
  describe("Router structure", () => {
    it("should have potentialsLeaderboard endpoint", () => {
      expect(appRouter._def.procedures).toHaveProperty("nft.potentialsLeaderboard");
    });

    it("should be a public procedure (no auth required)", async () => {
      const { ctx } = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      // Should not throw auth error
      const result = await caller.nft.potentialsLeaderboard();
      expect(result).toHaveProperty("entries");
      expect(result).toHaveProperty("total");
    }, 15000);
  });

  describe("Response shape", () => {
    it("should return entries array and total count", async () => {
      const { ctx } = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.nft.potentialsLeaderboard();

      expect(Array.isArray(result.entries)).toBe(true);
      expect(typeof result.total).toBe("number");
    });

    it("should accept optional pagination params", async () => {
      const { ctx } = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.nft.potentialsLeaderboard({ limit: 10, offset: 0 });

      expect(Array.isArray(result.entries)).toBe(true);
    });

    it("should reject invalid pagination params", async () => {
      const { ctx } = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.nft.potentialsLeaderboard({ limit: 200, offset: 0 })
      ).rejects.toThrow();

      await expect(
        caller.nft.potentialsLeaderboard({ limit: 0, offset: 0 })
      ).rejects.toThrow();
    });
  });

  describe("Frontend page", () => {
    it("should have PotentialsLeaderboardPage component file", () => {
      const exists = fs.existsSync(
        "/home/ubuntu/loredex-os/client/src/pages/PotentialsLeaderboardPage.tsx"
      );
      expect(exists).toBe(true);
    });

    it("should have the leaderboard route in App.tsx", () => {
      const appTsx = fs.readFileSync(
        "/home/ubuntu/loredex-os/client/src/App.tsx",
        "utf-8"
      );
      expect(appTsx).toContain("/potentials/leaderboard");
      expect(appTsx).toContain("PotentialsLeaderboardPage");
    });

    it("should display tier badges and rankings", () => {
      const page = fs.readFileSync(
        "/home/ubuntu/loredex-os/client/src/pages/PotentialsLeaderboardPage.tsx",
        "utf-8"
      );
      expect(page).toContain("TIER_CONFIG");
      expect(page).toContain("legendary");
      expect(page).toContain("GRAND COLLECTOR");
      expect(page).toContain("ARCHON");
    });

    it("should link back to Potentials page", () => {
      const page = fs.readFileSync(
        "/home/ubuntu/loredex-os/client/src/pages/PotentialsLeaderboardPage.tsx",
        "utf-8"
      );
      expect(page).toContain("/potentials");
    });

    it("should have leaderboard link on PotentialsPage", () => {
      const page = fs.readFileSync(
        "/home/ubuntu/loredex-os/client/src/pages/PotentialsPage.tsx",
        "utf-8"
      );
      expect(page).toContain("/potentials/leaderboard");
      expect(page).toContain("LEADERBOARD");
    });
  });
});

/* ═══════════════════════════════════════════════════════
   2. TRAIT-BASED FIGHTER BONUSES
   ═══════════════════════════════════════════════════════ */
describe("Trait-Based Fighter Bonuses", () => {
  describe("calculateTraitBonuses", () => {
    it("should return zero bonuses for empty traits", () => {
      const result = calculateTraitBonuses({});
      expect(result.total.attack).toBe(0);
      expect(result.total.defense).toBe(0);
      expect(result.total.hp).toBe(0);
      expect(result.total.speed).toBe(0);
      expect(result.breakdown).toHaveLength(0);
    });

    it("should return zero bonuses for null traits", () => {
      const result = calculateTraitBonuses({ nftClass: null, weapon: null, specie: null });
      expect(result.total.attack).toBe(0);
      expect(result.total.defense).toBe(0);
      expect(result.total.hp).toBe(0);
      expect(result.total.speed).toBe(0);
      expect(result.breakdown).toHaveLength(0);
    });

    it("should return zero bonuses for unknown traits", () => {
      const result = calculateTraitBonuses({
        nftClass: "UnknownClass",
        weapon: "UnknownWeapon",
        specie: "UnknownSpecie",
      });
      expect(result.total.attack).toBe(0);
      expect(result.breakdown).toHaveLength(0);
    });

    it("should calculate class-only bonus correctly (Assassin)", () => {
      const result = calculateTraitBonuses({ nftClass: "Assassin" });
      expect(result.total.attack).toBe(2);
      expect(result.total.defense).toBe(0);
      expect(result.total.hp).toBe(0);
      expect(result.total.speed).toBe(1);
      expect(result.breakdown).toHaveLength(1);
      expect(result.breakdown[0].source).toBe("Class: Assassin");
      expect(result.breakdown[0].bonus.label).toBe("Assassin's Edge");
    });

    it("should calculate weapon-only bonus correctly (Sword)", () => {
      const result = calculateTraitBonuses({ weapon: "Sword" });
      expect(result.total.attack).toBe(2);
      expect(result.total.defense).toBe(0);
      expect(result.total.hp).toBe(0);
      expect(result.total.speed).toBe(0);
      expect(result.breakdown).toHaveLength(1);
      expect(result.breakdown[0].source).toBe("Weapon: Sword");
    });

    it("should calculate specie-only bonus correctly (DeMagi)", () => {
      const result = calculateTraitBonuses({ specie: "DeMagi" });
      expect(result.total.attack).toBe(0);
      expect(result.total.defense).toBe(1);
      expect(result.total.hp).toBe(10);
      expect(result.total.speed).toBe(0);
      expect(result.breakdown).toHaveLength(1);
    });

    it("should stack all three trait bonuses (Spy + Daggers + Quarchon)", () => {
      const result = calculateTraitBonuses({
        nftClass: "Spy",
        weapon: "Daggers",
        specie: "Quarchon",
      });
      // Spy: atk=1, def=0, hp=0, spd=2
      // Daggers: atk=1, def=0, hp=0, spd=1
      // Quarchon: atk=1, def=0, hp=5, spd=1
      expect(result.total.attack).toBe(3);
      expect(result.total.defense).toBe(0);
      expect(result.total.hp).toBe(5);
      expect(result.total.speed).toBe(4);
      expect(result.breakdown).toHaveLength(3);
    });

    it("should stack all three trait bonuses (Engineer + Shield + DeMagi)", () => {
      const result = calculateTraitBonuses({
        nftClass: "Engineer",
        weapon: "Shield",
        specie: "DeMagi",
      });
      // Engineer: atk=0, def=2, hp=5, spd=0
      // Shield: atk=0, def=2, hp=5, spd=0
      // DeMagi: atk=0, def=1, hp=10, spd=0
      expect(result.total.attack).toBe(0);
      expect(result.total.defense).toBe(5);
      expect(result.total.hp).toBe(20);
      expect(result.total.speed).toBe(0);
      expect(result.breakdown).toHaveLength(3);
    });

    it("should handle Ne-Yon class and Ne-Yon specie together", () => {
      const result = calculateTraitBonuses({
        nftClass: "Ne-Yon",
        specie: "Ne-Yon",
      });
      // Ne-Yon class: atk=1, def=1, hp=0, spd=1
      // Ne-Yon specie: atk=1, def=1, hp=0, spd=0
      expect(result.total.attack).toBe(2);
      expect(result.total.defense).toBe(2);
      expect(result.total.hp).toBe(0);
      expect(result.total.speed).toBe(1);
      expect(result.breakdown).toHaveLength(2);
    });
  });

  describe("Bonus data completeness", () => {
    it("should have all 6 class bonuses", () => {
      const classes = Object.keys(CLASS_BONUSES);
      expect(classes).toContain("Spy");
      expect(classes).toContain("Oracle");
      expect(classes).toContain("Assassin");
      expect(classes).toContain("Engineer");
      expect(classes).toContain("Soldier");
      expect(classes).toContain("Ne-Yon");
      expect(classes).toHaveLength(6);
    });

    it("should have all 12 weapon bonuses", () => {
      const weapons = Object.keys(WEAPON_BONUSES);
      expect(weapons).toContain("Sword");
      expect(weapons).toContain("Staff");
      expect(weapons).toContain("Daggers");
      expect(weapons).toContain("Bow");
      expect(weapons).toContain("Gauntlets");
      expect(weapons).toContain("Scythe");
      expect(weapons).toContain("Spear");
      expect(weapons).toContain("Hammer");
      expect(weapons).toContain("Shield");
      expect(weapons).toContain("Claws");
      expect(weapons).toContain("Tome");
      expect(weapons).toContain("Whip");
      expect(weapons).toHaveLength(12);
    });

    it("should have all 3 specie bonuses", () => {
      const species = Object.keys(SPECIE_BONUSES);
      expect(species).toContain("DeMagi");
      expect(species).toContain("Quarchon");
      expect(species).toContain("Ne-Yon");
      expect(species).toHaveLength(3);
    });

    it("every bonus should have a label and color", () => {
      const allBonuses = [
        ...Object.values(CLASS_BONUSES),
        ...Object.values(WEAPON_BONUSES),
        ...Object.values(SPECIE_BONUSES),
      ];
      for (const bonus of allBonuses) {
        expect(typeof bonus.label).toBe("string");
        expect(bonus.label.length).toBeGreaterThan(0);
        expect(bonus.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      }
    });
  });

  describe("Router endpoint", () => {
    it("should have getTraitBonuses endpoint", () => {
      expect(appRouter._def.procedures).toHaveProperty("nft.getTraitBonuses");
    });

    it("should return bonuses data for authenticated user", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.nft.getTraitBonuses();

      expect(result).toHaveProperty("bonuses");
      expect(result).toHaveProperty("activePotential");
    });

    it("should return null bonuses for user with no claims", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.nft.getTraitBonuses();

      // Fresh test user has no claims
      expect(result.bonuses).toBeNull();
      expect(result.activePotential).toBeNull();
    });
  });

  describe("FightPage integration", () => {
    it("should import calculateTraitBonuses in FightPage", () => {
      const fight = fs.readFileSync(
        "/home/ubuntu/loredex-os/client/src/pages/FightPage.tsx",
        "utf-8"
      );
      expect(fight).toContain("calculateTraitBonuses");
      expect(fight).toContain("@shared/traitBonuses");
    });

    it("should query getTraitBonuses in FightPage", () => {
      const fight = fs.readFileSync(
        "/home/ubuntu/loredex-os/client/src/pages/FightPage.tsx",
        "utf-8"
      );
      expect(fight).toContain("trpc.nft.getTraitBonuses");
    });

    it("should display NFT TRAIT BONUSES panel in FighterDetailPanel", () => {
      const fight = fs.readFileSync(
        "/home/ubuntu/loredex-os/client/src/pages/FightPage.tsx",
        "utf-8"
      );
      expect(fight).toContain("NFT TRAIT BONUSES");
      expect(fight).toContain("traitBonuses");
    });

    it("should apply trait bonuses to boosted player in fight", () => {
      const fight = fs.readFileSync(
        "/home/ubuntu/loredex-os/client/src/pages/FightPage.tsx",
        "utf-8"
      );
      expect(fight).toContain("boostedPlayer");
      expect(fight).toContain("let hp = selectedPlayer.hp");
      expect(fight).toContain("let attack = selectedPlayer.attack");
      expect(fight).toContain("let defense = selectedPlayer.defense");
    });

    it("should show bonus indicators on stat bars", () => {
      const fight = fs.readFileSync(
        "/home/ubuntu/loredex-os/client/src/pages/FightPage.tsx",
        "utf-8"
      );
      // StatBar should accept bonus prop
      expect(fight).toContain("bonus={bonuses?.total.hp}");
      expect(fight).toContain("bonus={bonuses?.total.attack}");
      expect(fight).toContain("bonus={bonuses?.total.defense}");
      expect(fight).toContain("bonus={bonuses?.total.speed}");
    });
  });
});

/* ═══════════════════════════════════════════════════════
   3. BATCH "CLAIM ALL" FUNCTIONALITY
   ═══════════════════════════════════════════════════════ */
describe("Batch Claim All", () => {
  describe("Router structure", () => {
    it("should have batchClaimAll endpoint", () => {
      expect(appRouter._def.procedures).toHaveProperty("nft.batchClaimAll");
    });

    it("should require authentication", async () => {
      const { ctx } = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.nft.batchClaimAll({
          walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
          tokenIds: [1, 2, 3],
        })
      ).rejects.toThrow();
    });
  });

  describe("Input validation", () => {
    it("should reject invalid wallet address", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.nft.batchClaimAll({
          walletAddress: "not-a-wallet",
          tokenIds: [1, 2, 3],
        })
      ).rejects.toThrow();
    });

    it("should reject empty tokenIds array", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.nft.batchClaimAll({
          walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
          tokenIds: [],
        })
      ).rejects.toThrow();
    });

    it("should reject tokenIds over 999", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.nft.batchClaimAll({
          walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
          tokenIds: [1000],
        })
      ).rejects.toThrow();
    });

    it("should reject more than 50 tokenIds", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const tooMany = Array.from({ length: 51 }, (_, i) => i);
      await expect(
        caller.nft.batchClaimAll({
          walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
          tokenIds: tooMany,
        })
      ).rejects.toThrow();
    });
  });

  describe("PotentialsPage integration", () => {
    it("should have batchClaimAll mutation in PotentialsPage", () => {
      const page = fs.readFileSync(
        "/home/ubuntu/loredex-os/client/src/pages/PotentialsPage.tsx",
        "utf-8"
      );
      expect(page).toContain("batchClaimAll");
      expect(page).toContain("trpc.nft.batchClaimAll.useMutation");
    });

    it("should have CLAIM ALL button in GallerySection", () => {
      const page = fs.readFileSync(
        "/home/ubuntu/loredex-os/client/src/pages/PotentialsPage.tsx",
        "utf-8"
      );
      expect(page).toContain("CLAIM ALL");
      expect(page).toContain("onClaimAll");
      expect(page).toContain("isClaimingAll");
      expect(page).toContain("PackageCheck");
    });

    it("should filter unclaimed tokens before batch claim", () => {
      const page = fs.readFileSync(
        "/home/ubuntu/loredex-os/client/src/pages/PotentialsPage.tsx",
        "utf-8"
      );
      expect(page).toContain("ownedTokens.filter");
      expect(page).toContain("!claimedTokenIds.has");
    });

    it("should show loading state during batch claim", () => {
      const page = fs.readFileSync(
        "/home/ubuntu/loredex-os/client/src/pages/PotentialsPage.tsx",
        "utf-8"
      );
      expect(page).toContain("CLAIMING ALL...");
      expect(page).toContain("batchClaimAll.isPending");
    });
  });

  describe("Backend code quality", () => {
    it("should verify wallet is linked before batch claim", () => {
      const router = fs.readFileSync(
        "/home/ubuntu/loredex-os/server/routers/nft.ts",
        "utf-8"
      );
      expect(router).toContain("Wallet not linked to your account");
    });

    it("should check for already-claimed tokens in batch", () => {
      const router = fs.readFileSync(
        "/home/ubuntu/loredex-os/server/routers/nft.ts",
        "utf-8"
      );
      expect(router).toContain("alreadyClaimed");
      expect(router).toContain("unclaimedIds");
    });

    it("should verify on-chain ownership for batch claims", () => {
      const router = fs.readFileSync(
        "/home/ubuntu/loredex-os/server/routers/nft.ts",
        "utf-8"
      );
      expect(router).toContain("ownedAndUnclaimed");
      expect(router).toContain("ownershipChecks");
    });

    it("should return claimed count, skipped count, and results", () => {
      const router = fs.readFileSync(
        "/home/ubuntu/loredex-os/server/routers/nft.ts",
        "utf-8"
      );
      expect(router).toContain("claimed: results.filter");
      expect(router).toContain("skipped:");
      expect(router).toContain("results,");
    });
  });
});

/* ═══════════════════════════════════════════════════════
   4. CROSS-FEATURE INTEGRATION
   ═══════════════════════════════════════════════════════ */
describe("Cross-feature integration", () => {
  it("should have all 17 NFT procedures after additions", () => {
    const nftProcedures = Object.keys(appRouter._def.procedures).filter((k) =>
      k.startsWith("nft.")
    );
    // 14 original + 3 new (potentialsLeaderboard, batchClaimAll, getTraitBonuses) + 1 (getAllTraitBonuses)
    expect(nftProcedures.length).toBe(18);
  });

  it("should have shared traitBonuses module", () => {
    const exists = fs.existsSync("/home/ubuntu/loredex-os/shared/traitBonuses.ts");
    expect(exists).toBe(true);
  });

  it("should export calculateTraitBonuses from shared module", () => {
    const content = fs.readFileSync(
      "/home/ubuntu/loredex-os/shared/traitBonuses.ts",
      "utf-8"
    );
    expect(content).toContain("export function calculateTraitBonuses");
    expect(content).toContain("export const CLASS_BONUSES");
    expect(content).toContain("export const WEAPON_BONUSES");
    expect(content).toContain("export const SPECIE_BONUSES");
  });
});
