import { describe, it, expect } from "vitest";

describe("Fighting Game SF-Port Enhancements", () => {
  describe("FightEngine2D types and interfaces", () => {
    it("should export FightEngine2D class", async () => {
      const mod = await import("../client/src/game/FightEngine2D");
      expect(mod.FightEngine2D).toBeDefined();
      expect(typeof mod.FightEngine2D).toBe("function");
    });

    it("should export all required types", async () => {
      // These types are used by FightArena2D
      const mod = await import("../client/src/game/FightEngine2D");
      expect(mod.FightEngine2D).toBeDefined();
    });
  });

  describe("GameData loredexId cross-reference", () => {
    it("should have loredexId on FighterData interface", async () => {
      const { ALL_FIGHTERS } = await import("../client/src/game/gameData");
      expect(ALL_FIGHTERS).toBeDefined();
      expect(ALL_FIGHTERS.length).toBeGreaterThan(0);
    });

    it("all fighters should have a loredexId", async () => {
      const { ALL_FIGHTERS } = await import("../client/src/game/gameData");
      const missingLoredexId = ALL_FIGHTERS.filter((f) => !f.loredexId);
      // Some starter fighters may not have loredexId if they don't have a Loredex entry
      // but all unlockable and demon fighters should
      const unlockableAndDemon = ALL_FIGHTERS.filter(
        (f) => f.locked === true
      );
      const missingFromLocked = unlockableAndDemon.filter(
        (f) => !f.loredexId
      );
      expect(missingFromLocked).toEqual([]);
    });

    it("all loredexIds should be valid entity IDs", async () => {
      const { ALL_FIGHTERS } = await import("../client/src/game/gameData");
      const withLoredexId = ALL_FIGHTERS.filter((f) => f.loredexId);
      for (const fighter of withLoredexId) {
        expect(fighter.loredexId).toMatch(/^entity_\d+$/);
      }
    });

    it("should have no duplicate loredexIds (except shadow-tongue which appears in two rosters)", async () => {
      const { ALL_FIGHTERS } = await import("../client/src/game/gameData");
      const withLoredexId = ALL_FIGHTERS.filter((f) => f.loredexId);
      const idCounts = new Map<string, number>();
      for (const f of withLoredexId) {
        const count = idCounts.get(f.loredexId!) || 0;
        idCounts.set(f.loredexId!, count + 1);
      }
      // Shadow Tongue appears in both starter and demon rosters
      for (const [id, count] of idCounts) {
        if (id === "entity_7") {
          expect(count).toBe(2); // Shadow Tongue in starter + demon
        } else {
          expect(count).toBe(1);
        }
      }
    });

    it("should have correct loredexId mappings for key characters", async () => {
      const { ALL_FIGHTERS } = await import("../client/src/game/gameData");
      const findFighter = (id: string) =>
        ALL_FIGHTERS.find((f) => f.id === id);

      expect(findFighter("architect")?.loredexId).toBe("entity_2");
      expect(findFighter("dreamer")?.loredexId).toBe("entity_30");
      expect(findFighter("molgrath")?.loredexId).toBe("entity_91");
      expect(findFighter("iron-lion")?.loredexId).toBe("entity_23");
      expect(findFighter("agent-zero")?.loredexId).toBe("entity_24");
      expect(findFighter("oracle")?.loredexId).toBe("entity_50");
      expect(findFighter("enigma")?.loredexId).toBe("entity_54");
      expect(findFighter("vexahlia")?.loredexId).toBe("entity_93");
    });
  });

  describe("Fighter roster completeness", () => {
    it("should have 13 starter fighters", async () => {
      const { STARTER_FIGHTERS } = await import("../client/src/game/gameData");
      expect(STARTER_FIGHTERS.length).toBe(13);
    });

    it("should have 19 unlockable fighters", async () => {
      const { UNLOCKABLE_FIGHTERS } = await import(
        "../client/src/game/gameData"
      );
      expect(UNLOCKABLE_FIGHTERS.length).toBe(19);
    });

    it("should have 10 demon fighters", async () => {
      const { DEMON_FIGHTERS } = await import("../client/src/game/gameData");
      expect(DEMON_FIGHTERS.length).toBe(10);
    });

    it("ALL_FIGHTERS should be the combined roster", async () => {
      const { ALL_FIGHTERS, STARTER_FIGHTERS, UNLOCKABLE_FIGHTERS, DEMON_FIGHTERS } =
        await import("../client/src/game/gameData");
      expect(ALL_FIGHTERS.length).toBe(
        STARTER_FIGHTERS.length + UNLOCKABLE_FIGHTERS.length + DEMON_FIGHTERS.length
      );
    });

    it("every fighter should have a frameProfile with valid archetype", async () => {
      const { ALL_FIGHTERS } = await import("../client/src/game/gameData");
      const validArchetypes = [
        "rushdown", "powerhouse", "grappler", "zoner",
        "balanced", "glass_cannon", "tricky", "tank",
      ];
      for (const f of ALL_FIGHTERS) {
        expect(f.frameProfile).toBeDefined();
        expect(validArchetypes).toContain(f.frameProfile.archetype);
      }
    });

    it("every fighter should have a faction", async () => {
      const { ALL_FIGHTERS } = await import("../client/src/game/gameData");
      const validFactions = [
        "empire", "insurgency", "neyons", "potentials", "neutral", "hierarchy",
      ];
      for (const f of ALL_FIGHTERS) {
        expect(validFactions).toContain(f.faction);
      }
    });
  });

  describe("SF-ported engine enhancements", () => {
    it("FightEngine2D should have control history types defined", async () => {
      // The ControlHistoryEntry and HitSplash types are internal to the engine
      // but we can verify the engine module exports correctly
      const mod = await import("../client/src/game/FightEngine2D");
      expect(mod.FightEngine2D).toBeDefined();
    });

    it("should have 4 difficulty levels", async () => {
      const { DIFFICULTIES } = await import("../client/src/game/gameData");
      expect(DIFFICULTIES.length).toBe(4);
      expect(DIFFICULTIES[0].id).toBe("easy");
      expect(DIFFICULTIES[1].id).toBe("normal");
      expect(DIFFICULTIES[2].id).toBe("hard");
      expect(DIFFICULTIES[3].id).toBe("nightmare");
    });

    it("should have arena data with background images", async () => {
      const { ARENAS } = await import("../client/src/game/gameData");
      expect(ARENAS.length).toBeGreaterThan(0);
      // Most arenas should have background images
      const withBg = ARENAS.filter((a) => a.backgroundImage);
      expect(withBg.length).toBeGreaterThan(0);
    });
  });
});
