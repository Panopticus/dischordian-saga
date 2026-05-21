import type { HeroTarget } from "../../types/HeroTarget";

export const QUIETUS_INES_HUSH_DRAEL: HeroTarget = {
  "id": "quietus_ines_hush_drael",
  "name": "Quietus Ines Hush",
  "classKey": "assassin",
  "corruptorLord": "drael_mon",
  "threatTier": 4,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "soul_taxis",
      "category": "assassin",
      "severity": 3
    },
    {
      "id": "harvest_pace",
      "category": "assassin",
      "severity": 3
    },
    {
      "id": "veil_step",
      "category": "assassin",
      "severity": 2
    },
    {
      "id": "memorial_taking",
      "category": "assassin",
      "severity": 2
    },
    {
      "id": "cathedral_resonance",
      "category": "assassin",
      "severity": 3
    }
  ],
  "tells": [
    "Counts down souls in fives before each strike.",
    "Leaves a coin behind for every kill, weighted by market value."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Quietus Ines Hush served the League as a retrieval specialist in the League's quiet branch before the Harvester paid them, in advance, for the souls they had not yet brought him.",
    "Drael'Mon the Harvester now uses him to anchor a load-bearing column of the corruption."
  ]
};
