import type { HeroTarget } from "../../types/HeroTarget";

export const QUIETUS_DAPHNE_CROCUS_DRAEL: HeroTarget = {
  "id": "quietus_daphne_crocus_drael",
  "name": "Quietus Daphne Crocus",
  "classKey": "assassin",
  "corruptorLord": "drael_mon",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
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
    "Speaks the hunter's own blood-type back at him as a curse.",
    "Strikes only on the exact breath he chose in advance.",
    "Carries a weapon composed of the hunter's afterimage."
  ],
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Quietus Daphne Crocus served the League as a retrieval specialist in the League's quiet branch before the Harvester paid them, in advance, for the souls they had not yet brought him.",
    "Drael'Mon the Harvester now uses him to drive a substantive operation against League material."
  ]
};
