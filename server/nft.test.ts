import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import fs from "fs";

/* ─── Test helpers ─── */
type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext() {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "nft-test-user",
    email: "nft-tester@example.com",
    name: "NFT Tester",
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

describe("NFT Router — The Potentials Integration", () => {
  /* ─── Router structure tests ─── */
  describe("Router structure", () => {
    it("should have nft namespace on appRouter", () => {
      expect(appRouter._def.procedures).toHaveProperty("nft.getCollectionStats");
      expect(appRouter._def.procedures).toHaveProperty("nft.getTokenMetadata");
      expect(appRouter._def.procedures).toHaveProperty("nft.getClaimStatus");
      expect(appRouter._def.procedures).toHaveProperty("nft.linkWallet");
      expect(appRouter._def.procedures).toHaveProperty("nft.unlinkWallet");
      expect(appRouter._def.procedures).toHaveProperty("nft.getLinkedWallets");
      expect(appRouter._def.procedures).toHaveProperty("nft.checkOwnership");
      expect(appRouter._def.procedures).toHaveProperty("nft.claimCard");
      expect(appRouter._def.procedures).toHaveProperty("nft.getMyClaims");
      expect(appRouter._def.procedures).toHaveProperty("nft.browsePotentials");
      expect(appRouter._def.procedures).toHaveProperty("nft.getSignMessage");
    });

    it("should have 17 total NFT procedures", () => {
      const nftProcedures = Object.keys(appRouter._def.procedures).filter((k) =>
        k.startsWith("nft.")
      );
      expect(nftProcedures.length).toBe(17);
    });

    it("should have batch cache and arena perks procedures", () => {
      expect(appRouter._def.procedures).toHaveProperty("nft.batchCacheMetadata");
      expect(appRouter._def.procedures).toHaveProperty("nft.getArenaPerks");
      expect(appRouter._def.procedures).toHaveProperty("nft.getCacheProgress");
    });
  });

  /* ─── Collection stats (public) ─── */
  describe("getCollectionStats", () => {
    it("should return collection stats with totalSupply of 1000", async () => {
      const { ctx } = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      const stats = await caller.nft.getCollectionStats();

      expect(stats).toHaveProperty("totalSupply", 1000);
      expect(stats).toHaveProperty("contractAddress");
      expect(stats.contractAddress).toMatch(/^0x[a-fA-F0-9]{40}$/);
      expect(typeof stats.totalClaimed).toBe("number");
    });
  });

  /* ─── Claim status (public) ─── */
  describe("getClaimStatus", () => {
    it("should return unclaimed for a fresh token", async () => {
      const { ctx } = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      const status = await caller.nft.getClaimStatus({ tokenId: 999 });

      expect(status).toHaveProperty("claimed");
      expect(typeof status.claimed).toBe("boolean");
    });

    it("should reject invalid tokenId", async () => {
      const { ctx } = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(caller.nft.getClaimStatus({ tokenId: 1001 })).rejects.toThrow();
      await expect(caller.nft.getClaimStatus({ tokenId: -1 })).rejects.toThrow();
    });
  });

  /* ─── Wallet linking (protected) ─── */
  describe("linkWallet", () => {
    it("should reject invalid wallet address format", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.nft.linkWallet({
          walletAddress: "not-a-wallet",
          message: "test",
          signature: "test",
        })
      ).rejects.toThrow();
    });

    it("should reject invalid signature", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.nft.linkWallet({
          walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
          message: "test message",
          signature: "0xinvalidsignature",
        })
      ).rejects.toThrow();
    });
  });

  /* ─── Get linked wallets (protected) ─── */
  describe("getLinkedWallets", () => {
    it("should return an array for authenticated user", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      const wallets = await caller.nft.getLinkedWallets();

      expect(Array.isArray(wallets)).toBe(true);
    });
  });

  /* ─── Get my claims (protected) ─── */
  describe("getMyClaims", () => {
    it("should return an array for authenticated user", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      const claims = await caller.nft.getMyClaims();

      expect(Array.isArray(claims)).toBe(true);
    });
  });

  /* ─── Get sign message (protected) ─── */
  describe("getSignMessage", () => {
    it("should return a message and timestamp for valid wallet", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.nft.getSignMessage({
        walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
      });

      expect(result).toHaveProperty("message");
      expect(result).toHaveProperty("timestamp");
      expect(typeof result.message).toBe("string");
      expect(result.message).toContain("LOREDEX OS");
      expect(result.message).toContain("Link Wallet");
      expect(typeof result.timestamp).toBe("number");
    });

    it("should reject invalid wallet address format", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.nft.getSignMessage({ walletAddress: "invalid" })
      ).rejects.toThrow();
    });
  });

  /* ─── Frontend page file existence ─── */
  describe("PotentialsPage", () => {
    it("should have the PotentialsPage component file", () => {
      const exists = fs.existsSync(
        "/home/ubuntu/loredex-os/client/src/pages/PotentialsPage.tsx"
      );
      expect(exists).toBe(true);
    });

    it("should have the potentials route in App.tsx", () => {
      const appTsx = fs.readFileSync(
        "/home/ubuntu/loredex-os/client/src/App.tsx",
        "utf-8"
      );
      expect(appTsx).toContain("/potentials");
      expect(appTsx).toContain("PotentialsPage");
    });

    it("should reference the correct contract address", () => {
      const page = fs.readFileSync(
        "/home/ubuntu/loredex-os/client/src/pages/PotentialsPage.tsx",
        "utf-8"
      );
      expect(page).toContain("0xfa511d5c4cce10321e6e86793cc083213c36278e");
    });

    it("should have wallet connect functionality", () => {
      const page = fs.readFileSync(
        "/home/ubuntu/loredex-os/client/src/pages/PotentialsPage.tsx",
        "utf-8"
      );
      expect(page).toContain("BrowserProvider");
      expect(page).toContain("connectWallet");
      expect(page).toContain("signAndLink");
    });

    it("should have claim card functionality", () => {
      const page = fs.readFileSync(
        "/home/ubuntu/loredex-os/client/src/pages/PotentialsPage.tsx",
        "utf-8"
      );
      expect(page).toContain("claimCard");
      expect(page).toContain("CLAIM 1/1 CARD");
    });

    it("should have metadata trait display", () => {
      const page = fs.readFileSync(
        "/home/ubuntu/loredex-os/client/src/pages/PotentialsPage.tsx",
        "utf-8"
      );
      expect(page).toContain("trait_type");
      expect(page).toContain("CLASS_ICONS");
    });
  });

  /* ─── Schema tests ─── */
  describe("Database schema", () => {
    it("should have linked_wallets table in schema", () => {
      const schema = fs.readFileSync(
        "/home/ubuntu/loredex-os/drizzle/schema.ts",
        "utf-8"
      );
      expect(schema).toContain("linked_wallets");
      expect(schema).toContain("walletAddress");
      expect(schema).toContain("verificationSignature");
    });

    it("should have nft_claims table with one-time claim fields", () => {
      const schema = fs.readFileSync(
        "/home/ubuntu/loredex-os/drizzle/schema.ts",
        "utf-8"
      );
      expect(schema).toContain("nft_claims");
      expect(schema).toContain("claimerWallet");
      expect(schema).toContain("claimerUserId");
      expect(schema).toContain("metadataSnapshot");
    });

    it("should have nft_metadata_cache table with trait columns", () => {
      const schema = fs.readFileSync(
        "/home/ubuntu/loredex-os/drizzle/schema.ts",
        "utf-8"
      );
      expect(schema).toContain("nft_metadata_cache");
      expect(schema).toContain("nftClass");
      expect(schema).toContain("weapon");
      expect(schema).toContain("background");
      expect(schema).toContain("specie");
    });
  });

  /* ─── Arena perks (protected) ─── */
  describe("getArenaPerks", () => {
    it("should return perks data for authenticated user", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      const perks = await caller.nft.getArenaPerks();

      expect(perks).toHaveProperty("isHolder");
      expect(typeof perks.isHolder).toBe("boolean");
      expect(perks).toHaveProperty("claimedCount");
      expect(typeof perks.claimedCount).toBe("number");
      expect(perks).toHaveProperty("perks");
      expect(perks.perks).toHaveProperty("fightPointsMultiplier");
      expect(perks.perks).toHaveProperty("title");
      expect(perks.perks).toHaveProperty("exclusiveArenaTheme");
      expect(perks.perks).toHaveProperty("holderBadge");
    });

    it("should return non-holder defaults for user with no claims", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      const perks = await caller.nft.getArenaPerks();

      // Fresh test user has no claims
      expect(perks.isHolder).toBe(false);
      expect(perks.claimedCount).toBe(0);
      expect(perks.perks.fightPointsMultiplier).toBe(1.0);
      expect(perks.perks.title).toBeNull();
    });
  });

  /* ─── Cache progress (public) ─── */
  describe("getCacheProgress", () => {
    it("should return cache progress", async () => {
      const { ctx } = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      const stats = await caller.nft.getCacheProgress();

      expect(stats).toHaveProperty("cached");
      expect(typeof stats.cached).toBe("number");
      expect(stats).toHaveProperty("total", 1000);
    });
  });

  /* ─── Arena perks code quality ─── */
  describe("Arena perks code quality", () => {
    it("should have Potentials link in sidebar navigation", () => {
      const appShell = fs.readFileSync(
        "/home/ubuntu/loredex-os/client/src/components/AppShell.tsx",
        "utf-8"
      );
      expect(appShell).toContain("/potentials");
    });

    it("should have Potentials section in StorePage", () => {
      const store = fs.readFileSync(
        "/home/ubuntu/loredex-os/client/src/pages/StorePage.tsx",
        "utf-8"
      );
      expect(store).toContain("THE POTENTIALS");
      expect(store).toContain("/potentials");
    });

    it("should have arena perks display in FightPage", () => {
      const fight = fs.readFileSync(
        "/home/ubuntu/loredex-os/client/src/pages/FightPage.tsx",
        "utf-8"
      );
      expect(fight).toContain("getArenaPerks");
      expect(fight).toContain("NFT BONUS");
      expect(fight).toContain("holderPerks");
    });

    it("should have arena perks info on PotentialsPage overview", () => {
      const page = fs.readFileSync(
        "/home/ubuntu/loredex-os/client/src/pages/PotentialsPage.tsx",
        "utf-8"
      );
      expect(page).toContain("ARENA PERKS");
      expect(page).toContain("bonus fight points");
      expect(page).toContain("Collector's Champion");
    });
  });

  /* ─── NFT router helper function tests ─── */
  describe("NFT router code quality", () => {
    it("should use ethers.verifyMessage for signature verification", () => {
      const router = fs.readFileSync(
        "/home/ubuntu/loredex-os/server/routers/nft.ts",
        "utf-8"
      );
      expect(router).toContain("ethers.verifyMessage");
    });

    it("should have IPFS resolution support", () => {
      const router = fs.readFileSync(
        "/home/ubuntu/loredex-os/server/routers/nft.ts",
        "utf-8"
      );
      expect(router).toContain("ipfs://");
      expect(router).toContain("ipfs.io/ipfs/");
    });

    it("should enforce one-time claim per token", () => {
      const router = fs.readFileSync(
        "/home/ubuntu/loredex-os/server/routers/nft.ts",
        "utf-8"
      );
      // Check for the claim-once guard
      expect(router).toContain("already been claimed");
      expect(router).toContain("can only be claimed once");
    });

    it("should verify on-chain ownership before claiming", () => {
      const router = fs.readFileSync(
        "/home/ubuntu/loredex-os/server/routers/nft.ts",
        "utf-8"
      );
      expect(router).toContain("contract.ownerOf");
      expect(router).toContain("On-chain ownership verification");
    });

    it("should upload card image to S3", () => {
      const router = fs.readFileSync(
        "/home/ubuntu/loredex-os/server/routers/nft.ts",
        "utf-8"
      );
      expect(router).toContain("storagePut");
      expect(router).toContain("nft-cards/potential-");
    });
  });
});
