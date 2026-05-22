/* ═══════════════════════════════════════════════════════
   PREPARATION MISSION SERVICE — Nexus Trial loyalty arc
   docs/design/NEXUS_TRIAL_PLAN.md → Phase 3 (November)

   Bridges the apps/shared/preparationMissions/ registry
   to the player_preparation MySQL table. Read/write
   surface for the tRPC router and the future Verdict
   resolver (Sprint 9).

   Storage detail: humanConfessionWeight is stored as
   int×100 in the row (100 = 1.0×, 150 = 1.5×) to avoid
   floating-point comparison issues; factionMultipliers
   stays as raw floats in the JSON column.
   ═══════════════════════════════════════════════════════ */

import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { playerPreparation } from "../../db/schema";
import { logger } from "../logger";
import {
  DEFAULT_PLAYER_PREPARATION_STATE,
  PREPARATION_MISSIONS,
  PREPARATION_MISSION_IDS,
  canStartMission,
  isPreparationMissionId,
  resolveMission,
  type MissionEvaluation,
  type PlayerPreparationState,
  type PreparationMissionId,
  type PreparationMissionStatus,
} from "@shared/preparationMissions/registry";
import {
  scoreSalvage,
  type SalvageSubmission,
} from "@shared/preparationMissions/missions/salvage";
import {
  scoreReverseTrial,
  type ReverseTrialSubmission,
} from "@shared/preparationMissions/missions/reverseTrial";

const HUMAN_CONFESSION_WEIGHT_SCALE = 100;

/* ─── Row ↔ State ─── */

interface PreparationRow {
  witnessHandSize: number;
  filedBuff: boolean;
  elaraConfessionVisibility: boolean;
  humanConfessionWeight: number;
  factionMultipliers: Record<string, number>;
  recoveredBurntCardIds: string[];
  pledgedCardIds: string[];
  missionStatus: Record<string, string>;
}

function isPreparationMissionStatus(s: string): s is PreparationMissionStatus {
  return ["locked", "available", "in_progress", "passed", "failed", "skipped"].includes(s);
}

function rowToState(row: PreparationRow): PlayerPreparationState {
  // Sanitize missionStatus — only keep declared mission ids; default
  // any missing to "locked" / "available" per the registry baseline.
  const missionStatus = {
    ...DEFAULT_PLAYER_PREPARATION_STATE.missionStatus,
  };
  for (const id of PREPARATION_MISSION_IDS) {
    const raw = row.missionStatus[id];
    if (raw && isPreparationMissionStatus(raw)) {
      missionStatus[id] = raw;
    }
  }

  return {
    witnessHandSize: row.witnessHandSize,
    filedBuff: row.filedBuff,
    elaraConfessionVisibility: row.elaraConfessionVisibility,
    humanConfessionWeight: row.humanConfessionWeight / HUMAN_CONFESSION_WEIGHT_SCALE,
    factionMultipliers: { ...row.factionMultipliers },
    recoveredBurntCardIds: [...row.recoveredBurntCardIds],
    pledgedCardIds: [...row.pledgedCardIds],
    missionStatus,
  };
}

function stateToRow(state: PlayerPreparationState): PreparationRow {
  return {
    witnessHandSize: state.witnessHandSize,
    filedBuff: state.filedBuff,
    elaraConfessionVisibility: state.elaraConfessionVisibility,
    humanConfessionWeight: Math.round(state.humanConfessionWeight * HUMAN_CONFESSION_WEIGHT_SCALE),
    factionMultipliers: { ...state.factionMultipliers },
    recoveredBurntCardIds: [...state.recoveredBurntCardIds],
    pledgedCardIds: [...state.pledgedCardIds],
    missionStatus: { ...state.missionStatus },
  };
}

/* ─── Read / Write ─── */

/**
 * Load the player's preparation state, seeding the default row if no
 * row exists yet. Returns the registry-shaped state.
 *
 * When the DB is unavailable (test env, dev without a database) the
 * service falls back to returning the default state — callers see a
 * fresh player at the start of November.
 */
export async function loadPreparation(userId: number): Promise<PlayerPreparationState> {
  const db = await getDb();
  if (!db) return DEFAULT_PLAYER_PREPARATION_STATE;

  try {
    const rows = await db
      .select()
      .from(playerPreparation)
      .where(eq(playerPreparation.userId, userId))
      .limit(1);

    if (rows.length === 0) {
      // Seed a fresh row with defaults.
      const seed = stateToRow(DEFAULT_PLAYER_PREPARATION_STATE);
      await db.insert(playerPreparation).values({ userId, ...seed });
      return DEFAULT_PLAYER_PREPARATION_STATE;
    }

    return rowToState(rows[0] as unknown as PreparationRow);
  } catch (e) {
    logger.error(`[PreparationMissions] loadPreparation(${userId}) failed:`, e);
    return DEFAULT_PLAYER_PREPARATION_STATE;
  }
}

export async function savePreparation(
  userId: number,
  state: PlayerPreparationState,
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    await db
      .update(playerPreparation)
      .set(stateToRow(state))
      .where(eq(playerPreparation.userId, userId));
  } catch (e) {
    logger.error(`[PreparationMissions] savePreparation(${userId}) failed:`, e);
  }
}

