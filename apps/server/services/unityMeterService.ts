/* ═══════════════════════════════════════════════════════
   UNITY METER SERVICE

   Community state machine for DeMagi↔Quarchon unification
   (spec §6). Fork of pressureService.ts — simpler because
   the Unity Meter is a single percent (0-100) feeding a
   6-phase state machine, not a multi-dimensional pressure
   tracker.

   Usage from any router:
     import { unityMeterService } from "../services/unityMeterService";
     await unityMeterService.increment(userId, "questline_third_path");
     const { phase, percent, text } = await unityMeterService.getState();
   ═══════════════════════════════════════════════════════ */

import { eq, sql, and } from "drizzle-orm";
import { getDb } from "../db";
import {
  unityMeterState,
  unityContributions,
  potentialFactionMembership,
  potentialFactionState,
} from "../../db/schema";
import { logger } from "../logger";
import { ripple } from "./rippleEngine";
import type {
  UnityPhaseChangedEvent,
  FactionDominanceShiftEvent,
  ConvergenceThresholdReachedEvent,
  PotentialFactionJoinedEvent,
} from "./rippleEngine";
import {
  UNITY_CONTRIBUTIONS,
  UNITY_TEXT,
  getUnityPhase,
  applyUnityContribution,
  POTENTIAL_FACTION_INDEX,
  type PotentialFactionId,
  type UnityContributionSource,
  type UnityPhase,
} from "@shared/potentialFactions";

export interface UnityMeterStateView {
  phase: UnityPhase;
  percent: number;
  text: string;
}

async function readSingleton(): Promise<{ phase: UnityPhase; percent: number } | null> {
  const db = await getDb();
  if (!db) return null;
  const [row] = await db
    .select()
    .from(unityMeterState)
    .where(eq(unityMeterState.id, 1))
    .limit(1);
  if (!row) return null;
  return { phase: row.phase as UnityPhase, percent: row.percent };
}

async function writeSingleton(phase: UnityPhase, percent: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db
    .update(unityMeterState)
    .set({ phase, percent, lastTick: new Date() })
    .where(eq(unityMeterState.id, 1));
}

