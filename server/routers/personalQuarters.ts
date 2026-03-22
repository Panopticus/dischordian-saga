/**
 * PERSONAL QUARTERS ROUTER
 * ──────────────────────────────────────────────────
 * Decoratable player hideout with 100+ items, zones, visiting.
 * RPG integration: class/species unlock items, civil skills reduce costs.
 */
import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  playerQuarters, quarterVisits,
  citizenCharacters, civilSkillProgress, classMastery,
  prestigeProgress,
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

    // Get available decorations based on RPG state
    const allAvailable = getAvailableDecorations({
      characterClass: char?.characterClass,
      species: char?.species,
      civilSkills: skillMap,
      prestigeClass: prestRows[0]?.prestigeClassKey,
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
