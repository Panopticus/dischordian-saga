import type { HeroTarget } from "../../types/HeroTarget";

export const QUIETUS_NEVIN_ENDSIGN_ZYR: HeroTarget = {
  "id": "quietus_nevin_endsign_zyr",
  "name": "Quietus Nevin Endsign",
  "classKey": "assassin",
  "corruptorLord": "zyr_koth",
  "threatTier": 2,
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
      "id": "vampiric_economy",
      "category": "assassin",
      "severity": 2
    },
    {
      "id": "exact_quietus",
      "category": "assassin",
      "severity": 2
    }
  ],
  "tells": [
    "Hums a load-bearing frequency mid-strike."
  ],
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Quietus Nevin Endsign served the League as a retrieval specialist in the League's quiet branch before the Flayer revised them — third iteration is the operational one.",
    "Zyr'Koth the Flayer now uses him to hold a cell of the Crucible's lattice."
  ]
};
