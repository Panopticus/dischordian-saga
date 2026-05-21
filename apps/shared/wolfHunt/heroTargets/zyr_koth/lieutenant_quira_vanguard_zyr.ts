import type { HeroTarget } from "../../types/HeroTarget";

export const LIEUTENANT_QUIRA_VANGUARD_ZYR: HeroTarget = {
  "id": "lieutenant_quira_vanguard_zyr",
  "name": "Lieutenant Quira Vanguard",
  "classKey": "soldier",
  "corruptorLord": "zyr_koth",
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
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Lieutenant Quira Vanguard served the League as a ranking officer in the League's standing line before the Flayer revised them — third iteration is the operational one.",
    "Zyr'Koth the Flayer now uses him to scout the threshold rooms."
  ]
};
