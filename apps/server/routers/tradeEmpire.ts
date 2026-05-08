/**
 * Trade Empire Router — Mission execution, completion, and reward granting.
 *
 * Bridges the Trade Empire UI (which manages state locally) with
 * server-side persistence and reward integration into the unified economy.
 *
 * Phase 4 (this revision): state lives in six normalized tables —
 * tradeActiveMissions, tradeCompletedMissions, tradeSectorReputation,
 * tradeActiveCovers, tradeClassSectorUnlocks, tradeEmpireUserAggregates.
 * The legacy userProgress.gameData.tradeEmpire JSON blob is no longer
 * read or written; existing rows are migrated by
 * apps/scripts/backfill-trade-empire-blob.ts.
 *
 * Phase D.5 procedures (getConvergenceClimaxState, getSectorSaturation)
 * land schema-first per the audit-allow comments at apps/db/schema.ts:6974
 * and 7048; client UI for the doom clock + saturation HUD is the next
 * deliverable in the Phase D.5 plan.
 *
 * audit-allow-proc: getConvergenceClimaxState, getSectorSaturation
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../_core/trpc";
import { getDbWithRetry, type DrizzleDb } from "../db";
import { characterSheets, userProgress, dreamBalance } from "../../db/schema";
import { eq, and, desc } from "drizzle-orm";
import { ripple } from "../services/rippleEngine";
import { awardFragments } from "../services/imprintService";
import { recordQuestEvent } from "../services/guildQuestService";
import { processClueDropEvent } from "../services/conspiracyService";
import { awardEligibleTitles } from "../services/titleService";
import type {
  CoverIdentityActivatedEvent,
  CoverIdentityBlownEvent,
  GeneralsDilemmaResolvedEvent,
  OracleFuturePurchasedEvent,
  ContractSignedEvent,
  BrokerEngagementEvent,
  RouteMilestoneEvent,
  SectorFirstEnteredEvent,
} from "../services/rippleEngine";
import {
  CLASS_SECTOR_ACCESS,
  CLASS_EXCLUSIVE_MISSIONS,
  SPY_COVER_IDENTITIES,
} from "@shared/classTradeAccess";
import type { CharClass } from "@shared/characterCreationImpact";
import {
  tradeContracts,
  tradeBrokerEngagement,
  tradeRoutes,
  tradeRouteMilestones,
  tradeSectorArrivals,
  tradeOracleFutures,
  tradeActiveMissions,
  tradeCompletedMissions,
  tradeSectorReputation,
  tradeActiveCovers,
  tradeClassSectorUnlocks,
  tradeEmpireUserAggregates,
  type TradeOracleFutureRow,
} from "../../db/schema";
import { getContractTemplate } from "@shared/tradeEmpire/contractTemplates/index";
import {
  makeRouteKey,
  milestoneTiersCrossedBy,
  MILESTONE_TIER_CANON,
  type RouteMilestoneTier,
} from "@shared/tradeEmpire/routes";
import type { CargoCategory } from "@shared/tradeEmpire/cargo";
import { tryNpcReaction } from "./npc";
import { BROKER_REGISTRY } from "@shared/tradeEmpire/brokers";
import type { NpcKey } from "@shared/npcs/types";

/** Max trade cycles ahead an Oracle can buy a futures contract. */
const PROBABILITY_FUTURES_WINDOW = 3;

/**
 * Real-world hours per Oracle futures cycle. settlesAt is computed as
 * signedAt + cyclesAhead * ORACLE_FUTURES_CYCLE_HOURS hours. Phase 3
 * design call (per the audit-trade-empire-6kj28 plan): cycle clock = real
 * wall-clock, mirrors dispatchMission's durationMs semantics.
 */
const ORACLE_FUTURES_CYCLE_HOURS = 24;

/**
 * Per-mission spot-price impact for Oracle futures spot computation. Each
 * completed mission in the basis sector during the holding window shifts
 * the spot price by this fractional amount in the direction of the
 * position. Tuned so 1 cycle of typical play (~3-5 missions) moves the
 * spot ±5-15% versus base.
 */
const ORACLE_ACTIVITY_PRICE_DELTA = 0.04;

function dbUnavailable(): never {
  throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
}

interface MissionState {
  id: string;
  name: string;
  sectorId: string;
  dispatchedAt: number;
  durationMs: number;
  reward: {
    dream?: number;
    salvage?: number;
    influence?: number;
    voidCrystals?: number;
    xp?: number;
    material?: string;
    materialAmount?: number;
  };
}

interface ActiveCoverState {
  id: string;
  target: string;
  expiresAt: number;
}

interface TradeEmpireState {
  activeMissions: MissionState[];
  completedMissionIds: string[];
  totalMissionsCompleted: number;
  totalDreamEarned: number;
  totalInfluenceEarned: number;
  sectors: Record<string, { controlLevel: number; reputation: number }>;
  activeCover?: ActiveCoverState;
}

const DEFAULT_STATE: TradeEmpireState = {
  activeMissions: [],
  completedMissionIds: [],
  totalMissionsCompleted: 0,
  totalDreamEarned: 0,
  totalInfluenceEarned: 0,
  sectors: {},
};

/**
 * Reasonable cap on how many recent completed-mission ids we surface in
 * the assembled state shape. The full append-only log is queryable via
 * tradeCompletedMissions; getState only returns the recent tail to keep
 * the response payload bounded.
 */
const COMPLETED_MISSION_TAIL = 200;

// ───────────────────────────────────────────────────────────────────────
// Trade Empire state — normalized read path.
// ───────────────────────────────────────────────────────────────────────

/**
 * Load the assembled empire state for a user from the six normalized
 * tables. Returns DEFAULT_STATE for users with no rows yet (fresh users
 * or anyone whose blob was never backfilled).
 */
