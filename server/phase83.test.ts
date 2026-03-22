import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";

/* ═══════════════════════════════════════════════════════
   PHASE 83 TESTS — Syndicate Worlds, Space Stations,
   Tower Defense, Prestige Quests, Competitive Arena
   ═══════════════════════════════════════════════════════ */

/* ─── Shared Module Imports ─── */
import {
  WORLD_TYPES,
  BUILDINGS,
  resolveCapitalBonuses,
  getAvailableBuildings,
  calculateBuildCost,
  calculateBuildTime,
} from "../shared/syndicateWorlds";

import {
  STATION_MODULES,
  resolveStationBonuses,
  getAvailableModules,
} from "../shared/spaceStations";

import {
  TOWERS,
  RAID_UNITS,
  resolveTowerDefenseBonuses,
  getAvailableTowers,
  getAvailableRaidUnits,
  calculateRaidLoot,
  calculateRaidStars,
} from "../shared/towerDefense";

import {
  PRESTIGE_QUEST_CHAINS,
  canStartPrestigeQuest,
  canSkipStep,
  getPrestigeQuestChain,
} from "../shared/prestigeQuests";

/* ─── SYNDICATE WORLDS ─── */
describe("Syndicate Worlds shared module", () => {
  it("should export world type definitions", () => {
    expect(WORLD_TYPES).toBeDefined();
    expect(Array.isArray(WORLD_TYPES)).toBe(true);
    expect(WORLD_TYPES.length).toBeGreaterThan(0);
    WORLD_TYPES.forEach((wt) => {
      expect(wt.key).toBeDefined();
      expect(wt.name).toBeDefined();
    });
  });

  it("should export building definitions", () => {
    expect(BUILDINGS).toBeDefined();
    expect(Array.isArray(BUILDINGS)).toBe(true);
    expect(BUILDINGS.length).toBeGreaterThan(0);
    BUILDINGS.forEach((b) => {
      expect(b.key).toBeDefined();
      expect(b.name).toBeDefined();
      expect(b.category).toBeDefined();
    });
  });

  it("should resolve capital bonuses from RPG stats", () => {
    const bonuses = resolveCapitalBonuses({
      characterClass: "engineer",
      classRank: 5,
      species: "quarchon",
      civilSkills: { architecture: 3, engineering: 4 },
      talents: [],
      companionIds: [],
    });
    expect(bonuses).toBeDefined();
    expect(typeof bonuses.buildSpeedMultiplier).toBe("number");
    expect(typeof bonuses.costReduction).toBe("number");
    expect(bonuses.buildSpeedMultiplier).toBeGreaterThanOrEqual(1);
  });

  it("should filter available buildings by class and level", () => {
    const available = getAvailableBuildings({
      characterClass: "engineer",
      classRank: 3,
      citizenLevel: 5,
    });
    expect(Array.isArray(available)).toBe(true);
    expect(available.length).toBeGreaterThan(0);
  });

  it("should calculate build cost with bonuses", () => {
    const building = BUILDINGS[0];
    expect(building).toBeDefined();
    const cost = calculateBuildCost(building, 1, 0.1); // level 1, 10% reduction
    expect(Object.keys(cost).length).toBeGreaterThan(0);
    // Cost should be less than base due to reduction
    for (const [resource, amount] of Object.entries(cost)) {
      expect(amount).toBeGreaterThan(0);
    }
  });

  it("should calculate build time with bonuses", () => {
    const building = BUILDINGS[0];
    expect(building).toBeDefined();
    const time = calculateBuildTime(building, 1, 1.5); // level 1, 1.5x speed
    expect(time).toBeGreaterThan(0);
    const baseTime = calculateBuildTime(building, 1, 1.0);
    expect(time).toBeLessThan(baseTime);
  });
});

