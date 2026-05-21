/* ═══════════════════════════════════════════════════════
   WOLF-HUNT — Mission state shape

   One mission instance per (user, target) at a time. The
   mission state is the union of:

     - meta: id, targetId, step machine, choice log
     - bookkeeping: lycos HP, started/ended timestamps
     - terminal: outcome (set when step === "aftermath")

   The reducer (missionReducer.ts) is pure over its action
   union: same state + same action → same state'. The
   server persists this blob via wolfHuntStore.ts.
   ═══════════════════════════════════════════════════════ */

export type MissionStep =
  | "briefing"
  | "approach"
  | "engagement"
  | "aftermath";

export type MissionOutcome =
  | "killed"
  | "spared"
  | "escaped"
  | "lycos_died";

/** A choice the player commits at one of the four mission steps. */
export type ApproachChoiceKey =
  | "stealth"
  | "social"
  | "tactical"
  | "abort";

export type EngagementChoiceKey =
  | "hunt" // commit to the kill
  | "restraint" // disable + interrogate
  | "mercy" // offer peace; spares the hero
  | "withdraw"; // pull back; the hero escapes

export type AftermathChoiceKey =
  | "report_to_antiquarian"
  | "close_quietly";

export interface MissionChoiceLogEntry {
  step: MissionStep;
  /** The committed choice key — typed loosely so all steps fit one list. */
  choiceKey: string;
  /** Optional risk grade assigned to the choice at commit time (0-1). */
  riskGrade?: number;
  /** Whether this choice triggered a Lycos death roll. */
  triggeredDeathRoll?: boolean;
  /** Result of the death roll, if triggered. */
  deathRollResult?: "survived" | "wounded" | "died";
  /** Server-side timestamp at commit. */
  committedAt: number;
}

export interface WolfHuntMissionState {
  id: string;
  userId: number;
  targetId: string;
  step: MissionStep;
  /** 0-100. Decrements on wounded rolls. Mission auto-ends on lycos_died at 0. */
  lycosHealth: number;
  /** Append-only choice log. */
  choices: ReadonlyArray<MissionChoiceLogEntry>;
  /** Outcome when step === "aftermath". */
  outcome?: MissionOutcome;
  startedAt: number;
  endedAt?: number;
  /** Whether this mission engaged the boss-fight card module at step=engagement. */
  bossFightTriggered: boolean;
}

export function emptyMissionState(
  id: string,
  userId: number,
  targetId: string,
  startedAt: number,
): WolfHuntMissionState {
  return {
    id,
    userId,
    targetId,
    step: "briefing",
    lycosHealth: 100,
    choices: [],
    startedAt,
    bossFightTriggered: false,
  };
}
