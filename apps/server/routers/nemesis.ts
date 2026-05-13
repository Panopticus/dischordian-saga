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
  chooseNemesisFaction,
  type NemesisDef,
  type FactionStandingSnapshot,
} from "../../shared/nemesisSystem";
import {
  generateQuoteOpening,
  type NemesisEncounterKind,
} from "../../shared/nemesisMemory";
import {
  spawnPlan as spawnPlanShared,
  pickNextPlanKindWeighted,
  planSpawnDeficit,
  canSpawnAdditionalPlan,
  PLAN_KIND_CATALOG,
  type NemesisPlanKind,
  type NemesisPlanStatus,
} from "../../shared/nemesisPlans";
import { weightedPlanKindsFor } from "../../shared/nemesisArchetypes";
import { getFactionStandings } from "../services/factionStandingService";
import type { FactionId } from "../../shared/factions";

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
    alignedFaction: (row.alignedFaction ?? "hierarchy") as FactionId,
    spawnedAt: row.spawnedAt.toISOString(),
    lastEncounterAt: row.lastEncounterAt?.toISOString() ?? null,
  };
}

/* ═══════════════════════════════════════════════════════
   PHASE K1.1 — PLAN TOP-UP HELPER

   Reads the active plan count for one Nemesis; if below
   MIN_ACTIVE_PLANS, spawns new plans up to the floor
   using K4-weighted selection. Respects the K2 global
   ceiling. Seeded RNG keeps it deterministic per
   (userId, cohortNumber, sequence).
   ═══════════════════════════════════════════════════════ */
