import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_MOSEY_TALLY_ZYR: HeroTarget = {
  "id": "reaper_mosey_tally_zyr",
  "name": "Reaper Mosey Tally",
  "classKey": "assassin",
  "corruptorLord": "zyr_koth",
  "threatTier": 1,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "ritual_grace",
      "category": "assassin",
      "severity": 1
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
    }
  ],
  "tells": [
    "Leaves a coin behind for every kill, weighted by market value.",
    "Hums a load-bearing frequency mid-strike.",
    "Speaks the hunter's own blood-type back at him as a curse."
  ],
  "lairLocation": "antechamber",
  "briefingHints": [
    "Reaper Mosey Tally served the League as a retrieval specialist in the League's quiet branch before the Flayer revised them — third iteration is the operational one.",
    "Zyr'Koth the Flayer now uses him to scout the threshold rooms."
  ]
};
