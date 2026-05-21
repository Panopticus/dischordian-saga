import type { HeroTarget } from "../../types/HeroTarget";

export const PERSUADER_KAL_DEMIR: HeroTarget = {
  id: "persuader_kal_demir",
  name: "Persuader Kal Demir",
  classKey: "spy",
  corruptorLord: "syl_vex",
  threatTier: 5,
  isBossLieutenant: true,
  powerSet: [
    { id: "cobalt_conversion", category: "spy", severity: 3 },
    { id: "mirror_argument", category: "spy", severity: 3 },
    { id: "consent_extraction", category: "spy", severity: 2 },
  ],
  tells: [
    "Asks the Wolf which version of himself he wants to keep before the fight begins.",
    "His skin runs cobalt where Syl'Vex's weave has taken root — visible only when he laughs.",
    "Never fights the first round. Always lets the opponent commit to a posture first.",
  ],
  lairLocation: "corrupters_orchard",
  briefingHints: [
    "Was the League's chief diplomat. He has never lost a negotiation he was permitted to enter.",
    "Syl'Vex weaves through him without his knowledge — that is the corruption's design.",
    "The Wolf cannot debate him out of the corruption. The persuasion runs deeper than language.",
  ],
};