async function loadEmpireState(userId: number): Promise<TradeEmpireState> {
  const db = await getDbWithRetry();
  if (!db) dbUnavailable();

  const [
    activeRows,
    completedRows,
    sectorRows,
    coverRows,
    aggRows,
  ] = await Promise.all([
    db.select().from(tradeActiveMissions)
      .where(eq(tradeActiveMissions.userId, userId)),
    db.select().from(tradeCompletedMissions)
      .where(eq(tradeCompletedMissions.userId, userId))
      .orderBy(desc(tradeCompletedMissions.completedAt))
      .limit(COMPLETED_MISSION_TAIL),
    db.select().from(tradeSectorReputation)
      .where(eq(tradeSectorReputation.userId, userId)),
    db.select().from(tradeActiveCovers)
      .where(and(
        eq(tradeActiveCovers.userId, userId),
        eq(tradeActiveCovers.cleared, false),
      ))
      .orderBy(desc(tradeActiveCovers.createdAt))
      .limit(1),
    db.select().from(tradeEmpireUserAggregates)
      .where(eq(tradeEmpireUserAggregates.userId, userId))
      .limit(1),
  ]);

  const activeMissions: MissionState[] = activeRows.map((r) => ({
    id: r.missionId,
    name: r.name,
    sectorId: r.sectorId,
    dispatchedAt: Number(r.dispatchedAt),
    durationMs: Number(r.durationMs),
    reward: (r.reward ?? {}) as MissionState["reward"],
  }));

  const completedMissionIds = completedRows.map((r) => r.missionId);

  const sectors: TradeEmpireState["sectors"] = {};
  for (const r of sectorRows) {
    sectors[r.sectorId] = {
      controlLevel: r.controlLevel,
      reputation: r.reputation,
    };
  }

  const agg = aggRows[0];
  const activeCoverRow = coverRows[0];

  return {
    activeMissions,
    completedMissionIds,
    totalMissionsCompleted: agg?.totalMissionsCompleted ?? 0,
    totalDreamEarned: agg?.totalDreamEarned ?? 0,
    totalInfluenceEarned: agg?.totalInfluenceEarned ?? 0,
    sectors,
    activeCover: activeCoverRow
      ? {
          id: activeCoverRow.coverId,
          target: activeCoverRow.targetFactionId,
          expiresAt: Number(activeCoverRow.expiresAt),
        }
      : undefined,
  };
}

// ───────────────────────────────────────────────────────────────────────
// Trade Empire state — normalized write helpers (scoped per concern).
// ───────────────────────────────────────────────────────────────────────

async function insertActiveMission(
  db: DrizzleDb,
  userId: number,
  mission: MissionState,
): Promise<void> {
  await db.insert(tradeActiveMissions).values({
    userId,
    missionId: mission.id,
    name: mission.name,
    sectorId: mission.sectorId,
    dispatchedAt: mission.dispatchedAt,
    durationMs: mission.durationMs,
    reward: mission.reward as Record<string, unknown>,
  });
}

async function deleteActiveMission(
  db: DrizzleDb,
  userId: number,
  missionId: string,
): Promise<void> {
  await db.delete(tradeActiveMissions).where(
    and(
      eq(tradeActiveMissions.userId, userId),
      eq(tradeActiveMissions.missionId, missionId),
    ),
  );
}

async function recordCompletion(
  db: DrizzleDb,
  userId: number,
  mission: MissionState,
  dreamEarned: number,
  influenceEarned: number,
): Promise<{ totalMissionsCompleted: number }> {
  await db.insert(tradeCompletedMissions).values({
    userId,
    missionId: mission.id,
    sectorId: mission.sectorId,
    dreamEarned,
    influenceEarned,
  });

  // Upsert aggregates atomically. MySQL ON DUPLICATE KEY UPDATE makes
  // this a single round-trip without needing a SELECT first.
  await db
    .insert(tradeEmpireUserAggregates)
    .values({
      userId,
      totalMissionsCompleted: 1,
      totalDreamEarned: dreamEarned,
      totalInfluenceEarned: influenceEarned,
    })
    .onDuplicateKeyUpdate({
      set: {
        totalMissionsCompleted: sqlIncrement(
          tradeEmpireUserAggregates.totalMissionsCompleted,
          1,
        ),
        totalDreamEarned: sqlIncrement(
          tradeEmpireUserAggregates.totalDreamEarned,
          dreamEarned,
        ),
        totalInfluenceEarned: sqlIncrement(
          tradeEmpireUserAggregates.totalInfluenceEarned,
          influenceEarned,
        ),
      },
    });

  // Hot-read the new total for the caller's response.
  const [agg] = await db
    .select()
    .from(tradeEmpireUserAggregates)
    .where(eq(tradeEmpireUserAggregates.userId, userId))
    .limit(1);
  return {
    totalMissionsCompleted: agg?.totalMissionsCompleted ?? 1,
  };
}

/**
 * Tiny helper to express `column = column + delta` in a Drizzle update
 * set without pulling in the full sql tag. Drizzle accepts an SQL chunk
 * here so we go through its sql tag.
 */
import { sql } from "drizzle-orm";
import type { MySqlColumn } from "drizzle-orm/mysql-core";
function sqlIncrement(column: MySqlColumn, delta: number) {
  return sql`${column} + ${delta}`;
}

/**
 * Add `delta` to the user's reputation in the given sector, creating
 * the row if absent. When reputation crosses 100 the controlLevel
 * increments (capped at 5) and reputation rolls over by -100. Returns
 * the post-update controlLevel + reputation for the caller.
 */
async function bumpSectorReputation(
  db: DrizzleDb,
  userId: number,
  sectorId: string,
  delta: number,
): Promise<{ controlLevel: number; reputation: number }> {
  const [existing] = await db
    .select()
    .from(tradeSectorReputation)
    .where(
      and(
        eq(tradeSectorReputation.userId, userId),
        eq(tradeSectorReputation.sectorId, sectorId),
      ),
    )
    .limit(1);

  let controlLevel = existing?.controlLevel ?? 0;
  let reputation = (existing?.reputation ?? 0) + delta;
  if (reputation >= 100) {
    controlLevel = Math.min(5, controlLevel + 1);
    reputation -= 100;
  }

  if (existing) {
    await db
      .update(tradeSectorReputation)
      .set({ controlLevel, reputation })
      .where(eq(tradeSectorReputation.id, existing.id));
  } else {
    await db.insert(tradeSectorReputation).values({
      userId,
      sectorId,
      controlLevel,
      reputation,
    });
  }
  return { controlLevel, reputation };
}

async function setActiveCover(
  db: DrizzleDb,
  userId: number,
  cover: ActiveCoverState,
): Promise<void> {
  // Clear any existing active cover first — only one canonically active
  // per user. Then insert the new row.
  await db
    .update(tradeActiveCovers)
    .set({ cleared: true })
    .where(
      and(
        eq(tradeActiveCovers.userId, userId),
        eq(tradeActiveCovers.cleared, false),
      ),
    );
  await db.insert(tradeActiveCovers).values({
    userId,
    coverId: cover.id,
    targetFactionId: cover.target,
    expiresAt: cover.expiresAt,
  });
}

async function clearActiveCover(
  db: DrizzleDb,
  userId: number,
): Promise<void> {
  await db
    .update(tradeActiveCovers)
    .set({ cleared: true })
    .where(
      and(
        eq(tradeActiveCovers.userId, userId),
        eq(tradeActiveCovers.cleared, false),
      ),
    );
}

async function markClassSectorUnlocked(
  db: DrizzleDb,
  userId: number,
  sectorId: string,
): Promise<void> {
  // Drizzle MySQL: insert with ON DUPLICATE KEY UPDATE acts as upsert.
  // Touching updatedAt-equivalent isn't needed here; if the row already
  // exists we simply leave it.
  await db
    .insert(tradeClassSectorUnlocks)
    .values({ userId, sectorId })
    .onDuplicateKeyUpdate({
      set: { sectorId },
    });
}

