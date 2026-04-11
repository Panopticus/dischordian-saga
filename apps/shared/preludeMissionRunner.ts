/* ═══════════════════════════════════════════════════════
   PRELUDE MISSION RUNNER — pure state machine

   Walks a PreludeCrewMission step-by-step. Text / reveal /
   combat / puzzle steps auto-advance on "continue." Choice
   steps wait for the player to pick an option and record
   the outcome in a trail.

   Pure: input → output, no effects. The React wrapper
   (PreludeMissionRunner.tsx) owns the render + the flag-
   raise + reward writeback.
   ═══════════════════════════════════════════════════════ */

import {
  PRELUDE_CREW_MISSIONS,
  type PreludeCrewMission,
  type PreludeMissionStep,
} from "./preludeCrewMissions";

export interface PreludeRunState {
  missionId: PreludeCrewMission["id"];
  /** 0-based index into mission.steps. */
  stepIndex: number;
  /** Ordered list of choice outcomes selected by the player. */
  outcomeTrail: readonly string[];
  /** True once the player has advanced past the last step. */
  complete: boolean;
}

/** Create a fresh run state for a given mission. */
export function startPreludeRun(
  missionId: PreludeCrewMission["id"],
): PreludeRunState {
  return {
    missionId,
    stepIndex: 0,
    outcomeTrail: [],
    complete: false,
  };
}

/**
 * Advance a text/reveal/combat/puzzle step. No-op if the
 * current step is a choice step (choice steps require
 * pickPreludeChoice instead).
 */
export function advancePreludeStep(
  state: PreludeRunState,
): PreludeRunState {
  if (state.complete) return state;
  const mission = PRELUDE_CREW_MISSIONS[state.missionId];
  const step = mission.steps[state.stepIndex];
  if (!step) return { ...state, complete: true };
  if (step.kind === "choice") return state; // must pick
  const nextIndex = state.stepIndex + 1;
  if (nextIndex >= mission.steps.length) {
    return { ...state, stepIndex: nextIndex, complete: true };
  }
  return { ...state, stepIndex: nextIndex };
}

/**
 * Pick a choice option. Records the outcome string and
 * advances. No-op if the current step is not a choice step
 * or the option id is invalid.
 */
export function pickPreludeChoice(
  state: PreludeRunState,
  optionId: string,
): PreludeRunState {
  if (state.complete) return state;
  const mission = PRELUDE_CREW_MISSIONS[state.missionId];
  const step = mission.steps[state.stepIndex];
  if (!step || step.kind !== "choice" || !step.options) return state;
  const option = step.options.find((o) => o.id === optionId);
  if (!option) return state;
  const nextIndex = state.stepIndex + 1;
  const complete = nextIndex >= mission.steps.length;
  return {
    ...state,
    stepIndex: nextIndex,
    outcomeTrail: [...state.outcomeTrail, option.outcome],
    complete,
  };
}

/** Peek the current step without mutating state. */
export function getCurrentPreludeStep(
  state: PreludeRunState,
): PreludeMissionStep | null {
  const mission = PRELUDE_CREW_MISSIONS[state.missionId];
  return mission.steps[state.stepIndex] ?? null;
}

/** Progress fraction [0, 1]. */
export function getPreludeProgress(state: PreludeRunState): number {
  const mission = PRELUDE_CREW_MISSIONS[state.missionId];
  if (mission.steps.length === 0) return 1;
  return Math.min(1, state.stepIndex / mission.steps.length);
}

/**
 * Returns the flags the caller should raise once the mission
 * is complete. Consumers call this AFTER checking
 * `state.complete === true`. Returns an empty array for
 * incomplete runs.
 */
export function getPreludeCompletionFlags(
  state: PreludeRunState,
): readonly string[] {
  if (!state.complete) return [];
  const mission = PRELUDE_CREW_MISSIONS[state.missionId];
  const missionCompleteFlag = `prelude_mission_${state.missionId}_complete`;
  return [missionCompleteFlag, ...mission.flagsOnSuccess];
}
