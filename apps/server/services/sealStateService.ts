/* ═══════════════════════════════════════════════════════
   SEAL STATE SERVICE — derives & records the seven-seal spine

   The seven seals are *views* of the existing act_N_started /
   act_N_complete narrative flags — there is no separate seal
   state table. This service:

     1. Derives `sealed | breaking | broken` phase per seal from
        a player's flag set.
     2. Records a seal-break (idempotent), emitting the
        `seal_broken` ripple that fans out to mysteries / yearly
        events / governance / palimpsest / transmissions.
     3. Wires the calendar-override yearlies (Severance on Seal IV,
        Memorial Day on Seal V) via yearlyEventScheduler.activateBySeal.

   Pure derivation has no DB writes; recordSealBreak emits the
   ripple and triggers the calendar override.
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import {
  resolveSealPhase,
  latestBrokenSeal,
  isSealBroken,
  SEVEN_SEALS,
  type SealPhase,
  type SealNumber,
} from "@shared/sevenSeals";
import { ripple } from "./rippleEngine";
import { rippleLedgerService } from "./rippleLedgerService";
import { yearlyEventScheduler } from "./yearlyEventScheduler";
import { logger } from "../logger";

interface SealPhaseRow {
  num: SealNumber;
  act: SealNumber;
  phase: SealPhase;
}

/**
 * Read the player's narrative flags from `userProgress.gameData`
 * and derive a per-seal {sealed | breaking | broken} table.
 *
 * Empty array on missing DB / row / shape — derivation is forward-
 * only; a fresh player sees seven sealed wax buttons.
 */
export async function getSealPhasesForPlayer(
  userId: number,
): Promise<ReadonlyArray<SealPhaseRow>> {
  const flags = await readFlags(userId);
  return SEVEN_SEALS.map((s) => ({
    num: s.num,
    act: s.act,
    phase: resolveSealPhase({
      actStarted: flags[`act_${s.act}_started`] === true,
      actComplete:
        flags[`act_${s.act}_complete`] === true ||
        flags[`act_${s.act}_completed`] === true,
    }),
  }));
}

/** The highest-numbered broken seal across a player's flags. */
export async function latestBrokenSealForPlayer(
  userId: number,
): Promise<SealNumber | null> {
  const phases = await getSealPhasesForPlayer(userId);
  return latestBrokenSeal(
    phases.map((p) => ({ act: p.act, complete: p.phase === "broken" })),
  );
}

/**
 * Idempotent: record that a seal has broken for this player.
 *
 * - Asserts the act is canonically complete (read flags first).
 * - Emits `seal_broken` ripple (consumed by mysteries / yearly /
 *   governance / palimpsest / transmissions).
 * - Triggers the yearly-event override for Seal IV (Severance) /
 *   Seal V (Memorial Day) on first break.
 *
 * Returns true if the break was emitted, false if it was a no-op
 * (the seal isn't actually broken in the player's flag set).
 */
export async function recordSealBreak(
  userId: number,
  sealNumber: SealNumber,
): Promise<boolean> {
  const flags = await readFlags(userId);
  const phases = SEVEN_SEALS.map((s) => ({
    act: s.act,
    complete:
      flags[`act_${s.act}_complete`] === true ||
      flags[`act_${s.act}_completed`] === true,
  }));
  if (!isSealBroken(sealNumber, phases)) return false;

  try {
    await ripple.emit("seal_broken", {
      userId,
      sealNumber,
    });
    await rippleLedgerService.record({
      eventType: "seal_broken",
      userId,
      fromSystem: "yearly",
      toSystems: ["mysteries", "transmissions", "governance"],
      payload: { sealNumber },
    });
  } catch (err) {
    logger.error(`[sealState] emit seal_broken (${sealNumber}) failed:`, err);
  }

  // Calendar overrides: Seal IV → Severance; Seal V → Memorial Day.
  if (sealNumber === 4 || sealNumber === 5) {
    const key = sealNumber === 4 ? "severance" : "memorial_day";
    await yearlyEventScheduler
      .activateBySeal(key, sealNumber)
      .catch((err) =>
        logger.error(`[sealState] activateBySeal(${key}) failed:`, err),
      );
  }
  return true;
}

/**
 * Reading helper: pull narrativeFlags off userProgress.gameData.
 * Returns {} on every failure mode — derivation is forward-only.
 */
async function readFlags(
  userId: number,
): Promise<Record<string, unknown>> {
  const db = await getDb();
  if (!db) return {};
  try {
    const { userProgress } = await import("../../db/schema");
    const { eq } = await import("drizzle-orm");
    const rows = await db
      .select({ gameData: userProgress.gameData })
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(1);
    const data = rows[0]?.gameData as
      | { narrativeFlags?: Record<string, unknown> }
      | null
      | undefined;
    const flags = data?.narrativeFlags;
    return flags && typeof flags === "object"
      ? (flags as Record<string, unknown>)
      : {};
  } catch (err) {
    logger.error("[sealState] readFlags failed:", err);
    return {};
  }
}

export const sealStateService = {
  getSealPhasesForPlayer,
  latestBrokenSealForPlayer,
  recordSealBreak,
};
