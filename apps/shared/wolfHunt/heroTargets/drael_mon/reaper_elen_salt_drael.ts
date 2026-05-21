import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_ELEN_SALT_DRAEL: HeroTarget = {
  "id": "reaper_elen_salt_drael",
  "name": "Reaper Elen Salt",
  "classKey": "assassin",
  "corruptorLord": "drael_mon",
  "threatTier": 4,
  "isBossLieutenant": false,
  "powerSet": [
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
    },
    {
      "id": "ritual_grace",
      "category": "assassin",
      "severity": 1
    },
    {
      "id": "soul_taxis",
      "category": "assassin",
      "severity": 3
    }
  ],
  "tells": [
    "Strikes only on the exact breath he chose in advance."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Reaper Elen Salt served the League as a retrieval specialist in the League's quiet branch before the Harvester paid them, in advance, for the souls they had not yet brought him.",
    "Drael'Mon the Harvester now uses him to anchor a load-bearing column of the corruption."
  ]
};
