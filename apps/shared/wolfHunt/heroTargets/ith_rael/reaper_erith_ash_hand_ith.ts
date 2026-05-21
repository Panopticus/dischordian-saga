import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_ERITH_ASH_HAND_ITH: HeroTarget = {
  "id": "reaper_erith_ash_hand_ith",
  "name": "Reaper Erith Ash-Hand",
  "classKey": "assassin",
  "corruptorLord": "ith_rael",
  "threatTier": 4,
  "isBossLieutenant": false,
  "powerSet": [
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
    },
    {
      "id": "exact_quietus",
      "category": "assassin",
      "severity": 2
    },
    {
      "id": "shadow_weapon",
      "category": "assassin",
      "severity": 1
    }
  ],
  "tells": [
    "Counts down souls in fives before each strike.",
    "Leaves a coin behind for every kill, weighted by market value.",
    "Hums a load-bearing frequency mid-strike."
  ],
  "lairLocation": "rylloh_galleries",
  "briefingHints": [
    "Reaper Erith Ash-Hand served the League as a retrieval specialist in the League's quiet branch before the Whisperer turned them across a window of decades.",
    "Ith'Rael the Whisperer now uses him to anchor a load-bearing column of the corruption."
  ]
};
