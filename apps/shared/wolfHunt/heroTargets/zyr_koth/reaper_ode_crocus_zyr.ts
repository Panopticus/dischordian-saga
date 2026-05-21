import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_ODE_CROCUS_ZYR: HeroTarget = {
  "id": "reaper_ode_crocus_zyr",
  "name": "Reaper Ode Crocus",
  "classKey": "assassin",
  "corruptorLord": "zyr_koth",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
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
    "Speaks the hunter's own blood-type back at him as a curse.",
    "Strikes only on the exact breath he chose in advance."
  ],
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Reaper Ode Crocus served the League as a retrieval specialist in the League's quiet branch before the Flayer revised them — third iteration is the operational one.",
    "Zyr'Koth the Flayer now uses him to drive a substantive operation against League material."
  ]
};
