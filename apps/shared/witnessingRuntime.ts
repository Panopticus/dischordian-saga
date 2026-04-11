/* ═══════════════════════════════════════════════════════
   WITNESSING RUNTIME — consumer helpers for items 8-12

   Connects five data shells (preludeCrew, preludeCrewMissions,
   act1Opponents, act2Interlude, eyesBiography INFILTRATION_PATHS)
   to runtime gameplay via small pure functions.

   Each function is input → output. No stores. No side effects.
   Consumers (existing routers, React hooks) call these to
   answer "what's the next beat in system X given the player's
   current flag set?"
   ═══════════════════════════════════════════════════════ */

import {
  PRELUDE_CREW,
  type PreludeCrewMember,
  listPreludeCrew,
} from "./preludeCrew";
import {
  PRELUDE_CREW_MISSIONS,
  listPreludeMissions,
  type PreludeCrewMission,
} from "./preludeCrewMissions";
import {
  ACT_1_OPPONENTS,
  type Act1Opponent,
} from "./act1Opponents";
import {
  ENGINEERS_BENCH_FRAMING,
  ZEPHYR_9_CLASSROOM,
  listGameMasters,
  type GameMasterProfile,
} from "./act2Interlude";
import {
  INFILTRATION_PATHS,
  type FactionInfiltrationPath,
  type InfiltrationPathDef,
} from "./act3EyesBiography";

/* ─── ITEM 8 — PRELUDE CREW INTRO PROGRESSION ─── */

export interface PreludeIntroState {
  /** Which crew members have completed their jury sequence. */
  crewOnboard: readonly ("patch" | "zephyr_9" | "little_one")[];
  /** Which missions are complete. */
  missionsComplete: readonly (
    | "wreck_next_door"
    | "signal_from_nowhere"
    | "burnt_card"
  )[];
}

/**
 * Given the current flag set, compute the Prelude intro state.
 * Reads canonical flags: `prelude_<crew>_joined` for jury
 * completion and `prelude_mission_<id>_complete` for mission
 * completion.
 */
export function derivePreludeIntroState(
  flags: Record<string, unknown>,
): PreludeIntroState {
  const crewOnboard: PreludeIntroState["crewOnboard"] = (
    ["patch", "zephyr_9", "little_one"] as const
  ).filter((id) => Boolean(flags[`prelude_${id}_joined`]));
  const missionsComplete: PreludeIntroState["missionsComplete"] = (
    ["wreck_next_door", "signal_from_nowhere", "burnt_card"] as const
  ).filter((id) => Boolean(flags[`prelude_mission_${id}_complete`]));
  return { crewOnboard, missionsComplete };
}

/**
 * Which Prelude crew member is next in line to introduce
 * themselves? Returns null once all three are aboard.
 */
export function getNextPreludeCrewToJoin(
  flags: Record<string, unknown>,
): PreludeCrewMember | null {
  for (const member of listPreludeCrew()) {
    if (!flags[`prelude_${member.id}_joined`]) return member;
  }
  return null;
}

/**
 * Which Prelude mission is currently unlocked and ready to run?
 * A mission unlocks once its leader has joined AND it has not
 * yet been completed.
 */
export function getAvailablePreludeMissions(
  flags: Record<string, unknown>,
): readonly PreludeCrewMission[] {
  return listPreludeMissions().filter((m) => {
    const leaderJoined = Boolean(flags[`prelude_${m.leader}_joined`]);
    const done = Boolean(flags[`prelude_mission_${m.id}_complete`]);
    return leaderJoined && !done;
  });
}

/**
 * Has the entire Prelude onboarding arc been completed?
 * True once all three crew members are aboard AND all three
 * missions are complete, raising `prelude_complete`.
 */
export function isPreludeComplete(
  flags: Record<string, unknown>,
): boolean {
  const state = derivePreludeIntroState(flags);
  return state.crewOnboard.length === 3 && state.missionsComplete.length === 3;
}

