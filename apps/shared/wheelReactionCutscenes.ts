/* ═══════════════════════════════════════════════════════
   WHEEL-REACTION CUTSCENES — Act 3 + Act 4 outcome cinematics

   The Act 3 fork ("The Offer" — what to disclose) and the Act 4
   trust resolution each have three canonical outcomes that already
   leave behind narrative flags. The producer 2026-05-10 drop
   ships a single MP4 per outcome under
   `videos/wheel_reactions/`:

     Act 3 fork:
       wheel_act3_transparent.mp4   ← act3_path_transparent_chosen
       wheel_act3_pragmatic.mp4     ← act3_path_pragmatic_chosen
       wheel_act3_full_secret.mp4   ← act3_path_full_secret_chosen

     Act 4 trust resolution:
       wheel_act4_reconciled.mp4    ← act4_outcome_reconciled
       wheel_act4_fragile_trust.mp4 ← act4_outcome_fragile_trust
       wheel_act4_broken_trust.mp4  ← act4_outcome_broken_trust

   The Act 3 outcome flags are canonical (see `act3PathDividend.ts`).
   The Act 4 outcome flags below are introduced in this module
   as the runtime contract for the producer's three Act-4 cuts;
   the existing Act 4 dialog (act4OpponentDialog.ts) carries the
   same three branches under different names ("the_bridge",
   "the_discovery", "the_betrayal") — `act4DialogPathToOutcome()`
   maps between them so the wheel-reaction layer doesn't have to
   change either side.
   ═══════════════════════════════════════════════════════ */

import type { Act3PathFlag } from "./act3PathDividend";

export type Act3WheelOutcome = "transparent" | "pragmatic" | "full_secret";
export type Act4WheelOutcome = "reconciled" | "fragile_trust" | "broken_trust";

export const ACT_3_WHEEL_OUTCOMES: readonly Act3WheelOutcome[] = [
  "transparent",
  "pragmatic",
  "full_secret",
];
export const ACT_4_WHEEL_OUTCOMES: readonly Act4WheelOutcome[] = [
  "reconciled",
  "fragile_trust",
  "broken_trust",
];

export type Act4OutcomeFlag =
  | "act4_outcome_reconciled"
  | "act4_outcome_fragile_trust"
  | "act4_outcome_broken_trust";

export const ACT_4_OUTCOME_FLAGS: readonly Act4OutcomeFlag[] = [
  "act4_outcome_reconciled",
  "act4_outcome_fragile_trust",
  "act4_outcome_broken_trust",
];

export interface WheelReactionCutsceneDef {
  /** Stable id matching the delivered MP4 basename. */
  id: string;
  act: 3 | 4;
  outcome: Act3WheelOutcome | Act4WheelOutcome;
  /** Sticky narrative flag that causes this cutscene to fire. */
  triggerFlag: Act3PathFlag | Act4OutcomeFlag;
  /** Path under apps/client/public/videos/ — pass through `assetUrl()`. */
  videoRelPath: string;
}

const VIDEO_DIR = "videos/wheel_reactions";

const ACT3_DEFS: readonly WheelReactionCutsceneDef[] = [
  {
    id: "wheel_act3_transparent",
    act: 3,
    outcome: "transparent",
    triggerFlag: "act3_path_transparent_chosen",
    videoRelPath: `${VIDEO_DIR}/wheel_act3_transparent.mp4`,
  },
  {
    id: "wheel_act3_pragmatic",
    act: 3,
    outcome: "pragmatic",
    triggerFlag: "act3_path_pragmatic_chosen",
    videoRelPath: `${VIDEO_DIR}/wheel_act3_pragmatic.mp4`,
  },
  {
    id: "wheel_act3_full_secret",
    act: 3,
    outcome: "full_secret",
    triggerFlag: "act3_path_full_secret_chosen",
    videoRelPath: `${VIDEO_DIR}/wheel_act3_full_secret.mp4`,
  },
];

const ACT4_DEFS: readonly WheelReactionCutsceneDef[] = [
  {
    id: "wheel_act4_reconciled",
    act: 4,
    outcome: "reconciled",
    triggerFlag: "act4_outcome_reconciled",
    videoRelPath: `${VIDEO_DIR}/wheel_act4_reconciled.mp4`,
  },
  {
    id: "wheel_act4_fragile_trust",
    act: 4,
    outcome: "fragile_trust",
    triggerFlag: "act4_outcome_fragile_trust",
    videoRelPath: `${VIDEO_DIR}/wheel_act4_fragile_trust.mp4`,
  },
  {
    id: "wheel_act4_broken_trust",
    act: 4,
    outcome: "broken_trust",
    triggerFlag: "act4_outcome_broken_trust",
    videoRelPath: `${VIDEO_DIR}/wheel_act4_broken_trust.mp4`,
  },
];

export const WHEEL_REACTION_CUTSCENES: readonly WheelReactionCutsceneDef[] = [
  ...ACT3_DEFS,
  ...ACT4_DEFS,
];

const BY_FLAG = new Map<string, WheelReactionCutsceneDef>(
  WHEEL_REACTION_CUTSCENES.map((d) => [d.triggerFlag, d]),
);

/** Resolve a wheel-reaction cutscene by its trigger flag.
 *  Returns undefined for unknown flags. */
export function resolveWheelReactionByFlag(
  flag: string,
): WheelReactionCutsceneDef | undefined {
  return BY_FLAG.get(flag);
}

/** Map the Act 4 dialog-path slug ("the_bridge" / "the_discovery"
 *  / "the_betrayal" — as used in act4OpponentDialog.ts) onto the
 *  Act 4 wheel-reaction outcome. Authors using the dialog path
 *  vocabulary can call this to find the matching cutscene without
 *  having to know the outcome slug. */
export function act4DialogPathToOutcome(
  path: string,
): Act4WheelOutcome | null {
  switch (path) {
    case "the_bridge":
      return "reconciled";
    case "the_discovery":
      return "fragile_trust";
    case "the_betrayal":
      return "broken_trust";
    default:
      return null;
  }
}

export const WHEEL_REACTION_CUTSCENE_TOTAL = WHEEL_REACTION_CUTSCENES.length;
