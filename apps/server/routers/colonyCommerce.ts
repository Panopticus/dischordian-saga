/**
 * Colony Commerce Router — Trade Empire Phase B.
 *
 * Veska's harbor licenses founding lanes from the Inception Ark's
 * mature bloodlines. This router is the runtime for the colony-
 * commerce surface: charter a colony ship, seed a sector, watch
 * the colony's generations export Dream tokens back to the founder.
 *
 * Two-stage tutor handoff:
 *   - mech_breeding_tutor_seen — Elara introduces breeding (Act 3)
 *   - mech_colony_commerce_tutor_seen — Veska commercializes mature
 *     bloodlines once trade_empire_unlocked is also set
 *
 * State lives in three normalized tables (apps/db/schema.ts):
 *   - colonyLanes — voyages in flight
 *   - colonyWorlds — seeded sectors with generation counters
 *   - colonyFounderProgress — per-user founder tier + total founded
 *
 * Companion: apps/shared/tradeEmpire/colonyCommerce.ts (types +
 * economics canon — vessels, eligible sectors, founder tiers,
 * tariff math).
 *
 * audit-allow-proc: recordGenerationTick, getFounderTariffDiscount
 *   recordGenerationTick is fired by the future world-tick scheduler
 *   (analogous to crew bloodline aging ticks) — not a player-driven
 *   UI button. getFounderTariffDiscount is a future read-only
 *   convenience for tariff-display sub-widgets that don't need full
 *   getState; the panel currently reads founder data via getState.
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../_core/trpc";
import { getDbWithRetry } from "../db";
import {
  colonyLanes,
  colonyWorlds,
  colonyFounderProgress,
  userProgress,
  dreamBalance,
} from "../../db/schema";
import { eq, and, desc } from "drizzle-orm";
import {
  COLONY_VESSEL_SPECS,
  isColonyEligibleSector,
  computeFoundingTariff,
  resolveFounderTier,
  founderDiscountBps,
  crossedMilestone,
  FIRST_EXPORT_GENERATION,
  PER_GENERATION_EXPORT_VALUE,
  BLOODLINE_MATURITY_GEN,
  type ColonyVesselClass,
  type ColonyLaneState,
  type ColonyWorldState,
  type FounderProgressState,
  type ColonyCommerceState,
} from "@shared/tradeEmpire/colonyCommerce";

const FRANCHISE = "dischordian-saga";

function dbUnavailable(): never {
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Database unavailable",
  });
}

const VESSEL_CLASS_VALUES = Object.keys(COLONY_VESSEL_SPECS) as ColonyVesselClass[];
const vesselClassEnum = z.enum(VESSEL_CLASS_VALUES as [ColonyVesselClass, ...ColonyVesselClass[]]);

/* ─── Helpers ─── */

async function readNarrativeFlags(
  db: NonNullable<Awaited<ReturnType<typeof getDbWithRetry>>>,
  userId: number,
): Promise<Record<string, unknown>> {
  const rows = await db
    .select({ gameData: userProgress.gameData })
    .from(userProgress)
    .where(
      and(
        eq(userProgress.userId, userId),
        eq(userProgress.franchiseId, FRANCHISE),
      ),
    )
    .limit(1);
  const gameData = (rows[0]?.gameData as { narrativeFlags?: Record<string, unknown> } | null) ?? {};
  return gameData.narrativeFlags ?? {};
}

async function loadFounderProgress(
  db: NonNullable<Awaited<ReturnType<typeof getDbWithRetry>>>,
  userId: number,
): Promise<FounderProgressState> {
  const rows = await db
    .select()
    .from(colonyFounderProgress)
    .where(eq(colonyFounderProgress.userId, userId))
    .limit(1);
  const row = rows[0];
  const total = row?.totalColoniesFounded ?? 0;
  return {
    totalColoniesFounded: total,
    founderTier: row?.founderTier ?? resolveFounderTier(total),
    founderDiscountBps: founderDiscountBps(total),
  };
}

