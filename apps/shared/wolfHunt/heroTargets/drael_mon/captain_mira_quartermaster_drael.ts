import type { HeroTarget } from "../../types/HeroTarget";

export const CAPTAIN_MIRA_QUARTERMASTER_DRAEL: HeroTarget = {
  "id": "captain_mira_quartermaster_drael",
  "name": "Captain Mira Quartermaster",
  "classKey": "soldier",
  "corruptorLord": "drael_mon",
  "threatTier": 4,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "seven_dimension_siege",
      "category": "soldier",
      "severity": 3
    },
    {
      "id": "reorganization_doctrine",
      "category": "soldier",
      "severity": 3
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
    },
    {
      "id": "uniform_disregard",
      "category": "soldier",
      "severity": 1
    }
  ],
  "tells": [
    "Bleeds chairman-black when struck.",
    "Issues orders in a register only the corrupted obey.",
    "Maintains attritional pressure beyond reasonable endurance."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Captain Mira Quartermaster served the League as a ranking officer in the League's standing line before the Harvester paid them, in advance, for the souls they had not yet brought him.",
    "Drael'Mon the Harvester now uses him to anchor a load-bearing column of the corruption."
  ]
};
