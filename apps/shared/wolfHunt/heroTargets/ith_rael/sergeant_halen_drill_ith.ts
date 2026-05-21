import type { HeroTarget } from "../../types/HeroTarget";

export const SERGEANT_HALEN_DRILL_ITH: HeroTarget = {
  "id": "sergeant_halen_drill_ith",
  "name": "Sergeant Halen Drill",
  "classKey": "soldier",
  "corruptorLord": "ith_rael",
  "threatTier": 3,
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
    },
    {
      "id": "unmaking_command",
      "category": "soldier",
      "severity": 3
    }
  ],
  "tells": [
    "Plants a standard the cohort regroups around.",
    "Bleeds chairman-black when struck.",
    "Issues orders in a register only the corrupted obey."
  ],
  "lairLocation": "antechamber",
  "briefingHints": [
    "Sergeant Halen Drill served the League as a ranking officer in the League's standing line before the Whisperer turned them across a window of decades.",
    "Ith'Rael the Whisperer now uses him to drive a substantive operation against League material."
  ]
};
