/* ═══════════════════════════════════════════════════════
   NEMESIS ROUTER — server-side Nemesis state + memory + plans

   Per dreamer-canon (2026-05-13). Companion to:
     - apps/shared/nemesisSystem.ts   (spawn + RNG)
     - apps/shared/nemesisMemory.ts   (encounter ledger)
     - apps/shared/nemesisPlans.ts    (active objectives)
     - apps/db/schema.ts              (nemesis_state /
                                       nemesis_memory /
                                       nemesis_plans tables)

   Endpoints:
     - spawnForCohort: idempotent insert on apprentice recruit
     - getForCohort: fetch the Nemesis state + counts
     - listMine: list the player's Nemeses across cohorts
     - recordEncounter: append an encounter to the ledger
     - listMemory: read the encounter ledger
     - listActivePlans: read the player's Nemesis's open plans
     - spawnPlan: server-side authoring of a new active Plan
     - resolvePlan: mark a plan disrupted / succeeded / expired
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  nemesisState,
  nemesisMemory,
  nemesisPlans,
} from "../../db/schema";
import { eq, and, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import type { ApprenticeArchetype } from "../../shared/apprentices";
import { APPRENTICE_ARCHETYPES } from "../../shared/apprentices";
import {
  POLITICIAN_TICS,
  NEMESIS_SURFACES,
  spawnNemesis,
  shouldRevealProperName,
  type NemesisDef,
} from "../../shared/nemesisSystem";
import {
  generateQuoteOpening,
  type NemesisEncounterKind,
} from "../../shared/nemesisMemory";
import {
  spawnPlan as spawnPlanShared,
  type NemesisPlanKind,
  type NemesisPlanStatus,
} from "../../shared/nemesisPlans";

/* ═══════════════════════════════════════════════════════
   ZOD GUARDS
   ═══════════════════════════════════════════════════════ */

const archetypeSchema = z.enum(APPRENTICE_ARCHETYPES as readonly [
  ApprenticeArchetype,
  ...ApprenticeArchetype[],
]);

const encounterKindSchema = z.enum([
  "first_encounter",
  "route_sabotaged",
  "route_sabotage_blocked",
  "ambush_landed",
  "ambush_survived",
  "casino_odds_rigged",
  "casino_odds_rigging_blocked",
  "apprentice_whisper_landed",
  "apprentice_whisper_blocked",
  "hub_counter_vote_landed",
  "hub_counter_vote_blocked",
  "killed_by_player",
  "fled_player",
  "mocked_by_player",
] as const) satisfies z.ZodType<NemesisEncounterKind>;

const planKindSchema = z.enum([
  "trade_route_sabotage",
  "trade_intel_forgery",
  "trade_faction_rep_theft",
  "casino_odds_rigging",
  "casino_tip_jar_lift",
  "apprentice_breaking_point_whisper",
  "apprentice_trial_corruption",
  "apprentice_early_kill",
  "hub_counter_vote_campaign",
  "hub_smear_campaign",
  "world_chronicle_edit_request",
] as const) satisfies z.ZodType<NemesisPlanKind>;

const planStatusSchema = z.enum([
  "spawned",
  "ticking",
  "succeeded",
  "disrupted",
  "expired",
] as const) satisfies z.ZodType<NemesisPlanStatus>;

const sourceSchema = z.enum([
  "trade-empire",
  "casino",
  "hub",
  "apprentice",
  "world",
] as const);

/* ═══════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════ */

/** Rebuild a NemesisDef from a DB row. */
function rowToNemesisDef(row: typeof nemesisState.$inferSelect): NemesisDef {
  return {
    id: row.nemesisId,
    userId: row.userId,
    cohortNumber: row.cohortNumber,
    archetype: row.nemesisArchetype as ApprenticeArchetype,
    identity: {
      archetypeTitle: row.archetypeTitle,
      properName: row.properName,
      nameRevealed: row.nameRevealed === 1,
    },
    politicianTic:
      // Defensive cast — schema is `varchar` server-side so
      // unknown tic strings are tolerated by reading as the
      // first canonical tic. The runtime is expected to
      // always write a canonical tic id (validated below).
      (POLITICIAN_TICS as readonly string[]).includes(row.politicianTic)
        ? (row.politicianTic as NemesisDef["politicianTic"])
        : POLITICIAN_TICS[0],
    rank: row.rank as NemesisDef["rank"],
    grudgeTier: row.grudgeTier as NemesisDef["grudgeTier"],
    preferredSurface:
      (NEMESIS_SURFACES as readonly string[]).includes(row.preferredSurface)
        ? (row.preferredSurface as NemesisDef["preferredSurface"])
        : "trade-empire",
    spawnedAt: row.spawnedAt.toISOString(),
    lastEncounterAt: row.lastEncounterAt?.toISOString() ?? null,
  };
}

