import type { HeroTarget } from "../../types/HeroTarget";

export const CAPTAIN_MIRA_MARSH_RIRI: HeroTarget = {
  "id": "captain_mira_marsh_riri",
  "name": "Captain Mira Marsh",
  "classKey": "soldier",
  "corruptorLord": "riri_ahlia",
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
  "lairLocation": "tasking_yards",
  "briefingHints": [
    "Captain Mira Marsh served the League as a ranking officer in the League's standing line before the Taskmaster reorganised them onto a curriculum they had not been told existed.",
    "Riri'Ahlia the Taskmaster now uses him to anchor a load-bearing column of the corruption."
  ]
};
