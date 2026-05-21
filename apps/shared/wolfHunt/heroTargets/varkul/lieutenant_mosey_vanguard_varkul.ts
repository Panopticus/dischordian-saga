import type { HeroTarget } from "../../types/HeroTarget";

export const LIEUTENANT_MOSEY_VANGUARD_VARKUL: HeroTarget = {
  "id": "lieutenant_mosey_vanguard_varkul",
  "name": "Lieutenant Mosey Vanguard",
  "classKey": "soldier",
  "corruptorLord": "varkul",
  "threatTier": 1,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "flag_authority",
      "category": "soldier",
      "severity": 2
    },
    {
      "id": "uniform_disregard",
      "category": "soldier",
      "severity": 1
    },
    {
      "id": "garrison_recall",
      "category": "soldier",
      "severity": 1
    }
  ],
  "tells": [
    "Issues orders in a register only the corrupted obey."
  ],
  "lairLocation": "antechamber",
  "briefingHints": [
    "Lieutenant Mosey Vanguard served the League as a ranking officer in the League's standing line before the Blood Lord invited them into the Cathedral as visitor and they stayed.",
    "Varkul the Blood Lord now uses him to scout the threshold rooms."
  ]
};