async function loadActiveLanes(
  db: NonNullable<Awaited<ReturnType<typeof getDbWithRetry>>>,
  userId: number,
): Promise<ColonyLaneState[]> {
  const rows = await db
    .select()
    .from(colonyLanes)
    .where(eq(colonyLanes.userId, userId))
    .orderBy(desc(colonyLanes.signedAt));
  return rows.map((r) => ({
    laneId: r.laneId,
    sectorId: r.sectorId,
    vesselClass: r.vesselClass as ColonyVesselClass,
    bloodlineKey: r.bloodlineKey,
    signedAt: Number(r.signedAt),
    durationMs: Number(r.durationMs),
    tariffPaid: r.tariffPaid,
    status: r.status as ColonyLaneState["status"],
  }));
}

async function loadColonies(
  db: NonNullable<Awaited<ReturnType<typeof getDbWithRetry>>>,
  userId: number,
): Promise<ColonyWorldState[]> {
  const rows = await db
    .select()
    .from(colonyWorlds)
    .where(eq(colonyWorlds.userId, userId))
    .orderBy(desc(colonyWorlds.foundedAt));
  return rows.map((r) => ({
    colonyId: r.colonyId,
    sectorId: r.sectorId,
    bloodlineKey: r.bloodlineKey,
    name: r.name,
    foundedAt: r.foundedAt.getTime(),
    currentGeneration: r.currentGeneration,
    lastExportAt: r.lastExportAt !== null ? Number(r.lastExportAt) : null,
    totalExportValue: r.totalExportValue,
  }));
}

async function readBloodlineGeneration(
  db: NonNullable<Awaited<ReturnType<typeof getDbWithRetry>>>,
  userId: number,
  bloodlineKey: string,
): Promise<number | null> {
  const rows = await db
    .select({ gameData: userProgress.gameData })
    .from(userProgress)
    .where(
      and(
        eq(userProgress.userId, userId),
        eq(userProgress.franchiseId, FRANCHISE),
      ),
    )
    .limit(1);
  const gameData = rows[0]?.gameData as
    | { crew?: { bloodlines?: Record<string, { generationCount?: number }> } }
    | null;
  const bl = gameData?.crew?.bloodlines?.[bloodlineKey];
  return bl?.generationCount ?? null;
}

