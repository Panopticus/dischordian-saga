import type { HeroTarget } from "../../types/HeroTarget";

export const SERGEANT_RYL_RANKS_ZYR: HeroTarget = {
  "id": "sergeant_ryl_ranks_zyr",
  "name": "Sergeant Ryl Ranks",
  "classKey": "soldier",
  "corruptorLord": "zyr_koth",
  "threatTier": 2,
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
      "id": "executive_charge",
      "category": "soldier",
      "severity": 2
    },
    {
      "id": "iron_quartermaster",
      "category": "soldier",
      "severity": 2
    }
  ],
  "tells": [
    "Maintains attritional pressure beyond reasonable endurance.",
    "Calls a reserve unit on a delayed cadence."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Sergeant Ryl Ranks served the League as a ranking officer in the League's standing line before the Flayer revised them — third iteration is the operational one.",
    "Zyr'Koth the Flayer now uses him to hold a cell of the Crucible's lattice."
  ]
};