async function topUpPlansForNemesis(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  userId: number,
  stateRow: typeof nemesisState.$inferSelect,
): Promise<number> {
  const allPlans = await db
    .select()
    .from(nemesisPlans)
    .where(eq(nemesisPlans.nemesisId, stateRow.nemesisId));
  const activeForThisNemesis = allPlans.filter(
    (p) => p.status === "spawned" || p.status === "ticking",
  ).length;
  const deficit = Math.max(0, 3 - activeForThisNemesis);
  if (deficit === 0) return 0;

  // Global ceiling check
  const allUserPlans = await db
    .select()
    .from(nemesisPlans)
    .where(eq(nemesisPlans.userId, userId));
  const totalActive = allUserPlans.filter(
    (p) => p.status === "spawned" || p.status === "ticking",
  ).length;

  const archetype = stateRow.nemesisArchetype as ApprenticeArchetype;
  const archetypeWeights = weightedPlanKindsFor(archetype, {});
  const eligibleKinds = PLAN_KIND_CATALOG.map((d) => d.kind);

  const nemesisDef: NemesisDef = {
    id: stateRow.nemesisId,
    userId: stateRow.userId,
    cohortNumber: stateRow.cohortNumber,
    archetype,
    identity: {
      archetypeTitle: stateRow.archetypeTitle,
      properName: stateRow.properName,
      nameRevealed: stateRow.nameRevealed === 1,
    },
    politicianTic: stateRow.politicianTic as NemesisDef["politicianTic"],
    rank: stateRow.rank as NemesisDef["rank"],
    grudgeTier: stateRow.grudgeTier as NemesisDef["grudgeTier"],
    preferredSurface: stateRow.preferredSurface as NemesisDef["preferredSurface"],
    spawnedAt: stateRow.spawnedAt.toISOString(),
    lastEncounterAt: stateRow.lastEncounterAt?.toISOString() ?? null,
  };

  let spawned = 0;
  let totalAfter = totalActive;
  for (let i = 0; i < deficit; i++) {
    if (!canSpawnAdditionalPlan(totalAfter)) break;
    // Seeded RNG draw — deterministic on (userId, cohort, sequence)
    const seed =
      userId * 1009 +
      stateRow.cohortNumber * 31 +
      (allPlans.length + spawned + 1) * 7;
    const rng01 = ((seed * 2654435761) >>> 0) / 4294967296;

    const kind = pickNextPlanKindWeighted({
      eligibleKinds,
      archetypeWeights,
      rng01,
    });
    if (!kind) break;

    const sequence = allPlans.length + spawned + 1;
    const plan = spawnPlanShared({
      nemesis: nemesisDef,
      sequence,
      kind,
      targetDetail: `auto-${stateRow.nemesisId}-${sequence}`,
      spawnedAtIso: new Date().toISOString(),
    });
    await db.insert(nemesisPlans).values({
      planId: plan.id,
      nemesisId: stateRow.nemesisId,
      userId,
      sequence,
      kind: plan.kind,
      targetSurface: plan.targetSurface,
      targetDetail: plan.targetDetail,
      loreTitle: plan.loreTitle,
      rewardOnSuccess: plan.rewardOnSuccess,
      status: plan.status,
      ticksAt: new Date(plan.ticksAtIso),
    });
    spawned++;
    totalAfter++;
  }
  return spawned;
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

      // Phase K Wave 4 — compute the player's
      // nemesis-sequence: count of EXISTING (non-retired)
      // Nemeses + 1. If sequence >= 2, we will later fire
      // `accumulation_reveal` on prior Nemeses.
      const existingNemeses = await db
        .select()
        .from(nemesisState)
        .where(
          and(
            eq(nemesisState.userId, ctx.user.id),
            eq(nemesisState.retired, 0),
          ),
        );
      const sequence = existingNemeses.length + 1;

      // Phase K + faction alignment — pin the Nemesis to a
      // faction whose interests align with their archetype
      // AND maximally conflict with the player's current
      // standings. Faction selector is deterministic on
      // (userId, cohortNumber, sequence).
      let alignedFaction: FactionId = "hierarchy";
      try {
        const standings = await getFactionStandings(ctx.user.id);
        const playerStandings: FactionStandingSnapshot[] = (
          Object.entries(standings) as Array<[FactionId, number]>
        ).map(([factionId, standing]) => ({ factionId, standing }));
        alignedFaction = chooseNemesisFaction({
          archetype: nemesis.archetype,
          userId: ctx.user.id,
          cohortNumber: input.cohortNumber,
          nemesisSequence: sequence,
          playerStandings,
        });
      } catch (factionErr) {
        console.warn("[Nemesis] faction alignment failed; defaulting to hierarchy", factionErr);
      }

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
        nemesisSequence: sequence,
        rank: nemesis.rank,
        grudgeTier: nemesis.grudgeTier,
        preferredSurface: nemesis.preferredSurface,
        alignedFaction,
      });

      // Phase K Wave 4 — fire `accumulation_reveal` on the
      // highest-rank PRIOR Nemesis when the new one is the
      // player's 2nd+. The scene plays on the prior
      // Nemesis's next surface read.
      if (sequence >= 2 && existingNemeses.length > 0) {
        try {
          const { recordSurfaceEvent } = await import(
            "../services/nemesisEncounterService"
          );
          const sortedByRank = [...existingNemeses].sort(
            (a, b) => b.rank - a.rank,
          );
          const target = sortedByRank[0];
          await recordSurfaceEvent({
            userId: ctx.user.id,
            cohortNumber: target.cohortNumber,
            source: "world",
            encounterKind: "accumulation_reveal",
            detail: `New Nemesis at sequence ${sequence}: ${nemesis.identity.archetypeTitle}`,
          });
        } catch (accErr) {
          console.warn("[Nemesis] accumulation_reveal fire failed", accErr);
        }
      }

      return { ...nemesis, alignedFaction };
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

      // Lazy plan-tick sweep — any active plan whose ticksAt is in
      // the past auto-succeeds at the moment the player looks. The
      // chronicle's rivalry only progresses when the player witnesses
      // it, but it progresses honestly to the moment the plan would
      // have ticked. Errors are swallowed in the service.
      const { sweepExpiredPlansForUser } = await import(
        "../services/nemesisEncounterService"
      );
      await sweepExpiredPlansForUser(ctx.user.id, db);

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

        // Phase K Wave 4 — fire name_reveal_moment scene
        // exactly once, gated by nameRevealAcknowledged.
        if (rows[0].nameRevealAcknowledged === 0) {
          try {
            const { recordSurfaceEvent } = await import(
              "../services/nemesisEncounterService"
            );
            await recordSurfaceEvent({
              userId: ctx.user.id,
              cohortNumber: rows[0].cohortNumber,
              source: "world",
              encounterKind: "name_revealed",
              detail: rows[0].properName,
            });
            await db
              .update(nemesisState)
              .set({ nameRevealAcknowledged: 1 })
              .where(eq(nemesisState.nemesisId, rows[0].nemesisId));
          } catch (revealErr) {
            console.warn("[Nemesis] name_revealed fire failed", revealErr);
          }
        }
      }

      // Phase K1.1 — opportunistic plan top-up. After the
      // sweep resolves expired plans, replenish the
      // Nemesis's active plan count back to MIN_ACTIVE_PLANS,
      // respecting the global ceiling (K2). Top-up is
      // archetype-weighted via K4 preferences. Errors
      // swallowed; a Nemesis showing zero plans is a
      // visual-only loss.
      try {
        await topUpPlansForNemesis(db, ctx.user.id, rows[0]);
      } catch (topUpErr) {
        console.warn("[Nemesis] plan top-up failed", topUpErr);
      }

      return rowToNemesisDef(rows[0]);
    }),

  /** Phase K2 — Mordor-Saga hybrid: list every active
   *  (non-retired) Nemesis the player has accumulated
   *  across all cohorts. The HUD's NemesisRoster reads
   *  this. */
  getActiveNemeses: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    // Sweep first so retirement-via-rank-0 reflects
    // current plan-tick state.
    const { sweepExpiredPlansForUser } = await import(
      "../services/nemesisEncounterService"
    );
    await sweepExpiredPlansForUser(ctx.user.id, db);

    const rows = await db
      .select()
      .from(nemesisState)
      .where(
        and(
          eq(nemesisState.userId, ctx.user.id),
          eq(nemesisState.retired, 0),
        ),
      )
      .orderBy(desc(nemesisState.spawnedAt));
    return rows.map(rowToNemesisDef);
  }),

  /** Phase K Wave 4 — final encounter trigger. Called when
   *  `act7_arc_closes` flips true (Convergence Seat falls).
   *  Queues a `final_encounter_act7` for each active
   *  Nemesis in the player's roster, highest-rank first. */
  triggerFinalEncountersForUser: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    const roster = await db
      .select()
      .from(nemesisState)
      .where(
        and(
          eq(nemesisState.userId, ctx.user.id),
          eq(nemesisState.retired, 0),
        ),
      )
      .orderBy(desc(nemesisState.rank));
    const { recordSurfaceEvent } = await import(
      "../services/nemesisEncounterService"
    );
    let queued = 0;
    for (const target of roster) {
      try {
        await recordSurfaceEvent({
          userId: ctx.user.id,
          cohortNumber: target.cohortNumber,
          source: "world",
          encounterKind: "final_encounter_act7",
          detail: `Act 7 Convergence — ${target.archetypeTitle}`,
        });
        queued++;
      } catch (finalErr) {
        console.warn("[Nemesis] final_encounter fire failed for", target.nemesisId, finalErr);
      }
    }
    return { queued };
  }),

  /** Phase K Wave 4 — apprentice declared betrayal trigger.
   *  Called when the player chooses "Release them to the
   *  whisper" in the apprenticeBetrayal stage-3 declaration
   *  overlay. Records on the cohort's paired Nemesis;
   *  applies grudge +2 via applyEncounterTransition and
   *  unlocks the 35%-recruit gate. */
  triggerApprenticeDeclaredBetrayal: protectedProcedure
    .input(
      z.object({
        cohortNumber: z.number().int().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { recordSurfaceEvent } = await import(
        "../services/nemesisEncounterService"
      );
      try {
        await recordSurfaceEvent({
          userId: ctx.user.id,
          cohortNumber: input.cohortNumber,
          source: "world",
          encounterKind: "apprentice_declared_betrayal_to_nemesis",
          detail: "Apprentice released to whisper",
        });
        return { recorded: true };
      } catch (declErr) {
        console.warn("[Nemesis] apprentice_declared fire failed", declErr);
        return { recorded: false };
      }
    }),

  /** Phase K Wave 4 — cohort end trigger. Called when the
   *  player's apprentice graduates/dies/betrays. Records
   *  `cohort_ended` on the cohort's paired Nemesis so the
   *  pair-bank's cohort_end_confrontation scene fires on
   *  next surface read. */
  triggerCohortEndForUser: protectedProcedure
    .input(
      z.object({
        cohortNumber: z.number().int().min(1),
        outcome: z.enum(["graduated", "died", "betrayed"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { recordSurfaceEvent } = await import(
        "../services/nemesisEncounterService"
      );
      try {
        await recordSurfaceEvent({
          userId: ctx.user.id,
          cohortNumber: input.cohortNumber,
          source: "world",
          encounterKind: "cohort_ended",
          detail: `Apprentice ${input.outcome}`,
        });
        return { recorded: true };
      } catch (cohortErr) {
        console.warn("[Nemesis] cohort_ended fire failed", cohortErr);
        return { recorded: false };
      }
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

    // Lazy plan-tick sweep — see `getForCohort` for the rationale.
    const { sweepExpiredPlansForUser } = await import(
      "../services/nemesisEncounterService"
    );
    await sweepExpiredPlansForUser(ctx.user.id, db);

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
