/**
 * TOWER DEFENSE & RAIDING ROUTER
 * ───────────────────────────────
 * Tower placement, PvP raiding (Clash of Clans-style),
 * trophy system, daily streaks, and RPG integration.
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  towerPlacements, raidLogs, raidTrophies, dailyStreaks, defenseWaves,
  spaceStations, syndicateWorlds, users,
  citizenCharacters, civilSkillProgress, citizenTalentSelections,
  prestigeProgress, achievementTraitProgress, classMastery, characterSheets,
} from "../../db/schema";
import { eq, and, desc, inArray, sql } from "drizzle-orm";
import {
  TOWERS, RAID_UNITS,
  resolveTowerDefenseBonuses,
  calculateRaidStars, calculateRaidLoot,
  getAvailableTowers, getAvailableRaidUnits,
} from "../../shared/towerDefense";
import { ripple } from "../services/rippleEngine";
import { getConsequences } from "../services/universeConsequences";

/* ═══ RPG STATS LOADER ═══ */
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
  // Get morality score from character_sheets table
  const [sheet] = await db.select({ moralityScore: characterSheets.moralityScore })
    .from(characterSheets).where(eq(characterSheets.userId, userId)).limit(1);
  return {
    characterClass: citizen?.characterClass || undefined,
    classRank: mastery?.masteryRank || 0,
    species: citizen?.species || undefined,
    alignment: citizen?.alignment || undefined,
    element: citizen?.element || undefined,
    moralityScore: sheet?.moralityScore ?? 0,
    citizenLevel: citizen?.level || 1,
    civilSkills: civilSkillMap,
    talents: talentKeys,
    prestigeClass: prestige?.prestigeClassKey || undefined,
    prestigeRank: prestige?.prestigeRank || 0,
    achievementTraits: (traits?.equippedTraits as string[]) || [],
  };
}

/* ═══ LEAGUE THRESHOLDS ═══ */
const LEAGUE_THRESHOLDS: { league: string; minTrophies: number }[] = [
  { league: "bronze_1", minTrophies: 0 },
  { league: "bronze_2", minTrophies: 100 },
  { league: "bronze_3", minTrophies: 200 },
  { league: "silver_1", minTrophies: 400 },
  { league: "silver_2", minTrophies: 600 },
  { league: "silver_3", minTrophies: 800 },
  { league: "gold_1", minTrophies: 1000 },
  { league: "gold_2", minTrophies: 1300 },
  { league: "gold_3", minTrophies: 1600 },
  { league: "platinum_1", minTrophies: 2000 },
  { league: "platinum_2", minTrophies: 2400 },
  { league: "platinum_3", minTrophies: 2800 },
  { league: "diamond_1", minTrophies: 3200 },
  { league: "diamond_2", minTrophies: 3700 },
  { league: "diamond_3", minTrophies: 4200 },
  { league: "champion", minTrophies: 5000 },
  { league: "legend", minTrophies: 6000 },
];

function getLeagueForTrophies(trophies: number): string {
  let league = "bronze_1";
  for (const t of LEAGUE_THRESHOLDS) {
    if (trophies >= t.minTrophies) league = t.league;
  }
  return league;
}

/* ═══ RAID LOG ENRICHMENT ═══ */
type RaidLogRow = typeof raidLogs.$inferSelect;
type EnrichedRaidLog = RaidLogRow & { role: "attacker" | "defender"; opponentName: string };

async function enrichRaidLogs(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  rows: RaidLogRow[],
  role: "attacker" | "defender",
): Promise<EnrichedRaidLog[]> {
  if (rows.length === 0) return [];

  // Build sets of user IDs / station IDs / world IDs we need names for
  const userIds = new Set<number>();
  const stationIds = new Set<number>();
  const worldIds = new Set<number>();
  for (const r of rows) {
    if (role === "attacker") {
      // Opponent is the defender
      if (r.defenderType === "station") stationIds.add(r.defenderId);
      else worldIds.add(r.defenderId);
    } else {
      // Opponent is the attacker
      userIds.add(r.attackerId);
    }
  }

  const userMap = new Map<number, string>();
  if (userIds.size > 0) {
    const userRows = await db.select({ id: users.id, name: users.name })
      .from(users).where(inArray(users.id, [...userIds]));
    for (const u of userRows) userMap.set(u.id, u.name || `User ${u.id}`);
  }

  const stationMap = new Map<number, string>();
  if (stationIds.size > 0) {
    const stationRows = await db.select({ id: spaceStations.id, name: spaceStations.stationName })
      .from(spaceStations).where(inArray(spaceStations.id, [...stationIds]));
    for (const s of stationRows) stationMap.set(s.id, s.name || `Station ${s.id}`);
  }

  const worldMap = new Map<number, string>();
  if (worldIds.size > 0) {
    const worldRows = await db.select({ id: syndicateWorlds.id, name: syndicateWorlds.worldName })
      .from(syndicateWorlds).where(inArray(syndicateWorlds.id, [...worldIds]));
    for (const w of worldRows) worldMap.set(w.id, w.name || `World ${w.id}`);
  }

  return rows.map((r): EnrichedRaidLog => {
    let opponentName = "Unknown";
    if (role === "attacker") {
      if (r.defenderType === "station") opponentName = stationMap.get(r.defenderId) || `Station ${r.defenderId}`;
      else opponentName = worldMap.get(r.defenderId) || `World ${r.defenderId}`;
    } else {
      opponentName = userMap.get(r.attackerId) || `User ${r.attackerId}`;
    }
    return { ...r, role, opponentName };
  });
}