/**
 * Compute the spot price for an Oracle futures position at settlement
 * time. Phase 3 design call: spot = sector base × (1 + Σ activity-deltas)
 * where activity is the count of completed missions in the basis sector
 * during the holding window. The Oracle's foresight literally measures
 * the player's own near-future actions.
 *
 * Phase 4: queries tradeCompletedMissions directly on (userId, sectorId)
 * — strictly more accurate than the legacy id-prefix match.
 */
export async function computeOracleSpotPrice(
  userId: number,
  sectorId: string,
  signedAt: Date,
  basePrice: number,
): Promise<number> {
  const db = await getDbWithRetry();
  if (!db) dbUnavailable();
  const rows = await db
    .select()
    .from(tradeCompletedMissions)
    .where(
      and(
        eq(tradeCompletedMissions.userId, userId),
        eq(tradeCompletedMissions.sectorId, sectorId),
      ),
    );
  const sectorMatchCount = rows.length;
  const rawDelta = sectorMatchCount * ORACLE_ACTIVITY_PRICE_DELTA;
  const cappedDelta = Math.max(-0.5, Math.min(0.5, rawDelta));
  const spot = Math.round(basePrice * (1 + cappedDelta));
  // Touch signedAt to silence lint when the parameter isn't yet used by
  // the simple model; future versions will time-window the count.
  void signedAt;
  return spot;
}

/**
 * Settle a single Oracle futures position. Computes spot price, derives
 * payout from position type, writes back to the row, and credits or
 * deducts the user's dream balance. Idempotent — only acts on
 * status="open" rows.
 */
export async function settleOracleFuture(
  position: TradeOracleFutureRow,
): Promise<void> {
  if (position.status !== "open") return;
  const db = await getDbWithRetry();
  if (!db) dbUnavailable();

  // Spot price uses the strike as the base reference. Win/loss is the
  // signed delta versus strike, scaled by the player's recent activity.
  const spot = await computeOracleSpotPrice(
    position.userId,
    position.sectorId,
    position.signedAt,
    position.strikePrice,
  );

  let payout: number;
  switch (position.position) {
    case "call":
      // Win when spot > strike. Payout is the spread; loss forfeits 10%
      // of the strike as the Antiquarian's broker fee.
      payout =
        spot > position.strikePrice
          ? spot - position.strikePrice
          : -Math.round(position.strikePrice * 0.1);
      break;
    case "put":
      // Inverse: win when spot < strike.
      payout =
        spot < position.strikePrice
          ? position.strikePrice - spot
          : -Math.round(position.strikePrice * 0.1);
      break;
    case "spread":
      // Hedge: bounded payout at half the absolute spread, smaller fee.
      payout =
        Math.round(Math.abs(spot - position.strikePrice) * 0.5) -
        Math.round(position.strikePrice * 0.05);
      break;
  }

  await db
    .update(tradeOracleFutures)
    .set({
      settlementPrice: spot,
      payout,
      status: "settled",
    })
    .where(eq(tradeOracleFutures.id, position.id));

  // Credit / deduct dream balance for the payout.
  const dreamRow = await db
    .select()
    .from(dreamBalance)
    .where(eq(dreamBalance.userId, position.userId))
    .limit(1);
  if (dreamRow[0]) {
    const next = Math.max(0, (dreamRow[0].dreamTokens ?? 0) + payout);
    await db
      .update(dreamBalance)
      .set({ dreamTokens: next })
      .where(eq(dreamBalance.userId, position.userId));
  }
}

/**
 * Lazy resolver: settle any of this user's open Oracle futures whose
 * settlesAt has elapsed. Called from getOracleFutures and any other
 * read-paths that should reflect settled state.
 */
export async function settleExpiredOracleFutures(userId: number): Promise<void> {
  const db = await getDbWithRetry();
  if (!db) dbUnavailable();
  const now = new Date();
  const open = await db
    .select()
    .from(tradeOracleFutures)
    .where(
      and(
        eq(tradeOracleFutures.userId, userId),
        eq(tradeOracleFutures.status, "open"),
      ),
    );
  for (const position of open) {
    if (position.settlesAt && position.settlesAt <= now) {
      try {
        await settleOracleFuture(position);
      } catch (err) {
        console.warn("settleOracleFuture failed", { id: position.id, err });
      }
    }
  }
}

