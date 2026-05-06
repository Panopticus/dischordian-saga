/* ═══════════════════════════════════════════════════════
   LOYALTY MISSIONS — ME2-style per-companion arcs

   Plan §B2. Each romance candidate gets a personal mission
   chain that gates a companion-specific story payoff. This
   module is the data layer + state machine. Mission *content*
   (scene scripts, opponent decks, location art) is authoring-
   bound; this PR ships the engine + 3 seed missions (Locke,
   Vex, Elara) with placeholder beat text.

   Structure mirrors ME2: a multi-stage chain where each stage
   has a triggerCondition (flags / bond / act gate), a
   completion flag, and a final payoff (typically a
   companion-loyalty flag + an ME2-style "loyal in suicide
   mission" effect on the endgame).
   ═══════════════════════════════════════════════════════ */

import type { CompanionRosterId } from "./companionRoomRegistry";

export type LoyaltyStageStatus = "locked" | "available" | "in_progress" | "complete";

export interface LoyaltyStage {
  id: string;
  /** 1-indexed within the chain. */
  index: number;
  title: string;
  /** One-line beat summary for the journal entry. */
  summary: string;
  /** Flag set on completion. Required for the next stage's
   *  triggerFlag check. */
  completionFlag: string;
  /** Required flags for this stage to be available. */
  requiresFlags?: ReadonlyArray<string>;
  /** Required bond level (0–100) with the companion. */
  requiresBond?: number;
}

export interface LoyaltyMission {
  companionId: CompanionRosterId;
  title: string;
  /** Final loyalty flag set when the chain completes. Story
   *  endings use this to decide whether the companion
   *  survives / acts loyal in the endgame. */
  loyaltyFlag: string;
  stages: ReadonlyArray<LoyaltyStage>;
  /** Optional one-liner the companion says when the chain
   *  unlocks. Surfaces as a toast on the in-room visit. */
  introLine?: string;
}

export const LOYALTY_MISSIONS: ReadonlyArray<LoyaltyMission> = [
  {
    companionId: "adjudicator_locke",
    title: "Locke's Ledger",
    loyaltyFlag: "loyalty_locke_complete",
    introLine: "Locke: 'There's a name in the back of my ledger I never expected to write again.'",
    stages: [
      {
        id: "locke_1_inquiry",
        index: 1,
        title: "Open the Inquiry",
        summary: "Locke wants you to read the back-of-book entry he can't bring himself to surface alone.",
        completionFlag: "loyalty_locke_stage_1",
        requiresBond: 30,
        requiresFlags: ["trade_empire_unlocked"],
      },
      {
        id: "locke_2_meeting",
        index: 2,
        title: "The Meeting",
        summary: "Locke arranges a face-to-face with the name. You either negotiate, or you don't.",
        completionFlag: "loyalty_locke_stage_2",
        requiresFlags: ["loyalty_locke_stage_1"],
      },
      {
        id: "locke_3_resolution",
        index: 3,
        title: "Resolution",
        summary: "What Locke does with what you found out — depends on what you tell him.",
        completionFlag: "loyalty_locke_complete",
        requiresFlags: ["loyalty_locke_stage_2"],
      },
    ],
  },
  {
    companionId: "vex_solene",
    title: "Vex's Sample",
    loyaltyFlag: "loyalty_vex_complete",
    introLine: "Vex: 'I kept one vial. I shouldn't have. I want you to come with me when I open it.'",
    stages: [
      {
        id: "vex_1_vial",
        index: 1,
        title: "The Vial",
        summary: "Vex has carried a sample she shouldn't possess. She wants you in the room when she breaks the seal.",
        completionFlag: "loyalty_vex_stage_1",
        requiresBond: 30,
        requiresFlags: ["act_2_complete"],
      },
      {
        id: "vex_2_aftermath",
        index: 2,
        title: "Aftermath",
        summary: "What was in the vial wasn't what Vex was told. The decision about what to do next is yours together.",
        completionFlag: "loyalty_vex_stage_2",
        requiresFlags: ["loyalty_vex_stage_1"],
      },
      {
        id: "vex_3_record",
        index: 3,
        title: "Record",
        summary: "The Hierarchy notices. You decide whether the record stays sealed.",
        completionFlag: "loyalty_vex_complete",
        requiresFlags: ["loyalty_vex_stage_2"],
      },
    ],
  },
  {
    companionId: "elara",
    title: "Elara's Pre-Memory",
    loyaltyFlag: "loyalty_elara_complete",
    introLine: "Elara: 'I have a recording older than I am. I want you to tell me what's in it.'",
    stages: [
      {
        id: "elara_1_recording",
        index: 1,
        title: "The Recording",
        summary: "Elara has a recording she can't access alone. Help her open it.",
        completionFlag: "loyalty_elara_stage_1",
        requiresBond: 50,
      },
      {
        id: "elara_2_origin",
        index: 2,
        title: "Origin",
        summary: "What the recording reveals about who Elara was before she was Elara.",
        completionFlag: "loyalty_elara_stage_2",
        requiresFlags: ["loyalty_elara_stage_1"],
      },
      {
        id: "elara_3_choice",
        index: 3,
        title: "The Choice",
        summary: "She offers to be reset. Or to stay. The conversation that decides which.",
        completionFlag: "loyalty_elara_complete",
        requiresFlags: ["loyalty_elara_stage_2", "bond_80_mutual_peak"],
      },
    ],
  },
];

/* ─── Helpers ─── */

const MISSION_BY_COMPANION = new Map(
  LOYALTY_MISSIONS.map((m) => [m.companionId, m]),
);

export function getLoyaltyMission(
  companionId: CompanionRosterId,
): LoyaltyMission | undefined {
  return MISSION_BY_COMPANION.get(companionId);
}

export interface StageResolutionInput {
  flags: Readonly<Record<string, boolean | undefined>>;
  bondLevel: number;
}

export function stageStatus(
  stage: LoyaltyStage,
  input: StageResolutionInput,
): LoyaltyStageStatus {
  if (input.flags[stage.completionFlag]) return "complete";
  if (
    stage.requiresFlags &&
    !stage.requiresFlags.every((f) => input.flags[f])
  ) {
    return "locked";
  }
  if (stage.requiresBond !== undefined && input.bondLevel < stage.requiresBond) {
    return "locked";
  }
  // All gates met but not yet completed: in_progress if previous
  // stages are done, else available (= ready to start now).
  return "available";
}

/** Active stage of a companion's chain — the first stage
 *  that's available or in_progress. Null if none / chain
 *  fully complete. */
export function activeStage(
  mission: LoyaltyMission,
  input: StageResolutionInput,
): LoyaltyStage | null {
  for (const stage of mission.stages) {
    const s = stageStatus(stage, input);
    if (s === "available" || s === "in_progress") return stage;
  }
  return null;
}

export function isLoyaltyComplete(
  companionId: CompanionRosterId,
  flags: Readonly<Record<string, boolean | undefined>>,
): boolean {
  const mission = MISSION_BY_COMPANION.get(companionId);
  if (!mission) return false;
  return !!flags[mission.loyaltyFlag];
}