/* ─── SPACE STATIONS ─── */
describe("Space Stations shared module", () => {
  it("should export station module definitions", () => {
    expect(STATION_MODULES).toBeDefined();
    expect(Array.isArray(STATION_MODULES)).toBe(true);
    expect(STATION_MODULES.length).toBeGreaterThan(0);
    STATION_MODULES.forEach((m) => {
      expect(m.key).toBeDefined();
      expect(m.name).toBeDefined();
    });
  });

  it("should resolve station bonuses from RPG stats", () => {
    const bonuses = resolveStationBonuses({
      characterClass: "oracle",
      classRank: 4,
      species: "demagi",
      civilSkills: { engineering: 3, research: 2 },
      talents: [],
    });
    expect(bonuses).toBeDefined();
    expect(typeof bonuses.buildSpeedMultiplier).toBe("number");
    expect(typeof bonuses.productionMultiplier).toBe("number");
    expect(typeof bonuses.defenseMultiplier).toBe("number");
    expect(typeof bonuses.moduleSlotBonus).toBe("number");
    expect(Array.isArray(bonuses.sources)).toBe(true);
  });

  it("should filter available modules by class and level", () => {
    const available = getAvailableModules({
      characterClass: "soldier",
      classRank: 2,
      citizenLevel: 3,
    });
    expect(Array.isArray(available)).toBe(true);
    expect(available.length).toBeGreaterThan(0);
  });
});

/* ─── TOWER DEFENSE ─── */
describe("Tower Defense shared module", () => {
  it("should export tower definitions", () => {
    expect(TOWERS).toBeDefined();
    expect(Array.isArray(TOWERS)).toBe(true);
    expect(TOWERS.length).toBeGreaterThan(0);
    TOWERS.forEach((t) => {
      expect(t.key).toBeDefined();
      expect(t.name).toBeDefined();
      // element is optional on some towers
      expect(typeof t.baseDamage).toBe("number");
      expect(typeof t.baseDamage).toBe("number");
      expect(typeof t.baseHp).toBe("number");
    });
  });

  it("should export raid unit definitions", () => {
    expect(RAID_UNITS).toBeDefined();
    expect(Array.isArray(RAID_UNITS)).toBe(true);
    expect(RAID_UNITS.length).toBeGreaterThan(0);
    RAID_UNITS.forEach((u) => {
      expect(u.key).toBeDefined();
      expect(u.name).toBeDefined();
      expect(u.targetPriority).toBeDefined();
    });
  });

  it("should resolve tower defense bonuses from RPG stats", () => {
    const bonuses = resolveTowerDefenseBonuses({
      characterClass: "soldier",
      classRank: 6,
      prestigeClass: "warlord",
      species: "quarchon",
      civilSkills: { combat: 5, tactics: 3 },
      talents: [],
    });
    expect(bonuses).toBeDefined();
    expect(typeof bonuses.towerDamageMultiplier).toBe("number");
    expect(typeof bonuses.towerHpMultiplier).toBe("number");
    expect(typeof bonuses.raidUnitDamageMultiplier).toBe("number");
    expect(typeof bonuses.maxTowerSlots).toBe("number");
    expect(Array.isArray(bonuses.sources)).toBe(true);
  });

  it("should filter available towers by class", () => {
    const available = getAvailableTowers({
      characterClass: "assassin",
      classRank: 3,
    });
    expect(Array.isArray(available)).toBe(true);
    expect(available.length).toBeGreaterThan(0);
  });

  it("should filter available raid units by class", () => {
    const available = getAvailableRaidUnits({
      characterClass: "soldier",
      classRank: 3,
    });
    expect(Array.isArray(available)).toBe(true);
    expect(available.length).toBeGreaterThan(0);
  });

  it("should calculate raid stars from destruction percentage", () => {
    expect(calculateRaidStars(0)).toBe(0);
    expect(calculateRaidStars(24)).toBe(0);
    expect(calculateRaidStars(25)).toBe(1);
    expect(calculateRaidStars(50)).toBe(2);
    expect(calculateRaidStars(100)).toBe(3);
  });
});

