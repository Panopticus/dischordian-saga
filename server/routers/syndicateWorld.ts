/**
 * SYNDICATE WORLD ROUTER — Guild Capital Management
 * ──────────────────────────────────────────────────
 * CRUD for syndicate worlds and buildings.
 * Resource generation, building construction, RPG bonus resolution.
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  syndicateWorlds, syndicateBuildings, guildMembers, guilds,
  citizenCharacters, civilSkillProgress, citizenTalentSelections,
  prestigeProgress, achievementTraitProgress, classMastery,
} from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import {
  WORLD_TYPES, BUILDINGS, resolveCapitalBonuses,
  calculateBuildCost, calculateBuildTime, calculateProduction,
  checkBuildingSynergies, getAvailableBuildings, getBuilding,
} from "../../shared/syndicateWorlds";

/* ═══ HELPERS ═══ */

async function getUserGuildMembership(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(guildMembers).where(eq(guildMembers.userId, userId)).limit(1);
  return rows[0] || null;
}

async function getUserRpgStats(userId: number) {
  const db = await getDb();
  if (!db) return {};
  const [citizen] = await db.select().from(citizenCharacters)
    .where(and(eq(citizenCharacters.userId, userId), eq(citizenCharacters.isPrimary, 1))).limit(1);
  // Civil skills are stored per-skill-row, aggregate into a map
  const skillRows = await db.select().from(civilSkillProgress).where(eq(civilSkillProgress.userId, userId));
  const civilSkillMap: Record<string, number> = {};
  for (const row of skillRows) {
    civilSkillMap[row.skillKey] = row.level;
  }
  // Talents are stored per-selection-row, aggregate into array
  const talentRows = await db.select().from(citizenTalentSelections).where(eq(citizenTalentSelections.userId, userId));
  const talentKeys = talentRows.map(t => t.talentKey);
  const [prestige] = await db.select().from(prestigeProgress).where(eq(prestigeProgress.userId, userId)).limit(1);
  const [traits] = await db.select().from(achievementTraitProgress).where(eq(achievementTraitProgress.userId, userId)).limit(1);
  const [mastery] = await db.select().from(classMastery).where(eq(classMastery.userId, userId)).limit(1);

  return {
    characterClass: citizen?.characterClass || undefined,
    classRank: mastery?.masteryRank || 0,
    species: citizen?.species || undefined,
    citizenLevel: citizen?.level || 1,
    civilSkills: civilSkillMap,
    talents: talentKeys,
    prestigeClass: prestige?.prestigeClassKey || undefined,
    prestigeRank: prestige?.prestigeRank || 0,
    achievementTraits: (traits?.equippedTraits as string[]) || [],
  };
}

