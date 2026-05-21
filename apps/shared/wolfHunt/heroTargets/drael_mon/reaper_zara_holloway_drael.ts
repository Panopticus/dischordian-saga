import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_ZARA_HOLLOWAY_DRAEL: HeroTarget = {
  "id": "reaper_zara_holloway_drael",
  "name": "Reaper Zara Holloway",
  "classKey": "assassin",
  "corruptorLord": "drael_mon",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
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
    "Takes the dead's last memory along with the life.",
    "Counts down souls in fives before each strike."
  ],
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Reaper Zara Holloway served the League as a retrieval specialist in the League's quiet branch before the Harvester paid them, in advance, for the souls they had not yet brought him.",
    "Drael'Mon the Harvester now uses him to drive a substantive operation against League material."
  ]
};