/* ═══ DAILY STREAK REWARDS ═══ */
const DAILY_STREAK_REWARDS = [
  { day: 1, chronoShards: 5, credits: 100, label: "Day 1" },
  { day: 2, chronoShards: 5, credits: 150, label: "Day 2" },
  { day: 3, chronoShards: 10, credits: 200, label: "Day 3" },
  { day: 4, chronoShards: 10, credits: 250, label: "Day 4" },
  { day: 5, chronoShards: 15, credits: 300, label: "Day 5" },
  { day: 6, chronoShards: 15, credits: 400, label: "Day 6" },
  { day: 7, chronoShards: 30, credits: 500, label: "Week Bonus!" },
  { day: 14, chronoShards: 50, credits: 1000, label: "2-Week Bonus!" },
  { day: 30, chronoShards: 100, credits: 2500, label: "Monthly Bonus!" },
];

export const towerDefenseRouter = router({
  /* ═══════════════════════════════════════════
     TOWER MANAGEMENT
     ═══════════════════════════════════════════ */

  getTowers: protectedProcedure
    .input(z.object({
      ownerType: z.enum(["station", "world"]),
      ownerId: z.number(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(towerPlacements)
        .where(and(
          eq(towerPlacements.ownerType, input.ownerType),
          eq(towerPlacements.ownerId, input.ownerId),
        ));
    }),

  placeTower: protectedProcedure
    .input(z.object({
      ownerType: z.enum(["station", "world"]),
      ownerId: z.number(),
      towerKey: z.string(),
      gridX: z.number(),
      gridY: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "DB unavailable" };

      if (input.ownerType === "station") {
        const [station] = await db.select().from(spaceStations)
          .where(eq(spaceStations.id, input.ownerId)).limit(1);
        if (!station || station.userId !== ctx.user.id) return { success: false, error: "Not your station" };
      }

      const towerDef = TOWERS.find(t => t.key === input.towerKey);
      if (!towerDef) return { success: false, error: "Invalid tower" };

      const rpgStats = await getUserRpgStats(ctx.user.id);

      // Check class/prestige requirements
      if (towerDef.requiredClass && rpgStats.characterClass !== towerDef.requiredClass) {
        return { success: false, error: `Requires ${towerDef.requiredClass} class` };
      }
      if (towerDef.requiredClassRank && (rpgStats.classRank || 0) < towerDef.requiredClassRank) {
        return { success: false, error: `Requires ${towerDef.requiredClass} rank ${towerDef.requiredClassRank}` };
      }
      if (towerDef.requiredPrestige && rpgStats.prestigeClass !== towerDef.requiredPrestige) {
        return { success: false, error: `Requires ${towerDef.requiredPrestige} prestige class` };
      }
      if (towerDef.requiredCivilSkill) {
        const skillLevel = rpgStats.civilSkills?.[towerDef.requiredCivilSkill.skill] || 0;
        if (skillLevel < towerDef.requiredCivilSkill.level) {
          return { success: false, error: `Requires ${towerDef.requiredCivilSkill.skill} level ${towerDef.requiredCivilSkill.level}` };
        }
      }

      // Get resources + grid size from owner
      let resources: Record<string, number> = {};
      let gridSize = 8;
      if (input.ownerType === "station") {
        const [station] = await db.select().from(spaceStations)
          .where(eq(spaceStations.id, input.ownerId)).limit(1);
        resources = (station?.storedResources || {}) as Record<string, number>;
        gridSize = station?.gridSize || 8;
      } else {
        const [world] = await db.select().from(syndicateWorlds)
          .where(eq(syndicateWorlds.id, input.ownerId)).limit(1);
        resources = (world?.storedResources || {}) as Record<string, number>;
        gridSize = world?.gridSize || 8;
      }

      // Grid bounds + collision check
      const [w, h] = towerDef.gridSize;
      if (
        input.gridX < 0 || input.gridY < 0 ||
        input.gridX + w > gridSize || input.gridY + h > gridSize
      ) {
        return { success: false, error: "Tower does not fit on the grid" };
      }
      const existingTowers = await db.select().from(towerPlacements).where(and(
        eq(towerPlacements.ownerType, input.ownerType),
        eq(towerPlacements.ownerId, input.ownerId),
      ));
      for (const t of existingTowers) {
        if (t.status === "destroyed") continue;
        const tDef = TOWERS.find(td => td.key === t.towerKey);
        const [tw, th] = tDef?.gridSize || [1, 1];
        const overlapX = input.gridX < t.gridX + tw && t.gridX < input.gridX + w;
        const overlapY = input.gridY < t.gridY + th && t.gridY < input.gridY + h;
        if (overlapX && overlapY) {
          return { success: false, error: "That cell is already occupied" };
        }
      }

      const tdBonuses = resolveTowerDefenseBonuses(rpgStats);

      // Enforce dynamic max tower slot limit
      const activeTowerCount = existingTowers.filter(t => t.status !== "destroyed").length;
      if (activeTowerCount >= tdBonuses.maxTowerSlots) {
        return { success: false, error: `Tower slots full (${activeTowerCount}/${tdBonuses.maxTowerSlots})` };
      }

      // Apply RPG cost reduction (Engineer class + Craftsmanship civil skill)
      const costFactor = Math.max(0, 1 - (tdBonuses.costReduction || 0));
      const cost: Record<string, number> = {};
      for (const [res, base] of Object.entries(towerDef.baseCost)) {
        cost[res] = Math.max(1, Math.ceil((base as number) * costFactor));
      }

      for (const [res, amount] of Object.entries(cost)) {
        if ((resources[res] || 0) < amount) {
          return { success: false, error: `Not enough ${res} (need ${amount}, have ${resources[res] || 0})` };
        }
      }

      const updatedResources = { ...resources };
      for (const [res, amount] of Object.entries(cost)) {
        updatedResources[res] = (updatedResources[res] || 0) - amount;
      }

      if (input.ownerType === "station") {
        await db.update(spaceStations).set({ storedResources: updatedResources }).where(eq(spaceStations.id, input.ownerId));
      } else {
        await db.update(syndicateWorlds).set({ storedResources: updatedResources }).where(eq(syndicateWorlds.id, input.ownerId));
      }

      const maxHp = Math.ceil(towerDef.baseHp * tdBonuses.towerHpMultiplier);

      // Apply RPG build-time reduction to the base 5 minute timer
      const timeFactor = Math.max(0.1, 1 - (tdBonuses.buildTimeReduction || 0));
      const buildMs = Math.ceil(5 * 60 * 1000 * timeFactor);

      await db.insert(towerPlacements).values({
        ownerType: input.ownerType,
        ownerId: input.ownerId,
        towerKey: input.towerKey,
        level: 1,
        gridX: input.gridX,
        gridY: input.gridY,
        currentHp: maxHp,
        maxHp,
        status: "building",
        completesAt: new Date(Date.now() + buildMs),
      });

      return { success: true, bonusesApplied: tdBonuses.sources };
    }),

  upgradeTower: protectedProcedure
    .input(z.object({ towerId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "DB unavailable" };

      const [tower] = await db.select().from(towerPlacements)
        .where(eq(towerPlacements.id, input.towerId)).limit(1);
      if (!tower || tower.status !== "active") return { success: false, error: "Tower not available" };

      const towerDef = TOWERS.find(t => t.key === tower.towerKey);
      if (!towerDef) return { success: false, error: "Invalid tower def" };
      if (tower.level >= towerDef.maxLevel) return { success: false, error: "Max level" };

      const rpgStats = await getUserRpgStats(ctx.user.id);
      const tdBonuses = resolveTowerDefenseBonuses(rpgStats);
      const costFactor = Math.max(0, 1 - (tdBonuses.costReduction || 0));

      const newLevel = tower.level + 1;
      const costMult = Math.pow(towerDef.costMultiplier, newLevel - 1);
      const cost: Record<string, number> = {};
      for (const [res, base] of Object.entries(towerDef.baseCost)) {
        cost[res] = Math.max(1, Math.ceil((base as number) * costMult * costFactor));
      }

      let resources: Record<string, number> = {};
      if (tower.ownerType === "station") {
        const [station] = await db.select().from(spaceStations).where(eq(spaceStations.id, tower.ownerId)).limit(1);
        resources = (station?.storedResources || {}) as Record<string, number>;
      } else {
        const [world] = await db.select().from(syndicateWorlds).where(eq(syndicateWorlds.id, tower.ownerId)).limit(1);
        resources = (world?.storedResources || {}) as Record<string, number>;
      }

      for (const [res, amount] of Object.entries(cost)) {
        if ((resources[res] || 0) < amount) return { success: false, error: `Not enough ${res}` };
      }

      const updatedResources = { ...resources };
      for (const [res, amount] of Object.entries(cost)) {
        updatedResources[res] = (updatedResources[res] || 0) - amount;
      }

      if (tower.ownerType === "station") {
        await db.update(spaceStations).set({ storedResources: updatedResources }).where(eq(spaceStations.id, tower.ownerId));
      } else {
        await db.update(syndicateWorlds).set({ storedResources: updatedResources }).where(eq(syndicateWorlds.id, tower.ownerId));
      }

      const timeFactor = Math.max(0.1, 1 - (tdBonuses.buildTimeReduction || 0));
      const buildTimeMinutes = Math.max(1, Math.ceil(5 * Math.pow(1.3, newLevel - 1) * timeFactor));
      const completesAt = new Date(Date.now() + buildTimeMinutes * 60 * 1000);

      await db.update(towerPlacements)
        .set({ status: "upgrading", completesAt })
        .where(eq(towerPlacements.id, tower.id));

      return { success: true, newLevel, buildTimeMinutes };
    }),

  completeTower: protectedProcedure
    .input(z.object({ towerId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "DB unavailable" };

      const [tower] = await db.select().from(towerPlacements)
        .where(eq(towerPlacements.id, input.towerId)).limit(1);
      if (!tower) return { success: false, error: "Tower not found" };
      if (tower.status !== "building" && tower.status !== "upgrading") return { success: false, error: "Not under construction" };
      if (tower.completesAt && new Date(tower.completesAt) > new Date()) return { success: false, error: "Not yet complete" };

      const newLevel = tower.status === "upgrading" ? tower.level + 1 : tower.level;
      const towerDef = TOWERS.find(t => t.key === tower.towerKey);
      const hpPerLevel = towerDef ? Math.ceil(towerDef.baseHp * 0.2) : 40;
      const newMaxHp = tower.maxHp + hpPerLevel;

      await db.update(towerPlacements)
        .set({ status: "active", level: newLevel, completesAt: null, maxHp: newMaxHp, currentHp: newMaxHp })
        .where(eq(towerPlacements.id, tower.id));

      return { success: true, newLevel };
    }),

  /* ═══════════════════════════════════════════
     RAIDING SYSTEM (PvP)
     ═══════════════════════════════════════════ */

  findRaidTarget: protectedProcedure
    .input(z.object({ targetType: z.enum(["station", "world"]) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;

      if (input.targetType === "station") {
        const targets = await db.select().from(spaceStations)
          .where(sql`${spaceStations.userId} != ${ctx.user.id} AND (${spaceStations.shieldUntil} IS NULL OR ${spaceStations.shieldUntil} < NOW())`)
          .limit(10);
        if (targets.length === 0) return null;
        const target = targets[Math.floor(Math.random() * targets.length)];
        const towers = await db.select().from(towerPlacements)
          .where(and(eq(towerPlacements.ownerType, "station"), eq(towerPlacements.ownerId, target.id)));
        return {
          type: "station" as const,
          id: target.id,
          name: target.stationName,
          tier: target.tier,
          defense: target.totalDefense,
          towerCount: towers.length,
          lootAvailable: target.storedResources,
        };
      } else {
        const targets = await db.select().from(syndicateWorlds)
          .where(sql`${syndicateWorlds.shieldUntil} IS NULL OR ${syndicateWorlds.shieldUntil} < NOW()`)
          .limit(10);
        if (targets.length === 0) return null;
        const target = targets[Math.floor(Math.random() * targets.length)];
        const towers = await db.select().from(towerPlacements)
          .where(and(eq(towerPlacements.ownerType, "world"), eq(towerPlacements.ownerId, target.id)));
        return {
          type: "world" as const,
          id: target.id,
          name: target.worldName,
          level: target.level,
          defense: target.totalDefense,
          towerCount: towers.length,
          lootAvailable: target.storedResources,
        };
      }
    }),

  executeRaid: protectedProcedure
    .input(z.object({
      defenderType: z.enum(["station", "world"]),
      defenderId: z.number(),
      units: z.array(z.object({ key: z.string(), count: z.number() })),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "DB unavailable" };

      const rpgStats = await getUserRpgStats(ctx.user.id);
      const tdBonuses = resolveTowerDefenseBonuses(rpgStats);

      // Get defender info
      let defenderOwnerId = 0;
      let defenderResources: Record<string, number> = {};
      let defenderDefense = 0;

      if (input.defenderType === "station") {
        const [station] = await db.select().from(spaceStations)
          .where(eq(spaceStations.id, input.defenderId)).limit(1);
        if (!station) return { success: false, error: "Target not found" };
        if (station.userId === ctx.user.id) return { success: false, error: "Can't raid yourself" };
        if (station.shieldUntil && new Date(station.shieldUntil) > new Date()) {
          return { success: false, error: "Target is shielded" };
        }
        defenderOwnerId = station.userId;
        defenderResources = (station.storedResources || {}) as Record<string, number>;
        defenderDefense = station.totalDefense;
      } else {
        const [world] = await db.select().from(syndicateWorlds)
          .where(eq(syndicateWorlds.id, input.defenderId)).limit(1);
        if (!world) return { success: false, error: "Target not found" };
        if (world.shieldUntil && new Date(world.shieldUntil) > new Date()) {
          return { success: false, error: "Target is shielded" };
        }
        defenderOwnerId = world.guildId;
        defenderResources = (world.storedResources || {}) as Record<string, number>;
        defenderDefense = world.totalDefense;
      }

      // Get defender towers
      const towers = await db.select().from(towerPlacements)
        .where(and(
          eq(towerPlacements.ownerType, input.defenderType),
          eq(towerPlacements.ownerId, input.defenderId),
          eq(towerPlacements.status, "active"),
        ));

      // Apply Living Universe combat modifiers
      const fx = await getConsequences();
      const combatDamageMult = fx.combatModifiers?.attack ?? 1;
      const combatDefenseMult = fx.combatModifiers?.defense ?? 1;

      // Calculate attack power
      let totalAttackPower = 0;
      let totalUnitHp = 0;
      let totalUnits = 0;
      for (const unit of input.units) {
        const unitDef = RAID_UNITS.find(u => u.key === unit.key);
        if (!unitDef) continue;
        totalAttackPower += unitDef.baseDamage * unit.count * tdBonuses.raidUnitDamageMultiplier * combatDamageMult;
        totalUnitHp += unitDef.baseHp * unit.count * tdBonuses.raidUnitHpMultiplier * combatDefenseMult;
        totalUnits += unit.count;
      }

      // Calculate defense power
      let totalDefensePower = defenderDefense;
      let totalTowerHp = 0;
      for (const tower of towers) {
        const towerDef = TOWERS.find(t => t.key === tower.towerKey);
        if (!towerDef) continue;
        totalDefensePower += (towerDef.baseDamage + towerDef.damagePerLevel * tower.level) * towerDef.baseFireRate;
        totalTowerHp += tower.currentHp;
      }

      // Simulate raid
      const attackRatio = totalAttackPower / Math.max(totalDefensePower + totalTowerHp, 1);
      const destructionPercent = Math.min(Math.floor(attackRatio * 100), 100);
      const stars = calculateRaidStars(destructionPercent);
      const lootStolen = calculateRaidLoot(defenderResources, destructionPercent, tdBonuses.raidLootMultiplier);
      const unitsLost = Math.floor(totalUnits * Math.max(0, 1 - attackRatio) * 0.5);
      const towersDestroyed = Math.floor(towers.length * (destructionPercent / 100));
      const result = stars > 0 ? "victory" : "defeat";
      const xpEarned = Math.floor(destructionPercent * 5 + stars * 100);

      // Apply loot
      if (result === "victory") {
        const updatedDefResources = { ...defenderResources };
        for (const [res, amount] of Object.entries(lootStolen)) {
          updatedDefResources[res] = Math.max((updatedDefResources[res] || 0) - amount, 0);
        }

        const shieldHours = stars * 4 + 4;
        const shieldUntil = new Date(Date.now() + shieldHours * 60 * 60 * 1000);

        if (input.defenderType === "station") {
          await db.update(spaceStations)
            .set({
              storedResources: updatedDefResources,
              shieldUntil,
              timesRaided: sql`${spaceStations.timesRaided} + 1`,
            })
            .where(eq(spaceStations.id, input.defenderId));
        } else {
          await db.update(syndicateWorlds)
            .set({
              storedResources: updatedDefResources,
              shieldUntil,
              timesRaided: sql`${syndicateWorlds.timesRaided} + 1`,
            })
            .where(eq(syndicateWorlds.id, input.defenderId));
        }

        // Credit loot to attacker's station (applies to both station and
        // world raids — previously the UI reported loot for world raids but
        // the attacker never actually received it).
        const [attackerStation] = await db.select().from(spaceStations)
          .where(eq(spaceStations.userId, ctx.user.id)).limit(1);
        if (attackerStation) {
          const attackerResources = { ...(attackerStation.storedResources || {}) } as Record<string, number>;
          for (const [res, amount] of Object.entries(lootStolen)) {
            attackerResources[res] = (attackerResources[res] || 0) + amount;
          }
          await db.update(spaceStations)
            .set({ storedResources: attackerResources })
            .where(eq(spaceStations.id, attackerStation.id));
        }
      }

      // Update trophies
      const trophyChange = result === "victory"
        ? Math.ceil(10 + stars * 5)
        : -8;

      let [myTrophyRow] = await db.select().from(raidTrophies)
        .where(eq(raidTrophies.userId, ctx.user.id)).limit(1);
      if (!myTrophyRow) {
        await db.insert(raidTrophies).values({ userId: ctx.user.id });
        [myTrophyRow] = await db.select().from(raidTrophies)
          .where(eq(raidTrophies.userId, ctx.user.id)).limit(1);
      }

      const newTrophies = Math.max((myTrophyRow?.trophies || 0) + trophyChange, 0);
      const newLeague = getLeagueForTrophies(newTrophies);
      const isVictory = result === "victory";

      await db.update(raidTrophies)
        .set({
          trophies: newTrophies,
          league: newLeague as any,
          seasonHigh: Math.max(myTrophyRow?.seasonHigh || 0, newTrophies),
          allTimeHigh: Math.max(myTrophyRow?.allTimeHigh || 0, newTrophies),
          totalRaids: (myTrophyRow?.totalRaids || 0) + 1,
          winStreak: isVictory ? (myTrophyRow?.winStreak || 0) + 1 : 0,
          bestWinStreak: isVictory
            ? Math.max(myTrophyRow?.bestWinStreak || 0, (myTrophyRow?.winStreak || 0) + 1)
            : myTrophyRow?.bestWinStreak || 0,
        })
        .where(eq(raidTrophies.userId, ctx.user.id));

      await ripple.emit("defense_wave_complete", { userId: ctx.user.id, wave: stars });

      // Tier 4 quest progression + Tier 1 title hooks + Tier 2B clue drops.
      const { recordQuestEvent } = await import("../services/guildQuestService");
      const { awardEligibleTitles } = await import("../services/titleService");
      const { mirrorRating } = await import("../services/competitiveRatingsService");
      if (stars >= 1) {
        recordQuestEvent({ kind: "td_raid_won", userId: ctx.user.id }).catch(() => {});
      }
      // Defender survival (logged when their base holds against this raid).
      if (defenderOwnerId && stars === 0) {
        recordQuestEvent({ kind: "td_defense_held", userId: defenderOwnerId }).catch(() => {});
      }
      awardEligibleTitles(ctx.user.id, stars >= 1
        ? { kind: "pvp_match_won", userId: ctx.user.id, gameType: "td_raid", newTier: 0, totalWins: 1 }
        : { kind: "pvp_match_lost", userId: ctx.user.id, gameType: "td_raid" }
      ).catch(() => {});
      // Mirror raid trophies into competitive_ratings (gameType=td_raid).
      try {
        const tt = await db.select().from(raidTrophies).where(eq(raidTrophies.userId, ctx.user.id)).limit(1);
        const trophies = tt[0]?.trophies ?? 0;
        const elo = 1000 + Math.min(trophies, 2000);
        const tier =
          elo >= 2200 ? "grandmaster" :
          elo >= 2000 ? "master" :
          elo >= 1800 ? "diamond" :
          elo >= 1600 ? "platinum" :
          elo >= 1400 ? "gold" :
          elo >= 1200 ? "silver" : "bronze";
        mirrorRating({
          userId: ctx.user.id,
          gameType: "td_raid",
          currentElo: elo,
          rankTier: tier,
          result: stars >= 1 ? { win: true } : { loss: true },
        }).catch(() => {});
      } catch {/* mirror is best-effort */}

      // Log the raid
      await db.insert(raidLogs).values({
        attackerId: ctx.user.id,
        defenderType: input.defenderType,
        defenderId: input.defenderId,
        defenderOwnerId,
        result,
        stars,
        destructionPercent,
        lootStolen,
        unitsDeployed: input.units,
        unitsLost,
        towersDestroyed,
        xpEarned,
        trophiesChanged: trophyChange,
        rpgBonuses: {
          towerDamage: tdBonuses.towerDamageMultiplier,
          unitDamage: tdBonuses.raidUnitDamageMultiplier,
          unitHp: tdBonuses.raidUnitHpMultiplier,
          lootMult: tdBonuses.raidLootMultiplier,
        },
        duration: Math.floor(Math.random() * 120) + 60,
      });

      return {
        success: true,
        result,
        stars,
        destructionPercent,
        lootStolen,
        unitsLost,
        towersDestroyed,
        xpEarned,
        trophyChange,
        newTrophies,
        newLeague,
        rpgBonusesApplied: tdBonuses.sources,
      };
    }),

  getRaidHistory: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(20) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      const rows = await db.select().from(raidLogs)
        .where(eq(raidLogs.attackerId, ctx.user.id))
        .orderBy(desc(raidLogs.createdAt))
        .limit(input.limit);
      return enrichRaidLogs(db, rows, "attacker");
    }),

  getDefenseLog: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(20) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      const [station] = await db.select().from(spaceStations)
        .where(eq(spaceStations.userId, ctx.user.id)).limit(1);
      if (!station) return [];
      const rows = await db.select().from(raidLogs)
        .where(and(
          eq(raidLogs.defenderType, "station"),
          eq(raidLogs.defenderId, station.id),
        ))
        .orderBy(desc(raidLogs.createdAt))
        .limit(input.limit);
      return enrichRaidLogs(db, rows, "defender");
    }),

  getCombinedHistory: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(25) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      // Attacker raids
      const attackerRows = await db.select().from(raidLogs)
        .where(eq(raidLogs.attackerId, ctx.user.id))
        .orderBy(desc(raidLogs.createdAt))
        .limit(input.limit);
      // Defender raids (only station defenses, since only stations belong to a single user)
      const [station] = await db.select().from(spaceStations)
        .where(eq(spaceStations.userId, ctx.user.id)).limit(1);
      let defenderRows: typeof attackerRows = [];
      if (station) {
        defenderRows = await db.select().from(raidLogs)
          .where(and(
            eq(raidLogs.defenderType, "station"),
            eq(raidLogs.defenderId, station.id),
          ))
          .orderBy(desc(raidLogs.createdAt))
          .limit(input.limit);
      }
      const enrichedAttacker = await enrichRaidLogs(db, attackerRows, "attacker");
      const enrichedDefender = await enrichRaidLogs(db, defenderRows, "defender");
      const merged = [...enrichedAttacker, ...enrichedDefender];
      merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return merged.slice(0, input.limit);
    }),

  /* ═══════════════════════════════════════════
     TROPHY & LEAGUE SYSTEM
     ═══════════════════════════════════════════ */

  getTrophies: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const [row] = await db.select().from(raidTrophies)
      .where(eq(raidTrophies.userId, ctx.user.id)).limit(1);
    return row || null;
  }),

  getLeaderboard: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(25) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const rows = await db.select().from(raidTrophies)
        .orderBy(desc(raidTrophies.trophies))
        .limit(input.limit);
      if (rows.length === 0) return [];
      const userIds = rows.map(r => r.userId);
      const userRows = await db.select({ id: users.id, name: users.name })
        .from(users).where(inArray(users.id, userIds));
      const nameMap = new Map<number, string>();
      for (const u of userRows) nameMap.set(u.id, u.name || `Raider ${u.id}`);
      return rows.map(row => ({
        ...row,
        userName: nameMap.get(row.userId) || `Raider ${row.userId}`,
      }));
    }),

  getLeagueThresholds: protectedProcedure.query(() => LEAGUE_THRESHOLDS),

  /* ═══════════════════════════════════════════
     DAILY STREAK / CHRONO SHARDS
     ═══════════════════════════════════════════ */

  getStreak: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const [row] = await db.select().from(dailyStreaks)
      .where(eq(dailyStreaks.userId, ctx.user.id)).limit(1);
    return row || null;
  }),

  checkIn: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { success: false, error: "DB unavailable" };

    const today = new Date().toISOString().slice(0, 10);

    const [streak] = await db.select().from(dailyStreaks)
      .where(eq(dailyStreaks.userId, ctx.user.id)).limit(1);

    if (!streak) {
      await db.insert(dailyStreaks).values({ userId: ctx.user.id, lastCheckIn: today, currentStreak: 1, totalCheckIns: 1 });
      return { success: true, streak: 1, reward: DAILY_STREAK_REWARDS[0] };
    }

    if (streak.lastCheckIn === today) {
      return { success: false, error: "Already checked in today" };
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const isConsecutive = streak.lastCheckIn === yesterday;
    const newStreak = isConsecutive ? streak.currentStreak + 1 : 1;

    // Auto-repair if streak broken and repair items available
    let usedRepair = false;
    if (!isConsecutive && streak.repairItems > 0) {
      usedRepair = true;
    }

    const finalStreak = usedRepair ? streak.currentStreak + 1 : newStreak;
    const rewardIndex = Math.min(finalStreak - 1, DAILY_STREAK_REWARDS.length - 1);
    const reward = DAILY_STREAK_REWARDS[rewardIndex];
    const shardsEarned = reward.chronoShards || 0;

    await db.update(dailyStreaks)
      .set({
        currentStreak: finalStreak,
        longestStreak: Math.max(streak.longestStreak, finalStreak),
        chronoShards: streak.chronoShards + shardsEarned,
        lastCheckIn: today,
        repairItems: usedRepair ? streak.repairItems - 1 : streak.repairItems,
        totalCheckIns: streak.totalCheckIns + 1,
      })
      .where(eq(dailyStreaks.userId, ctx.user.id));

    return {
      success: true,
      streak: finalStreak,
      reward,
      shardsEarned,
      usedRepair,
    };
  }),

  /* ═══════════════════════════════════════════
     PVE DEFENSE WAVES — solo wave combat against
     pre-generated enemy waves using placed towers
     ═══════════════════════════════════════════ */

  getDefenseWaves: protectedProcedure
    .input(z.object({
      ownerType: z.enum(["station", "world"]),
      ownerId: z.number(),
      limit: z.number().min(1).max(50).default(10),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(defenseWaves)
        .where(and(
          eq(defenseWaves.ownerType, input.ownerType),
          eq(defenseWaves.ownerId, input.ownerId),
        ))
        .orderBy(desc(defenseWaves.createdAt))
        .limit(input.limit);
    }),

  /**
   * Simulate one PvE wave against the owner's placed towers. Scales the
   * wave to the next wave number (max completed + 1). Writes the result
   * to defenseWaves, persists HP damage to towers, and awards resources
   * to the owner if the defense succeeds.
   */
  runDefenseWave: protectedProcedure
    .input(z.object({
      ownerType: z.enum(["station", "world"]),
      ownerId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "DB unavailable" };

      // Auth: station raids must belong to the player; world raids must
      // belong to a guild the player is in (we skip the guild check here
      // since world ownership is guild-wide and any member can run waves).
      if (input.ownerType === "station") {
        const [station] = await db.select().from(spaceStations)
          .where(eq(spaceStations.id, input.ownerId)).limit(1);
        if (!station || station.userId !== ctx.user.id) {
          return { success: false, error: "Not your station" };
        }
      }

      const rpgStats = await getUserRpgStats(ctx.user.id);
      const tdBonuses = resolveTowerDefenseBonuses(rpgStats);

      // Get active towers
      const towers = await db.select().from(towerPlacements)
        .where(and(
          eq(towerPlacements.ownerType, input.ownerType),
          eq(towerPlacements.ownerId, input.ownerId),
          eq(towerPlacements.status, "active"),
        ));

      if (towers.length === 0) {
        return { success: false, error: "No active towers — place some first" };
      }

      // Determine next wave number (max existing wave + 1)
      const prior = await db.select({ waveNumber: defenseWaves.waveNumber }).from(defenseWaves)
        .where(and(
          eq(defenseWaves.ownerType, input.ownerType),
          eq(defenseWaves.ownerId, input.ownerId),
        ))
        .orderBy(desc(defenseWaves.waveNumber))
        .limit(1);
      const waveNumber = (prior[0]?.waveNumber || 0) + 1;

      /* ─── Generate the wave ─── */
      // Enemies scale linearly with wave number. At wave 10 this is ~25 enemies.
      const enemyCount = 5 + waveNumber * 2;
      const enemyHp = Math.ceil(50 * (1 + waveNumber * 0.15));
      const enemyDmg = Math.ceil(10 * (1 + waveNumber * 0.10));
      const difficultyMultiplier = 100 + waveNumber * 20;
      const enemies: { key: string; count: number; level: number }[] = [
        { key: "swarm_drone", count: enemyCount, level: waveNumber },
      ];

      /* ─── Compute tower DPS + HP pool ─── */
      // We approximate DPS as baseDamage + damagePerLevel*(level-1), so
      // "total damage per second" is actually "total damage per attack round"
      // — good enough for a stat-based simulation.
      let towerDps = 0;
      let towerHpPool = 0;
      for (const t of towers) {
        const def = TOWERS.find(td => td.key === t.towerKey);
        if (!def) continue;
        const dmg = def.baseDamage + def.damagePerLevel * (t.level - 1);
        // Fire-rate per minute → rough per-second contribution
        const perSecond = (dmg * (def.baseFireRate || 1)) / 60;
        towerDps += perSecond * tdBonuses.towerDamageMultiplier;
        towerHpPool += t.currentHp;
      }
      towerDps = Math.max(towerDps, 1);

      const totalWaveHp = enemyCount * enemyHp * (difficultyMultiplier / 100);
      const totalWaveDps = enemyCount * enemyDmg * (difficultyMultiplier / 100);

      // Time (sec) for the towers to burn through the wave.
      const killDuration = totalWaveHp / towerDps;
      // Towers soak incoming damage for `killDuration` seconds.
      const damageTaken = Math.ceil(totalWaveDps * killDuration);

      const survived = damageTaken < towerHpPool;

      /* ─── Apply damage across towers proportionally ─── */
      let towersDestroyed = 0;
      if (towerHpPool > 0) {
        for (const t of towers) {
          const share = t.currentHp / towerHpPool;
          const dmg = Math.ceil(damageTaken * share);
          const newHp = Math.max(0, t.currentHp - dmg);
          if (newHp === 0 && t.currentHp > 0) towersDestroyed += 1;
          await db.update(towerPlacements)
            .set({
              currentHp: newHp,
              status: newHp === 0 ? "destroyed" : t.status,
            })
            .where(eq(towerPlacements.id, t.id));
        }
      }

      /* ─── Compute + award rewards (only on success) ─── */
      let rewards: Record<string, number> = {};
      if (survived) {
        rewards = {
          credits: 100 + waveNumber * 50,
          alloy: 10 + waveNumber * 5,
        };
        // Add rewards to owner storedResources
        if (input.ownerType === "station") {
          const [station] = await db.select().from(spaceStations)
            .where(eq(spaceStations.id, input.ownerId)).limit(1);
          if (station) {
            const updated = { ...(station.storedResources || {}) } as Record<string, number>;
            for (const [res, amt] of Object.entries(rewards)) {
              updated[res] = (updated[res] || 0) + amt;
            }
            await db.update(spaceStations)
              .set({
                storedResources: updated,
                successfulDefenses: sql`${spaceStations.successfulDefenses} + 1`,
              })
              .where(eq(spaceStations.id, input.ownerId));
          }
        } else {
          const [world] = await db.select().from(syndicateWorlds)
            .where(eq(syndicateWorlds.id, input.ownerId)).limit(1);
          if (world) {
            const updated = { ...(world.storedResources || {}) } as Record<string, number>;
            for (const [res, amt] of Object.entries(rewards)) {
              updated[res] = (updated[res] || 0) + amt;
            }
            await db.update(syndicateWorlds)
              .set({ storedResources: updated })
              .where(eq(syndicateWorlds.id, input.ownerId));
          }
        }
      }

      /* ─── Persist the wave record ─── */
      await db.insert(defenseWaves).values({
        ownerType: input.ownerType,
        ownerId: input.ownerId,
        waveNumber,
        enemies,
        difficultyMultiplier,
        rewards,
        status: survived ? "completed" : "failed",
        completedAt: new Date(),
      });

      // Emit a ripple so defense waves feed into the living universe
      await ripple.emit("defense_wave_complete", { userId: ctx.user.id, wave: waveNumber });

      return {
        success: true,
        waveNumber,
        survived,
        enemyCount,
        difficultyMultiplier,
        towerDps: Math.round(towerDps),
        damageTaken,
        towersDestroyed,
        rewards,
      };
    }),

  /* ═══════════════════════════════════════════
     STATIC DATA
     ═══════════════════════════════════════════ */

  getTowerDefs: protectedProcedure.query(() => TOWERS),
  getUnitDefs: protectedProcedure.query(() => RAID_UNITS),
  getStreakRewards: protectedProcedure.query(() => DAILY_STREAK_REWARDS),

  /** Returns the player's dynamic max tower slot count from RPG bonuses. */
  getMaxTowerSlots: protectedProcedure.query(async ({ ctx }) => {
    const rpgStats = await getUserRpgStats(ctx.user.id);
    const tdBonuses = resolveTowerDefenseBonuses(rpgStats);
    return {
      maxTowerSlots: tdBonuses.maxTowerSlots,
      maxRaidUnits: tdBonuses.maxRaidUnits,
    };
  }),
});
