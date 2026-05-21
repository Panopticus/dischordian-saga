/* ═══════════════════════════════════════════════════════
   PATH B RESOLUTION SERVICE — Necromancer-event auto-return

   Wires the pure batchResolvePathB helper
   (apps/shared/resurrectionPathB.ts) into the runtime. When
   the galactic state enters a "dark" phase (dischordia
   cycle: long_night or vortex_advance — the local analogue
   of the Necromancer Cycle's "manifesting / returned"
   phases referenced in the original Path B design notes),
   every user with an open Resurrection Protocols quest has
   their outstanding petitions auto-resolved by the
   unmediated Samsara machine.

   Per-user effects, persisted in this service:
     1. Quest status → "completed_path_b" (resurrectionStore).
     2. NpcWorldDeathRecord → resolvedPathB true; world block
        lifted (resurrectionStore).
     3. `pending_resurrection_cinematic_<npcKey>` flag → true
        on userProgress.narrativeFlags, when the NPC has a
        cinematic binding (Wraith / Akai today). The
        ResurrectionCinematicRouter consumes it on next
        render to play the death-and-rebirth cinematic.
     4. Crew feed → one memorial-category entry per outcome
        carrying the transmission's first line ("I'm back.
        No thanks to you.") so the player sees the return
        in the crew log without an inbox surface.

   Idempotent. batchResolvePathB skips quests already in
   completed_path_a / completed_path_b status — re-running
   in the same dark phase is a no-op.

   Pending follow-ups, intentionally NOT done here:
     - NPC trust delta (PATH_B_REPUTATION_HIT). Server has no
       general per-NPC relationship adapter today — the
       outcome's `reputationHit` is dropped rather than
       silently applied to the wrong system. Future work:
       wire to a relationship adapter when one exists.
     - Inbox / transmissions UI surface. The crew feed is
       the closest existing player-facing surface; if a
       dedicated transmissions inbox lands later, swap the
       feed append for an inbox write.
   ═══════════════════════════════════════════════════════ */

import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { userProgress } from "../../db/schema";
import { logger } from "../logger";

import {
  batchResolvePathB,
  type PathBOutcome,
} from "../../shared/resurrectionPathB";
import {
  loadResurrectionStore,
  saveResurrectionStore,
  upsertQuest,
  upsertWorldDeath,
} from "./resurrectionStore";
import { loadCrewState, saveCrewState } from "./crewState";
import { dischordiaCycleService } from "./dischordiaCycleService";
import type { DischordiaPhase } from "../../shared/dischordiaCycle";

const FRANCHISE = "dischordian-saga";

/** Galactic phases that fire Path B. The Necromancer Cycle is
 *  documented in resurrectionPathB.ts (`shouldFirePathBForPhase`)
 *  as triggering on manifesting / returned / banishment_active,
 *  but the runtime cycle today is the Dischordia fork; these
 *  two phases are its dark analogues. Keep this list strict —
 *  the policy is "the universe needs them alive again", not
 *  "anything that isn't dawn". */
const PATH_B_TRIGGER_PHASES: ReadonlySet<DischordiaPhase> = new Set([
  "long_night",
  "vortex_advance",
]);

export function shouldFirePathBForDischordiaPhase(
  phase: DischordiaPhase,
): boolean {
  return PATH_B_TRIGGER_PHASES.has(phase);
}

export interface PathBSweepResult {
  /** Number of quests resolved via Path B in this sweep. */
  resolved: number;
  /** Whether the gating phase check skipped the sweep. */
  skippedForPhase: boolean;
}

/** Run a Path B sweep for one user. Pure I/O — `batchResolvePathB`
 *  does the decision-making; this function persists the outcomes.
 *  Called from runSeasonTick's per-active-user loop. */
export async function runPathBSweepForUser(
  userId: number,
  now: number = Date.now(),
): Promise<PathBSweepResult> {
  const phase = dischordiaCycleService.getState().phase;
  if (!shouldFirePathBForDischordiaPhase(phase)) {
    return { resolved: 0, skippedForPhase: true };
  }

  let store = await loadResurrectionStore(userId);
  if (store.quests.length === 0) {
    return { resolved: 0, skippedForPhase: false };
  }

  const outcomes = batchResolvePathB({
    openQuests: store.quests,
    worldDeathRecords: store.worldDeaths,
    now,
    // Stable per-(userId, dark-phase-start) seed so re-running
    // inside the same dark phase picks the same transmission
    // variant — keeps the player's lived history deterministic.
    triggerSeed:
      userId * 1_000_003 +
      Date.parse(dischordiaCycleService.getState().phaseStartedAt),
  });

  if (outcomes.length === 0) {
    return { resolved: 0, skippedForPhase: false };
  }

  for (const outcome of outcomes) {
    store = upsertQuest(store, outcome.quest);
    store = upsertWorldDeath(store, outcome.worldDeathRecord);
  }
  await saveResurrectionStore(userId, store);

  await applyPendingCinematicFlags(userId, outcomes);
  await appendTransmissionsToCrewFeed(userId, outcomes, now);

  return { resolved: outcomes.length, skippedForPhase: false };
}

/** Stamp `pending_resurrection_cinematic_<npcKey>` on userProgress
 *  for each outcome that carries one. Mirrors the JSON_SET pattern
 *  resurrection.ts:432-449 uses on Path A. */
async function applyPendingCinematicFlags(
  userId: number,
  outcomes: ReadonlyArray<PathBOutcome>,
): Promise<void> {
  const flagsToSet = outcomes
    .map((o) => o.pendingCinematicFlag)
    .filter((f): f is string => f !== null);
  if (flagsToSet.length === 0) return;

  const db = await getDb();
  if (!db) return;
  try {
    const rows = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(1);
    if (rows.length === 0) return;
    const raw = (rows[0]?.gameData ?? {}) as Record<string, unknown>;
    const narrativeFlags = {
      ...((raw.narrativeFlags ?? {}) as Record<string, boolean>),
    };
    for (const flag of flagsToSet) {
      narrativeFlags[flag] = true;
    }
    await db
      .update(userProgress)
      .set({ gameData: { ...raw, narrativeFlags } })
      .where(eq(userProgress.userId, userId));
  } catch (err) {
    logger.error("[pathBResolution] cinematic flag write failed:", err);
  }
}

/** Append one feed entry per outcome carrying the transmission's
 *  opening line. The full transmission text remains on the outcome
 *  (would-be inbox surface); the feed is the current narrative log
 *  the player reads. */
async function appendTransmissionsToCrewFeed(
  userId: number,
  outcomes: ReadonlyArray<PathBOutcome>,
  now: number,
): Promise<void> {
  const state = await loadCrewState(userId);
  if (!state) return;
  const newEntries = outcomes.map((o) => ({
    id: `path_b_transmission_${o.transmission.npcKey}_${now}`,
    timestamp: now,
    roomId: "the_commons",
    category: "transmission",
    text: `${o.transmission.npcKey}: ${o.transmission.lines[0] ?? ""}`,
    severity: "info" as const,
    actionable: false,
  }));
  await saveCrewState(userId, {
    ...state,
    feed: [...state.feed, ...newEntries].slice(-200),
  });
}
