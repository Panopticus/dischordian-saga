import type { HeroTarget } from "../../types/HeroTarget";

export const CAPTAIN_PHAEDRA_SHIELDWALL_ZYR: HeroTarget = {
  "id": "captain_phaedra_shieldwall_zyr",
  "name": "Captain Phaedra Shieldwall",
  "classKey": "soldier",
  "corruptorLord": "zyr_koth",
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
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Captain Phaedra Shieldwall served the League as a ranking officer in the League's standing line before the Flayer revised them — third iteration is the operational one.",
    "Zyr'Koth the Flayer now uses him to anchor a load-bearing column of the corruption."
  ]
};
