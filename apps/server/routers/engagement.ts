/**
 * ENGAGEMENT ROUTER
 * ──────────────────────────────────────────────────
 * The single integration seam for the five NPC-paired
 * engagement modules:
 *
 *   • Breeding × Dr. Lyra Vox  → bloodline witnesses
 *   • Army Recruiting × Vex Solène → commissions + directives
 *   • Celebration × Game Masters → trial interventions
 *   • Mechronis × the Engineer → journal-page recovery
 *   • Trade Empire × Adjudicator Locke → confidential ledger
 *
 * State stored in userProgress.gameData.engagement under the
 * dischordian-saga franchise, mirroring the crew + tradeEmpire
 * pattern.
 *
 * Every procedure is small: a load → mutate → save cycle around
 * pure helpers from apps/shared/. The shared modules carry the
 * gameplay logic + the canonical NPC voice; this file wires them
 * to per-user persistence.
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { userProgress } from "../../db/schema";
import { eq, and } from "drizzle-orm";

import {
  ENGAGEMENT_STATE_VERSION,
  createDefaultEngagementState,
  ensureEngagementState,
  getApprenticeState,
  upsertApprenticeState,
  type EngagementState,
} from "../../shared/engagementPersistence";

import {
  scanBloodlineForWitnesses,
  aggregateBloodlineBoons,
  type WitnessReport,
} from "../../shared/lyraVoxBloodlineWitness";

import {
  commissionsForMissionCount,
} from "../../shared/vexSoleneCommissions";

import {
  INTERVENTION_DAYS,
  checkInterventionEligibility,
  invokeIntervention,
  aggregateBoons,
  type InterventionDay,
} from "../../shared/gameMastersTrialIntervention";

import {
  recoverJournalPage,
  equipSignature,
  resolveEquippedSignature,
} from "../../shared/engineerShadowCurriculum";

import {
  allLedgerEntries,
  checkLedgerEligibility,
  executeLedgerEntry,
  getLedgerEntry,
  type LockeTrustBand,
} from "../../shared/lockeConfidentialLedger";

const FRANCHISE = "dischordian-saga";

function dbUnavailable(): never {
  throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
}

/* ─── persistence helpers ─── */

async function loadState(userId: number): Promise<EngagementState> {
  const db = await getDb();
  if (!db) dbUnavailable();
  const rows = await db
    .select()
    .from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.franchiseId, FRANCHISE)))
    .limit(1);
  const gameData = (rows[0]?.gameData as Record<string, unknown> | undefined) ?? {};
  return ensureEngagementState(gameData.engagement);
}

async function saveState(userId: number, state: EngagementState): Promise<void> {
  const db = await getDb();
  if (!db) dbUnavailable();
  const rows = await db
    .select()
    .from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.franchiseId, FRANCHISE)))
    .limit(1);
  const existing = (rows[0]?.gameData as Record<string, unknown> | undefined) ?? {};
  const next = { ...existing, engagement: { ...state, version: ENGAGEMENT_STATE_VERSION } };
  if (rows.length > 0) {
    await db
      .update(userProgress)
      .set({ gameData: next })
      .where(and(eq(userProgress.userId, userId), eq(userProgress.franchiseId, FRANCHISE)));
  } else {
    await db.insert(userProgress).values({
      userId,
      franchiseId: FRANCHISE,
      xp: 0,
      level: 1,
      points: 0,
      gameData: next,
    });
  }
}

/* ─── input schemas (named for reuse) ─── */

const interventionDaySchema = z.union([z.literal(7), z.literal(14), z.literal(21), z.literal(28)]);
const trustBandSchema = z.union([z.literal("Stranger"), z.literal("Counterparty"), z.literal("Partner")]);

/* ─── ROUTER ─── */

