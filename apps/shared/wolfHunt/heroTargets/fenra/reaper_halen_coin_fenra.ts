import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_HALEN_COIN_FENRA: HeroTarget = {
  "id": "reaper_halen_coin_fenra",
  "name": "Reaper Halen Coin",
  "classKey": "assassin",
  "corruptorLord": "fenra",
  "threatTier": 3,
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
    },
    {
      "id": "soul_taxis",
      "category": "assassin",
      "severity": 3
    }
  ],
  "tells": [
    "Takes the dead's last memory along with the life."
  ],
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Reaper Halen Coin served the League as a retrieval specialist in the League's quiet branch before the Moon Tyrant charted them from the inside.",
    "Fenra the Moon Tyrant now uses him to drive a substantive operation against League material."
  ]
};