/* ─── ITEM 9 — ACT 1 CARD LADDER PROGRESSION ─── */

/**
 * Given the player's total Act 1 card wins, return the next
 * Act 1 opponent they should face. Returns null once the
 * 12-step ladder is complete.
 *
 * The ladder is consumed sequentially — opponent #N is
 * available once the player has (N-1) Act 1 card wins.
 */
export function getNextAct1Opponent(
  act1CardWins: number,
): Act1Opponent | null {
  const nextStep = act1CardWins + 1;
  return ACT_1_OPPONENTS.find((o) => o.act1Step === nextStep) ?? null;
}

/**
 * List every Act 1 opponent the player has already beaten,
 * based on their Act 1 card wins.
 */
export function listDefeatedAct1Opponents(
  act1CardWins: number,
): readonly Act1Opponent[] {
  return ACT_1_OPPONENTS.filter((o) => o.act1Step <= act1CardWins);
}

/* ─── ITEM 10 — ACT 2 ENGINEERS BENCH RESOLVER ─── */

/**
 * Resolve the Zephyr-9 classroom line that should play when
 * the player reaches `zephyrDepth`. Falls back to the bench
 * firstPowerOn framing when the player has not yet reached
 * depth 1.
 */
export function getActiveEngineersBenchLine(
  zephyrDepth: number,
): string {
  // Find the highest classroom depth line the player has
  // earned, falling back to the firstPowerOn framing line.
  const match = [...ZEPHYR_9_CLASSROOM]
    .sort((a, b) => b.depth - a.depth)
    .find((u) => u.depth <= zephyrDepth);
  return match?.zephyrLine ?? ENGINEERS_BENCH_FRAMING.firstPowerOn;
}

/**
 * Which Game Master (Left / Right) should surface at this
 * moment of the Act 2 interlude, based on the player's morality
 * tilt? Positive morality maps to the Left (analytical) lens,
 * negative maps to the Right (improvisational) lens. Morality
 * zero returns null — neither Game Master has the player's
 * attention yet.
 */
export function getActiveAct2GameMaster(
  moralityScore: number,
): GameMasterProfile | null {
  if (moralityScore === 0) return null;
  const targetLens: GameMasterProfile["lens"] =
    moralityScore > 0 ? "left" : "right";
  return listGameMasters().find((gm) => gm.lens === targetLens) ?? null;
}

/* ─── ITEM 11 — INFILTRATION PATH QUEST CHAIN ─── */

export interface InfiltrationPathProgress {
  pathId: FactionInfiltrationPath;
  /** Has the player committed to this path? */
  committed: boolean;
  /** Has the path reached its milestone? */
  milestoneReached: boolean;
  /** Has the path reached its ending beat? */
  endingReached: boolean;
}

/**
 * Compute the progress state of all three infiltration paths
 * from the player's narrative flag set.
 */
export function deriveInfiltrationProgress(
  flags: Record<string, unknown>,
): readonly InfiltrationPathProgress[] {
  const out: InfiltrationPathProgress[] = [];
  for (const [pathId, path] of Object.entries(INFILTRATION_PATHS) as [
    FactionInfiltrationPath,
    InfiltrationPathDef,
  ][]) {
    out.push({
      pathId,
      committed: Boolean(flags[path.commitFlag]),
      milestoneReached: Boolean(flags[path.milestoneFlag]),
      endingReached: Boolean(flags[path.endingFlag]),
    });
  }
  return out;
}

/**
 * Which infiltration path is the player currently active in?
 * Returns the committed-but-not-complete path, or null if none.
 */
export function getActiveInfiltrationPath(
  flags: Record<string, unknown>,
): InfiltrationPathDef | null {
  for (const progress of deriveInfiltrationProgress(flags)) {
    if (progress.committed && !progress.endingReached) {
      return INFILTRATION_PATHS[progress.pathId];
    }
  }
  return null;
}
