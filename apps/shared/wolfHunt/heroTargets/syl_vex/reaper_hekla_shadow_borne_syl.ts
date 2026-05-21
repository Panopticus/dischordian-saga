import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_HEKLA_SHADOW_BORNE_SYL: HeroTarget = {
  "id": "reaper_hekla_shadow_borne_syl",
  "name": "Reaper Hekla Shadow-Borne",
  "classKey": "assassin",
  "corruptorLord": "syl_vex",
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
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Reaper Hekla Shadow-Borne served the League as a retrieval specialist in the League's quiet branch before the Corruptor wove a cobalt thread into their decision-making.",
    "Syl'Vex the Corruptor now uses him to scout the threshold rooms."
  ]
};
