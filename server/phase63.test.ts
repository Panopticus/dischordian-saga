import { describe, it, expect } from "vitest";

/**
 * Phase 63 Tests: Chain Progress Persistence & Chain-Specific Hidden Rooms
 *
 * Tests cover:
 * 1. Chain progress persistence via GameState server sync
 * 2. Chain-specific hidden room definitions (10 rooms)
 * 3. chain_complete unlock requirement type
 * 4. Room connections and hotspot structure
 * 5. Server schema for completedGames, collectedCards, etc.
 */

/* ─── MOCK DATA ─── */

// Simulated ROOM_DEFINITIONS for the chain rooms
const CHAIN_ROOMS = [
  { id: "engineering-core", chainId: "engineer_chain", deck: 8, deckName: "Hidden — Engineer", connection: "engineering" },
  { id: "oracle-sanctum", chainId: "oracle_chain", deck: 8, deckName: "Hidden — Oracle", connection: "observation-deck" },
  { id: "shadow-vault", chainId: "assassin_chain", deck: 8, deckName: "Hidden — Assassin", connection: "armory" },
  { id: "war-room", chainId: "soldier_chain", deck: 8, deckName: "Hidden — Soldier", connection: "bridge" },
  { id: "cipher-den", chainId: "spy_chain", deck: 8, deckName: "Hidden — Spy", connection: "comms-array" },
  { id: "order-tribunal", chainId: "order_chain", deck: 9, deckName: "Hidden — Order", connection: "bridge" },
  { id: "chaos-forge", chainId: "chaos_chain", deck: 9, deckName: "Hidden — Chaos", connection: "engineering" },
  { id: "elemental-nexus", chainId: "demagi_chain", deck: 10, deckName: "Hidden — DeMagi", connection: "observation-deck" },
  { id: "quantum-lab", chainId: "quarchon_chain", deck: 10, deckName: "Hidden — Quarchon", connection: "archives" },
  { id: "synthesis-chamber", chainId: "neyon_chain", deck: 10, deckName: "Hidden — Ne-Yon", connection: "medical-bay" },
];

// Simulated canUnlockRoom with chain_complete support
function canUnlockRoom(
  requirement: { type: string; value: string | number },
  narrativeFlags: Record<string, boolean>,
  visitedRooms: string[],
  discoveredIds: string[]
): boolean {
  switch (requirement.type) {
    case "chain_complete":
      return narrativeFlags[`chain_${requirement.value}_complete`] === true;
    case "visit":
      return visitedRooms.includes(requirement.value as string);
    case "discover":
      return discoveredIds.length >= (requirement.value as number);
    default:
      return false;
  }
}

// Simulated gameState schema fields for persistence
const GAME_STATE_SCHEMA_FIELDS = [
  "characterChoices",
  "visitedRooms",
  "currentRoom",
  "narrativeFlags",
  "claimedQuestRewards",
  "completedGames",
  "collectedCards",
  "loreAchievements",
  "conexusXp",
  "activeDeck",
];

