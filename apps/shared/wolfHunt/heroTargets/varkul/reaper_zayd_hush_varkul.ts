import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_ZAYD_HUSH_VARKUL: HeroTarget = {
  "id": "reaper_zayd_hush_varkul",
  "name": "Reaper Zayd Hush",
  "classKey": "assassin",
  "corruptorLord": "varkul",
  "threatTier": 4,
  "isBossLieutenant": false,
  "powerSet": [
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
    },
    {
      "id": "ritual_grace",
      "category": "assassin",
      "severity": 1
    },
    {
      "id": "soul_taxis",
      "category": "assassin",
      "severity": 3
    }
  ],
  "tells": [
    "Counts down souls in fives before each strike.",
    "Leaves a coin behind for every kill, weighted by market value.",
    "Hums a load-bearing frequency mid-strike."
  ],
  "lairLocation": "cathedral_undercroft",
  "briefingHints": [
    "Reaper Zayd Hush served the League as a retrieval specialist in the League's quiet branch before the Blood Lord invited them into the Cathedral as visitor and they stayed.",
    "Varkul the Blood Lord now uses him to anchor a load-bearing column of the corruption."
  ]
};
