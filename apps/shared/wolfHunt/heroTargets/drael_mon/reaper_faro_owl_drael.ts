import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_FARO_OWL_DRAEL: HeroTarget = {
  "id": "reaper_faro_owl_drael",
  "name": "Reaper Faro Owl",
  "classKey": "assassin",
  "corruptorLord": "drael_mon",
  "threatTier": 1,
  "isBossLieutenant": false,
  "powerSet": [
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
    "Carries a weapon composed of the hunter's afterimage.",
    "Performs a brief sacrament before each kill."
  ],
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Reaper Faro Owl served the League as a retrieval specialist in the League's quiet branch before the Harvester paid them, in advance, for the souls they had not yet brought him.",
    "Drael'Mon the Harvester now uses him to scout the threshold rooms."
  ]
};