export const tradeEmpireRouter = router({
  getState: protectedProcedure.query(async ({ ctx }) => {
    const state = await loadEmpireState(ctx.user.id);
    // Split active queue into still-running vs. ready-to-claim.
    const now = Date.now();
    const completed: MissionState[] = [];
    const stillActive: MissionState[] = [];
    for (const m of state.activeMissions) {
      if (now >= m.dispatchedAt + m.durationMs) {
        completed.push(m);
      } else {
        stillActive.push(m);
      }
    }
    return {
      ...state,
      activeMissions: stillActive,
      pendingCompletions: completed,
    };
  }),

  dispatchMission: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string(),
      sectorId: z.string(),
      durationMs: z.number().min(1000),
      reward: z.object({
        dream: z.number().optional(),
        salvage: z.number().optional(),
        influence: z.number().optional(),
        voidCrystals: z.number().optional(),
        xp: z.number().optional(),
        material: z.string().optional(),
        materialAmount: z.number().optional(),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDbWithRetry();
      if (!db) dbUnavailable();

      // Max 3 concurrent + duplicate-id check, both via tradeActiveMissions.
      const active = await db
        .select()
        .from(tradeActiveMissions)
        .where(eq(tradeActiveMissions.userId, ctx.user.id));
      if (active.length >= 3) {
        return { success: false, error: "Maximum 3 active missions" };
      }
      if (active.some((m) => m.missionId === input.id)) {
        return { success: false, error: "Mission already dispatched" };
      }

      const dispatchedAt = Date.now();
      await insertActiveMission(db, ctx.user.id, {
        id: input.id,
        name: input.name,
        sectorId: input.sectorId,
        dispatchedAt,
        durationMs: input.durationMs,
        reward: input.reward,
      });
      return { success: true, endsAt: dispatchedAt + input.durationMs };
    }),

  completeMission: protectedProcedure
    .input(z.object({ missionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDbWithRetry();
      if (!db) dbUnavailable();

      const [activeRow] = await db
        .select()
        .from(tradeActiveMissions)
        .where(
          and(
            eq(tradeActiveMissions.userId, ctx.user.id),
            eq(tradeActiveMissions.missionId, input.missionId),
          ),
        )
        .limit(1);
      if (!activeRow) {
        return { success: false, error: "Mission not found" };
      }

      const now = Date.now();
      const dispatchedAt = Number(activeRow.dispatchedAt);
      const durationMs = Number(activeRow.durationMs);
      if (now < dispatchedAt + durationMs) {
        return { success: false, error: "Mission not yet complete" };
      }

      const mission: MissionState = {
        id: activeRow.missionId,
        name: activeRow.name,
        sectorId: activeRow.sectorId,
        dispatchedAt,
        durationMs,
        reward: (activeRow.reward ?? {}) as MissionState["reward"],
      };
      const r = mission.reward;

      // 1) Move active → completed log; bump aggregates.
      await deleteActiveMission(db, ctx.user.id, mission.id);
      const dreamEarned = r.dream && r.dream > 0 ? r.dream : 0;
      const influenceEarned = r.influence && r.influence > 0 ? r.influence : 0;
      const { totalMissionsCompleted } = await recordCompletion(
        db,
        ctx.user.id,
        mission,
        dreamEarned,
        influenceEarned,
      );

      // 2) Credit dream balance (separate canonical economy table).
      if (dreamEarned > 0) {
        const [dreamRow] = await db
          .select()
          .from(dreamBalance)
          .where(eq(dreamBalance.userId, ctx.user.id))
          .limit(1);
        if (dreamRow) {
          await db
            .update(dreamBalance)
            .set({ dreamTokens: (dreamRow.dreamTokens ?? 0) + dreamEarned })
            .where(eq(dreamBalance.userId, ctx.user.id));
        }
      }

      // 3) Crafting materials still live on userProgress.gameData
      //    (cross-system concern outside Trade Empire's normalized scope).
      if (r.material && r.materialAmount) {
        const [row] = await db
          .select()
          .from(userProgress)
          .where(
            and(
              eq(userProgress.userId, ctx.user.id),
              eq(userProgress.franchiseId, "dischordian-saga"),
            ),
          )
          .limit(1);
        const gameData = (row?.gameData as Record<string, unknown> | undefined) ?? {};
        const materials = (gameData.materials as Record<string, number> | undefined) ?? {};
        materials[r.material] = (materials[r.material] ?? 0) + r.materialAmount;
        await db
          .update(userProgress)
          .set({ gameData: { ...gameData, materials } })
          .where(
            and(
              eq(userProgress.userId, ctx.user.id),
              eq(userProgress.franchiseId, "dischordian-saga"),
            ),
          );
      }

      // 4) Sector reputation (+10, with rollover at 100 → controlLevel +1).
      const { controlLevel: newControl, reputation: newRep } =
        await bumpSectorReputation(db, ctx.user.id, mission.sectorId, 10);
      // Approximate prior reputation for the threshold-crossing ripple.
      const priorReputation = newRep === 0 && newControl > 0
        ? 90 // rolled over
        : newRep - 10;

      // Thought Virus integration — running the Vox Corridor adds real viral
      // exposure on top of the normal reward, per thoughtVirus.ts lore.
      if (mission.id.startsWith("vox_corridor")) {
        const { addLoad } = await import("../services/thoughtVirusService");
        await addLoad(ctx.user.id, 6, "mission_vox_corridor");
      }

      // Cross-system: feed Dead Man's Circuit "Kinetic Acquisition" side quest
      await ripple.emit("trade_run_complete", { userId: ctx.user.id, missionId: mission.id });

      // Phase D.5 — bump per-sector saturation so the oversupply meter
      // grows on every trade run. Decay loop runs hourly on the server.
      // See apps/server/services/tradeRouteSaturationService.ts and the
      // schema doc-comment at apps/db/schema.ts:6974.
      try {
        const { bumpSaturation } = await import(
          "../services/tradeRouteSaturationService"
        );
        await bumpSaturation(mission.sectorId);
      } catch (saturationErr) {
        console.warn("[Saturation] mission bump failed", saturationErr);
      }

      // Tier 4 quest progression + Tier 1 title nudge.
      recordQuestEvent({ kind: "trade_mission_completed", userId: ctx.user.id }).catch(() => {});
      // Tier 2B narrative-milestone clue drop on mission complete (lower rate).
      processClueDropEvent(ctx.user.id, "narrative_milestone").catch(() => {});
      awardEligibleTitles(ctx.user.id).catch(() => {});

      // Phase 2 — mission_outcome ripple. Per priority plan §Stage 1+
      // Phase 2 ripple emissions: previously silent at completeMission;
      // now fires for faction commentary, companion morale, pressure-
      // service shifts, Oracle dream-residue mission-unlock check.
      try {
        await ripple.emit("mission_outcome", {
          userId: ctx.user.id,
          missionId: mission.id,
          result: "success",
        });
      } catch (rippleErr) {
        console.warn("mission_outcome ripple failed", rippleErr);
      }

      // Phase 2 — faction_align ripple. Fires when sector.reputation
      // crossed a threshold (0-line) on this mission completion.
      // Handlers: NPC confrontation check, Locke deferred-threat
      // logging, Vex standing-shift tracking.
      try {
        const crossedThreshold =
          priorReputation <= 0 && newRep > 0 ? "positive" :
          priorReputation >= 0 && newRep < 0 ? "negative" :
          undefined;
        await ripple.emit("faction_align", {
          userId: ctx.user.id,
          factionId: mission.sectorId,
          delta: 10,
          newReputation: newRep,
          crossedThreshold,
        });
      } catch (rippleErr) {
        console.warn("faction_align ripple failed", rippleErr);
      }

      // Phase F6 — every trade empire mission completion grants 2
      // imprint fragments to The Antiquarian, who is the canonical
      // catalog-keeper of trade routes / endings in Dischordia.
      // Wrapped in try/catch so an imprint failure cannot break
      // mission completion.
      try {
        await awardFragments(db, {
          userId: ctx.user.id,
          npcSlug: "antiquarian",
          source: "trade_empire_mission",
          sourceDetail: mission.id,
        });
      } catch (e) {
        console.warn(`[Imprints] trade_empire_mission grant failed: ${e}`);
      }

      return {
        success: true,
        rewards: r,
        sectorReputation: newRep,
        sectorControlLevel: newControl,
        totalCompleted: totalMissionsCompleted,
      };
    }),

  cancelMission: protectedProcedure
    .input(z.object({ missionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDbWithRetry();
      if (!db) dbUnavailable();
      const [existing] = await db
        .select()
        .from(tradeActiveMissions)
        .where(
          and(
            eq(tradeActiveMissions.userId, ctx.user.id),
            eq(tradeActiveMissions.missionId, input.missionId),
          ),
        )
        .limit(1);
      if (!existing) return { success: false, error: "Mission not found" };
      await deleteActiveMission(db, ctx.user.id, input.missionId);
      return { success: true };
    }),

  /* ═══════════════════════════════════════════════════════
     POTENTIAL IDENTITY SYSTEM — Class-exclusive Trade Empire
     ═══════════════════════════════════════════════════════ */

  /** Returns the caller's class + the sectors they are allowed to enter. */
  getMyClassAccess: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDbWithRetry();
    if (!db) dbUnavailable();
    const [sheet] = await db
      .select()
      .from(characterSheets)
      .where(eq(characterSheets.userId, ctx.user.id))
      .limit(1);
    const characterClass = (sheet?.characterClass ?? null) as CharClass | null;
    const sectors = characterClass ? CLASS_SECTOR_ACCESS[characterClass] ?? [] : [];
    const missions = characterClass ? CLASS_EXCLUSIVE_MISSIONS[characterClass] ?? [] : [];
    return { characterClass, sectors, missions };
  }),

  /**
   * Server-side gate check: refuses the unlock if the caller is not the
   * right class (or does not have the unlock flag set).
   */
  unlockClassSector: protectedProcedure
    .input(z.object({ sectorId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDbWithRetry();
      if (!db) dbUnavailable();
      const [sheet] = await db
        .select()
        .from(characterSheets)
        .where(eq(characterSheets.userId, ctx.user.id))
        .limit(1);
      const characterClass = (sheet?.characterClass ?? null) as CharClass | null;
      if (!characterClass) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Character sheet not found",
        });
      }
      const allowed = CLASS_SECTOR_ACCESS[characterClass] ?? [];
      if (!allowed.includes(input.sectorId)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `${characterClass} cannot access sector ${input.sectorId}`,
        });
      }
      await markClassSectorUnlocked(db, ctx.user.id, input.sectorId);
      return { success: true, sectorId: input.sectorId, characterClass };
    }),

  /**
   * Oracle-only: purchase a futures position via an Antiquarian futures
   * contract. Inserts a tradeContracts row (status=signed) AND a
   * tradeOracleFutures position row, then emits oracle_future_purchased.
   *
   * settlesAt = signedAt + cyclesAhead * ORACLE_FUTURES_CYCLE_HOURS hours.
   * The position is settled lazily on getOracleFutures or any subsequent
   * call that triggers `settleExpiredOracleFutures` for this user.
   */
  purchaseFutures: protectedProcedure
    .input(
      z.object({
        sectorId: z.string(),
        commodity: z.enum(["credits", "materials", "influence", "intelligence"]),
        cyclesAhead: z.number().int().min(1).max(PROBABILITY_FUTURES_WINDOW),
        strikePrice: z.number().int().min(1),
        projectedPrice: z.number().int().min(1),
        position: z.enum(["call", "put", "spread"]).optional().default("call"),
        contractKey: z.string().optional().default("antiquarian.futures_call"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDbWithRetry();
      if (!db) dbUnavailable();
      const [sheet] = await db
        .select()
        .from(characterSheets)
        .where(eq(characterSheets.userId, ctx.user.id))
        .limit(1);
      if ((sheet?.characterClass as CharClass | undefined) !== "oracle") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only Oracles can trade probability futures.",
        });
      }

      // Anchor the position to a registered Antiquarian futures template.
      const template = getContractTemplate(input.contractKey);
      if (!template || template.metadata?.tier !== "oracle_futures") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Unknown or non-futures contract template: ${input.contractKey}`,
        });
      }

      const now = new Date();
      const settlesAt = new Date(
        now.getTime() + input.cyclesAhead * ORACLE_FUTURES_CYCLE_HOURS * 60 * 60 * 1000,
      );

      // Insert parent tradeContracts row.
      const contractInsert = await db.insert(tradeContracts).values({
        userId: ctx.user.id,
        contractKey: input.contractKey,
        brokerKey: template.brokerKey,
        status: "signed",
        auditedOnSigning: false,
        stageStatus: {},
        disclosedClauses: [],
      });
      const contractId =
        (contractInsert as unknown as Array<{ insertId?: number }>)[0]?.insertId ?? 0;

      // Insert the futures position row.
      await db.insert(tradeOracleFutures).values({
        userId: ctx.user.id,
        contractId,
        commodity: input.commodity,
        sectorId: input.sectorId,
        position: input.position,
        strikePrice: input.strikePrice,
        projectedPrice: input.projectedPrice,
        cyclesAhead: input.cyclesAhead,
        settlesAt,
        status: "open",
      });

      try {
        await ripple.emit("oracle_future_purchased", {
          userId: ctx.user.id,
          sectorId: input.sectorId,
          commodity: input.commodity,
          cyclesAhead: input.cyclesAhead,
          projectedPrice: input.projectedPrice,
        } as OracleFuturePurchasedEvent);
      } catch (rippleErr) {
        console.warn("oracle_future_purchased ripple failed", rippleErr);
      }

      return {
        success: true,
        contractId,
        contractKey: input.contractKey,
        sectorId: input.sectorId,
        commodity: input.commodity,
        position: input.position,
        cyclesAhead: input.cyclesAhead,
        strikePrice: input.strikePrice,
        projectedPrice: input.projectedPrice,
        signedAt: now.toISOString(),
        settlesAt: settlesAt.toISOString(),
      };
    }),

  /**
   * Oracle-only: list this user's open and recently-settled futures.
   * Lazily settles any whose settlesAt has elapsed before returning.
   */
  getOracleFutures: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDbWithRetry();
    if (!db) dbUnavailable();
    const [sheet] = await db
      .select()
      .from(characterSheets)
      .where(eq(characterSheets.userId, ctx.user.id))
      .limit(1);
    if ((sheet?.characterClass as CharClass | undefined) !== "oracle") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only Oracles can read probability futures.",
      });
    }

    // Lazy-settle anything past horizon.
    await settleExpiredOracleFutures(ctx.user.id);

    const rows = await db
      .select()
      .from(tradeOracleFutures)
      .where(eq(tradeOracleFutures.userId, ctx.user.id));
    const open = rows.filter((r) => r.status === "open");
    const settled = rows.filter((r) => r.status === "settled");
    return { open, settled };
  }),

  /** Spy-only: activate a time-boxed cover identity. */
  activateCoverIdentity: protectedProcedure
    .input(
      z.object({
        coverId: z.string(),
        targetFactionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDbWithRetry();
      if (!db) dbUnavailable();
      const [sheet] = await db
        .select()
        .from(characterSheets)
        .where(eq(characterSheets.userId, ctx.user.id))
        .limit(1);
      if ((sheet?.characterClass as CharClass | undefined) !== "spy") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only Spies can activate cover identities.",
        });
      }
      const cover = SPY_COVER_IDENTITIES.find((c) => c.id === input.coverId);
      if (!cover) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Unknown cover identity: ${input.coverId}`,
        });
      }
      const expiresAt = Date.now() + cover.durationHours * 60 * 60 * 1000;
      await setActiveCover(db, ctx.user.id, {
        id: cover.id,
        target: input.targetFactionId,
        expiresAt,
      });
      await ripple.emit("cover_identity_activated", {
        userId: ctx.user.id,
        coverId: cover.id,
        targetFactionId: input.targetFactionId,
        expiresAt,
      } as CoverIdentityActivatedEvent);
      return { success: true, coverId: cover.id, expiresAt };
    }),

  /**
   * Rolls a perception check whenever a Spy-in-cover interacts with a
   * faction NPC. On failure, fires `cover_identity_blown` — handlers in
   * rippleEngine apply the -15 Unity Meter penalty and notify the player.
   */
  blowCoverCheck: protectedProcedure
    .input(
      z.object({
        npcPerception: z.number().int().min(0).max(30),
        detectionCheckDifficulty: z.number().int().min(0).max(30),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDbWithRetry();
      if (!db) dbUnavailable();
      const [activeCoverRow] = await db
        .select()
        .from(tradeActiveCovers)
        .where(
          and(
            eq(tradeActiveCovers.userId, ctx.user.id),
            eq(tradeActiveCovers.cleared, false),
          ),
        )
        .orderBy(desc(tradeActiveCovers.createdAt))
        .limit(1);
      if (!activeCoverRow) return { triggered: false };
      const roll = Math.floor(Math.random() * 20) + 1 + input.npcPerception;
      if (roll >= input.detectionCheckDifficulty + 10) {
        await ripple.emit("cover_identity_blown", {
          userId: ctx.user.id,
          coverId: activeCoverRow.coverId,
          targetFactionId: activeCoverRow.targetFactionId,
          detectedBy: "faction_npc",
        } as CoverIdentityBlownEvent);
        await clearActiveCover(db, ctx.user.id);
        return { triggered: true, blown: true };
      }
      return { triggered: true, blown: false };
    }),

  /** Soldier-only: resolve The General's Dilemma. */
  resolveGeneralsDilemma: protectedProcedure
    .input(z.object({ resolution: z.enum(["expose", "protect"]) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDbWithRetry();
      if (!db) dbUnavailable();
      const [sheet] = await db
        .select()
        .from(characterSheets)
        .where(eq(characterSheets.userId, ctx.user.id))
        .limit(1);
      if ((sheet?.characterClass as CharClass | undefined) !== "soldier") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only Soldiers can resolve The General's Dilemma.",
        });
      }
      await ripple.emit("generals_dilemma_resolved", {
        userId: ctx.user.id,
        resolution: input.resolution,
      } as GeneralsDilemmaResolvedEvent);
      return { success: true, resolution: input.resolution };
    }),

  // ═══════════════════════════════════════════════════════════════════
  // PHASE 2.2 — Contract + route + sector-arrival endpoints
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Sign a contract template. Inserts a tradeContracts row, increments
   * the corresponding tradeBrokerEngagement, and emits both
   * contract_signed + broker_engagement ripples.
   *
   * Idempotent per (user, contractKey, status='signed' or 'active'):
   * if a player tries to re-sign an active contract, the existing row
   * is returned without duplicate insertion.
   */
  signContract: protectedProcedure
    .input(z.object({
      contractKey: z.string(),
      auditedOnSigning: z.boolean().optional().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const template = getContractTemplate(input.contractKey);
      if (!template) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Unknown contract template: ${input.contractKey}`,
        });
      }
      const db = await getDbWithRetry();
      if (!db) dbUnavailable();

      // Idempotency: existing active contract?
      const existing = await db
        .select()
        .from(tradeContracts)
        .where(and(
          eq(tradeContracts.userId, ctx.user.id),
          eq(tradeContracts.contractKey, input.contractKey),
        ))
        .limit(1);
      if (existing.length > 0 && existing[0]) {
        const status = existing[0].status;
        if (status === "signed" || status === "active") {
          return {
            success: true,
            contractId: existing[0].id,
            alreadySigned: true,
          };
        }
      }

      // Insert new contract row.
      const insertResult = await db.insert(tradeContracts).values({
        userId: ctx.user.id,
        contractKey: input.contractKey,
        brokerKey: template.brokerKey,
        status: "signed",
        auditedOnSigning: input.auditedOnSigning,
        stageStatus: {},
        disclosedClauses: [],
      });

      // Increment broker engagement.
      const engagementRow = await db
        .select()
        .from(tradeBrokerEngagement)
        .where(and(
          eq(tradeBrokerEngagement.userId, ctx.user.id),
          eq(tradeBrokerEngagement.brokerKey, template.brokerKey),
        ))
        .limit(1);
      if (engagementRow.length > 0 && engagementRow[0]) {
        await db
          .update(tradeBrokerEngagement)
          .set({
            engagementCount: (engagementRow[0].engagementCount ?? 0) + 1,
          })
          .where(eq(tradeBrokerEngagement.id, engagementRow[0].id));
      } else {
        await db.insert(tradeBrokerEngagement).values({
          userId: ctx.user.id,
          brokerKey: template.brokerKey,
          engagementCount: 1,
          firstMetAt: new Date(),
        });
      }

      // Ripple: contract_signed.
      try {
        await ripple.emit("contract_signed", {
          userId: ctx.user.id,
          contractKey: input.contractKey,
          brokerKey: template.brokerKey,
          hiddenClausesAcknowledged: input.auditedOnSigning,
        } as ContractSignedEvent);
      } catch (rippleErr) {
        console.warn("contract_signed ripple failed", rippleErr);
      }

      // Ripple: broker_engagement (mission_accepted = canonical for signing).
      try {
        await ripple.emit("broker_engagement", {
          userId: ctx.user.id,
          brokerKey: template.brokerKey,
          npcKey: template.brokerKey, // canonical broker→npc mapping
          engagementType: "mission_accepted",
        } as BrokerEngagementEvent);
      } catch (rippleErr) {
        console.warn("broker_engagement ripple failed", rippleErr);
      }

      // Phase 3 pilot — canonical broker NPC reaction at signing.
      // Surface "trade_empire" reads the broker's signing-line bank
      // (Locke: 5x5 personality grid; Nilmorg: institutional register).
      // Silent-fail: if no line matches the canonical context, the
      // signing flow continues uninterrupted.
      let npcReaction: { lineId: string; text: string; voId?: string } | null = null;
      try {
        const brokerDef = BROKER_REGISTRY[template.brokerKey];
        const reaction = await tryNpcReaction({
          userId: ctx.user.id,
          npcKey: brokerDef.npcKey as NpcKey,
          surface: "trade_empire",
          targetId: input.contractKey,
        });
        if (reaction) {
          npcReaction = {
            lineId: reaction.line.lineId,
            text: reaction.line.text,
            voId: reaction.line.voId,
          };
        }
      } catch (reactionErr) {
        console.warn("signContract npc reaction failed", reactionErr);
      }

      // Phase 3 wave-2 — Vex's canonical Maestro-narrator commentary
      // on canonical contract-signing. Per vex_solene.md §5.10,
      // Maestro is the default Trade Empire narrator from Act 3 §7
      // onward; reveal-stage gating in the canonical bank ensures
      // pre-reveal players canonically see Maestro register, post-
      // reveal players canonically see Engineer-Zero direct register.
      let vexNarration: { lineId: string; text: string; voId?: string } | null = null;
      try {
        const reaction = await tryNpcReaction({
          userId: ctx.user.id,
          npcKey: "vex_solene" as NpcKey,
          surface: "trade_empire",
          targetId: input.contractKey,
        });
        if (reaction) {
          vexNarration = {
            lineId: reaction.line.lineId,
            text: reaction.line.text,
            voId: reaction.line.voId,
          };
        }
      } catch (reactionErr) {
        console.warn("signContract vex narration failed", reactionErr);
      }

      // Drizzle MySQL insert returns ResultSetHeader-shape; insertId on result[0]
      const insertId = (insertResult as unknown as Array<{ insertId?: number }>)[0]?.insertId;
      return {
        success: true,
        contractId: insertId ?? null,
        alreadySigned: false,
        npcReaction,
        vexNarration,
      };
    }),

  /**
   * Mark a contract stage as completed. Updates stageStatus JSON;
   * if all stages succeed, sets contract status → 'succeeded'.
   */
  completeContractStage: protectedProcedure
    .input(z.object({
      contractKey: z.string(),
      stageId: z.string(),
      result: z.enum(["succeeded", "failed"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const template = getContractTemplate(input.contractKey);
      if (!template) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Unknown contract template: ${input.contractKey}`,
        });
      }
      const db = await getDbWithRetry();
      if (!db) dbUnavailable();

      const rows = await db
        .select()
        .from(tradeContracts)
        .where(and(
          eq(tradeContracts.userId, ctx.user.id),
          eq(tradeContracts.contractKey, input.contractKey),
        ))
        .limit(1);
      const row = rows[0];
      if (!row) {
        return { success: false, error: "Contract not signed" };
      }
      if (row.status !== "signed" && row.status !== "active") {
        return { success: false, error: `Contract is ${row.status}, not active` };
      }

      // Validate stage exists in template.
      const stage = template.stages.find(s => s.stageId === input.stageId);
      if (!stage) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Unknown stage: ${input.stageId}`,
        });
      }

      const stageStatus = (row.stageStatus as Record<string, string>) ?? {};
      stageStatus[input.stageId] = input.result;

      // Determine contract status.
      const allStageIds = template.stages.map(s => s.stageId);
      const allSucceeded = allStageIds.every(id => stageStatus[id] === "succeeded");
      const anyFailed = allStageIds.some(id => stageStatus[id] === "failed");
      const newStatus =
        anyFailed ? "failed" :
        allSucceeded ? "succeeded" :
        "active";

      await db
        .update(tradeContracts)
        .set({
          status: newStatus,
          stageStatus,
          resolvedAt: (newStatus === "succeeded" || newStatus === "failed")
            ? new Date()
            : null,
        })
        .where(eq(tradeContracts.id, row.id));

      return {
        success: true,
        contractStatus: newStatus,
        completedStages: allStageIds.filter(id => stageStatus[id] === "succeeded").length,
        totalStages: allStageIds.length,
      };
    }),

  /**
   * Mark a sector as first-entered. Inserts a tradeSectorArrivals row
   * (idempotent per uniq index) and emits sector_first_entered ripple
   * exactly once per (user, sector). Handler in rippleEngine triggers
   * the canonical arrivalCinematic + Eyes-narrator whisper.
   */
  sectorFirstEntered: protectedProcedure
    .input(z.object({ sectorId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDbWithRetry();
      if (!db) dbUnavailable();

      // Idempotency check via uniq index.
      const existing = await db
        .select()
        .from(tradeSectorArrivals)
        .where(and(
          eq(tradeSectorArrivals.userId, ctx.user.id),
          eq(tradeSectorArrivals.sectorId, input.sectorId),
        ))
        .limit(1);
      if (existing.length > 0) {
        return {
          success: true,
          firstVisit: false,
          firstEnteredAt: existing[0]?.firstEnteredAt ?? new Date(),
        };
      }

      await db.insert(tradeSectorArrivals).values({
        userId: ctx.user.id,
        sectorId: input.sectorId,
        cinematicWatched: false,
      });

      try {
        await ripple.emit("sector_first_entered", {
          userId: ctx.user.id,
          sectorId: input.sectorId,
        } as SectorFirstEnteredEvent);
      } catch (rippleErr) {
        console.warn("sector_first_entered ripple failed", rippleErr);
      }

      // Phase 3 pilot + wave-2 + wave-3 — canonical NPC first-visit greetings.
      // Pilot wave (Locke + Nilmorg + Eidolon) + wave-2 (Vex Maestro
      // narrator per vex_solene.md §5.10) + wave-3 (Hierophant on
      // canonical Thaloria-aligned sectors per wraith_calder.md §5.7
      // quiet-missions canon) react on the "trade_empire" surface;
      // selector silently returns null if the NPC's bank has no
      // canonical line for this sector — Hierophant canonically only
      // fires on Thaloria-aligned sectors per his bank's gating.
      const PILOT_NPCS: ReadonlyArray<NpcKey> = [
        "adjudicator_locke",
        "nilmorg",
        "your_eidolon",
        "vex_solene",
        "wraith_calder",
      ];
      const npcGreetings: Array<{
        npcKey: NpcKey;
        lineId: string;
        text: string;
        voId?: string;
      }> = [];
      for (const npcKey of PILOT_NPCS) {
        try {
          const reaction = await tryNpcReaction({
            userId: ctx.user.id,
            npcKey,
            surface: "trade_empire",
            targetId: input.sectorId,
          });
          if (reaction) {
            npcGreetings.push({
              npcKey,
              lineId: reaction.line.lineId,
              text: reaction.line.text,
              voId: reaction.line.voId,
            });
          }
        } catch (reactionErr) {
          console.warn(`sectorFirstEntered npc reaction failed for ${npcKey}`, reactionErr);
        }
      }

      return {
        success: true,
        firstVisit: true,
        firstEnteredAt: new Date(),
        npcGreetings,
      };
    }),

  /**
   * Mark a sector-arrival cinematic as watched. Toggles
   * tradeSectorArrivals.cinematicWatched true.
   */
  markArrivalCinematicWatched: protectedProcedure
    .input(z.object({ sectorId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDbWithRetry();
      if (!db) dbUnavailable();
      await db
        .update(tradeSectorArrivals)
        .set({ cinematicWatched: true })
        .where(and(
          eq(tradeSectorArrivals.userId, ctx.user.id),
          eq(tradeSectorArrivals.sectorId, input.sectorId),
        ));
      return { success: true };
    }),

  /**
   * Record a completed route run. Increments tradeRoutes.runCount; on
   * canonical milestone-tier crossings (5 / 10 / 25 / 50) inserts
   * tradeRouteMilestones rows + emits route_milestone ripple per tier
   * crossed.
   *
   * Typically called by the client after a `dispatchMission → completeMission`
   * sequence where the player chose to log the run as part of a
   * recurring route. The mission outcome itself is logged via
   * `completeMission`; this endpoint is the canonical-route-tracker
   * extension.
   */
  recordRouteRun: protectedProcedure
    .input(z.object({
      fromSectorId: z.string(),
      toSectorId: z.string(),
      cargoCategory: z.string().optional(),
      factionsTouched: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDbWithRetry();
      if (!db) dbUnavailable();

      const routeKey = makeRouteKey(
        input.fromSectorId,
        input.toSectorId,
        input.cargoCategory as CargoCategory | undefined,
      );

      const existing = await db
        .select()
        .from(tradeRoutes)
        .where(and(
          eq(tradeRoutes.userId, ctx.user.id),
          eq(tradeRoutes.routeKey, routeKey),
        ))
        .limit(1);

      const priorRunCount = existing[0]?.runCount ?? 0;
      const newRunCount = priorRunCount + 1;
      const tiersCrossed = milestoneTiersCrossedBy(
        priorRunCount,
        newRunCount,
      );
      const newMilestoneTier = tiersCrossed.length > 0
        ? tiersCrossed[tiersCrossed.length - 1]!
        : (existing[0]?.milestoneTier ?? 0);

      if (existing[0]) {
        await db
          .update(tradeRoutes)
          .set({
            runCount: newRunCount,
            milestoneTier: newMilestoneTier,
          })
          .where(eq(tradeRoutes.id, existing[0].id));
      } else {
        await db.insert(tradeRoutes).values({
          userId: ctx.user.id,
          routeKey,
          fromSectorId: input.fromSectorId,
          toSectorId: input.toSectorId,
          cargoCategory: input.cargoCategory ?? null,
          runCount: newRunCount,
          milestoneTier: newMilestoneTier,
        });
      }

      // Append-only milestone log + ripple per crossed tier.
      const factionsTouched = input.factionsTouched ?? [];
      const npcAcknowledgments: Array<{
        npcKey: NpcKey;
        tier: number;
        lineId: string;
        text: string;
        voId?: string;
      }> = [];
      for (const tier of tiersCrossed) {
        await db.insert(tradeRouteMilestones).values({
          userId: ctx.user.id,
          routeKey,
          milestoneTier: tier,
          runCountAtAchievement: newRunCount,
        }).catch(() => {/* idempotent on uniq violation */});

        try {
          await ripple.emit("route_milestone", {
            userId: ctx.user.id,
            routeKey,
            runCount: newRunCount,
            factionsTouched,
          } as RouteMilestoneEvent);
        } catch (rippleErr) {
          console.warn("route_milestone ripple failed", rippleErr);
        }

        // Phase 3 pilot — canonical per-tier NPC acknowledgments.
        // MILESTONE_TIER_CANON declares which NPCs canonically react
        // at each tier (5 / 10 / 25 / 50). Run the canonical selector
        // for each acknowledger; silent-fail if no line matches.
        const canon = MILESTONE_TIER_CANON[tier];
        if (canon) {
          for (const acker of canon.canonicalAcknowledgers) {
            try {
              const reaction = await tryNpcReaction({
                userId: ctx.user.id,
                npcKey: acker.npcKey as NpcKey,
                surface: "trade_empire",
                targetId: routeKey,
              });
              if (reaction) {
                npcAcknowledgments.push({
                  npcKey: acker.npcKey as NpcKey,
                  tier,
                  lineId: reaction.line.lineId,
                  text: reaction.line.text,
                  voId: reaction.line.voId,
                });
              }
            } catch (reactionErr) {
              console.warn(`route_milestone npc reaction failed for ${acker.npcKey}`, reactionErr);
            }
          }
        }
      }

      // Phase D.5 — saturation bump on the destination sector. Routes
      // and missions both feed the same per-sector oversupply meter so
      // grinding either path crashes prices on that sector. See
      // apps/server/services/tradeRouteSaturationService.ts.
      try {
        const { bumpSaturation } = await import(
          "../services/tradeRouteSaturationService"
        );
        await bumpSaturation(input.toSectorId);
      } catch (saturationErr) {
        console.warn("[Saturation] route bump failed", saturationErr);
      }

      return {
        success: true,
        runCount: newRunCount,
        currentMilestoneTier: newMilestoneTier as RouteMilestoneTier | 0,
        tiersCrossedThisRun: tiersCrossed,
        npcAcknowledgments,
      };
    }),

  /**
   * Phase D.5 — read the singleton convergence climax state (the
   * "doom clock"). Returns the current convergence score, phase
   * (dormant | open | resolved), and the open-window timestamps.
   * Lazily creates the row on first read.
   *
   * See apps/db/schema.ts:7048 and the consumer service at
   * apps/server/services/convergenceClimaxService.ts.
   */
  getConvergenceClimaxState: protectedProcedure.query(async () => {
    const { getConvergenceClimaxState } = await import(
      "../services/convergenceClimaxService"
    );
    const row = await getConvergenceClimaxState();
    if (!row) {
      return {
        convergence: 0,
        phase: "dormant" as const,
        openedAt: null as Date | null,
        closesAtMs: null as number | null,
        resolutionKey: null as string | null,
      };
    }
    return {
      convergence: row.convergence,
      phase: row.phase,
      openedAt: row.openedAt,
      closesAtMs: row.closesAtMs,
      resolutionKey: row.resolutionKey,
    };
  }),

  /**
   * Phase D.5 — read the per-sector saturation score (0..200). The
   * client pairs this with `applySaturationToPrice` (or the server's
   * `effectivePriceForSector`) to render the oversupply price-crash
   * indicator on the trade UI. See
   * apps/server/services/tradeRouteSaturationService.ts.
   */
  getSectorSaturation: protectedProcedure
    .input(z.object({ sectorId: z.string() }))
    .query(async ({ input }) => {
      const { getSaturation } = await import(
        "../services/tradeRouteSaturationService"
      );
      const saturation = await getSaturation(input.sectorId);
      return { sectorId: input.sectorId, saturation };
    }),

  /** Pressure-driven price modifiers (plan §C4). Returns the per-good
   *  multiplier bundle the trade UI applies on top of base prices. The
   *  Living Universe pressure snapshot drives the math; clients pair
   *  this with their authored base-price record via applyPriceModifiers. */
  getPriceModifiers: protectedProcedure.query(async () => {
    const { computePriceModifiers } = await import("../../shared/tradePriceDrift");
    const { pressureService } = await import("../services/pressureService");
    const pressure = await pressureService.getAllPressures();
    const cycleNet = (pressure.moralityHumanity ?? 0) - (pressure.moralityMachine ?? 0);
    return computePriceModifiers({
      deaths: pressure.deaths,
      viralExposures: pressure.viralExposures,
      truthRevealed: pressure.truthRevealed,
      healingDone: pressure.healingDone,
      exploration: pressure.exploration,
      cycleNet,
    });
  }),
});
