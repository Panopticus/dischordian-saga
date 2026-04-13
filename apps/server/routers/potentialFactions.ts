/* ═══════════════════════════════════════════════════════
   POTENTIAL FACTIONS ROUTER

   Exposes the Potential Identity faction system and Unity Meter
   to the client via tRPC. Delegates all state management to
   unityMeterService.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, desc } from "drizzle-orm";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  potentialFactionMembership,
  potentialFactionState,
  unityContributions,
} from "../../db/schema";
import { unityMeterService } from "../services/unityMeterService";
import {
  ALL_POTENTIAL_FACTIONS,
  DEMAGI_FACTIONS,
  QUARCHON_FACTIONS,
  POTENTIAL_FACTION_INDEX,
  type PotentialFactionId,
} from "@shared/potentialFactions";
import { POTENTIAL_FACTION_NPCS } from "@shared/potentialFactionNpcs";

const POTENTIAL_FACTION_IDS = Object.keys(POTENTIAL_FACTION_INDEX) as PotentialFactionId[];
const factionIdSchema = z.enum(POTENTIAL_FACTION_IDS as [PotentialFactionId, ...PotentialFactionId[]]);

export const potentialFactionsRouter = router({
  /** Returns the full faction metadata list — public, no auth required. */
  listFactions: publicProcedure.query(async () => {
    return {
      demagi: DEMAGI_FACTIONS,
      quarchon: QUARCHON_FACTIONS,
      npcs: POTENTIAL_FACTION_NPCS,
    };
  }),

  /** Returns the current Unity Meter view. */
  getUnityState: publicProcedure.query(async () => {
    return unityMeterService.getState();
  }),

  /** Returns the aggregate state for every faction (dominance + member count). */
  listFactionStates: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(potentialFactionState);
  }),

  /** Returns the caller's memberships. */
  listMyMemberships: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db
      .select()
      .from(potentialFactionMembership)
      .where(eq(potentialFactionMembership.userId, ctx.user.id));
  }),

  /** Returns the caller's contribution history, most recent first. */
  listMyContributions: protectedProcedure
    .input(z.object({ limit: z.number().int().min(1).max(200).default(50) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(unityContributions)
        .where(eq(unityContributions.userId, ctx.user.id))
        .orderBy(desc(unityContributions.createdAt))
        .limit(input.limit);
    }),

  /** Returns the top contributors to a specific faction. */
  getFactionLeaderboard: publicProcedure
    .input(
      z.object({
        factionId: factionIdSchema,
        limit: z.number().int().min(1).max(100).default(10),
      }),
    )
    .query(async ({ input }) => {
      return unityMeterService.getFactionLeaderboard(input.factionId, input.limit);
    }),

  /** Records a Unity Meter contribution. */
  contribute: protectedProcedure
    .input(
      z.object({
        source: z.string(),
        factionId: factionIdSchema.optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const view = await unityMeterService.increment(
        ctx.user.id,
        // Unchecked cast — the service ignores unknown sources and
        // returns the current state unchanged, so this is safe at
        // runtime even if the client sends an unknown string.
        input.source as Parameters<typeof unityMeterService.increment>[1],
        input.factionId,
      );
      return view;
    }),

  /** Joins the caller to a Potential faction. */
  joinFaction: protectedProcedure
    .input(
      z.object({
        factionId: factionIdSchema,
        recruitedBy: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Refuse to join a faction the player doesn't know about yet.
      const faction = POTENTIAL_FACTION_INDEX[input.factionId];
      if (!faction) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Unknown faction: ${input.factionId}`,
        });
      }
      return unityMeterService.joinFaction(
        ctx.user.id,
        input.factionId,
        input.recruitedBy,
      );
    }),

  /** Returns every faction's recruitment pressure for the caller. */
  getRecruitmentPressure: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [] as { factionId: string; pressure: number }[];
    // Proxy: sum of positive contributions tagged with this faction id per user
    const rows = await db
      .select({
        factionId: unityContributions.factionId,
        delta: unityContributions.delta,
      })
      .from(unityContributions)
      .where(eq(unityContributions.userId, ctx.user.id));
    const totals: Record<string, number> = {};
    for (const row of rows) {
      if (!row.factionId) continue;
      totals[row.factionId] = (totals[row.factionId] ?? 0) + row.delta;
    }
    return ALL_POTENTIAL_FACTIONS.map((f) => ({
      factionId: f.id,
      pressure: totals[f.id] ?? 0,
      thresholdReached: (totals[f.id] ?? 0) >= f.recruitmentThresholdReputation,
    }));
  }),
});
