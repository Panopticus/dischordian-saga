import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_ADROS_ASH_HAND_DRAEL: HeroTarget = {
  "id": "reaper_adros_ash_hand_drael",
  "name": "Reaper Adros Ash-Hand",
  "classKey": "assassin",
  "corruptorLord": "drael_mon",
  "threatTier": 4,
  "isBossLieutenant": false,
  "powerSet": [
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
    },
    {
      "id": "blood_lexicon",
      "category": "assassin",
      "severity": 3
    },
    {
      "id": "vampiric_economy",
      "category": "assassin",
      "severity": 2
    }
  ],
  "tells": [
    "Counts down souls in fives before each strike.",
    "Leaves a coin behind for every kill, weighted by market value.",
    "Hums a load-bearing frequency mid-strike."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Reaper Adros Ash-Hand served the League as a retrieval specialist in the League's quiet branch before the Harvester paid them, in advance, for the souls they had not yet brought him.",
    "Drael'Mon the Harvester now uses him to anchor a load-bearing column of the corruption."
  ]
};
