import type { HeroTarget } from "../../types/HeroTarget";

export const QUIETUS_DREV_MARSH_VARKUL: HeroTarget = {
  "id": "quietus_drev_marsh_varkul",
  "name": "Quietus Drev Marsh",
  "classKey": "assassin",
  "corruptorLord": "varkul",
  "threatTier": 4,
  "isBossLieutenant": false,
  "powerSet": [
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
    },
    {
      "id": "memorial_taking",
      "category": "assassin",
      "severity": 2
    },
    {
      "id": "cathedral_resonance",
      "category": "assassin",
      "severity": 3
    }
  ],
  "tells": [
    "Strikes only on the exact breath he chose in advance."
  ],
  "lairLocation": "cathedral_undercroft",
  "briefingHints": [
    "Quietus Drev Marsh served the League as a retrieval specialist in the League's quiet branch before the Blood Lord invited them into the Cathedral as visitor and they stayed.",
    "Varkul the Blood Lord now uses him to anchor a load-bearing column of the corruption."
  ]
};