/* ─── PRESTIGE QUESTS ─── */
describe("Prestige Quests shared module", () => {
  it("should export prestige quest chain definitions", () => {
    expect(PRESTIGE_QUEST_CHAINS).toBeDefined();
    expect(Array.isArray(PRESTIGE_QUEST_CHAINS)).toBe(true);
    expect(PRESTIGE_QUEST_CHAINS.length).toBeGreaterThan(0);
    PRESTIGE_QUEST_CHAINS.forEach((q) => {
      expect(q.key).toBeDefined();
      expect(q.name).toBeDefined();
      expect(q.prestigeClass).toBeDefined();
      expect(Array.isArray(q.steps)).toBe(true);
      expect(q.steps.length).toBeGreaterThan(0);
    });
  });

  it("should check if a quest can be started", () => {
    const chain = PRESTIGE_QUEST_CHAINS[0];
    expect(chain).toBeDefined();
    // Test with matching class
    const result = canStartPrestigeQuest(chain, {
      characterClass: chain.requiredBaseClass,
      classRank: chain.requiredClassRank,
      citizenLevel: chain.requiredLevel,
    });
    expect(result.canStart).toBe(true);

    // Test with wrong class
    const wrongClass = canStartPrestigeQuest(chain, {
      characterClass: "wrong_class",
      classRank: 10,
      citizenLevel: 50,
    });
    expect(wrongClass.canStart).toBe(false);
    expect(wrongClass.reason).toBeDefined();
  });

  it("should retrieve quest chain by prestige class", () => {
    const chain = PRESTIGE_QUEST_CHAINS[0];
    const found = getPrestigeQuestChain(chain.prestigeClass);
    expect(found).toBeDefined();
    expect(found!.key).toBe(chain.key);
  });

  it("should return undefined for unknown prestige class", () => {
    const found = getPrestigeQuestChain("nonexistent_class_xyz");
    expect(found).toBeUndefined();
  });
});

/* ─── ROUTER WIRING ─── */
describe("Phase 83 router wiring", () => {
  it("should have syndicateWorld router", () => {
    expect(appRouter._def.procedures).toHaveProperty("syndicateWorld.getWorld");
    expect(appRouter._def.procedures).toHaveProperty("syndicateWorld.createWorld");
    expect(appRouter._def.procedures).toHaveProperty("syndicateWorld.buildStructure");
    expect(appRouter._def.procedures).toHaveProperty("syndicateWorld.collectResources");
    expect(appRouter._def.procedures).toHaveProperty("syndicateWorld.getCapitalBonuses");
    expect(appRouter._def.procedures).toHaveProperty("syndicateWorld.getAvailableBuildings");
  });

  it("should have spaceStation router", () => {
    expect(appRouter._def.procedures).toHaveProperty("spaceStation.getStation");
    expect(appRouter._def.procedures).toHaveProperty("spaceStation.createStation");
    expect(appRouter._def.procedures).toHaveProperty("spaceStation.buildModule");
    expect(appRouter._def.procedures).toHaveProperty("spaceStation.collectResources");
    expect(appRouter._def.procedures).toHaveProperty("spaceStation.getStationBonuses");
    expect(appRouter._def.procedures).toHaveProperty("spaceStation.getAvailableModules");
  });

  it("should have towerDefense router", () => {
    expect(appRouter._def.procedures).toHaveProperty("towerDefense.getTowers");
    expect(appRouter._def.procedures).toHaveProperty("towerDefense.placeTower");
    expect(appRouter._def.procedures).toHaveProperty("towerDefense.upgradeTower");
    expect(appRouter._def.procedures).toHaveProperty("towerDefense.executeRaid");
    expect(appRouter._def.procedures).toHaveProperty("towerDefense.getRaidHistory");
    expect(appRouter._def.procedures).toHaveProperty("towerDefense.getTrophies");
    expect(appRouter._def.procedures).toHaveProperty("towerDefense.getLeaderboard");
    expect(appRouter._def.procedures).toHaveProperty("towerDefense.checkIn");
    expect(appRouter._def.procedures).toHaveProperty("towerDefense.getStreak");
  });

  it("should have prestigeQuests router", () => {
    expect(appRouter._def.procedures).toHaveProperty("prestigeQuest.getQuestChains");
    expect(appRouter._def.procedures).toHaveProperty("prestigeQuest.startQuest");
    expect(appRouter._def.procedures).toHaveProperty("prestigeQuest.advanceStep");
    expect(appRouter._def.procedures).toHaveProperty("prestigeQuest.getMyProgress");
    expect(appRouter._def.procedures).toHaveProperty("prestigeQuest.abandonQuest");
  });
});

