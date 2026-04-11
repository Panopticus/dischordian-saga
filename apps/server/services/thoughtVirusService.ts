/* ═══════════════════════════════════════════════════════
   THOUGHT VIRUS SERVICE — Per-player persistence + glue

   Stores the player's VirusInfectionState inside
   `user_progress.progressData.virus`, mirroring how
   terminusSwarmRouter stores `terminus_base` in the same
   blob. That keeps us schema-migration-free.

   This service is the ONLY place that writes virus state.
   Other routers call its helpers (applyResidueLog,
   applyPropagationTick, applyCure) and those helpers:
     1. Load the current state (or default)
     2. Call the pure functions in apps/shared/thoughtVirus.ts
     3. Persist the new state
     4. Emit pressure events via pressureService
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import { eq } from "drizzle-orm";
import { userProgress } from "../../db/schema";
import { logger } from "../logger";
import { pressureService } from "./pressureService";
import {
  DEFAULT_VIRUS_STATE,
  type VirusInfectionState,
  type CureAction,
  logResidueItem,
  quarantineResidueItem,
  propagateTick,
  applyCure,
  pressureFromStateDelta,
  applyLoadDelta,
} from "@shared/thoughtVirus";

const VIRUS_KEY = "virus";

/**
 * Load the per-player virus state from user_progress.progressData.virus.
 * Returns a fresh default state if the user has no row yet.
 */
export async function loadVirusState(userId: number): Promise<VirusInfectionState> {
  const db = await getDb();
  if (!db) return { ...DEFAULT_VIRUS_STATE };

  const rows = await db.select().from(userProgress)
    .where(eq(userProgress.userId, userId))
    .limit(1);

  const progressData = (rows[0]?.progressData as Record<string, unknown> | null) ?? {};
  const raw = progressData[VIRUS_KEY];
  if (!raw || typeof raw !== "object") return { ...DEFAULT_VIRUS_STATE };
  // Merge onto defaults so added fields stay backwards-compatible.
  return { ...DEFAULT_VIRUS_STATE, ...(raw as Partial<VirusInfectionState>) };
}

/**
 * Write the per-player virus state back.
 * Creates a userProgress row if one does not yet exist.
 */
export async function saveVirusState(
  userId: number,
  state: VirusInfectionState,
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const rows = await db.select().from(userProgress)
    .where(eq(userProgress.userId, userId))
    .limit(1);

  const progressData = (rows[0]?.progressData as Record<string, unknown> | null) ?? {};
  const nextProgressData = { ...progressData, [VIRUS_KEY]: state };

  if (rows[0]) {
    await db.update(userProgress)
      .set({ progressData: nextProgressData, updatedAt: new Date() })
      .where(eq(userProgress.userId, userId))
      .catch(e => logger.error(`[ThoughtVirus] save failed for ${userId}:`, e));
  } else {
    await db.insert(userProgress).values({
      userId,
      progressData: nextProgressData,
    }).catch(e => logger.error(`[ThoughtVirus] insert failed for ${userId}:`, e));
  }
}

/**
 * Record that the player logged a residue item in their Ark.
 * Updates state, writes pressure, returns the new state + delta.
 */
export async function recordResidueLog(
  userId: number,
  itemId: string,
): Promise<{ state: VirusInfectionState; delta: number }> {
  const before = await loadVirusState(userId);
  const { state: after, delta } = logResidueItem(before, itemId);
  if (delta === 0) return { state: after, delta };

  await saveVirusState(userId, after);
  const pressure = pressureFromStateDelta(before, after);
  if (pressure > 0) {
    await pressureService.increment(userId, "viralExposures", pressure, `residue_log_${itemId}`);
  }
  // Even without a stage jump, residue logs still nudge the pressure meter.
  await pressureService.increment(userId, "viralExposures", 1, `residue_log_${itemId}`);
  return { state: after, delta };
}

/**
 * Record that the player quarantined (destroyed / sealed) a residue item.
 * Writes healingDone pressure as a counter-force.
 */
export async function recordResidueQuarantine(
  userId: number,
  itemId: string,
): Promise<{ state: VirusInfectionState; delta: number }> {
  const before = await loadVirusState(userId);
  const { state: after, delta } = quarantineResidueItem(before, itemId);
  if (delta === 0) return { state: after, delta };

  await saveVirusState(userId, after);
  // Quarantining residue counts as healing — feeds the counter-force
  // that resists the Necromancer and blunts Terminus pressure scoring.
  await pressureService.increment(userId, "healingDone", 2, `residue_quarantine_${itemId}`);
  return { state: after, delta };
}

/**
 * Apply a propagation tick for a single player. Called by the
 * living-universe hourly tick for every active player, or lazily
 * whenever the player loads their Ark scene.
 */
export async function runPropagationTick(
  userId: number,
  now: number = Date.now(),
): Promise<{ state: VirusInfectionState; newlyInfectedRooms: string[]; loadGained: number }> {
  const before = await loadVirusState(userId);
  const result = propagateTick(before, now);
  if (result.loadGained === 0 && result.newlyInfectedRooms.length === 0) {
    return { state: before, newlyInfectedRooms: [], loadGained: 0 };
  }
  await saveVirusState(userId, result.state);
  const pressure = pressureFromStateDelta(before, result.state);
  if (pressure > 0) {
    await pressureService.increment(userId, "viralExposures", pressure, "virus_propagation_tick");
  }
  return result;
}

/**
 * Apply a cure. Returns the updated state and the cure that was used.
 */
export async function runCure(
  userId: number,
  cureId: CureAction,
): Promise<{ state: VirusInfectionState; success: boolean }> {
  const before = await loadVirusState(userId);
  const { state: after, cure, success } = applyCure(before, cureId);
  if (!success) return { state: before, success: false };
  await saveVirusState(userId, after);
  // Cures don't feed Terminus; instead they feed truthRevealed (published
  // medical data) or healingDone (companion sacrifice is still a heal in
  // the metadata sense) so the community pressure math stays legible.
  if (cure?.id === "companion_sacrifice") {
    await pressureService.increment(userId, "deaths", 1, `cure_${cure.id}`);
  } else if (cure?.id === "source_bargain") {
    await pressureService.increment(userId, "betrayals", 10, `cure_${cure.id}`);
  } else if (cure) {
    await pressureService.increment(userId, "healingDone", 5, `cure_${cure.id}`);
  }
  return { state: after, success: true };
}

/**
 * Free-form helper for other systems to push a load delta. Used by the
 * Vox Corridor mission resolver to add viral exposure for every sector
 * the player traverses on that trade route.
 */
export async function addLoad(
  userId: number,
  delta: number,
  source: string,
): Promise<VirusInfectionState> {
  const before = await loadVirusState(userId);
  const after = applyLoadDelta(before, delta);
  await saveVirusState(userId, after);
  const pressure = pressureFromStateDelta(before, after);
  if (pressure > 0) {
    await pressureService.increment(userId, "viralExposures", pressure, source);
  }
  return after;
}