async function debitDreamTokens(
  db: NonNullable<Awaited<ReturnType<typeof getDbWithRetry>>>,
  userId: number,
  amount: number,
): Promise<void> {
  if (amount <= 0) return;
  const rows = await db
    .select({ tokens: dreamBalance.dreamTokens })
    .from(dreamBalance)
    .where(eq(dreamBalance.userId, userId))
    .limit(1);
  const current = rows[0]?.tokens ?? 0;
  if (current < amount) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Insufficient Dream tokens (have ${current}, need ${amount})`,
    });
  }
  await db
    .update(dreamBalance)
    .set({ dreamTokens: current - amount })
    .where(eq(dreamBalance.userId, userId));
}

async function creditDreamTokens(
  db: NonNullable<Awaited<ReturnType<typeof getDbWithRetry>>>,
  userId: number,
  amount: number,
): Promise<void> {
  if (amount <= 0) return;
  const rows = await db
    .select({ tokens: dreamBalance.dreamTokens })
    .from(dreamBalance)
    .where(eq(dreamBalance.userId, userId))
    .limit(1);
  if (rows[0]) {
    await db
      .update(dreamBalance)
      .set({ dreamTokens: rows[0].tokens + amount })
      .where(eq(dreamBalance.userId, userId));
  } else {
    await db.insert(dreamBalance).values({
      userId,
      dreamTokens: amount,
      soulBoundDream: 0,
      dnaCode: 0,
      totalDreamEarned: amount,
    });
  }
}

/* ─── Router ─── */

export const colonyCommerceRouter = router({
  /**
   * Read-only state aggregator. Returns the player's founder tier,
   * active voyages, founded colonies, and current discount in bps.
   */
  getState: protectedProcedure.query(async ({ ctx }): Promise<ColonyCommerceState> => {
    const db = await getDbWithRetry();
    if (!db) dbUnavailable();
    const [founderProgress, activeLanes, colonies] = await Promise.all([
      loadFounderProgress(db, ctx.user.id),
      loadActiveLanes(db, ctx.user.id),
      loadColonies(db, ctx.user.id),
    ]);
    return { founderProgress, activeLanes, colonies };
  }),

  /**
   * Vessel catalog with the player's actual tariff after their
   * current founder discount. Drives the charter UI.
   */
  getVesselQuotes: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDbWithRetry();
    if (!db) dbUnavailable();
    const founder = await loadFounderProgress(db, ctx.user.id);
    return Object.values(COLONY_VESSEL_SPECS).map((vessel) => ({
      id: vessel.id,
      displayName: vessel.displayName,
      voyageDurationMs: vessel.voyageDurationMs,
      baseTariffDream: vessel.baseTariffDream,
      requiredFounderTier: vessel.requiredFounderTier,
      effectiveTariffDream: computeFoundingTariff(vessel, founder.founderDiscountBps),
      eligible: founder.founderTier >= vessel.requiredFounderTier,
    }));
  }),

  /**
   * Sign a founding lane. Gates: tutor flag + trade_empire unlocked
   * + sector eligible + bloodline mature + vessel tier eligible +
   * Dream tokens to cover the tariff. Inserts the lane row + debits.
   */
  signColonyLane: protectedProcedure
    .input(
      z.object({
        bloodlineKey: z.string().min(1).max(64),
        sectorId: z.string().min(1).max(128),
        vesselClass: vesselClassEnum,
        colonyName: z.string().min(1).max(128),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDbWithRetry();
      if (!db) dbUnavailable();

      // Gate 1: tutor + trade-empire-unlock flags.
      const flags = await readNarrativeFlags(db, ctx.user.id);
      if (!flags.mech_colony_commerce_tutor_seen) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Veska has not yet underwritten colony lanes for you.",
        });
      }
      if (!flags.trade_empire_unlocked) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Trade Empire access is required to charter a colony ship.",
        });
      }

      // Gate 2: sector eligibility.
      if (!isColonyEligibleSector(input.sectorId)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Sector ${input.sectorId} does not license colony charters.`,
        });
      }

      // Gate 3: bloodline maturity (read-through to crew state).
      const generation = await readBloodlineGeneration(
        db,
        ctx.user.id,
        input.bloodlineKey,
      );
      if (generation === null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Bloodline ${input.bloodlineKey} not found.`,
        });
      }
      if (generation < BLOODLINE_MATURITY_GEN) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Bloodline must reach generation ${BLOODLINE_MATURITY_GEN} (currently ${generation}).`,
        });
      }

      // Gate 4: vessel tier.
      const vessel = COLONY_VESSEL_SPECS[input.vesselClass];
      const founder = await loadFounderProgress(db, ctx.user.id);
      if (founder.founderTier < vessel.requiredFounderTier) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `${vessel.displayName} requires founder tier ${vessel.requiredFounderTier} (have ${founder.founderTier}).`,
        });
      }

      // Compute tariff and debit.
      const tariff = computeFoundingTariff(vessel, founder.founderDiscountBps);
      await debitDreamTokens(db, ctx.user.id, tariff);

      // Insert the lane row.
      const signedAt = Date.now();
      const laneId = `lane_${ctx.user.id}_${input.bloodlineKey}_${input.sectorId}_${signedAt}`;
      await db.insert(colonyLanes).values({
        userId: ctx.user.id,
        laneId,
        sectorId: input.sectorId,
        vesselClass: input.vesselClass,
        bloodlineKey: input.bloodlineKey,
        signedAt,
        durationMs: vessel.voyageDurationMs,
        tariffPaid: tariff,
        status: "in_voyage",
      });

      return {
        success: true,
        laneId,
        tariffPaid: tariff,
        arrivesAt: signedAt + vessel.voyageDurationMs,
        colonyName: input.colonyName,
      };
    }),

  /**
   * Complete a voyage: mark the lane arrived, create the colonyWorlds
   * row, increment founder progress, fire milestone tier-ups.
   */
  recordColonyArrival: protectedProcedure
    .input(
      z.object({
        laneId: z.string(),
        colonyName: z.string().min(1).max(128),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDbWithRetry();
      if (!db) dbUnavailable();

      const laneRows = await db
        .select()
        .from(colonyLanes)
        .where(
          and(
            eq(colonyLanes.userId, ctx.user.id),
            eq(colonyLanes.laneId, input.laneId),
          ),
        )
        .limit(1);
      const lane = laneRows[0];
      if (!lane) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Lane ${input.laneId} not found.`,
        });
      }
      if (lane.status !== "in_voyage") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Lane is already ${lane.status}.`,
        });
      }

      const arrivesAt = Number(lane.signedAt) + Number(lane.durationMs);
      if (Date.now() < arrivesAt) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Voyage still in flight.",
        });
      }

      // Mark lane arrived.
      await db
        .update(colonyLanes)
        .set({ status: "arrived" })
        .where(eq(colonyLanes.id, lane.id));

      // Create the colony world.
      const colonyId = lane.laneId.replace(/^lane_/, "colony_");
      await db.insert(colonyWorlds).values({
        userId: ctx.user.id,
        colonyId,
        sectorId: lane.sectorId,
        bloodlineKey: lane.bloodlineKey,
        name: input.colonyName,
        currentGeneration: 1,
        totalExportValue: 0,
      });

      // Bump founder progress.
      const prevFounder = await loadFounderProgress(db, ctx.user.id);
      const newTotal = prevFounder.totalColoniesFounded + 1;
      const newTier = resolveFounderTier(newTotal);
      const tierCrossed = crossedMilestone(prevFounder.totalColoniesFounded, newTotal);
      const existingProgress = await db
        .select()
        .from(colonyFounderProgress)
        .where(eq(colonyFounderProgress.userId, ctx.user.id))
        .limit(1);
      if (existingProgress.length > 0) {
        await db
          .update(colonyFounderProgress)
          .set({
            totalColoniesFounded: newTotal,
            founderTier: newTier,
            ...(tierCrossed ? { lastTierAt: new Date() } : {}),
          })
          .where(eq(colonyFounderProgress.userId, ctx.user.id));
      } else {
        await db.insert(colonyFounderProgress).values({
          userId: ctx.user.id,
          totalColoniesFounded: newTotal,
          founderTier: newTier,
          lastTierAt: tierCrossed ? new Date() : null,
        });
      }

      return {
        success: true,
        colonyId,
        founderTier: newTier,
        founderDiscountBps: founderDiscountBps(newTotal),
        milestoneCrossed: tierCrossed,
      };
    }),

  /**
   * Tick a colony's generation counter. Credits export Dream when
   * the generation crosses FIRST_EXPORT_GENERATION (= 2). Idempotent
   * by colony+generation.
   */
  recordGenerationTick: protectedProcedure
    .input(
      z.object({
        colonyId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDbWithRetry();
      if (!db) dbUnavailable();
      const rows = await db
        .select()
        .from(colonyWorlds)
        .where(
          and(
            eq(colonyWorlds.userId, ctx.user.id),
            eq(colonyWorlds.colonyId, input.colonyId),
          ),
        )
        .limit(1);
      const colony = rows[0];
      if (!colony) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Colony ${input.colonyId} not found.`,
        });
      }

      const newGeneration = colony.currentGeneration + 1;
      const exportsThisTick =
        newGeneration >= FIRST_EXPORT_GENERATION ? PER_GENERATION_EXPORT_VALUE : 0;

      await db
        .update(colonyWorlds)
        .set({
          currentGeneration: newGeneration,
          lastExportAt: exportsThisTick > 0 ? Date.now() : colony.lastExportAt,
          totalExportValue: colony.totalExportValue + exportsThisTick,
        })
        .where(eq(colonyWorlds.id, colony.id));

      if (exportsThisTick > 0) {
        await creditDreamTokens(db, ctx.user.id, exportsThisTick);
      }

      return {
        success: true,
        currentGeneration: newGeneration,
        exportsCredited: exportsThisTick,
      };
    }),

  /**
   * Read-only founder discount (in bps). Surfaced separately so
   * tariff displays in the trade-empire UI can show the player
   * their compounding benefit without pulling full state.
   */
  getFounderTariffDiscount: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDbWithRetry();
    if (!db) dbUnavailable();
    const founder = await loadFounderProgress(db, ctx.user.id);
    return {
      totalColoniesFounded: founder.totalColoniesFounded,
      founderTier: founder.founderTier,
      founderDiscountBps: founder.founderDiscountBps,
    };
  }),
});
