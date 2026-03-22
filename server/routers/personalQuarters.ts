/**
 * PERSONAL QUARTERS ROUTER
 * ──────────────────────────────────────────────────
 * Decoratable player hideout with 120+ items, zones, visiting.
 * RPG integration: class/species unlock items, civil skills reduce costs,
 * boss kill trophies, seasonal event decorations, achievement-gated items.
 */
import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  playerQuarters, quarterVisits,
  citizenCharacters, civilSkillProgress, classMastery,
  prestigeProgress, bossMastery, eventParticipation,
  seasonalEvents, userAchievements, characterSheets,
} from "../../drizzle/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  DECORATION_ITEMS, ROOM_ZONES,
  getAvailableDecorations, calculateQuarterBonuses,
} from "../../shared/personalQuarters";

export const personalQuartersRouter = router({
  /** Get or create my quarters */
  getMyQuarters: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("DB unavailable");
    let [quarters] = await db.select().from(playerQuarters).where(eq(playerQuarters.userId, ctx.user.id));
    if (!quarters) {
      await db.insert(playerQuarters).values({
        userId: ctx.user.id,
        name: "My Quarters",
      });
      [quarters] = await db.select().from(playerQuarters).where(eq(playerQuarters.userId, ctx.user.id));
    }

    // Get RPG bonuses
    const [char] = await db.select().from(citizenCharacters).where(eq(citizenCharacters.userId, ctx.user.id));
    const civilSkills = await db.select().from(civilSkillProgress).where(eq(civilSkillProgress.userId, ctx.user.id));
    const skillMap: Record<string, number> = {};
    for (const s of civilSkills) skillMap[s.skillKey] = s.level;
    const classRows = await db.select().from(classMastery).where(eq(classMastery.userId, ctx.user.id));
    const classMap: Record<string, number> = {};
    for (const c of classRows) classMap[c.characterClass] = c.masteryRank;
    const prestRows = await db.select().from(prestigeProgress).where(eq(prestigeProgress.userId, ctx.user.id));

    // Get boss kill counts
    const bossRows = await db.select().from(bossMastery).where(eq(bossMastery.userId, ctx.user.id));
    const bossKills: Record<string, number> = {};
    for (const b of bossRows) bossKills[b.bossKey] = b.kills;

    // Get seasonal event participation
    const eventParts = await db.select({
      eventKey: seasonalEvents.eventKey,
    }).from(eventParticipation)
      .innerJoin(seasonalEvents, eq(eventParticipation.eventId, seasonalEvents.id))
      .where(eq(eventParticipation.userId, ctx.user.id));
    const seasonalEventsParticipated = Array.from(new Set(eventParts.map(e => e.eventKey)));

    // Get achievements
    const achievementRows = await db.select().from(userAchievements).where(eq(userAchievements.userId, ctx.user.id));
    const achievements = achievementRows.map(a => a.achievementId);

    // Get morality score and level
    const [sheet] = await db.select().from(characterSheets).where(eq(characterSheets.userId, ctx.user.id));
    const moralityScore = sheet?.moralityScore ?? 0;
    const citizenLevel = char?.level ?? 1;

    // Get available decorations based on full RPG state
    const allAvailable = getAvailableDecorations({
      characterClass: char?.characterClass,
      species: char?.species,
      civilSkills: skillMap,
      prestigeClass: prestRows[0]?.prestigeClassKey,
      achievements,
      moralityScore,
      citizenLevel,
      bossKills,
      seasonalEventsParticipated,
    });

    // Calculate bonuses from placed items
    const placedItemDefs = (quarters.placedItems || []).map(
      (pi: { itemKey: string }) => DECORATION_ITEMS.find(d => d.key === pi.itemKey)
    ).filter(Boolean);
    const bonuses = calculateQuarterBonuses(placedItemDefs as any);

    return {
      quarters,
      bonuses,
      availableItems: allAvailable,
      zones: ROOM_ZONES,
      stats: {
        totalItems: DECORATION_ITEMS.length,
        unlockedItems: allAvailable.length,
        placedItems: (quarters.placedItems || []).length,
        bossKills,
        seasonalEventsParticipated,
        achievementCount: achievements.length,
      },
    };
  }),

  /** Place an item */
  placeItem: protectedProcedure
    .input(z.object({
      itemKey: z.string(),
      zone: z.string(),
      x: z.number(),
      y: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [quarters] = await db.select().from(playerQuarters).where(eq(playerQuarters.userId, ctx.user.id));
      if (!quarters) throw new Error("No quarters found");

      const item = DECORATION_ITEMS.find(i => i.key === input.itemKey);
      if (!item) throw new Error("Item not found");

      const unlockedZones = quarters.unlockedZones || ["main"];
      if (!unlockedZones.includes(input.zone)) throw new Error("Zone not unlocked");

      const placedItems = quarters.placedItems || [];
      placedItems.push({ itemKey: input.itemKey, zone: input.zone, x: input.x, y: input.y });

      const ownedItems = quarters.ownedItems || [];
      if (!ownedItems.includes(input.itemKey)) ownedItems.push(input.itemKey);

      await db.update(playerQuarters)
        .set({ placedItems, ownedItems })
        .where(eq(playerQuarters.id, quarters.id));

      return { placed: true };
    }),

  /** Remove an item */
  removeItem: protectedProcedure
    .input(z.object({ itemKey: z.string(), zone: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [quarters] = await db.select().from(playerQuarters).where(eq(playerQuarters.userId, ctx.user.id));
      if (!quarters) throw new Error("No quarters found");

      const placedItems = (quarters.placedItems || []).filter(
        (i: { itemKey: string; zone: string }) => !(i.itemKey === input.itemKey && i.zone === input.zone)
      );

      await db.update(playerQuarters)
        .set({ placedItems })
        .where(eq(playerQuarters.id, quarters.id));

      return { removed: true };
    }),

  /** Unlock a zone */
  unlockZone: protectedProcedure
    .input(z.object({ zoneKey: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [quarters] = await db.select().from(playerQuarters).where(eq(playerQuarters.userId, ctx.user.id));
      if (!quarters) throw new Error("No quarters found");

      const zone = ROOM_ZONES.find((zn) => zn.zone === input.zoneKey);
      if (!zone) throw new Error("Zone not found");

      const unlockedZones = quarters.unlockedZones || ["main"];
      if (unlockedZones.includes(input.zoneKey)) throw new Error("Zone already unlocked");

      unlockedZones.push(input.zoneKey);
      await db.update(playerQuarters)
        .set({ unlockedZones })
        .where(eq(playerQuarters.id, quarters.id));

      return { unlocked: true, zone: zone.name };
    }),

  /** Visit someone's quarters */
  visitQuarters: protectedProcedure
    .input(z.object({ ownerId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [quarters] = await db.select().from(playerQuarters).where(eq(playerQuarters.userId, input.ownerId));
      if (!quarters) return null;

      // Log visit
      if (ctx.user.id !== input.ownerId) {
        await db.insert(quarterVisits).values({
          ownerId: input.ownerId,
          visitorId: ctx.user.id,
        });
        await db.update(playerQuarters)
          .set({ visitCount: quarters.visitCount + 1 })
          .where(eq(playerQuarters.id, quarters.id));
      }

      return { quarters };
    }),

  /** Get recent visitors */
  getRecentVisitors: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("DB unavailable");
    return db.select().from(quarterVisits)
      .where(eq(quarterVisits.ownerId, ctx.user.id))
      .orderBy(desc(quarterVisits.visitedAt))
      .limit(20);
  }),

  /** Rename quarters */
  rename: protectedProcedure
    .input(z.object({ name: z.string().min(1).max(100) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      await db.update(playerQuarters)
        .set({ name: input.name })
        .where(eq(playerQuarters.userId, ctx.user.id));
      return { renamed: true };
    }),
});