export const engagementRouter = router({
  /* ─────────────────────────────────────────────────
     getState — full snapshot of the engagement layer
     ───────────────────────────────────────────────── */
  getState: protectedProcedure.query(async ({ ctx }) => {
    return await loadState(ctx.user.id);
  }),

  /* ═══════════════════════════════════════════════════
     BREEDING × DR. LYRA VOX — bloodline witnesses
     ═══════════════════════════════════════════════════ */

  bloodlineWitnesses: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const state = await loadState(ctx.user.id);
      return state.bloodlineWitnesses;
    }),

    /**
     * Scan a bloodline against the canonical milestones and file any
     * new witnesses. Caller passes a snapshot of the bloodline + its
     * roster context. Returns the new witnesses (not the cumulative
     * list); UI surfaces "what just unlocked" with this.
     */
    scan: protectedProcedure
      .input(z.object({
        bloodline: z.object({
          id: z.string(),
          generationCount: z.number(),
          geneticDrift: z.number(),
        }),
        members: z.array(z.object({
          bloodlineId: z.string(),
          isFounder: z.boolean().optional(),
          stats: z.object({
            resilience: z.number(),
            intellect: z.number(),
            reflexes: z.number(),
            empathy: z.number(),
            immunity: z.number(),
            adaptability: z.number(),
          }),
        })),
        deceased: z.array(z.object({
          bloodlineId: z.string(),
          isFounder: z.boolean().optional(),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        const state = await loadState(ctx.user.id);
        const newReports = scanBloodlineForWitnesses(
          // Cast back to nominal types: the runtime check is the
          // structural shape of the input, which matches the
          // SerializedBloodline / SerializedCrewMember subsets the
          // scanner reads.
          input.bloodline as never,
          input.members as never,
          input.deceased as never,
          state.bloodlineWitnesses,
          Date.now(),
        );
        if (newReports.length === 0) return { newReports: [] as WitnessReport[] };
        const next: EngagementState = {
          ...state,
          bloodlineWitnesses: [...state.bloodlineWitnesses, ...newReports],
        };
        await saveState(ctx.user.id, next);
        return { newReports };
      }),

    /** Aggregated boons currently active for a bloodline. */
    boonsForBloodline: protectedProcedure
      .input(z.object({ bloodlineId: z.string() }))
      .query(async ({ ctx, input }) => {
        const state = await loadState(ctx.user.id);
        return aggregateBloodlineBoons(
          state.bloodlineWitnesses.map(w => w.boon),
          input.bloodlineId as never,
        );
      }),
  }),

  /* ═══════════════════════════════════════════════════
     ARMY RECRUITING × VEX SOLÈNE — commissions
     ═══════════════════════════════════════════════════ */

  vexCommissions: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const state = await loadState(ctx.user.id);
      return {
        receipts: state.vexCommissions,
        lastMissionCount: state.vexLastMissionCount,
      };
    }),

    /**
     * Record a new total mission count and return any commissions
     * the player just crossed. Idempotent: if the count hasn't
     * advanced past lastMissionCount, returns nothing.
     */
    recordMissionCount: protectedProcedure
      .input(z.object({ missionCount: z.number().int().nonnegative() }))
      .mutation(async ({ ctx, input }) => {
        const state = await loadState(ctx.user.id);
        const prev = state.vexLastMissionCount;
        const next = Math.max(prev, input.missionCount);
        const newCommissions = commissionsForMissionCount(prev, next);
        if (newCommissions.length === 0 && next === prev) {
          return { newCommissions: [] };
        }
        const newReceipts = newCommissions.map(c => ({
          milestone: c.milestone,
          receivedAt: Date.now(),
          directive: c.directive,
        }));
        const persisted: EngagementState = {
          ...state,
          vexCommissions: [...state.vexCommissions, ...newReceipts],
          vexLastMissionCount: next,
        };
        await saveState(ctx.user.id, persisted);
        return { newCommissions };
      }),
  }),

  /* ═══════════════════════════════════════════════════
     CELEBRATION × GAME MASTERS — trial interventions
     ═══════════════════════════════════════════════════ */

  gameMasters: router({
    /** Per-apprentice intervention state. */
    getApprentice: protectedProcedure
      .input(z.object({ apprenticeId: z.string() }))
      .query(async ({ ctx, input }) => {
        const state = await loadState(ctx.user.id);
        return getApprenticeState(state, input.apprenticeId);
      }),

    /** Pre-flight: is the rite available right now for this apprentice? */
    checkEligibility: protectedProcedure
      .input(z.object({
        apprenticeId: z.string(),
        trialDay: z.number().int().nonnegative(),
        bond: z.number().int(),
        missedDays: z.number().int().nonnegative(),
      }))
      .query(async ({ ctx, input }) => {
        const state = await loadState(ctx.user.id);
        const ap = getApprenticeState(state, input.apprenticeId);
        return checkInterventionEligibility({
          trialDay: input.trialDay,
          bond: input.bond,
          missedDays: input.missedDays,
          redeemedDays: ap.redeemedDays,
        });
      }),

    /**
     * Invoke a Game Masters intervention. Caller passes the
     * apprentice's current trial state; router validates with
     * checkInterventionEligibility, applies the intervention,
     * and persists the new redemption + held-boon record.
     */
    invoke: protectedProcedure
      .input(z.object({
        apprenticeId: z.string(),
        trialDay: z.number().int().nonnegative(),
        bond: z.number().int(),
        missedDays: z.number().int().nonnegative(),
      }))
      .mutation(async ({ ctx, input }) => {
        const state = await loadState(ctx.user.id);
        const ap = getApprenticeState(state, input.apprenticeId);
        const eligibility = checkInterventionEligibility({
          trialDay: input.trialDay,
          bond: input.bond,
          missedDays: input.missedDays,
          redeemedDays: ap.redeemedDays,
        });
        if (!eligibility.eligible) {
          return { success: false as const, reason: eligibility.reason };
        }
        const result = invokeIntervention({
          trialDay: input.trialDay,
          bond: input.bond,
          missedDays: input.missedDays,
          redeemedDays: ap.redeemedDays,
        });
        const day = result.intervention.day;
        const updatedAp = {
          apprenticeId: input.apprenticeId,
          redeemedDays: result.redeemedDaysAfter as InterventionDay[],
          heldBoonDays: ap.heldBoonDays.includes(day)
            ? ap.heldBoonDays
            : [...ap.heldBoonDays, day],
        };
        const persisted: EngagementState = {
          ...state,
          gameMastersByApprentice: upsertApprenticeState(state, updatedAp),
        };
        await saveState(ctx.user.id, persisted);
        return {
          success: true as const,
          intervention: result.intervention,
          bondAfter: result.bondAfter,
          missedDaysAfter: result.missedDaysAfter,
          line: result.line,
        };
      }),

    /**
     * Aggregate boons currently held by an apprentice. The trial
     * summary reads this when computing end-of-run combat buffs.
     */
    aggregateBoons: protectedProcedure
      .input(z.object({ apprenticeId: z.string() }))
      .query(async ({ ctx, input }) => {
        const state = await loadState(ctx.user.id);
        const ap = getApprenticeState(state, input.apprenticeId);
        return aggregateBoons(ap.heldBoonDays.map(d => ({ day: d })));
      }),

    /** All canonical intervention days — useful for static UI seeding. */
    days: protectedProcedure.query(async () => INTERVENTION_DAYS),
  }),

  /* ═══════════════════════════════════════════════════
     MECHRONIS × THE ENGINEER'S JOURNAL
     ═══════════════════════════════════════════════════ */

  engineerJournal: router({
    progress: protectedProcedure.query(async ({ ctx }) => {
      const state = await loadState(ctx.user.id);
      return state.engineerJournal;
    }),

    /**
     * Recover one journal page. Triggered when the player earns a
     * Distinction grade in any Mechronis lesson (see
     * apps/server/routers/celebration.ts addTranscriptEntry).
     */
    recoverPage: protectedProcedure.mutation(async ({ ctx }) => {
      const state = await loadState(ctx.user.id);
      const r = recoverJournalPage(state.engineerJournal);
      if (r.page === null) {
        return { recovered: false as const };
      }
      const persisted: EngagementState = { ...state, engineerJournal: r.progress };
      await saveState(ctx.user.id, persisted);
      return {
        recovered: true as const,
        page: r.page,
        chapterUnlocked: r.chapterUnlocked,
      };
    }),

    /** Equip a signature technique chapter (or unequip with null). */
    equipChapter: protectedProcedure
      .input(z.object({ chapterNumber: z.number().int().min(1).max(4).nullable() }))
      .mutation(async ({ ctx, input }) => {
        const state = await loadState(ctx.user.id);
        const r = equipSignature(state.engineerJournal, input.chapterNumber);
        if (!r.ok) return { success: false as const, reason: r.reason };
        const persisted: EngagementState = { ...state, engineerJournal: r.progress };
        await saveState(ctx.user.id, persisted);
        return { success: true as const, equippedChapter: r.progress.equippedChapter };
      }),

    /** Resolve the currently equipped technique (for card-match start). */
    equipped: protectedProcedure.query(async ({ ctx }) => {
      const state = await loadState(ctx.user.id);
      return resolveEquippedSignature(state.engineerJournal);
    }),
  }),

  /* ═══════════════════════════════════════════════════
     TRADE EMPIRE × ADJUDICATOR LOCKE — confidential ledger
     ═══════════════════════════════════════════════════ */

  lockeLedger: router({
    /** Static catalog of every contract the ledger ever offers. */
    catalog: protectedProcedure.query(async () => allLedgerEntries()),

    /** Per-user state — which entries the player has signed. */
    state: protectedProcedure.query(async ({ ctx }) => {
      const state = await loadState(ctx.user.id);
      return { completedEntryIds: state.lockeCompletedEntryIds };
    }),

    /**
     * Pre-flight: which contracts are signable right now given the
     * caller's current Locke band + reputation? Caller passes both
     * because Locke trust + reputation live in the trade-empire
     * subsystem; the engagement router doesn't reach into trade
     * state to read them.
     */
    checkAvailability: protectedProcedure
      .input(z.object({
        band: trustBandSchema,
        reputation: z.number().int().nonnegative(),
      }))
      .query(async ({ ctx, input }) => {
        const state = await loadState(ctx.user.id);
        const eligible = allLedgerEntries().filter(e =>
          checkLedgerEligibility(e, {
            band: input.band as LockeTrustBand,
            reputation: input.reputation,
            completedEntryIds: state.lockeCompletedEntryIds,
          }).eligible
        );
        return eligible;
      }),

    /**
     * Sign and execute a confidential-ledger contract. The router
     * validates eligibility, debits Locke reputation conceptually
     * (caller is responsible for applying the cost to the
     * trade-empire reputation table on its side), persists the
     * completion, and returns the cross-system payout for the
     * client to route to the receiving subsystem.
     */
    sign: protectedProcedure
      .input(z.object({
        entryId: z.string(),
        band: trustBandSchema,
        reputation: z.number().int().nonnegative(),
      }))
      .mutation(async ({ ctx, input }) => {
        const state = await loadState(ctx.user.id);
        const entry = getLedgerEntry(input.entryId);
        if (!entry) {
          return { success: false as const, reason: "unknown_entry" as const };
        }
        const eligibility = checkLedgerEligibility(entry, {
          band: input.band as LockeTrustBand,
          reputation: input.reputation,
          completedEntryIds: state.lockeCompletedEntryIds,
        });
        if (!eligibility.eligible) {
          return { success: false as const, reason: eligibility.reason };
        }
        const result = executeLedgerEntry(entry, {
          band: input.band as LockeTrustBand,
          reputation: input.reputation,
          completedEntryIds: state.lockeCompletedEntryIds,
        });
        const persisted: EngagementState = {
          ...state,
          lockeCompletedEntryIds: result.completedEntryIdsAfter,
        };
        await saveState(ctx.user.id, persisted);
        return {
          success: true as const,
          payout: result.payout,
          reputationAfter: result.reputationAfter,
          closeLine: result.closeLine,
        };
      }),
  }),
});