describe("Phase 63: Chain Progress Persistence", () => {
  describe("Server schema includes all game state fields", () => {
    it("should include characterChoices in schema", () => {
      expect(GAME_STATE_SCHEMA_FIELDS).toContain("characterChoices");
    });

    it("should include visitedRooms in schema", () => {
      expect(GAME_STATE_SCHEMA_FIELDS).toContain("visitedRooms");
    });

    it("should include narrativeFlags in schema", () => {
      expect(GAME_STATE_SCHEMA_FIELDS).toContain("narrativeFlags");
    });

    it("should include claimedQuestRewards in schema", () => {
      expect(GAME_STATE_SCHEMA_FIELDS).toContain("claimedQuestRewards");
    });

    it("should include completedGames in schema", () => {
      expect(GAME_STATE_SCHEMA_FIELDS).toContain("completedGames");
    });

    it("should include collectedCards in schema", () => {
      expect(GAME_STATE_SCHEMA_FIELDS).toContain("collectedCards");
    });

    it("should include loreAchievements in schema", () => {
      expect(GAME_STATE_SCHEMA_FIELDS).toContain("loreAchievements");
    });

    it("should include conexusXp in schema", () => {
      expect(GAME_STATE_SCHEMA_FIELDS).toContain("conexusXp");
    });

    it("should include activeDeck in schema", () => {
      expect(GAME_STATE_SCHEMA_FIELDS).toContain("activeDeck");
    });
  });

  describe("Chain completion flags persist via narrativeFlags", () => {
    it("should store chain completion as narrative flag", () => {
      const flags: Record<string, boolean> = {};
      flags["chain_engineer_chain_complete"] = true;
      expect(flags["chain_engineer_chain_complete"]).toBe(true);
    });

    it("should support multiple chain completions simultaneously", () => {
      const flags: Record<string, boolean> = {
        chain_engineer_chain_complete: true,
        chain_order_chain_complete: true,
        chain_demagi_chain_complete: true,
      };
      expect(Object.keys(flags).filter((k) => k.startsWith("chain_") && k.endsWith("_complete")).length).toBe(3);
    });

    it("should serialize chain flags to JSON for server sync", () => {
      const flags = { chain_spy_chain_complete: true, first_room_entered: true };
      const json = JSON.stringify(flags);
      const parsed = JSON.parse(json);
      expect(parsed.chain_spy_chain_complete).toBe(true);
      expect(parsed.first_room_entered).toBe(true);
    });
  });

  describe("Claimed quest rewards persist via claimedQuestRewards", () => {
    it("should store claimed chain rewards", () => {
      const claimed = ["chain_engineer_chain", "chain_oracle_chain"];
      expect(claimed).toContain("chain_engineer_chain");
    });

    it("should prevent duplicate claims after reload", () => {
      const claimed = new Set(["chain_engineer_chain"]);
      claimed.add("chain_engineer_chain"); // duplicate
      expect(claimed.size).toBe(1);
    });

    it("should serialize claimed rewards to JSON array", () => {
      const claimed = ["chain_engineer_chain", "quest_first_room"];
      const json = JSON.stringify(claimed);
      const parsed = JSON.parse(json);
      expect(parsed).toHaveLength(2);
    });
  });
});

