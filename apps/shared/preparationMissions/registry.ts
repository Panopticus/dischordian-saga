/* ═══════════════════════════════════════════════════════
   PREPARATION MISSIONS — Nexus Trial loyalty arc
   docs/design/NEXUS_TRIAL_PLAN.md → Phase 3 (November)

   Modeled on Mass Effect 2's suicide-run preparation: five
   week-by-week missions in November 2026 that compose the
   player's individual buff profile for the March 2027
   Nexus Trial.

   This module ships the *framework*. The five missions'
   actual gameplay implementations land in Sprint 6+8 (each
   is its own constrained card-match format). What ships
   here is the contract: per-player state, mission registry,
   ordering enforcement, evaluator interface.

   Each mission contributes to one or more buff slots on
   PlayerPreparationState. Pass/fail outcomes are recorded
   server-side in the player_preparation table and read by
   the Verdict resolver in Sprint 9.
   ═══════════════════════════════════════════════════════ */

/** Stable id for the five preparation missions. */
export type PreparationMissionId =
  | "salvage"
  | "reverse_trial"
  | "tribunal_elara"
  | "the_question"
  | "bidding_war";

export const PREPARATION_MISSION_IDS = [
  "salvage",
  "reverse_trial",
  "tribunal_elara",
  "the_question",
  "bidding_war",
] as const satisfies readonly PreparationMissionId[];

/** Per-mission lifecycle status. */
export type PreparationMissionStatus =
  | "locked" // prerequisite missions not yet passed
  | "available" // ready to start
  | "in_progress" // player started, hasn't finished
  | "passed"
  | "failed"
  | "skipped"; // player let the week pass without attempting

/** Static definition. Pure data — no functions, JSON-serializable. */
export interface PreparationMissionDef {
  id: PreparationMissionId;
  /** Calendar week within November (1..5). Ordering is linear. */
  week: 1 | 2 | 3 | 4 | 5;
  /** Player-facing short title. */
  title: string;
  /** Brief — one sentence — describing what the player must do. */
  description: string;
  /** Mission ids that must be `passed` before this one is `available`. */
  prerequisites: readonly PreparationMissionId[];
  /** Format label surfaced to the UI. Matches the gameplay-style
   *  declared in the plan's Mission detail section. */
  format:
    | "salvage"
    | "reverse_trial"
    | "tribunal"
    | "the_question"
    | "bidding_war";
}

/* ─── PLAYER STATE ─── */

/**
 * The cumulative buff profile a player carries into the Nexus Trial.
 * Each mission's pass-reward and fail-penalty patches this shape.
 */
export interface PlayerPreparationState {
  /** Trial Witness Hand size. Baseline 5; Salvage recoveries can add. */
  witnessHandSize: number;
  /** Reverse-Trial pass enables the +2-plays-per-turn buff on turns 1–3. */
  filedBuff: boolean;
  /** Elara's Tribunal pass makes the Confession-phase Elara-tally live to the player. */
  elaraConfessionVisibility: boolean;
  /** The Question pass: 1.5× weight on confession-category card plays. Baseline 1.0. */
  humanConfessionWeight: number;
  /**
   * Bidding-War-pledged faction multipliers. Each faction's value defaults to 1.0.
   * Pledges from sub-houses raise the multiplier for that faction. Capped at 3.0×.
   */
  factionMultipliers: Record<string, number>;
  /** Burnt-card NPC ids the player recovered during Salvage. Used for ballot vote bias. */
  recoveredBurntCardIds: readonly string[];
  /** Card ids the player pledged during Bidding War. Returned in Season 2 week 1. */
  pledgedCardIds: readonly string[];
  /** Per-mission lifecycle. */
  missionStatus: Record<PreparationMissionId, PreparationMissionStatus>;
}

/** Empty / starting state. Used at row-creation and in tests. */
export const DEFAULT_PLAYER_PREPARATION_STATE: PlayerPreparationState = {
  witnessHandSize: 5,
  filedBuff: false,
  elaraConfessionVisibility: false,
  humanConfessionWeight: 1.0,
  factionMultipliers: {},
  recoveredBurntCardIds: [],
  pledgedCardIds: [],
  missionStatus: {
    salvage: "available", // Week 1 has no prereqs
    reverse_trial: "locked",
    tribunal_elara: "locked",
    the_question: "locked",
    bidding_war: "locked",
  },
};

/* ─── REGISTRY ─── */

