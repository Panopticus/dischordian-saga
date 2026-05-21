import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_LINNEA_ASH_HAND_ZYR: HeroTarget = {
  "id": "reaper_linnea_ash_hand_zyr",
  "name": "Reaper Linnea Ash-Hand",
  "classKey": "assassin",
  "corruptorLord": "zyr_koth",
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
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Reaper Linnea Ash-Hand served the League as a retrieval specialist in the League's quiet branch before the Flayer revised them — third iteration is the operational one.",
    "Zyr'Koth the Flayer now uses him to anchor a load-bearing column of the corruption."
  ]
};
