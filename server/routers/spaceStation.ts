/**
 * SPACE STATION ROUTER — Personal Player Base Management
 * ──────────────────────────────────────────────────────
 * CRUD for space stations and modules.
 * Resource generation, module construction, RPG bonus resolution.
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  spaceStations, stationModules,
  citizenCharacters, civilSkillProgress, citizenTalentSelections,
  prestigeProgress, achievementTraitProgress, classMastery,
} from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import {
  STATION_TIERS, STATION_MODULES, resolveStationBonuses,
  getAvailableModules, getStationTier, MODULE_SYNERGIES,
} from "../../shared/spaceStations";

/* ═══ HELPER — Reusable RPG stats loader ═══ */
async function getUserRpgStats(userId: number) {
  const db = await getDb();
  if (!db) return {};
  const [citizen] = await db.select().from(citizenCharacters)
    .where(and(eq(citizenCharacters.userId, userId), eq(citizenCharacters.isPrimary, 1))).limit(1);
  const skillRows = await db.select().from(civilSkillProgress).where(eq(civilSkillProgress.userId, userId));
  const civilSkillMap: Record<string, number> = {};
  for (const row of skillRows) civilSkillMap[row.skillKey] = row.level;
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

export const spaceStationRouter = router({
  /* ─── GET STATION ─── */
  getStation: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const [station] = await db.select().from(spaceStations)
      .where(eq(spaceStations.userId, ctx.user.id)).limit(1);
    if (!station) return null;
    const modules = await db.select().from(stationModules)
      .where(eq(stationModules.stationId, station.id));
    return { station, modules };
  }),

  /* ─── CREATE STATION ─── */
  createStation: protectedProcedure
    .input(z.object({ stationName: z.string().min(1).max(128) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "DB unavailable" };
      const existing = await db.select().from(spaceStations)
        .where(eq(spaceStations.userId, ctx.user.id)).limit(1);
      if (existing.length > 0) return { success: false, error: "Station already exists" };

      const rpgStats = await getUserRpgStats(ctx.user.id);
      const tier = getStationTier(rpgStats.citizenLevel || 1);

      await db.insert(spaceStations).values({
        userId: ctx.user.id,
        stationName: input.stationName,
        tier: tier.tier,
        gridSize: tier.gridSize,
        storedResources: { credits: 500, alloy: 100, crystal: 50 },
        productionRates: {},
        stationedCompanions: [],
        activeSynergies: [],
      });
      return { success: true, tier: tier.tier };
    }),

  /* ─── BUILD MODULE ─── */
  buildModule: protectedProcedure
    .input(z.object({
      moduleKey: z.string(),
      gridX: z.number(),
      gridY: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "DB unavailable" };

      const [station] = await db.select().from(spaceStations)
        .where(eq(spaceStations.userId, ctx.user.id)).limit(1);
      if (!station) return { success: false, error: "No station found. Create one first." };

      const moduleDef = STATION_MODULES.find(m => m.key === input.moduleKey);
      if (!moduleDef) return { success: false, error: "Invalid module" };

      const rpgStats = await getUserRpgStats(ctx.user.id);

      // Check availability
      const available = getAvailableModules({
        characterClass: rpgStats.characterClass,
        classRank: rpgStats.classRank,
        citizenLevel: rpgStats.citizenLevel,
        prestigeClass: rpgStats.prestigeClass,
        civilSkills: rpgStats.civilSkills,
      });
      if (!available.find(m => m.key === input.moduleKey)) {
        return { success: false, error: "Module not available with your current RPG stats" };
      }

      // Check module count
      const existingModules = await db.select().from(stationModules)
        .where(eq(stationModules.stationId, station.id));
      const bonuses = resolveStationBonuses(rpgStats);
      const tier = STATION_TIERS.find(t => t.tier === station.tier) || STATION_TIERS[0];
      const maxModules = tier.maxModules + bonuses.moduleSlotBonus;
      if (existingModules.length >= maxModules) {
        return { success: false, error: `Max modules reached (${maxModules})` };
      }

      // Calculate cost
      const costReduction = bonuses.costReduction;
      const cost: Record<string, number> = {};
      for (const [res, base] of Object.entries(moduleDef.baseCost)) {
        cost[res] = Math.ceil(base * (1 - Math.min(costReduction, 0.50)));
      }

      // Check resources
      const resources = (station.storedResources || {}) as Record<string, number>;
      for (const [res, amount] of Object.entries(cost)) {
        if ((resources[res] || 0) < amount) {
          return { success: false, error: `Not enough ${res} (need ${amount}, have ${resources[res] || 0})` };
        }
      }

      // Build time
      const buildTimeMinutes = Math.ceil(moduleDef.baseBuildTime / Math.max(bonuses.buildSpeedMultiplier, 0.5));
      const completesAt = new Date(Date.now() + buildTimeMinutes * 60 * 1000);

      // Deduct resources
      const updatedResources = { ...resources };
      for (const [res, amount] of Object.entries(cost)) {
        updatedResources[res] = (updatedResources[res] || 0) - amount;
      }

      await db.update(spaceStations)
        .set({ storedResources: updatedResources })
        .where(eq(spaceStations.id, station.id));

      await db.insert(stationModules).values({
        stationId: station.id,
        moduleKey: input.moduleKey,
        level: 1,
        gridX: input.gridX,
        gridY: input.gridY,
        status: "building",
        completesAt,
        currentHp: 100,
        maxHp: 100,
      });

      return { success: true, buildTimeMinutes, completesAt: completesAt.toISOString(), bonusesApplied: bonuses.sources };
    }),

  /* ─── UPGRADE MODULE ─── */
  upgradeModule: protectedProcedure
    .input(z.object({ moduleId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "DB unavailable" };

      const [mod] = await db.select().from(stationModules)
        .where(eq(stationModules.id, input.moduleId)).limit(1);
      if (!mod || mod.status !== "active") return { success: false, error: "Module not available" };

      const [station] = await db.select().from(spaceStations)
        .where(eq(spaceStations.id, mod.stationId)).limit(1);
      if (!station || station.userId !== ctx.user.id) return { success: false, error: "Not your station" };

      const moduleDef = STATION_MODULES.find(m => m.key === mod.moduleKey);
      if (!moduleDef) return { success: false, error: "Invalid module def" };
      if (mod.level >= moduleDef.maxLevel) return { success: false, error: "Already max level" };

      const rpgStats = await getUserRpgStats(ctx.user.id);
      const bonuses = resolveStationBonuses(rpgStats);
      const newLevel = mod.level + 1;
      const costMult = Math.pow(moduleDef.costMultiplier, newLevel - 1);
      const cost: Record<string, number> = {};
      for (const [res, base] of Object.entries(moduleDef.baseCost)) {
        cost[res] = Math.ceil(base * costMult * (1 - Math.min(bonuses.costReduction, 0.50)));
      }

      const resources = (station.storedResources || {}) as Record<string, number>;
      for (const [res, amount] of Object.entries(cost)) {
        if ((resources[res] || 0) < amount) return { success: false, error: `Not enough ${res}` };
      }

      const buildTimeMinutes = Math.ceil(
        (moduleDef.baseBuildTime * Math.pow(1.3, newLevel - 1)) / Math.max(bonuses.buildSpeedMultiplier, 0.5)
      );
      const completesAt = new Date(Date.now() + buildTimeMinutes * 60 * 1000);

      const updatedResources = { ...resources };
      for (const [res, amount] of Object.entries(cost)) {
        updatedResources[res] = (updatedResources[res] || 0) - amount;
      }

      await db.update(spaceStations).set({ storedResources: updatedResources }).where(eq(spaceStations.id, station.id));
      await db.update(stationModules).set({ status: "upgrading", completesAt }).where(eq(stationModules.id, mod.id));

      return { success: true, newLevel, buildTimeMinutes, bonusesApplied: bonuses.sources };
    }),

  /* ─── COMPLETE MODULE ─── */
  completeModule: protectedProcedure
    .input(z.object({ moduleId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "DB unavailable" };

      const [mod] = await db.select().from(stationModules)
        .where(eq(stationModules.id, input.moduleId)).limit(1);
      if (!mod) return { success: false, error: "Module not found" };
      if (mod.status !== "building" && mod.status !== "upgrading") return { success: false, error: "Not under construction" };
      if (mod.completesAt && new Date(mod.completesAt) > new Date()) return { success: false, error: "Not yet complete" };

      const newLevel = mod.status === "upgrading" ? mod.level + 1 : mod.level;
      await db.update(stationModules)
        .set({ status: "active", level: newLevel, completesAt: null })
        .where(eq(stationModules.id, mod.id));

      // Recalculate station stats
      const [station] = await db.select().from(spaceStations)
        .where(eq(spaceStations.id, mod.stationId)).limit(1);
      if (station) {
        const allModules = await db.select().from(stationModules)
          .where(and(eq(stationModules.stationId, station.id), eq(stationModules.status, "active")));
        let totalDefense = 0;
        let stealthRating = 0;
        const elements: string[] = [];
        for (const m of allModules) {
          const def = STATION_MODULES.find(d => d.key === m.moduleKey);
          if (!def) continue;
          if (def.bonus.target === "station_defense") totalDefense += def.bonus.value * m.level;
          if (def.bonus.target === "station_shield") totalDefense += def.bonus.value * m.level;
          if (def.bonus.target === "stealth_rating") stealthRating += def.bonus.value * m.level;
          if (def.element) elements.push(def.element);
        }
        const synergies: string[] = [];
        const elementSet = new Set(elements);
        for (const syn of MODULE_SYNERGIES) {
          if (elementSet.has(syn.elements[0]) && elementSet.has(syn.elements[1])) {
            synergies.push(syn.label);
          }
        }
        await db.update(spaceStations)
          .set({ totalDefense, stealthRating, activeSynergies: synergies })
          .where(eq(spaceStations.id, station.id));
      }

      return { success: true, newLevel };
    }),

  /* ─── COLLECT RESOURCES ─── */
  collectResources: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { success: false, error: "DB unavailable" };

    const [station] = await db.select().from(spaceStations)
      .where(eq(spaceStations.userId, ctx.user.id)).limit(1);
    if (!station) return { success: false, error: "No station" };

    const rpgStats = await getUserRpgStats(ctx.user.id);
    const bonuses = resolveStationBonuses(rpgStats);

    const modules = await db.select().from(stationModules)
      .where(and(eq(stationModules.stationId, station.id), eq(stationModules.status, "active")));

    const hoursSince = Math.min(
      (Date.now() - new Date(station.lastCollection).getTime()) / (1000 * 60 * 60),
      24
    );

    const collected: Record<string, number> = {};
    for (const m of modules) {
      const def = STATION_MODULES.find(d => d.key === m.moduleKey);
      if (!def) continue;
      // Production modules
      if (def.bonus.target.endsWith("_production") || def.bonus.target === "dream_production" || def.bonus.target === "trade_income") {
        const resource = def.bonus.target.replace("_production", "").replace("trade_income", "credits");
        const rate = def.bonus.value * m.level * bonuses.productionMultiplier;
        collected[resource] = (collected[resource] || 0) + Math.floor(rate * hoursSince);
      }
    }

    const resources = { ...(station.storedResources || {}) } as Record<string, number>;
    for (const [res, amount] of Object.entries(collected)) {
      resources[res] = (resources[res] || 0) + amount;
    }

    await db.update(spaceStations)
      .set({ storedResources: resources, lastCollection: new Date() })
      .where(eq(spaceStations.id, station.id));

    return { success: true, collected, hoursSinceCollection: Math.round(hoursSince * 10) / 10, bonusesApplied: bonuses.sources };
  }),

  /* ─── UPGRADE STATION TIER ─── */
  upgradeTier: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { success: false, error: "DB unavailable" };

    const [station] = await db.select().from(spaceStations)
      .where(eq(spaceStations.userId, ctx.user.id)).limit(1);
    if (!station) return { success: false, error: "No station" };

    const nextTier = STATION_TIERS.find(t => t.tier === station.tier + 1);
    if (!nextTier) return { success: false, error: "Already max tier" };

    const rpgStats = await getUserRpgStats(ctx.user.id);
    if ((rpgStats.citizenLevel || 1) < nextTier.requiredLevel) {
      return { success: false, error: `Requires citizen level ${nextTier.requiredLevel}` };
    }

    const resources = (station.storedResources || {}) as Record<string, number>;
    for (const [res, amount] of Object.entries(nextTier.upgradeCost)) {
      if ((resources[res] || 0) < amount) {
        return { success: false, error: `Not enough ${res} (need ${amount})` };
      }
    }

    const updatedResources = { ...resources };
    for (const [res, amount] of Object.entries(nextTier.upgradeCost)) {
      updatedResources[res] = (updatedResources[res] || 0) - amount;
    }

    await db.update(spaceStations)
      .set({
        tier: nextTier.tier,
        gridSize: nextTier.gridSize,
        storedResources: updatedResources,
      })
      .where(eq(spaceStations.id, station.id));

    return { success: true, newTier: nextTier };
  }),

  /* ─── GET RPG BONUSES ─── */
  getStationBonuses: protectedProcedure.query(async ({ ctx }) => {
    const rpgStats = await getUserRpgStats(ctx.user.id);
    return resolveStationBonuses(rpgStats);
  }),

  /* ─── GET AVAILABLE MODULES ─── */
  getAvailableModules: protectedProcedure.query(async ({ ctx }) => {
    const rpgStats = await getUserRpgStats(ctx.user.id);
    return getAvailableModules({
      characterClass: rpgStats.characterClass,
      classRank: rpgStats.classRank,
      citizenLevel: rpgStats.citizenLevel,
      prestigeClass: rpgStats.prestigeClass,
      civilSkills: rpgStats.civilSkills,
    });
  }),

  /* ─── GET STATION TIERS ─── */
  getStationTiers: protectedProcedure.query(() => STATION_TIERS),

  /* ─── VISIT STATION (other player) ─── */
  visitStation: protectedProcedure
    .input(z.object({ targetUserId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "DB unavailable" };
      if (input.targetUserId === ctx.user.id) return { success: false, error: "Can't visit your own station" };

      const [target] = await db.select().from(spaceStations)
        .where(eq(spaceStations.userId, input.targetUserId)).limit(1);
      if (!target) return { success: false, error: "Station not found" };

      await db.update(spaceStations)
        .set({
          visitCount: target.visitCount + 1,
          reputation: target.reputation + 2,
        })
        .where(eq(spaceStations.id, target.id));

      return { success: true, stationName: target.stationName, tier: target.tier };
    }),
});
