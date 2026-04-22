/* ═══════════════════════════════════════════════════════
   ACT 5 COMPLETION GATE — §11 "The Reckoning / The Map"

   Four conditions must all hold (AND narrativeAct >= 5) for
   Act 5 to complete:

     1. Opening cinematic played:
        `slideshow_act_5_map_intro_complete`

     2. Map revealed:
        `act_5_map_revealed` — set when Act5InterludePage opens
        and the player sees Kael's 5-sector map for the first time.

     3. Cades FPS mission 7 complete:
        `cades_m7_complete` — Iron Lion's last stand on Veridian VI.
        This is the canonical end-of-Act-5 beat.

     4. At least 5 army recruitment missions cleared — matches the
        Act 6 trigger threshold (see apps/shared/armyRecruitment.ts).
        Gameplay populates GameState.armyRecruitmentMissionsCompleted
        via addCompletedRecruitmentMission. The gate reads the count
        so the Act-5-to-Act-6 handoff is consistent with the canon
        "5+ missions unlocks Act 6" trigger.

   When readyToFire, the hook sets `act_5_complete` + `act_6_started`
   and advances narrativeAct to 6. Act 6 is NOT sequential in the
   calendar sense — it's gated on army recruitment too — but the
   narrativeAct bump lets downstream gates reference the value
   cleanly and matches the Prelude→Act-1, Act-2→Act-3, Act-3→Act-4
   handoff pattern.

   The Bridge of Kael post-credits scene is a separate trigger
   (see witnessingIntegrations.ts shouldPlayBridgeOfKaelPostCredits)
   that fires once `kael_questline_complete` + `returned_to_bridge_
   post_kael` are both true; this gate does not touch it.
   ═══════════════════════════════════════════════════════ */

import {
  RECRUITMENT_THRESHOLDS,
  hasReachedAct6Threshold,
  getRecruitmentMissionCount,
} from "./armyRecruitment";

export type Act5CompletionRequiredFlag =
  | "slideshow_act_5_map_intro_complete"
  | "act_5_map_revealed"
  | "cades_m7_complete";

export const ACT_5_COMPLETION_REQUIRED_FLAGS: readonly Act5CompletionRequiredFlag[] = [
  "slideshow_act_5_map_intro_complete",
  "act_5_map_revealed",
  "cades_m7_complete",
] as const;

export interface Act5CompletionInput {
  narrativeAct: number | undefined;
  flags: Record<string, unknown> | undefined;
  /** Recruitment missions list from GameState. */
  armyRecruitmentMissionsCompleted?: readonly string[] | null;
}

export interface Act5CompletionStatus {
  alreadyComplete: boolean;
  allConditionsMet: boolean;
  readyToFire: boolean;
  requiredFlagStatus: Record<Act5CompletionRequiredFlag, boolean>;
  requiredMet: number;
  recruitmentCount: number;
  recruitmentThresholdMet: boolean;
  recruitmentThreshold: number;
}

/** Pure evaluator. */
export function deriveAct5CompletionStatus(
  input: Act5CompletionInput,
): Act5CompletionStatus {
  const flags = input.flags ?? {};
  const alreadyComplete = Boolean(flags.act_5_complete);
  const inAct5 = (input.narrativeAct ?? 0) >= 5;

  const requiredFlagStatus = {
    slideshow_act_5_map_intro_complete: Boolean(
      flags.slideshow_act_5_map_intro_complete,
    ),
    act_5_map_revealed: Boolean(flags.act_5_map_revealed),
    cades_m7_complete: Boolean(flags.cades_m7_complete),
  } as Record<Act5CompletionRequiredFlag, boolean>;
  const requiredMet = ACT_5_COMPLETION_REQUIRED_FLAGS.reduce(
    (n, f) => n + (requiredFlagStatus[f] ? 1 : 0),
    0,
  );
  const allRequiredMet = requiredMet === ACT_5_COMPLETION_REQUIRED_FLAGS.length;

  const recruitmentCount = getRecruitmentMissionCount({
    armyRecruitmentMissionsCompleted: input.armyRecruitmentMissionsCompleted,
  });
  const recruitmentThresholdMet = hasReachedAct6Threshold(recruitmentCount);

  const allConditionsMet = allRequiredMet && recruitmentThresholdMet;
  const readyToFire = inAct5 && !alreadyComplete && allConditionsMet;

  return {
    alreadyComplete,
    allConditionsMet,
    readyToFire,
    requiredFlagStatus,
    requiredMet,
    recruitmentCount,
    recruitmentThresholdMet,
    recruitmentThreshold: RECRUITMENT_THRESHOLDS.act6,
  };
}

export function isAct5Complete(
  flags: Record<string, unknown> | undefined,
): boolean {
  return Boolean(flags?.act_5_complete);
}
