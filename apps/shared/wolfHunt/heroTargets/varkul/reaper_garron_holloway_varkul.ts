import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_GARRON_HOLLOWAY_VARKUL: HeroTarget = {
  "id": "reaper_garron_holloway_varkul",
  "name": "Reaper Garron Holloway",
  "classKey": "assassin",
  "corruptorLord": "varkul",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "memorial_taking",
      "category": "assassin",
      "severity": 2
    },
    {
      "id": "cathedral_resonance",
      "category": "assassin",
      "severity": 3
    },
    {
      "id": "blood_lexicon",
      "category": "assassin",
      "severity": 3
    },
    {
      "id": "vampiric_economy",
      "category": "assassin",
      "severity": 2
    }
  ],
  "tells": [
    "Takes the dead's last memory along with the life."
  ],
  "lairLocation": "cathedral_undercroft",
  "briefingHints": [
    "Reaper Garron Holloway served the League as a retrieval specialist in the League's quiet branch before the Blood Lord invited them into the Cathedral as visitor and they stayed.",
    "Varkul the Blood Lord now uses him to drive a substantive operation against League material."
  ]
};
