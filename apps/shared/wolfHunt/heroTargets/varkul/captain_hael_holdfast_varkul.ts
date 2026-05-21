import type { HeroTarget } from "../../types/HeroTarget";

export const CAPTAIN_HAEL_HOLDFAST_VARKUL: HeroTarget = {
  "id": "captain_hael_holdfast_varkul",
  "name": "Captain Hael Holdfast",
  "classKey": "soldier",
  "corruptorLord": "varkul",
  "threatTier": 4,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "seven_dimension_siege",
      "category": "soldier",
      "severity": 3
    },
    {
      "id": "reorganization_doctrine",
      "category": "soldier",
      "severity": 3
    },
    {
      "id": "attritional_will",
      "category": "soldier",
      "severity": 2
    },
    {
      "id": "flag_authority",
      "category": "soldier",
      "severity": 2
    },
    {
      "id": "uniform_disregard",
      "category": "soldier",
      "severity": 1
    }
  ],
  "tells": [
    "Salutes an empty seat to her right before every order.",
    "Reorders his guard formation mid-fight — the formation is the attack."
  ],
  "lairLocation": "cathedral_undercroft",
  "briefingHints": [
    "Captain Hael Holdfast served the League as a ranking officer in the League's standing line before the Blood Lord invited them into the Cathedral as visitor and they stayed.",
    "Varkul the Blood Lord now uses him to anchor a load-bearing column of the corruption."
  ]
};
