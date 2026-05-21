import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_BETT_TALLY_DRAEL: HeroTarget = {
  "id": "reaper_bett_tally_drael",
  "name": "Reaper Bett Tally",
  "classKey": "assassin",
  "corruptorLord": "drael_mon",
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
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Reaper Bett Tally served the League as a retrieval specialist in the League's quiet branch before the Harvester paid them, in advance, for the souls they had not yet brought him.",
    "Drael'Mon the Harvester now uses him to scout the threshold rooms."
  ]
};
