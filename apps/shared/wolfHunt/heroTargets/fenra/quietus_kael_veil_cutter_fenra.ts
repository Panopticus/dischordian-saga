import type { HeroTarget } from "../../types/HeroTarget";

export const QUIETUS_KAEL_VEIL_CUTTER_FENRA: HeroTarget = {
  "id": "quietus_kael_veil_cutter_fenra",
  "name": "Quietus Kael Veil-Cutter",
  "classKey": "assassin",
  "corruptorLord": "fenra",
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
    "Quietus Kael Veil-Cutter served the League as a retrieval specialist in the League's quiet branch before the Moon Tyrant charted them from the inside.",
    "Fenra the Moon Tyrant now uses him to hold a cell of the Crucible's lattice."
  ]
};
