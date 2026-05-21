import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_ALIZ_QUIETUS_VARKUL: HeroTarget = {
  "id": "reaper_aliz_quietus_varkul",
  "name": "Reaper Aliz Quietus",
  "classKey": "assassin",
  "corruptorLord": "varkul",
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
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Reaper Aliz Quietus served the League as a retrieval specialist in the League's quiet branch before the Blood Lord invited them into the Cathedral as visitor and they stayed.",
    "Varkul the Blood Lord now uses him to scout the threshold rooms."
  ]
};