/* ═══════════════════════════════════════════════════════
   ROUTER
   ═══════════════════════════════════════════════════════ */

export const nemesisRouter = router({
  /** Spawn a Nemesis for a freshly-recruited apprentice cohort.
   *  Idempotent — re-calling with the same (userId, cohortNumber)
   *  returns the existing Nemesis. */
  spawnForCohort: protectedProcedure
    .input(
      z.object({
        cohortNumber: z.number().int().min(1),
        apprenticeArchetype: archetypeSchema,
        /** Optional explicit name-reveal state at spawn (defaults false). */
        nameRevealedFromGameState: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const existing = await db
        .select()
        .from(nemesisState)
        .where(
          and(
            eq(nemesisState.userId, ctx.user.id),
            eq(nemesisState.cohortNumber, input.cohortNumber),
          ),
        )
        .limit(1);

      if (existing.length > 0) {
        return rowToNemesisDef(existing[0]);
      }

      const nemesis = spawnNemesis({
        userId: ctx.user.id,
        cohortNumber: input.cohortNumber,
        apprenticeArchetype: input.apprenticeArchetype,
        spawnedAtIso: new Date().toISOString(),
        nameRevealedFromGameState: input.nameRevealedFromGameState,
      });

      await db.insert(nemesisState).values({
        nemesisId: nemesis.id,
        userId: ctx.user.id,
        cohortNumber: input.cohortNumber,
        apprenticeArchetype: input.apprenticeArchetype,
        nemesisArchetype: nemesis.archetype,
        archetypeTitle: nemesis.identity.archetypeTitle,
        properName: nemesis.identity.properName,
        nameRevealed: nemesis.identity.nameRevealed ? 1 : 0,
        politicianTic: nemesis.politicianTic,
        rank: nemesis.rank,
        grudgeTier: nemesis.grudgeTier,
        preferredSurface: nemesis.preferredSurface,
      });

      return nemesis;
    }),

  /** Fetch the Nemesis for a specific cohort + refresh
   *  name-reveal status against in-game gates. */
  getForCohort: protectedProcedure
    .input(
      z.object({
        cohortNumber: z.number().int().min(1),
        /** Optional in-game gate states from the caller. */
        resurrectionistE5Complete: z.boolean().default(false),
        gameMasterPlagueMaskSeedSeen: z.boolean().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const rows = await db
        .select()
        .from(nemesisState)
        .where(
          and(
            eq(nemesisState.userId, ctx.user.id),
            eq(nemesisState.cohortNumber, input.cohortNumber),
          ),
        )
        .limit(1);

      if (rows.length === 0) return null;

      const reveal = shouldRevealProperName(
        input.resurrectionistE5Complete,
        input.gameMasterPlagueMaskSeedSeen,
      );
      if (reveal && rows[0].nameRevealed === 0) {
        await db
          .update(nemesisState)
          .set({ nameRevealed: 1 })
          .where(eq(nemesisState.nemesisId, rows[0].nemesisId));
        rows[0].nameRevealed = 1;
      }

      return rowToNemesisDef(rows[0]);
    }),

  /** List the player's Nemeses across all cohorts. */
  listMine: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const rows = await db
      .select()
      .from(nemesisState)
      .where(eq(nemesisState.userId, ctx.user.id))
      .orderBy(desc(nemesisState.spawnedAt));

    return rows.map(rowToNemesisDef);
  }),

  /** Record an encounter. Generates the quote-opening server-side
   *  using the Nemesis's current grudge tier. */
  recordEncounter: protectedProcedure
    .input(
      z.object({
        nemesisId: z.string().min(1).max(64),
        encounterKind: encounterKindSchema,
        source: sourceSchema,
        detail: z.string().min(1).max(256),
        playerContext: z
          .object({
            act: z.number().int().optional(),
            phase: z.number().int().optional(),
            witnessLevel: z.number().int().optional(),
            companionPresent: z.string().optional(),
            surfaceDetail: z.string().optional(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const states = await db
        .select()
        .from(nemesisState)
        .where(
          and(
            eq(nemesisState.nemesisId, input.nemesisId),
            eq(nemesisState.userId, ctx.user.id),
          ),
        )
        .limit(1);
      if (states.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Nemesis not found." });
      }
      const grudge = states[0].grudgeTier as NemesisDef["grudgeTier"];

      const existingCount = (
        await db
          .select()
          .from(nemesisMemory)
          .where(eq(nemesisMemory.nemesisId, input.nemesisId))
      ).length;
      const sequence = existingCount + 1;
      const memoryId = `mem_${input.nemesisId}_${sequence}`;
      const quoteOpening = generateQuoteOpening(
        input.encounterKind,
        grudge,
        input.detail,
      );

      await db.insert(nemesisMemory).values({
        memoryId,
        nemesisId: input.nemesisId,
        userId: ctx.user.id,
        sequence,
        encounterKind: input.encounterKind,
        source: input.source,
        quoteOpening,
        playerContext: input.playerContext ?? null,
      });

      await db
        .update(nemesisState)
        .set({ lastEncounterAt: new Date() })
        .where(eq(nemesisState.nemesisId, input.nemesisId));

      return { memoryId, quoteOpening, sequence };
    }),

  /** Read the encounter ledger for a Nemesis. */
  listMemory: protectedProcedure
    .input(
      z.object({
        nemesisId: z.string().min(1).max(64),
        limit: z.number().int().min(1).max(200).default(50),
      }),
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return await db
        .select()
        .from(nemesisMemory)
        .where(
          and(
            eq(nemesisMemory.nemesisId, input.nemesisId),
            eq(nemesisMemory.userId, ctx.user.id),
          ),
        )
        .orderBy(desc(nemesisMemory.recordedAt))
        .limit(input.limit);
    }),

  /** List the player's active plans across all Nemeses. */
  listActivePlans: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const rows = await db
      .select()
      .from(nemesisPlans)
      .where(eq(nemesisPlans.userId, ctx.user.id))
      .orderBy(desc(nemesisPlans.spawnedAt));

    return rows.filter(
      (r) => r.status === "spawned" || r.status === "ticking",
    );
  }),

  /** Spawn a new Plan for a Nemesis. */
  spawnPlan: protectedProcedure
    .input(
      z.object({
        nemesisId: z.string().min(1).max(64),
        kind: planKindSchema,
        targetDetail: z.string().min(1).max(128),
        /** Optional explicit ticksAtIso; default computed
         *  from PLAN_KIND_CATALOG.defaultTickHours. */
        ticksAtIso: z.string().datetime().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const states = await db
        .select()
        .from(nemesisState)
        .where(
          and(
            eq(nemesisState.nemesisId, input.nemesisId),
            eq(nemesisState.userId, ctx.user.id),
          ),
        )
        .limit(1);
      if (states.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Nemesis not found." });
      }
      const nemesis = rowToNemesisDef(states[0]);

      const existingCount = (
        await db
          .select()
          .from(nemesisPlans)
          .where(eq(nemesisPlans.nemesisId, input.nemesisId))
      ).length;
      const sequence = existingCount + 1;

      const plan = spawnPlanShared({
        nemesis,
        sequence,
        kind: input.kind,
        targetDetail: input.targetDetail,
        spawnedAtIso: new Date().toISOString(),
        ticksAtIso: input.ticksAtIso,
      });

      await db.insert(nemesisPlans).values({
        planId: plan.id,
        nemesisId: input.nemesisId,
        userId: ctx.user.id,
        sequence,
        kind: plan.kind,
        targetSurface: plan.targetSurface,
        targetDetail: plan.targetDetail,
        loreTitle: plan.loreTitle,
        rewardOnSuccess: plan.rewardOnSuccess,
        status: plan.status,
        ticksAt: new Date(plan.ticksAtIso),
      });

      return plan;
    }),

  /** Resolve a Plan (disrupted / succeeded / expired). */
  resolvePlan: protectedProcedure
    .input(
      z.object({
        planId: z.string().min(1).max(96),
        status: planStatusSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db
        .update(nemesisPlans)
        .set({
          status: input.status,
          resolvedAt: new Date(),
        })
        .where(
          and(
            eq(nemesisPlans.planId, input.planId),
            eq(nemesisPlans.userId, ctx.user.id),
          ),
        );

      return { planId: input.planId, status: input.status };
    }),
});
