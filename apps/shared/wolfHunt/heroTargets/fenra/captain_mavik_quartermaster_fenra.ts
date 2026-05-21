import type { HeroTarget } from "../../types/HeroTarget";

export const CAPTAIN_MAVIK_QUARTERMASTER_FENRA: HeroTarget = {
  "id": "captain_mavik_quartermaster_fenra",
  "name": "Captain Mavik Quartermaster",
  "classKey": "soldier",
  "corruptorLord": "fenra",
  "threatTier": 4,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "executive_charge",
      "category": "soldier",
      "severity": 2
    },
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
    "Bleeds chairman-black when struck.",
    "Issues orders in a register only the corrupted obey.",
    "Maintains attritional pressure beyond reasonable endurance."
  ],
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Captain Mavik Quartermaster served the League as a ranking officer in the League's standing line before the Moon Tyrant charted them from the inside.",
    "Fenra the Moon Tyrant now uses him to anchor a load-bearing column of the corruption."
  ]
};