export const PREPARATION_MISSIONS: Record<PreparationMissionId, PreparationMissionDef> = {
  salvage: {
    id: "salvage",
    week: 1,
    title: "Recover the Burnt Cards",
    description:
      "Hunt fragments across the Inception Ark. Each recovered burnt card becomes part of your Witness Hand — and biases the second-death ballot in that name's favour.",
    prerequisites: [],
    format: "salvage",
  },
  reverse_trial: {
    id: "reverse_trial",
    week: 2,
    title: "Forge the Verdict Stream",
    description:
      "Sit at Locke's bench. Author the Charge while an AI defends. Six phases sequential, win on aggregate verdict-deltas.",
    prerequisites: ["salvage"],
    format: "reverse_trial",
  },
  tribunal_elara: {
    id: "tribunal_elara",
    week: 3,
    title: "Loyalty: Elara",
    description:
      "Walk Atarion's substrate-archive with Elara. Officiate the substrate's tribunal of her past as Senator. Choose what to admit as evidence.",
    prerequisites: ["reverse_trial"],
    format: "tribunal",
  },
  the_question: {
    id: "the_question",
    week: 4,
    title: "Loyalty: The Human",
    description:
      "Substrate-dive with The Human. He asks the player a question generated from their Witnessing record. Seven turns. No traditional win condition.",
    prerequisites: ["tribunal_elara"],
    format: "the_question",
  },
  bidding_war: {
    id: "bidding_war",
    week: 5,
    title: "The Council of Sub-Houses",
    description:
      "Twenty-four sub-houses sit on neutral ground. Trade card-faction strength for pledges. The Antiquarian refuses pledges of Locke or any ballot candidate.",
    prerequisites: ["the_question"],
    format: "bidding_war",
  },
};

/* ─── EVALUATION ─── */

/**
 * A mission's evaluator — supplied by each mission's gameplay
 * implementation in Sprints 6 and 8 — produces this shape on
 * completion. The service applies `rewards` on pass and
 * `penalties` on fail to the player's PlayerPreparationState.
 */
export interface MissionEvaluation {
  passed: boolean;
  /** Diegetic one-liner the UI surfaces in the mission summary. */
  reason: string;
  /**
   * Patch applied to PlayerPreparationState if `passed`. Each key is
   * optional — only the slots this mission contributes to need supply.
   * Numeric slots (factionMultipliers, witnessHandSize, humanConfessionWeight)
   * are additive; reward shapes use the operation that's natural for
   * each: arrays append (recoveredBurntCardIds, pledgedCardIds), numbers
   * add or replace per slot semantics.
   */
  rewards?: PreparationStatePatch;
  /** Patch applied to PlayerPreparationState if !passed. Same semantics. */
  penalties?: PreparationStatePatch;
}

/** Sparse patch shape — every field optional. */
export interface PreparationStatePatch {
  witnessHandSize?: number;
  filedBuff?: boolean;
  elaraConfessionVisibility?: boolean;
  humanConfessionWeight?: number;
  factionMultipliers?: Record<string, number>;
  recoveredBurntCardIds?: readonly string[];
  pledgedCardIds?: readonly string[];
}

/** Type guard for mission ids. */
export function isPreparationMissionId(s: string): s is PreparationMissionId {
  return (PREPARATION_MISSION_IDS as readonly string[]).includes(s);
}

/* ─── ORDERING ─── */

/** Returns the lifecycle status the *registry* implies for the mission
 *  given the player's other mission statuses. Used to roll prerequisite
 *  satisfaction forward without storing redundant state. */
export function deriveAvailability(
  missionId: PreparationMissionId,
  status: PlayerPreparationState["missionStatus"],
): PreparationMissionStatus {
  // Terminal states win — don't reset a passed/failed mission.
  const current = status[missionId];
  if (current === "passed" || current === "failed" || current === "skipped") {
    return current;
  }
  if (current === "in_progress") return "in_progress";

  const def = PREPARATION_MISSIONS[missionId];
  const allPrereqsPassed = def.prerequisites.every(
    (p) => status[p] === "passed",
  );
  return allPrereqsPassed ? "available" : "locked";
}

/** Returns true iff the mission may be started under the current state. */
export function canStartMission(
  missionId: PreparationMissionId,
  state: PlayerPreparationState,
): boolean {
  return deriveAvailability(missionId, state.missionStatus) === "available";
}