export const unityMeterService = {
  /**
   * Apply a Unity Meter contribution. Records the delta in the
   * append-only log, advances the singleton percent within [0,100],
   * and fires `unity_phase_changed` if the phase transitions.
   */
  async increment(
    userId: number,
    source: UnityContributionSource,
    factionId?: PotentialFactionId,
  ): Promise<UnityMeterStateView> {
    const db = await getDb();
    if (!db) return { phase: "contested", percent: 50, text: UNITY_TEXT.contested };

    const current = await readSingleton();
    if (!current) {
      // Singleton missing — seed it and return a neutral view.
      await db.insert(unityMeterState).values({ id: 1, phase: "contested", percent: 50 });
      return { phase: "contested", percent: 50, text: UNITY_TEXT.contested };
    }

    const delta = UNITY_CONTRIBUTIONS[source] ?? 0;
    const nextPercent = applyUnityContribution(current.percent, source);
    const nextPhase = getUnityPhase(nextPercent);

    // Append contribution log
    await db.insert(unityContributions).values({
      userId,
      source,
      delta,
      factionId: factionId ?? null,
    }).catch((e) => logger.error("[unity] contribution insert failed", e));

    // Persist new state
    if (nextPercent !== current.percent || nextPhase !== current.phase) {
      await writeSingleton(nextPhase, nextPercent);
    }

    // Emit phase change
    if (nextPhase !== current.phase) {
      try {
        await ripple.emit("unity_phase_changed", {
          userId,
          previousPhase: current.phase,
          newPhase: nextPhase,
          percent: nextPercent,
        } as UnityPhaseChangedEvent);
      } catch (err) {
        logger.error("[unity] unity_phase_changed ripple failed", err);
      }
    }

    // Convergence threshold fires when we hit 'converging' for the first time
    if (current.phase !== "converging" && nextPhase === "converging") {
      try {
        await ripple.emit("convergence_threshold_reached", {
          userId,
          percent: nextPercent,
        } as ConvergenceThresholdReachedEvent);
      } catch (err) {
        logger.error("[unity] convergence_threshold_reached ripple failed", err);
      }
    }

    return { phase: nextPhase, percent: nextPercent, text: UNITY_TEXT[nextPhase] };
  },

  /** Returns the current Unity Meter view. */
  async getState(): Promise<UnityMeterStateView> {
    const current = await readSingleton();
    if (!current) {
      return { phase: "contested", percent: 50, text: UNITY_TEXT.contested };
    }
    return {
      phase: current.phase,
      percent: current.percent,
      text: UNITY_TEXT[current.phase],
    };
  },

  /** Per-faction aggregate state row. */
  async getFactionState(factionId: PotentialFactionId) {
    const db = await getDb();
    if (!db) return null;
    const [row] = await db
      .select()
      .from(potentialFactionState)
      .where(eq(potentialFactionState.factionId, factionId))
      .limit(1);
    return row ?? null;
  },

  /**
   * Joins the player to a Potential faction. Applies the -5 Unity Meter
   * formal_affiliation penalty, bumps the faction's member count, and
   * fires `potential_faction_joined` so downstream handlers (e.g. faction
   * dominance tick) can react.
   */
  async joinFaction(
    userId: number,
    factionId: PotentialFactionId,
    recruitedBy?: string,
  ): Promise<{ joined: boolean; memberCount: number; unity: UnityMeterStateView }> {
    const db = await getDb();
    if (!db) {
      return {
        joined: false,
        memberCount: 0,
        unity: { phase: "contested", percent: 50, text: UNITY_TEXT.contested },
      };
    }

    // Ensure the faction exists — the migration seeds every row, but in
    // test contexts the seed may not have run yet.
    const faction = POTENTIAL_FACTION_INDEX[factionId];
    if (!faction) {
      throw new Error(`Unknown Potential faction: ${factionId}`);
    }

    // Idempotency: no-op if the player is already a member.
    const [existing] = await db
      .select()
      .from(potentialFactionMembership)
      .where(
        and(
          eq(potentialFactionMembership.userId, userId),
          eq(potentialFactionMembership.factionId, factionId),
        ),
      )
      .limit(1);

    if (existing) {
      const [state] = await db
        .select()
        .from(potentialFactionState)
        .where(eq(potentialFactionState.factionId, factionId))
        .limit(1);
      const unity = await unityMeterService.getState();
      return {
        joined: false,
        memberCount: state?.memberCount ?? 0,
        unity,
      };
    }

    await db.insert(potentialFactionMembership).values({
      userId,
      factionId,
      rank: "recruit",
      recruitedBy: recruitedBy ?? null,
    });

    // Upsert the aggregate row (seeded by migration, but be defensive)
    await db
      .insert(potentialFactionState)
      .values({ factionId, memberCount: 1 })
      .onDuplicateKeyUpdate({
        set: {
          memberCount: sql`${potentialFactionState.memberCount} + 1`,
        },
      });

    const [updated] = await db
      .select()
      .from(potentialFactionState)
      .where(eq(potentialFactionState.factionId, factionId))
      .limit(1);

    // Apply the -5 Unity Meter formal_affiliation penalty
    const unity = await unityMeterService.increment(
      userId,
      "questline_formal_affiliation",
      factionId,
    );

    try {
      await ripple.emit("potential_faction_joined", {
        userId,
        factionId,
        recruitedBy,
      } as PotentialFactionJoinedEvent);
    } catch (err) {
      logger.error("[unity] potential_faction_joined ripple failed", err);
    }

    return {
      joined: true,
      memberCount: updated?.memberCount ?? 1,
      unity,
    };
  },

  /**
   * Periodic tick — recomputes dominance from recent contributions and
   * emits faction_dominance_shift events when a species crosses the
   * 60% community threshold for the first time.
   *
   * Intended to be called by an existing cron/scheduler (dailyBrief).
   * We do not install our own scheduler here — the plan wires this into
   * the existing Living Universe tick.
   */
  async tick(): Promise<{
    demagiMembers: number;
    quarchonMembers: number;
    demagiPercent: number;
    quarchonPercent: number;
  }> {
    const db = await getDb();
    if (!db) {
      return { demagiMembers: 0, quarchonMembers: 0, demagiPercent: 0, quarchonPercent: 0 };
    }

    const rows = await db.select().from(potentialFactionState);
    let demagiMembers = 0;
    let quarchonMembers = 0;
    for (const row of rows) {
      if (row.factionId.startsWith("demagi_")) demagiMembers += row.memberCount;
      else if (row.factionId.startsWith("quarchon_")) quarchonMembers += row.memberCount;
    }
    const total = demagiMembers + quarchonMembers;
    const demagiPercent = total === 0 ? 0 : Math.round((demagiMembers / total) * 100);
    const quarchonPercent = total === 0 ? 0 : Math.round((quarchonMembers / total) * 100);

    // Recompute the dominance column per-row so leaderboards render cleanly
    for (const row of rows) {
      const dominance = total === 0 ? 0 : Math.round((row.memberCount / total) * 100);
      if (dominance !== row.dominance) {
        await db
          .update(potentialFactionState)
          .set({ dominance })
          .where(eq(potentialFactionState.factionId, row.factionId));
      }
    }

    // Emit dominance events if either side crosses the 60% community
    // threshold (spec §5.3 Faction Dominance trigger).
    if (demagiPercent >= 60) {
      try {
        // userId=0 marks a system-generated ripple — handlers tolerate it
        await ripple.emit("faction_dominance_shift", {
          userId: 0,
          species: "demagi",
          dominantFactionId: rows
            .filter((r) => r.factionId.startsWith("demagi_"))
            .sort((a, b) => b.memberCount - a.memberCount)[0]?.factionId ?? "demagi_assembly",
          dominancePercent: demagiPercent,
        } as FactionDominanceShiftEvent);
      } catch (err) {
        logger.error("[unity] faction_dominance_shift ripple failed", err);
      }
    }
    if (quarchonPercent >= 60) {
      try {
        await ripple.emit("faction_dominance_shift", {
          userId: 0,
          species: "quarchon",
          dominantFactionId: rows
            .filter((r) => r.factionId.startsWith("quarchon_"))
            .sort((a, b) => b.memberCount - a.memberCount)[0]?.factionId ?? "quarchon_accord",
          dominancePercent: quarchonPercent,
        } as FactionDominanceShiftEvent);
      } catch (err) {
        logger.error("[unity] faction_dominance_shift ripple failed", err);
      }
    }

    return { demagiMembers, quarchonMembers, demagiPercent, quarchonPercent };
  },

  /**
   * Returns the top N contributors for a given faction by total delta.
   * Used by the leaderboard query in the router.
   */
  async getFactionLeaderboard(factionId: PotentialFactionId, limit: number = 10) {
    const db = await getDb();
    if (!db) return [];
    return db
      .select({
        userId: unityContributions.userId,
        totalDelta: sql<number>`SUM(${unityContributions.delta})`.as("totalDelta"),
      })
      .from(unityContributions)
      .where(eq(unityContributions.factionId, factionId))
      .groupBy(unityContributions.userId)
      .orderBy(sql`SUM(${unityContributions.delta}) DESC`)
      .limit(limit);
  },
};
