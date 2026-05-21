import type { HeroTarget } from "../../types/HeroTarget";

export const SERGEANT_LIOR_RANK_DRAEL: HeroTarget = {
  "id": "sergeant_lior_rank_drael",
  "name": "Sergeant Lior Rank",
  "classKey": "soldier",
  "corruptorLord": "drael_mon",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "iron_quartermaster",
      "category": "soldier",
      "severity": 2
    },
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
    }
  ],
  "tells": [
    "Plants a standard the cohort regroups around.",
    "Bleeds chairman-black when struck."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Sergeant Lior Rank served the League as a ranking officer in the League's standing line before the Harvester paid them, in advance, for the souls they had not yet brought him.",
    "Drael'Mon the Harvester now uses him to drive a substantive operation against League material."
  ]
};
