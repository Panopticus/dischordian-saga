import type { HeroTarget } from "../../types/HeroTarget";

export const QUIETUS_FERREN_TALLY_ITH: HeroTarget = {
  "id": "quietus_ferren_tally_ith",
  "name": "Quietus Ferren Tally",
  "classKey": "assassin",
  "corruptorLord": "ith_rael",
  "threatTier": 1,
  "isBossLieutenant": false,
  "powerSet": [
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
    }
  ],
  "tells": [
    "Leaves a coin behind for every kill, weighted by market value."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Quietus Ferren Tally served the League as a retrieval specialist in the League's quiet branch before the Whisperer turned them across a window of decades.",
    "Ith'Rael the Whisperer now uses him to scout the threshold rooms."
  ]
};
