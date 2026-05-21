import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_ILYA_HUSH_FENRA: HeroTarget = {
  "id": "reaper_ilya_hush_fenra",
  "name": "Reaper Ilya Hush",
  "classKey": "assassin",
  "corruptorLord": "fenra",
  "threatTier": 4,
  "isBossLieutenant": false,
  "powerSet": [
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
    }
  ],
  "tells": [
    "Counts down souls in fives before each strike.",
    "Leaves a coin behind for every kill, weighted by market value."
  ],
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Reaper Ilya Hush served the League as a retrieval specialist in the League's quiet branch before the Moon Tyrant charted them from the inside.",
    "Fenra the Moon Tyrant now uses him to anchor a load-bearing column of the corruption."
  ]
};
