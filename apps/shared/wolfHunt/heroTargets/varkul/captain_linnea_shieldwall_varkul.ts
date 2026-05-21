import type { HeroTarget } from "../../types/HeroTarget";

export const CAPTAIN_LINNEA_SHIELDWALL_VARKUL: HeroTarget = {
  "id": "captain_linnea_shieldwall_varkul",
  "name": "Captain Linnea Shieldwall",
  "classKey": "soldier",
  "corruptorLord": "varkul",
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
    "Bleeds chairman-black when struck.",
    "Issues orders in a register only the corrupted obey.",
    "Maintains attritional pressure beyond reasonable endurance."
  ],
  "lairLocation": "cathedral_undercroft",
  "briefingHints": [
    "Captain Linnea Shieldwall served the League as a ranking officer in the League's standing line before the Blood Lord invited them into the Cathedral as visitor and they stayed.",
    "Varkul the Blood Lord now uses him to anchor a load-bearing column of the corruption."
  ]
};
