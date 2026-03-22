/**
 * SEASONAL EVENTS ROUTER
 * ──────────────────────────────────────────────────
 * Event lifecycle, participation, token earning, event shop.
 */
import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  seasonalEvents, eventParticipation, eventShopPurchases,
  citizenCharacters, civilSkillProgress, classMastery,
} from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import {
  SEASONAL_EVENTS,
  resolveEventBonuses,
} from "../../shared/seasonalEvents";

export const seasonalEventsRouter = router({
  /** Get active events */
  getActiveEvents: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("DB unavailable");
    const events = await db.select().from(seasonalEvents).where(eq(seasonalEvents.active, true)).orderBy(desc(seasonalEvents.startsAt));
    return events;
  }),

  /** Get event details with user participation */
  getEventDetails: protectedProcedure
    .input(z.object({ eventId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [event] = await db.select().from(seasonalEvents).where(eq(seasonalEvents.id, input.eventId));
      if (!event) return null;

      const [participation] = await db.select().from(eventParticipation)
        .where(and(eq(eventParticipation.userId, ctx.user.id), eq(eventParticipation.eventId, input.eventId)));

      // Get RPG bonuses
      const [char] = await db.select().from(citizenCharacters).where(eq(citizenCharacters.userId, ctx.user.id));
      const civilSkills = await db.select().from(civilSkillProgress).where(eq(civilSkillProgress.userId, ctx.user.id));
      const skillMap: Record<string, number> = {};
      for (const s of civilSkills) skillMap[s.skillKey] = s.level;

      const bonuses = resolveEventBonuses({
        characterClass: char?.characterClass || undefined,
        civilSkills: skillMap,
        });

      const eventDef = SEASONAL_EVENTS.find(e => e.key === event.eventKey);
      const milestones = eventDef?.milestones || [];
      const shopItems = eventDef?.shopItems || [];

      return {
        event,
        participation: participation || null,
        bonuses,
        eventDef: eventDef || null,
        milestones,
        shopItems,
      };
    }),

  /** Contribute to event */
  contribute: protectedProcedure
    .input(z.object({ eventId: z.number(), amount: z.number().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [event] = await db.select().from(seasonalEvents).where(eq(seasonalEvents.id, input.eventId));
      if (!event || !event.active) throw new Error("Event not active");

      // Get RPG bonuses
      const [char] = await db.select().from(citizenCharacters).where(eq(citizenCharacters.userId, ctx.user.id));
      const civilSkills = await db.select().from(civilSkillProgress).where(eq(civilSkillProgress.userId, ctx.user.id));
      const skillMap: Record<string, number> = {};
      for (const s of civilSkills) skillMap[s.skillKey] = s.level;
      const bonuses = resolveEventBonuses({
        characterClass: char?.characterClass || undefined,
        civilSkills: skillMap,
        });

      const boostedAmount = Math.floor(input.amount * bonuses.contributionMultiplier);
      const tokensEarned = Math.floor(boostedAmount * bonuses.tokenBonusMultiplier * 0.1);

      // Upsert participation
      const [existing] = await db.select().from(eventParticipation)
        .where(and(eq(eventParticipation.userId, ctx.user.id), eq(eventParticipation.eventId, input.eventId)));

      if (existing) {
        await db.update(eventParticipation)
          .set({
            contribution: existing.contribution + boostedAmount,
            tokensEarned: existing.tokensEarned + tokensEarned,
          })
          .where(eq(eventParticipation.id, existing.id));
      } else {
        await db.insert(eventParticipation).values({
          userId: ctx.user.id,
          eventId: input.eventId,
          contribution: boostedAmount,
          tokensEarned,
        });
      }

      // Update global progress
      await db.update(seasonalEvents)
        .set({ globalProgress: event.globalProgress + boostedAmount })
        .where(eq(seasonalEvents.id, input.eventId));

      return { contributed: boostedAmount, tokensEarned, bonuses };
    }),

  /** Buy from event shop */
  buyShopItem: protectedProcedure
    .input(z.object({ eventId: z.number(), itemKey: z.string(), quantity: z.number().min(1).default(1) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      // Find item across all events
      const allEvents = SEASONAL_EVENTS;
      let item: (typeof allEvents[number]["shopItems"][number]) | undefined;
      for (const ev of allEvents) {
        const found = ev.shopItems.find(i => i.key === input.itemKey);
        if (found) { item = found; break; }
      }
      if (!item) throw new Error("Item not found");

      const totalCost = item.cost * input.quantity;

      const [participation] = await db.select().from(eventParticipation)
        .where(and(eq(eventParticipation.userId, ctx.user.id), eq(eventParticipation.eventId, input.eventId)));

      if (!participation) throw new Error("Not participating in event");
      const availableTokens = participation.tokensEarned - participation.tokensSpent;
      if (availableTokens < totalCost) throw new Error("Not enough tokens");

      await db.update(eventParticipation)
        .set({ tokensSpent: participation.tokensSpent + totalCost })
        .where(eq(eventParticipation.id, participation.id));

      await db.insert(eventShopPurchases).values({
        userId: ctx.user.id,
        eventId: input.eventId,
        itemKey: input.itemKey,
        quantity: input.quantity,
        tokensCost: totalCost,

      });

      return { purchased: true, item: item.name, quantity: input.quantity, tokensSpent: totalCost };
    }),

  /** Get purchase history */
  getPurchaseHistory: protectedProcedure
    .input(z.object({ eventId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db.select().from(eventShopPurchases)
        .where(and(eq(eventShopPurchases.userId, ctx.user.id), eq(eventShopPurchases.eventId, input.eventId)))
        .orderBy(desc(eventShopPurchases.purchasedAt));
    }),
});
