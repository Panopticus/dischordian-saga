import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_HADI_COIN_DRAEL: HeroTarget = {
  "id": "reaper_hadi_coin_drael",
  "name": "Reaper Hadi Coin",
  "classKey": "assassin",
  "corruptorLord": "drael_mon",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "ritual_grace",
      "category": "assassin",
      "severity": 1
    },
    {
      "id": "soul_taxis",
      "category": "assassin",
      "severity": 3
    },
    {
      "id": "harvest_pace",
      "category": "assassin",
      "severity": 3
    },
    {
      "id": "veil_step",
      "category": "assassin",
      "severity": 2
    }
  ],
  "tells": [
    "Takes the dead's last memory along with the life."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Reaper Hadi Coin served the League as a retrieval specialist in the League's quiet branch before the Harvester paid them, in advance, for the souls they had not yet brought him.",
    "Drael'Mon the Harvester now uses him to drive a substantive operation against League material."
  ]
};