/** The next mission the player should attempt, or null if all are
 *  resolved (passed/failed/skipped). Returns missions in calendar
 *  week order. */
export function nextAvailableMission(
  state: PlayerPreparationState,
): PreparationMissionId | null {
  for (const id of PREPARATION_MISSION_IDS) {
    if (canStartMission(id, state)) return id;
  }
  return null;
}

/* ─── PATCH APPLICATION ─── */

/**
 * Apply an evaluation's reward or penalty patch to the player's
 * preparation state. Pure / deterministic; returns a new state.
 *
 * Numeric reward slots use additive semantics (Bidding-War pledges
 * accumulate; Salvage recoveries grow the Witness Hand). Boolean
 * slots OR with the current value (you can't un-pass a buff).
 * Numeric penalty slots replace (a failed Reverse-Trial sets the
 * 0.75× weight, doesn't subtract from baseline).
 */
export function applyMissionPatch(
  state: PlayerPreparationState,
  patch: PreparationStatePatch | undefined,
  kind: "reward" | "penalty",
): PlayerPreparationState {
  // Always return a fresh copy. Callers mutate the result; the input
  // must never be touched (DEFAULT_PLAYER_PREPARATION_STATE is module-
  // level and a shared reference).
  const next: PlayerPreparationState = {
    ...state,
    factionMultipliers: { ...state.factionMultipliers },
    recoveredBurntCardIds: [...state.recoveredBurntCardIds],
    pledgedCardIds: [...state.pledgedCardIds],
    missionStatus: { ...state.missionStatus },
  };
  if (!patch) return next;

  if (patch.witnessHandSize !== undefined) {
    next.witnessHandSize =
      kind === "reward"
        ? next.witnessHandSize + patch.witnessHandSize
        : patch.witnessHandSize;
  }
  if (patch.filedBuff !== undefined) {
    next.filedBuff = kind === "reward" ? next.filedBuff || patch.filedBuff : patch.filedBuff;
  }
  if (patch.elaraConfessionVisibility !== undefined) {
    next.elaraConfessionVisibility =
      kind === "reward"
        ? next.elaraConfessionVisibility || patch.elaraConfessionVisibility
        : patch.elaraConfessionVisibility;
  }
  if (patch.humanConfessionWeight !== undefined) {
    next.humanConfessionWeight = patch.humanConfessionWeight;
  }
  if (patch.factionMultipliers !== undefined) {
    for (const [faction, mult] of Object.entries(patch.factionMultipliers)) {
      if (kind === "reward") {
        next.factionMultipliers[faction] =
          (next.factionMultipliers[faction] ?? 1.0) * mult;
      } else {
        next.factionMultipliers[faction] = mult;
      }
    }
  }
  if (patch.recoveredBurntCardIds !== undefined && kind === "reward") {
    const seen = new Set(next.recoveredBurntCardIds);
    for (const id of patch.recoveredBurntCardIds) {
      if (!seen.has(id)) {
        next.recoveredBurntCardIds = [...next.recoveredBurntCardIds, id];
        seen.add(id);
      }
    }
  }
  if (patch.pledgedCardIds !== undefined && kind === "reward") {
    const seen = new Set(next.pledgedCardIds);
    for (const id of patch.pledgedCardIds) {
      if (!seen.has(id)) {
        next.pledgedCardIds = [...next.pledgedCardIds, id];
        seen.add(id);
      }
    }
  }

  return next;
}

/**
 * Resolve a mission against the player's state and an evaluator's
 * verdict. Returns the new state. Throws if the mission can't be
 * started (caller should have checked canStartMission first).
 */
export function resolveMission(
  state: PlayerPreparationState,
  missionId: PreparationMissionId,
  evaluation: MissionEvaluation,
): PlayerPreparationState {
  if (!canStartMission(missionId, state)) {
    const current = state.missionStatus[missionId];
    throw new Error(
      `Mission ${missionId} is not startable (status=${current})`,
    );
  }

  const patch = evaluation.passed ? evaluation.rewards : evaluation.penalties;
  const after = applyMissionPatch(state, patch, evaluation.passed ? "reward" : "penalty");
  after.missionStatus = {
    ...after.missionStatus,
    [missionId]: evaluation.passed ? "passed" : "failed",
  };

  // Cascade prerequisite unlock to downstream missions.
  for (const id of PREPARATION_MISSION_IDS) {
    after.missionStatus[id] = deriveAvailability(id, after.missionStatus);
  }

  return after;
}
