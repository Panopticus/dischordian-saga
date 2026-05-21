import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_FENRA_FALLNIGHT_VARKUL: HeroTarget = {
  "id": "reaper_fenra_fallnight_varkul",
  "name": "Reaper Fenra Fallnight",
  "classKey": "assassin",
  "corruptorLord": "varkul",
  "threatTier": 2,
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
    }
  ],
  "tells": [
    "Performs a brief sacrament before each kill.",
    "Takes the dead's last memory along with the life.",
    "Counts down souls in fives before each strike."
  ],
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Reaper Fenra Fallnight served the League as a retrieval specialist in the League's quiet branch before the Blood Lord invited them into the Cathedral as visitor and they stayed.",
    "Varkul the Blood Lord now uses him to hold a cell of the Crucible's lattice."
  ]
};
