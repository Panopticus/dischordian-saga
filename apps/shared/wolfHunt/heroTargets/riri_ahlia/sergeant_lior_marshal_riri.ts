import type { HeroTarget } from "../../types/HeroTarget";

export const SERGEANT_LIOR_MARSHAL_RIRI: HeroTarget = {
  "id": "sergeant_lior_marshal_riri",
  "name": "Sergeant Lior Marshal",
  "classKey": "soldier",
  "corruptorLord": "riri_ahlia",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "iron_quartermaster",
      "category": "soldier",
      "severity": 2
    },
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
    }
  ],
  "tells": [
    "Calls a reserve unit on a delayed cadence."
  ],
  "lairLocation": "tasking_yards",
  "briefingHints": [
    "Sergeant Lior Marshal served the League as a ranking officer in the League's standing line before the Taskmaster reorganised them onto a curriculum they had not been told existed.",
    "Riri'Ahlia the Taskmaster now uses him to drive a substantive operation against League material."
  ]
};
