/* ═══════════════════════════════════════════════════════
   NARRATOR DIALOG — BARREL

   Re-exports every tier file for both narrators and provides
   convenience arrays for the runtime dialog system.

   Usage:
     import { ALL_NARRATOR_DIALOGS, getAvailableScenes } from "@shared/narratorDialog";
     const scenes = getAvailableScenes("elara", trust, flags, ALL_NARRATOR_DIALOGS);
   ═══════════════════════════════════════════════════════ */

export type {
  TrustTier,
  NarratorId,
  NarratorEmotion,
  NarratorLine,
  PlayerResponseOption,
  NarratorScene,
  NarratorTierDialog,
} from "./trustTierDialogTypes";

export {
  getScenesForNarrator,
  getAvailableScenes,
} from "./trustTierDialogTypes";

import type { NarratorTierDialog } from "./trustTierDialogTypes";

import { ELARA_TIER_0 } from "./elaraTier0";
import { ELARA_TIER_1 } from "./elaraTier1";
import { ELARA_TIER_2 } from "./elaraTier2";
import { ELARA_TIER_3 } from "./elaraTier3";
import { ELARA_TIER_4 } from "./elaraTier4";

import { HUMAN_TIER_0 } from "./humanTier0";
import { HUMAN_TIER_1 } from "./humanTier1";
import { HUMAN_TIER_2 } from "./humanTier2";
import { HUMAN_TIER_3 } from "./humanTier3";
import { HUMAN_TIER_4 } from "./humanTier4";

export const ALL_ELARA_DIALOGS: NarratorTierDialog[] = [
  ELARA_TIER_0,
  ELARA_TIER_1,
  ELARA_TIER_2,
  ELARA_TIER_3,
  ELARA_TIER_4,
];

export const ALL_HUMAN_DIALOGS: NarratorTierDialog[] = [
  HUMAN_TIER_0,
  HUMAN_TIER_1,
  HUMAN_TIER_2,
  HUMAN_TIER_3,
  HUMAN_TIER_4,
];

export const ALL_NARRATOR_DIALOGS: NarratorTierDialog[] = [
  ...ALL_ELARA_DIALOGS,
  ...ALL_HUMAN_DIALOGS,
];

export {
  ELARA_TIER_0,
  ELARA_TIER_1,
  ELARA_TIER_2,
  ELARA_TIER_3,
  ELARA_TIER_4,
  HUMAN_TIER_0,
  HUMAN_TIER_1,
  HUMAN_TIER_2,
  HUMAN_TIER_3,
  HUMAN_TIER_4,
};