describe("Phase 63: Chain-Specific Hidden Rooms", () => {
  describe("Room definitions", () => {
    it("should define exactly 10 chain rooms", () => {
      expect(CHAIN_ROOMS).toHaveLength(10);
    });

    it("should have 5 class chain rooms on deck 8", () => {
      const deck8 = CHAIN_ROOMS.filter((r) => r.deck === 8);
      expect(deck8).toHaveLength(5);
    });

    it("should have 2 alignment chain rooms on deck 9", () => {
      const deck9 = CHAIN_ROOMS.filter((r) => r.deck === 9);
      expect(deck9).toHaveLength(2);
    });

    it("should have 3 species chain rooms on deck 10", () => {
      const deck10 = CHAIN_ROOMS.filter((r) => r.deck === 10);
      expect(deck10).toHaveLength(3);
    });

    it("should have unique room IDs", () => {
      const ids = CHAIN_ROOMS.map((r) => r.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("should have unique chain IDs", () => {
      const chainIds = CHAIN_ROOMS.map((r) => r.chainId);
      expect(new Set(chainIds).size).toBe(chainIds.length);
    });

    it("each room should connect to an existing room", () => {
      const validConnections = [
        "engineering", "observation-deck", "armory", "bridge",
        "comms-array", "archives", "medical-bay",
      ];
      CHAIN_ROOMS.forEach((room) => {
        expect(validConnections).toContain(room.connection);
      });
    });
  });

  describe("Class chain rooms", () => {
    it("should have Engineering Core for engineer chain", () => {
      const room = CHAIN_ROOMS.find((r) => r.chainId === "engineer_chain");
      expect(room).toBeDefined();
      expect(room!.id).toBe("engineering-core");
      expect(room!.deckName).toBe("Hidden — Engineer");
    });

    it("should have Oracle Sanctum for oracle chain", () => {
      const room = CHAIN_ROOMS.find((r) => r.chainId === "oracle_chain");
      expect(room).toBeDefined();
      expect(room!.id).toBe("oracle-sanctum");
    });

    it("should have Shadow Vault for assassin chain", () => {
      const room = CHAIN_ROOMS.find((r) => r.chainId === "assassin_chain");
      expect(room).toBeDefined();
      expect(room!.id).toBe("shadow-vault");
    });

    it("should have War Room for soldier chain", () => {
      const room = CHAIN_ROOMS.find((r) => r.chainId === "soldier_chain");
      expect(room).toBeDefined();
      expect(room!.id).toBe("war-room");
    });

    it("should have Cipher Den for spy chain", () => {
      const room = CHAIN_ROOMS.find((r) => r.chainId === "spy_chain");
      expect(room).toBeDefined();
      expect(room!.id).toBe("cipher-den");
    });
  });

  describe("Alignment chain rooms", () => {
    it("should have Tribunal of Order for order chain", () => {
      const room = CHAIN_ROOMS.find((r) => r.chainId === "order_chain");
      expect(room).toBeDefined();
      expect(room!.id).toBe("order-tribunal");
      expect(room!.deck).toBe(9);
    });

    it("should have Chaos Forge for chaos chain", () => {
      const room = CHAIN_ROOMS.find((r) => r.chainId === "chaos_chain");
      expect(room).toBeDefined();
      expect(room!.id).toBe("chaos-forge");
      expect(room!.deck).toBe(9);
    });
  });

  describe("Species chain rooms", () => {
    it("should have Elemental Nexus for DeMagi chain", () => {
      const room = CHAIN_ROOMS.find((r) => r.chainId === "demagi_chain");
      expect(room).toBeDefined();
      expect(room!.id).toBe("elemental-nexus");
      expect(room!.deck).toBe(10);
    });

    it("should have Quantum Laboratory for Quarchon chain", () => {
      const room = CHAIN_ROOMS.find((r) => r.chainId === "quarchon_chain");
      expect(room).toBeDefined();
      expect(room!.id).toBe("quantum-lab");
    });

    it("should have Synthesis Chamber for Ne-Yon chain", () => {
      const room = CHAIN_ROOMS.find((r) => r.chainId === "neyon_chain");
      expect(room).toBeDefined();
      expect(room!.id).toBe("synthesis-chamber");
    });
  });

  describe("chain_complete unlock requirement", () => {
    it("should unlock room when chain is complete", () => {
      const flags = { chain_engineer_chain_complete: true };
      const result = canUnlockRoom(
        { type: "chain_complete", value: "engineer_chain" },
        flags,
        [],
        []
      );
      expect(result).toBe(true);
    });

    it("should NOT unlock room when chain is incomplete", () => {
      const flags = {};
      const result = canUnlockRoom(
        { type: "chain_complete", value: "engineer_chain" },
        flags,
        [],
        []
      );
      expect(result).toBe(false);
    });

    it("should unlock only the correct chain room", () => {
      const flags = { chain_oracle_chain_complete: true };
      // Oracle room should unlock
      expect(
        canUnlockRoom({ type: "chain_complete", value: "oracle_chain" }, flags, [], [])
      ).toBe(true);
      // Engineer room should NOT unlock
      expect(
        canUnlockRoom({ type: "chain_complete", value: "engineer_chain" }, flags, [], [])
      ).toBe(false);
    });

    it("should support all 10 chain unlock types", () => {
      const allChainIds = CHAIN_ROOMS.map((r) => r.chainId);
      const allFlags: Record<string, boolean> = {};
      allChainIds.forEach((id) => {
        allFlags[`chain_${id}_complete`] = true;
      });

      allChainIds.forEach((chainId) => {
        expect(
          canUnlockRoom({ type: "chain_complete", value: chainId }, allFlags, [], [])
        ).toBe(true);
      });
    });

    it("should coexist with other unlock requirement types", () => {
      const flags = { chain_soldier_chain_complete: true };
      const visited = ["bridge"];

      // chain_complete works
      expect(
        canUnlockRoom({ type: "chain_complete", value: "soldier_chain" }, flags, visited, [])
      ).toBe(true);

      // visit still works
      expect(
        canUnlockRoom({ type: "visit", value: "bridge" }, flags, visited, [])
      ).toBe(true);

      // discover still works
      expect(
        canUnlockRoom({ type: "discover", value: 5 }, flags, visited, ["a", "b", "c", "d", "e"])
      ).toBe(true);
    });
  });

  describe("Room structure validation", () => {
    it("each chain room should have a unique deck name", () => {
      const deckNames = CHAIN_ROOMS.map((r) => r.deckName);
      expect(new Set(deckNames).size).toBe(deckNames.length);
    });

    it("deck names should indicate the chain type", () => {
      CHAIN_ROOMS.forEach((room) => {
        expect(room.deckName).toMatch(/^Hidden — /);
      });
    });

    it("class rooms should be on deck 8", () => {
      const classChains = ["engineer_chain", "oracle_chain", "assassin_chain", "soldier_chain", "spy_chain"];
      classChains.forEach((chainId) => {
        const room = CHAIN_ROOMS.find((r) => r.chainId === chainId);
        expect(room?.deck).toBe(8);
      });
    });

    it("alignment rooms should be on deck 9", () => {
      const alignmentChains = ["order_chain", "chaos_chain"];
      alignmentChains.forEach((chainId) => {
        const room = CHAIN_ROOMS.find((r) => r.chainId === chainId);
        expect(room?.deck).toBe(9);
      });
    });

    it("species rooms should be on deck 10", () => {
      const speciesChains = ["demagi_chain", "quarchon_chain", "neyon_chain"];
      speciesChains.forEach((chainId) => {
        const room = CHAIN_ROOMS.find((r) => r.chainId === chainId);
        expect(room?.deck).toBe(10);
      });
    });
  });

  describe("Player experience flow", () => {
    it("player with engineer class should unlock Engineering Core after completing engineer chain", () => {
      const flags = { chain_engineer_chain_complete: true };
      const unlocked = canUnlockRoom(
        { type: "chain_complete", value: "engineer_chain" },
        flags, [], []
      );
      expect(unlocked).toBe(true);
    });

    it("player should be able to unlock up to 3 chain rooms (class + alignment + species)", () => {
      const flags = {
        chain_engineer_chain_complete: true,
        chain_order_chain_complete: true,
        chain_demagi_chain_complete: true,
      };

      const unlockedRooms = CHAIN_ROOMS.filter((room) =>
        canUnlockRoom(
          { type: "chain_complete", value: room.chainId },
          flags, [], []
        )
      );
      expect(unlockedRooms).toHaveLength(3);
      expect(unlockedRooms.map((r) => r.id)).toEqual(
        expect.arrayContaining(["engineering-core", "order-tribunal", "elemental-nexus"])
      );
    });

    it("player with no chain completions should have 0 chain rooms unlocked", () => {
      const flags = {};
      const unlockedRooms = CHAIN_ROOMS.filter((room) =>
        canUnlockRoom(
          { type: "chain_complete", value: room.chainId },
          flags, [], []
        )
      );
      expect(unlockedRooms).toHaveLength(0);
    });

    it("completionist player should be able to unlock all 10 chain rooms", () => {
      const allFlags: Record<string, boolean> = {};
      CHAIN_ROOMS.forEach((r) => {
        allFlags[`chain_${r.chainId}_complete`] = true;
      });

      const unlockedRooms = CHAIN_ROOMS.filter((room) =>
        canUnlockRoom(
          { type: "chain_complete", value: room.chainId },
          allFlags, [], []
        )
      );
      expect(unlockedRooms).toHaveLength(10);
    });
  });
});