export const syndicateWorldRouter = router({
  /* ─── GET WORLD ─── */
  getWorld: protectedProcedure
    .input(z.object({ guildId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const [world] = await db.select().from(syndicateWorlds)
        .where(eq(syndicateWorlds.guildId, input.guildId)).limit(1);
      if (!world) return null;

      const buildings = await db.select().from(syndicateBuildings)
        .where(eq(syndicateBuildings.worldId, world.id));

      return { world, buildings };
    }),

  /* ─── CREATE WORLD (guild leader only) ─── */
  createWorld: protectedProcedure
    .input(z.object({
      guildId: z.number(),
      biome: z.string(),
      worldName: z.string().min(1).max(128),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "DB unavailable" };

      // Verify user is guild leader
      const membership = await getUserGuildMembership(ctx.user.id);
      if (!membership || membership.guildId !== input.guildId || membership.role !== "leader") {
        return { success: false, error: "Only the guild leader can create a world" };
      }

      // Check if world already exists
      const existing = await db.select().from(syndicateWorlds)
        .where(eq(syndicateWorlds.guildId, input.guildId)).limit(1);
      if (existing.length > 0) return { success: false, error: "World already exists" };

      const worldType = WORLD_TYPES.find(w => w.key === input.biome);
      if (!worldType) return { success: false, error: "Invalid biome" };

      await db.insert(syndicateWorlds).values({
        guildId: input.guildId,
        biome: input.biome,
        worldName: input.worldName,
        gridSize: worldType.gridSize,
        storedResources: { credits: 1000, alloy: 200, crystal: 100 },
        productionRates: {},
        activeSynergies: [],
      });

      return { success: true };
    }),

  /* ─── BUILD STRUCTURE ─── */
  buildStructure: protectedProcedure
    .input(z.object({
      worldId: z.number(),
      buildingKey: z.string(),
      gridX: z.number(),
      gridY: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "DB unavailable" };

      const [world] = await db.select().from(syndicateWorlds)
        .where(eq(syndicateWorlds.id, input.worldId)).limit(1);
      if (!world) return { success: false, error: "World not found" };

      // Verify guild membership
      const membership = await getUserGuildMembership(ctx.user.id);
      if (!membership || membership.guildId !== world.guildId) {
        return { success: false, error: "Not a member of this guild" };
      }

      const buildingDef = getBuilding(input.buildingKey);
      if (!buildingDef) return { success: false, error: "Invalid building" };

      // Get RPG stats for bonus calculation
      const rpgStats = await getUserRpgStats(ctx.user.id);

      // Check if player can build this (class/prestige requirements)
      const available = getAvailableBuildings({
        characterClass: rpgStats.characterClass,
        classRank: rpgStats.classRank,
        citizenLevel: rpgStats.citizenLevel,
        prestigeClass: rpgStats.prestigeClass,
      });
      if (!available.find(b => b.key === input.buildingKey)) {
        return { success: false, error: "Building not available with your current class/prestige" };
      }

      // Resolve RPG bonuses
      const bonuses = resolveCapitalBonuses(rpgStats);

      // Calculate cost with reductions
      const cost = calculateBuildCost(buildingDef, 1, bonuses.costReduction);

      // Check resources
      const resources = (world.storedResources || {}) as Record<string, number>;
      for (const [res, amount] of Object.entries(cost)) {
        if ((resources[res] || 0) < amount) {
          return { success: false, error: `Not enough ${res} (need ${amount}, have ${resources[res] || 0})` };
        }
      }

      // Calculate build time
      const buildTimeMinutes = calculateBuildTime(buildingDef, 1, bonuses.buildSpeedMultiplier);
      const completesAt = new Date(Date.now() + buildTimeMinutes * 60 * 1000);

      // Deduct resources
      const updatedResources = { ...resources };
      for (const [res, amount] of Object.entries(cost)) {
        updatedResources[res] = (updatedResources[res] || 0) - amount;
      }

      await db.update(syndicateWorlds)
        .set({ storedResources: updatedResources })
        .where(eq(syndicateWorlds.id, world.id));

      await db.insert(syndicateBuildings).values({
        worldId: world.id,
        buildingKey: input.buildingKey,
        level: 1,
        gridX: input.gridX,
        gridY: input.gridY,
        status: "building",
        completesAt,
        currentHp: 100,
        maxHp: 100,
        builtBy: ctx.user.id,
      });

      return {
        success: true,
        buildTimeMinutes,
        completesAt: completesAt.toISOString(),
        bonusesApplied: bonuses.sources,
      };
    }),

  /* ─── UPGRADE BUILDING ─── */
  upgradeBuilding: protectedProcedure
    .input(z.object({ buildingId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "DB unavailable" };

      const [building] = await db.select().from(syndicateBuildings)
        .where(eq(syndicateBuildings.id, input.buildingId)).limit(1);
      if (!building || building.status !== "active") return { success: false, error: "Building not available" };

      const [world] = await db.select().from(syndicateWorlds)
        .where(eq(syndicateWorlds.id, building.worldId)).limit(1);
      if (!world) return { success: false, error: "World not found" };

      const membership = await getUserGuildMembership(ctx.user.id);
      if (!membership || membership.guildId !== world.guildId) {
        return { success: false, error: "Not a member of this guild" };
      }

      const buildingDef = getBuilding(building.buildingKey);
      if (!buildingDef) return { success: false, error: "Invalid building definition" };
      if (building.level >= buildingDef.maxLevel) return { success: false, error: "Already max level" };

      const rpgStats = await getUserRpgStats(ctx.user.id);
      const bonuses = resolveCapitalBonuses(rpgStats);
      const newLevel = building.level + 1;
      const cost = calculateBuildCost(buildingDef, newLevel, bonuses.costReduction);

      const resources = (world.storedResources || {}) as Record<string, number>;
      for (const [res, amount] of Object.entries(cost)) {
        if ((resources[res] || 0) < amount) {
          return { success: false, error: `Not enough ${res}` };
        }
      }

      const buildTimeMinutes = calculateBuildTime(buildingDef, newLevel, bonuses.buildSpeedMultiplier);
      const completesAt = new Date(Date.now() + buildTimeMinutes * 60 * 1000);

      const updatedResources = { ...resources };
      for (const [res, amount] of Object.entries(cost)) {
        updatedResources[res] = (updatedResources[res] || 0) - amount;
      }

      await db.update(syndicateWorlds)
        .set({ storedResources: updatedResources })
        .where(eq(syndicateWorlds.id, world.id));

      await db.update(syndicateBuildings)
        .set({ status: "upgrading", completesAt })
        .where(eq(syndicateBuildings.id, building.id));

      return { success: true, newLevel, buildTimeMinutes, bonusesApplied: bonuses.sources };
    }),

  /* ─── COLLECT RESOURCES ─── */
  collectResources: protectedProcedure
    .input(z.object({ worldId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "DB unavailable" };

      const [world] = await db.select().from(syndicateWorlds)
        .where(eq(syndicateWorlds.id, input.worldId)).limit(1);
      if (!world) return { success: false, error: "World not found" };

      const membership = await getUserGuildMembership(ctx.user.id);
      if (!membership || membership.guildId !== world.guildId) {
        return { success: false, error: "Not a member of this guild" };
      }

      const rpgStats = await getUserRpgStats(ctx.user.id);
      const bonuses = resolveCapitalBonuses(rpgStats);

      const worldType = WORLD_TYPES.find(w => w.key === world.biome);
      const worldBiomeBonus = worldType?.resourceBonus.multiplier || 1.0;

      // Get active buildings
      const buildings = await db.select().from(syndicateBuildings)
        .where(and(eq(syndicateBuildings.worldId, world.id), eq(syndicateBuildings.status, "active")));

      // Calculate hours since last collection
      const hoursSinceCollection = Math.min(
        (Date.now() - new Date(world.lastCollection).getTime()) / (1000 * 60 * 60),
        24 // cap at 24 hours
      );

      // Calculate total production
      const collected: Record<string, number> = {};
      for (const b of buildings) {
        const def = getBuilding(b.buildingKey);
        if (!def?.production) continue;
        const rates = calculateProduction(def, b.level, bonuses.resourceMultiplier, worldBiomeBonus);
        for (const rate of rates) {
          collected[rate.resource] = (collected[rate.resource] || 0) + Math.floor(rate.baseRate * hoursSinceCollection);
        }
      }

      // Add to stored resources
      const resources = { ...(world.storedResources || {}) } as Record<string, number>;
      for (const [res, amount] of Object.entries(collected)) {
        resources[res] = (resources[res] || 0) + amount;
      }

      await db.update(syndicateWorlds)
        .set({ storedResources: resources, lastCollection: new Date() })
        .where(eq(syndicateWorlds.id, world.id));

      return { success: true, collected, hoursSinceCollection: Math.round(hoursSinceCollection * 10) / 10, bonusesApplied: bonuses.sources };
    }),

  /* ─── GET RPG BONUSES (for display) ─── */
  getCapitalBonuses: protectedProcedure
    .query(async ({ ctx }) => {
      const rpgStats = await getUserRpgStats(ctx.user.id);
      return resolveCapitalBonuses(rpgStats);
    }),

  /* ─── GET AVAILABLE BUILDINGS ─── */
  getAvailableBuildings: protectedProcedure
    .query(async ({ ctx }) => {
      const rpgStats = await getUserRpgStats(ctx.user.id);
      return getAvailableBuildings({
        characterClass: rpgStats.characterClass,
        classRank: rpgStats.classRank,
        citizenLevel: rpgStats.citizenLevel,
        prestigeClass: rpgStats.prestigeClass,
      });
    }),

  /* ─── COMPLETE BUILDING (check if build timer finished) ─── */
  completeBuilding: protectedProcedure
    .input(z.object({ buildingId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "DB unavailable" };

      const [building] = await db.select().from(syndicateBuildings)
        .where(eq(syndicateBuildings.id, input.buildingId)).limit(1);
      if (!building) return { success: false, error: "Building not found" };
      if (building.status !== "building" && building.status !== "upgrading") {
        return { success: false, error: "Building is not under construction" };
      }
      if (building.completesAt && new Date(building.completesAt) > new Date()) {
        return { success: false, error: "Construction not yet complete" };
      }

      const newLevel = building.status === "upgrading" ? building.level + 1 : building.level;

      await db.update(syndicateBuildings)
        .set({ status: "active", level: newLevel, completesAt: null })
        .where(eq(syndicateBuildings.id, building.id));

      // Recalculate world defense
      const [world] = await db.select().from(syndicateWorlds)
        .where(eq(syndicateWorlds.id, building.worldId)).limit(1);
      if (world) {
        const allBuildings = await db.select().from(syndicateBuildings)
          .where(and(eq(syndicateBuildings.worldId, world.id), eq(syndicateBuildings.status, "active")));
        let totalDefense = 0;
        const elements: string[] = [];
        for (const b of allBuildings) {
          const def = getBuilding(b.buildingKey);
          if (def?.defenseValue) totalDefense += def.defenseValue * b.level;
          if (def?.element) elements.push(def.element);
        }
        const synergies = checkBuildingSynergies(elements);
        await db.update(syndicateWorlds)
          .set({
            totalDefense,
            activeSynergies: synergies.map(s => s.label),
          })
          .where(eq(syndicateWorlds.id, world.id));
      }

      return { success: true, newLevel };
    }),

  /* ─── GET WORLD TYPES ─── */
  getWorldTypes: protectedProcedure.query(() => WORLD_TYPES),

  /* ─── GET ALL BUILDING DEFS ─── */
  getBuildingDefs: protectedProcedure.query(() => BUILDINGS),
});
