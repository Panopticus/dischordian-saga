/* ═══════════════════════════════════════════════════════
   VORTEX INCURSION RUN — helpers

   Extends apps/shared/incursions.ts with a Vortex-specific
   run generator and progression helpers. Unlike the generic
   incursion dungeon (which shuffles a pool), the Vortex
   template is a SCRIPTED 10-room sequence authored for the
   §11.5 community endgame.

   Keeps the canonical IncursionRun shape so existing
   buff / reward / leaderboard helpers continue to work.

   Pure functions only. No store dependencies.
   ═══════════════════════════════════════════════════════ */

import {
  calculateRoomDifficulty,
  getRunRewards,
  type IncursionRoom,
  type IncursionRun,
  type RunReward,
} from "./incursions";
import { VORTEX_INCURSION_ROOMS } from "./vortexIncursionTemplate";

export interface VortexRunInput {
  runId: string;
  playerA: string;
  playerB: string;
  /** Epoch ms used as the startedAt timestamp. */
  nowMs: number;
  /** Optional week id override for testing. */
  weekId?: string;
}

function currentWeekId(nowMs: number): string {
  const weekNum = Math.ceil((nowMs / 86400000 - 3) / 7);
  return `2026-W${String(weekNum).padStart(2, "0")}`;
}

/**
 * Spawn a new Vortex Incursion run. Rooms come from
 * VORTEX_INCURSION_ROOMS in canonical order; no shuffling.
 * Players alternate assignments A / B across the rooms.
 */
export function spawnVortexRun(input: VortexRunInput): IncursionRun {
  const rooms: IncursionRoom[] = VORTEX_INCURSION_ROOMS.map((def, i) => ({
    index: i,
    def,
    difficulty: calculateRoomDifficulty(i, def.difficultyMod),
    assignedPlayer: i % 2 === 0 ? "A" : "B",
    cleared: false,
    elapsedMs: 0,
  }));
  return {
    runId: input.runId,
    playerA: input.playerA,
    playerB: input.playerB,
    rooms,
    activeBuffs: [],
    currentRoomIndex: 0,
    startedAt: input.nowMs,
    completedAt: null,
    abandoned: false,
    weekId: input.weekId ?? currentWeekId(input.nowMs),
  };
}

/**
 * Mark the room at `roomIndex` as cleared, record the time
 * it took, and advance the run's cursor to the next room.
 * Returns a new IncursionRun — the original is not mutated.
 */
export function clearVortexRoom(
  run: IncursionRun,
  roomIndex: number,
  elapsedMs: number,
): IncursionRun {
  if (roomIndex !== run.currentRoomIndex) return run;
  const rooms = run.rooms.map((r, i) =>
    i === roomIndex ? { ...r, cleared: true, elapsedMs } : r,
  );
  const nextIndex = roomIndex + 1;
  const completed = nextIndex >= rooms.length;
  return {
    ...run,
    rooms,
    currentRoomIndex: Math.min(nextIndex, rooms.length - 1),
    completedAt: completed ? run.startedAt + totalElapsed(rooms) : null,
  };
}

function totalElapsed(rooms: readonly IncursionRoom[]): number {
  return rooms.reduce((sum, r) => sum + r.elapsedMs, 0);
}

/** Has the run completed all ten rooms? */
export function isVortexRunComplete(run: IncursionRun): boolean {
  return run.completedAt !== null;
}

/** How many Vortex rooms has this run cleared? */
export function countVortexRoomsCleared(run: IncursionRun): number {
  return run.rooms.filter((r) => r.cleared).length;
}

/**
 * Light Energy contribution for the Dischordia Cycle meter
 * per cleared room. Every room contributes a base value;
 * the Vortex Core adds a bonus on top.
 */
export const VORTEX_LIGHT_PER_ROOM = 25;
export const VORTEX_CORE_BONUS_LIGHT = 250;

/**
 * Total light energy a run has earned for the community
 * meter, based on its current cleared-room count.
 */
export function getVortexLightReward(run: IncursionRun): number {
  let total = 0;
  for (const room of run.rooms) {
    if (!room.cleared) continue;
    total += VORTEX_LIGHT_PER_ROOM;
    if (room.def.key === "vortex_core") {
      total += VORTEX_CORE_BONUS_LIGHT;
    }
  }
  return total;
}

/**
 * Re-export the canonical run reward calculator so consumers
 * can import from one module.
 */
export function getVortexRunRewards(run: IncursionRun): RunReward {
  return getRunRewards(run);
}