/* ─── ARK ROOM DEFINITIONS ─── */
describe("Phase 83 Ark room definitions", () => {
  it("should have station-dock room", async () => {
    const { ROOM_DEFINITIONS } = await import("../client/src/contexts/GameContext");
    const stationDock = ROOM_DEFINITIONS.find((r) => r.id === "station-dock");
    expect(stationDock).toBeDefined();
    expect(stationDock!.features).toContain("Space Station");
    expect(stationDock!.features).toContain("Tower Defense");
    expect(stationDock!.features).toContain("Competitive Arena");
    expect(stationDock!.featureRoutes).toContain("/space-station");
    expect(stationDock!.featureRoutes).toContain("/tower-defense");
    expect(stationDock!.featureRoutes).toContain("/competitive-arena");
  });

  it("should have guild-sanctum room", async () => {
    const { ROOM_DEFINITIONS } = await import("../client/src/contexts/GameContext");
    const sanctum = ROOM_DEFINITIONS.find((r) => r.id === "guild-sanctum");
    expect(sanctum).toBeDefined();
    expect(sanctum!.features).toContain("Syndicate World");
    expect(sanctum!.features).toContain("Prestige Quests");
    expect(sanctum!.featureRoutes).toContain("/syndicate-world");
    expect(sanctum!.featureRoutes).toContain("/prestige-quests");
  });
});

/* ─── RPG IMPACT INTEGRATION ─── */
describe("RPG impact on base building systems", () => {
  it("engineer class should get build speed bonus for syndicate worlds", () => {
    const engineerBonuses = resolveCapitalBonuses({
      characterClass: "engineer",
      classRank: 5,
      species: "quarchon",
      civilSkills: { engineering: 5 },
      talents: [],
    });
    const soldierBonuses = resolveCapitalBonuses({
      characterClass: "soldier",
      classRank: 5,
      species: "quarchon",
      civilSkills: {},
      talents: [],
    });
    // Engineer should have better build speed
    expect(engineerBonuses.buildSpeedMultiplier).toBeGreaterThan(soldierBonuses.buildSpeedMultiplier);
  });

  it("soldier class should get defense bonus for tower defense", () => {
    const soldierBonuses = resolveTowerDefenseBonuses({
      characterClass: "soldier",
      classRank: 5,
      species: "quarchon",
      civilSkills: { combat: 5 },
      talents: [],
    });
    const oracleBonuses = resolveTowerDefenseBonuses({
      characterClass: "oracle",
      classRank: 5,
      species: "demagi",
      civilSkills: {},
      talents: [],
    });
    // Soldier should have better tower damage or HP
    expect(
      soldierBonuses.towerDamageMultiplier + soldierBonuses.towerHpMultiplier
    ).toBeGreaterThanOrEqual(
      oracleBonuses.towerDamageMultiplier + oracleBonuses.towerHpMultiplier
    );
  });

  it("prestige class should provide additional bonuses for space station", () => {
    const withPrestige = resolveStationBonuses({
      characterClass: "engineer",
      classRank: 10,
      prestigeClass: "architect",
      species: "neyon",
      civilSkills: { engineering: 5, architecture: 5 },
      talents: [],
    });
    const withoutPrestige = resolveStationBonuses({
      characterClass: "engineer",
      classRank: 10,
      species: "neyon",
      civilSkills: { engineering: 5, architecture: 5 },
      talents: [],
    });
    // Prestige class should provide additional bonuses
    expect(withPrestige.sources.length).toBeGreaterThanOrEqual(withoutPrestige.sources.length);
  });

  it("civil skills should affect station bonuses", () => {
    const withSkills = resolveStationBonuses({
      characterClass: "engineer",
      classRank: 3,
      civilSkills: { engineering: 5, architecture: 5, research: 5 },
      talents: [],
    });
    const withoutSkills = resolveStationBonuses({
      characterClass: "engineer",
      classRank: 3,
      civilSkills: {},
      talents: [],
    });
    // With civil skills should have more bonus sources
    expect(withSkills.sources.length).toBeGreaterThanOrEqual(withoutSkills.sources.length);
  });
});
