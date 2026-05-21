import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_GWYN_MARSH_SYL: HeroTarget = {
  "id": "reaper_gwyn_marsh_syl",
  "name": "Reaper Gwyn Marsh",
  "classKey": "assassin",
  "corruptorLord": "syl_vex",
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
    "Strikes only on the exact breath he chose in advance."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Reaper Gwyn Marsh served the League as a retrieval specialist in the League's quiet branch before the Corruptor wove a cobalt thread into their decision-making.",
    "Syl'Vex the Corruptor now uses him to anchor a load-bearing column of the corruption."
  ]
};
