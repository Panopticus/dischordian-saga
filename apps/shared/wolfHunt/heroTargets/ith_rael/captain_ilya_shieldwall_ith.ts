import type { HeroTarget } from "../../types/HeroTarget";

export const CAPTAIN_ILYA_SHIELDWALL_ITH: HeroTarget = {
  "id": "captain_ilya_shieldwall_ith",
  "name": "Captain Ilya Shieldwall",
  "classKey": "soldier",
  "corruptorLord": "ith_rael",
  "threatTier": 4,
  "isBossLieutenant": false,
  "powerSet": [
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
    },
    {
      "id": "rank_compulsion",
      "category": "soldier",
      "severity": 3
    },
    {
      "id": "executive_charge",
      "category": "soldier",
      "severity": 2
    }
  ],
  "tells": [
    "Bleeds chairman-black when struck."
  ],
  "lairLocation": "rylloh_galleries",
  "briefingHints": [
    "Captain Ilya Shieldwall served the League as a ranking officer in the League's standing line before the Whisperer turned them across a window of decades.",
    "Ith'Rael the Whisperer now uses him to anchor a load-bearing column of the corruption."
  ]
};
