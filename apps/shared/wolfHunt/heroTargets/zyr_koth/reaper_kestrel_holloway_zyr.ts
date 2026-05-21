import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_KESTREL_HOLLOWAY_ZYR: HeroTarget = {
  "id": "reaper_kestrel_holloway_zyr",
  "name": "Reaper Kestrel Holloway",
  "classKey": "assassin",
  "corruptorLord": "zyr_koth",
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
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Reaper Kestrel Holloway served the League as a retrieval specialist in the League's quiet branch before the Flayer revised them — third iteration is the operational one.",
    "Zyr'Koth the Flayer now uses him to drive a substantive operation against League material."
  ]
};
