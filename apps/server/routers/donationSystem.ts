/**
 * DONATION SYSTEM ROUTER
 * ──────────────────────────────────────────────────
 * Card/material donations, weekly limits, reputation.
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  donations, donationReputation, guildMembers, yearlyEvents,
} from "../../db/schema";
import { eq, and, desc, isNull } from "drizzle-orm";
import {
  WEEKLY_LIMITS, REPUTATION_PER_DONATION, getReputationEarned,
  type DonationType,
} from "../../shared/donationSystem";
import { ripple } from "../services/rippleEngine";
import { rippleLedgerService } from "../services/rippleLedgerService";
import { getYearlyEvent, type YearlyEventKey } from "@shared/yearlyEvents";

/**
 * Look up a multiplier from the active yearly event (if any). Returns
 * 1.0 outside any active window. The multiplier is the gameplay
 * realization of "donations during yearly events get bonuses."
 */
async function getActiveDonationMultiplier(): Promise<{
  multiplier: number;
  eventKey: YearlyEventKey | null;
}> {
  const db = await getDb();
  if (!db) return { multiplier: 1, eventKey: null };
  const year = new Date().getUTCFullYear();
  const rows = await db
    .select({ eventKey: yearlyEvents.eventKey })
    .from(yearlyEvents)
    .where(and(eq(yearlyEvents.activeYear, year), isNull(yearlyEvents.resolvedAt)))
    .limit(1);
  const key = rows[0]?.eventKey as YearlyEventKey | undefined;
  if (!key) return { multiplier: 1, eventKey: null };
  try {
    return { multiplier: getYearlyEvent(key).donationMultiplier, eventKey: key };
  } catch {
    return { multiplier: 1, eventKey: null };
  }
}

export const donationSystemRouter = router({
  /** Get my donation reputation for a guild */
  getMyReputation: protectedProcedure
    .input(z.object({ guildId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [rep] = await db.select().from(donationReputation)
        .where(and(eq(donationReputation.userId, ctx.user.id), eq(donationReputation.guildId, input.guildId)));
      return rep || null;
    }),

  /** Make a donation */
  donate: protectedProcedure
    .input(z.object({
      guildId: z.number(),
      donationType: z.string(),
      itemKey: z.string().optional(),
      amount: z.number().min(1).default(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");

      // Verify guild membership
      const [membership] = await db.select().from(guildMembers)
        .where(and(eq(guildMembers.userId, ctx.user.id), eq(guildMembers.guildId, input.guildId)));
      if (!membership) throw new Error("Not a guild member");

      const validTypes: DonationType[] = ["card", "material", "dream", "token"];
      if (!validTypes.includes(input.donationType as DonationType)) throw new Error("Invalid donation type");

      // Check weekly limit
      const [rep] = await db.select().from(donationReputation)
        .where(and(eq(donationReputation.userId, ctx.user.id), eq(donationReputation.guildId, input.guildId)));

      const weeklyDonations = rep?.weeklyDonations || {};
      const currentWeekly = weeklyDonations[input.donationType] || 0;
      const limit = WEEKLY_LIMITS[input.donationType as keyof typeof WEEKLY_LIMITS] || 10;
      if (currentWeekly + input.amount > limit) throw new Error("Weekly limit reached");

      const baseRep = getReputationEarned(input.donationType as DonationType, input.amount, {});
      const { multiplier: yearlyMultiplier, eventKey: activeYearlyKey } =
        await getActiveDonationMultiplier();
      const repEarned = Math.round(baseRep * yearlyMultiplier);

      // Record donation
      await db.insert(donations).values({
        donorId: ctx.user.id,
        guildId: input.guildId,
        donationType: input.donationType,
        itemKey: input.itemKey ?? null,
        amount: input.amount,
        reputationEarned: repEarned,
      });

      // Update reputation
      const newWeekly = { ...weeklyDonations, [input.donationType]: currentWeekly + input.amount };
      if (rep) {
        await db.update(donationReputation)
          .set({
            totalReputation: rep.totalReputation + repEarned,
            weeklyDonations: newWeekly,
          })
          .where(eq(donationReputation.id, rep.id));
      } else {
        await db.insert(donationReputation).values({
          userId: ctx.user.id,
          guildId: input.guildId,
          totalReputation: repEarned,
          weeklyDonations: newWeekly,
        });
      }

      await ripple.emit("guild_donation", { userId: ctx.user.id, amount: input.amount, resourceType: input.donationType || "dream" });

      // Mercy blend — every donation tilts the global Famine + Death
      // axes a hair downward. Multiplied during yearly events.
      try {
        await ripple.emit("mercy_extended", {
          userId: ctx.user.id,
          amount: input.amount,
          yearlyMultiplier,
          activeYearlyKey,
        });
        await rippleLedgerService.record({
          eventType: "mercy_extended",
          userId: ctx.user.id,
          fromSystem: "charity",
          toSystems: ["governance", "social"],
          payload: { amount: input.amount, yearlyMultiplier, activeYearlyKey },
        });
      } catch {
        // emit failures are observability-only; donation still landed.
      }

      return {
        donated: true,
        reputationEarned: repEarned,
        baseReputation: baseRep,
        yearlyMultiplier,
        activeYearlyKey,
      };
    }),

  /** Get donation history for a guild */
  getGuildDonations: protectedProcedure
    .input(z.object({ guildId: z.number(), limit: z.number().min(1).max(50).default(20) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db.select().from(donations)
        .where(eq(donations.guildId, input.guildId))
        .orderBy(desc(donations.donatedAt))
        .limit(input.limit);
    }),

  /** Get guild reputation leaderboard */
  getReputationLeaderboard: protectedProcedure
    .input(z.object({ guildId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db.select().from(donationReputation)
        .where(eq(donationReputation.guildId, input.guildId))
        .orderBy(desc(donationReputation.totalReputation))
        .limit(20);
    }),

  /** Get donation types */
  getDonationTypes: protectedProcedure.query(async () => {
    return { types: ["card", "material", "dream", "token"], weeklyLimits: WEEKLY_LIMITS, reputationPer: REPUTATION_PER_DONATION };
  }),
});