/* ─── Mission lifecycle ─── */

export interface StartMissionResult {
  ok: boolean;
  reason?: string;
  state: PlayerPreparationState;
}

export async function startMission(
  userId: number,
  missionId: string,
): Promise<StartMissionResult> {
  if (!isPreparationMissionId(missionId)) {
    const state = await loadPreparation(userId);
    return { ok: false, reason: "unknown_mission", state };
  }
  const state = await loadPreparation(userId);
  if (!canStartMission(missionId, state)) {
    return {
      ok: false,
      reason: `mission_prerequisite_unmet (status=${state.missionStatus[missionId]})`,
      state,
    };
  }
  // Single-attempt rule: mark in_progress so a follow-up start is rejected.
  const next: PlayerPreparationState = {
    ...state,
    missionStatus: {
      ...state.missionStatus,
      [missionId]: "in_progress",
    },
  };
  await savePreparation(userId, next);
  logger.info(`[PreparationMissions] user=${userId} started mission=${missionId}`);
  return { ok: true, state: next };
}

export interface CompleteMissionResult {
  ok: boolean;
  reason?: string;
  state: PlayerPreparationState;
}

/**
 * Resolve a mission with the supplied evaluation. The caller (the
 * mission's gameplay implementation, Sprints 6 & 8) produces the
 * `MissionEvaluation`; this service applies it deterministically and
 * persists the new state.
 */
export async function completeMission(
  userId: number,
  missionId: string,
  evaluation: MissionEvaluation,
): Promise<CompleteMissionResult> {
  if (!isPreparationMissionId(missionId)) {
    const state = await loadPreparation(userId);
    return { ok: false, reason: "unknown_mission", state };
  }
  const state = await loadPreparation(userId);

  // The mission must be in_progress (or available — the start step
  // is optional for missions that auto-start). Anything terminal is
  // a logic error.
  const current = state.missionStatus[missionId];
  if (current === "passed" || current === "failed" || current === "skipped") {
    return { ok: false, reason: `mission_already_resolved (${current})`, state };
  }

  // resolveMission throws if canStartMission is false — which can happen
  // if a downstream mission completion arrives before its prereq. We
  // surface this as a clean error rather than letting the throw bubble.
  // For in_progress missions, we lift them back to "available" so the
  // resolver accepts them.
  const startable: PlayerPreparationState =
    current === "in_progress"
      ? {
          ...state,
          missionStatus: { ...state.missionStatus, [missionId]: "available" },
        }
      : state;

  if (!canStartMission(missionId, startable)) {
    return {
      ok: false,
      reason: `mission_prerequisite_unmet (status=${state.missionStatus[missionId]})`,
      state,
    };
  }

  const after = resolveMission(startable, missionId, evaluation);
  await savePreparation(userId, after);
  logger.info(
    `[PreparationMissions] user=${userId} mission=${missionId} ${evaluation.passed ? "PASSED" : "FAILED"} reason="${evaluation.reason}"`,
  );
  return { ok: true, state: after };
}

/** Read-only view used by status surfaces (e.g. the future Daily Brief
 *  preparation tracker). Returns the full registry alongside the
 *  player's current state so the client can render mission cards
 *  without a second round-trip. */
export async function listMissionsForPlayer(userId: number) {
  const state = await loadPreparation(userId);
  return {
    state,
    missions: PREPARATION_MISSION_IDS.map((id) => ({
      def: PREPARATION_MISSIONS[id],
      status: state.missionStatus[id],
    })),
  };
}

/* ─── Mission-specific submission dispatch ─── */

/**
 * Discriminated union of submission shapes one per implemented mission.
 * Sprints 6 + 8 add their entries here. Sprint 6 implements salvage
 * and reverse_trial; the other three are stubbed (the dispatcher
 * rejects them cleanly).
 */
export type MissionSubmission =
  | { missionId: "salvage"; payload: SalvageSubmission }
  | { missionId: "reverse_trial"; payload: ReverseTrialSubmission };

/**
 * Score a mission submission server-side and apply the resulting
 * evaluation. The client never constructs a MissionEvaluation
 * directly — that's the server's responsibility, so a malicious
 * client can't claim `passed: true` without supplying the underlying
 * gameplay data.
 *
 * Dispatches by `missionId` to the appropriate scorer module.
 * Unknown mission ids return an error response with the player's
 * current state unchanged.
 */
export async function submitMission(
  userId: number,
  submission: MissionSubmission,
): Promise<CompleteMissionResult> {
  let evaluation: MissionEvaluation;
  switch (submission.missionId) {
    case "salvage":
      evaluation = scoreSalvage(submission.payload);
      break;
    case "reverse_trial":
      evaluation = scoreReverseTrial(submission.payload);
      break;
    default: {
      const _exhaustive: never = submission;
      void _exhaustive;
      const state = await loadPreparation(userId);
      return { ok: false, reason: "mission_scorer_not_implemented", state };
    }
  }

  return completeMission(userId, submission.missionId, evaluation);
}
