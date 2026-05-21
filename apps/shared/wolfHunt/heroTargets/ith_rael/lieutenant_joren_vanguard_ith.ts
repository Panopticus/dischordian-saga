import type { HeroTarget } from "../../types/HeroTarget";

export const LIEUTENANT_JOREN_VANGUARD_ITH: HeroTarget = {
  "id": "lieutenant_joren_vanguard_ith",
  "name": "Lieutenant Joren Vanguard",
  "classKey": "soldier",
  "corruptorLord": "ith_rael",
  "threatTier": 1,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "iron_quartermaster",
      "category": "soldier",
      "severity": 2
    },
    {
      "id": "attritional_will",
      "category": "soldier",
      "severity": 2
    },
    {
      "id": "flag_authority",
      "category": "soldier",
      "severity": 2
    }
  ],
  "tells": [
    "Issues orders in a register only the corrupted obey.",
    "Maintains attritional pressure beyond reasonable endurance."
  ],
  "lairLocation": "antechamber",
  "briefingHints": [
    "Lieutenant Joren Vanguard served the League as a ranking officer in the League's standing line before the Whisperer turned them across a window of decades.",
    "Ith'Rael the Whisperer now uses him to scout the threshold rooms."
  ]
};
