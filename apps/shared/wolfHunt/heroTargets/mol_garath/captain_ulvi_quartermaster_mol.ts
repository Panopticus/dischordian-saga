import type { HeroTarget } from "../../types/HeroTarget";

export const CAPTAIN_ULVI_QUARTERMASTER_MOL: HeroTarget = {
  "id": "captain_ulvi_quartermaster_mol",
  "name": "Captain Ulvi Quartermaster",
  "classKey": "soldier",
  "corruptorLord": "mol_garath",
  "threatTier": 4,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "unmaking_command",
      "category": "soldier",
      "severity": 3
    },
    {
      "id": "rank_compulsion",
      "category": "soldier",
      "severity": 3
    },
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
    }
  ],
  "tells": [
    "Bleeds chairman-black when struck.",
    "Issues orders in a register only the corrupted obey.",
    "Maintains attritional pressure beyond reasonable endurance."
  ],
  "lairLocation": "unmakers_court",
  "briefingHints": [
    "Captain Ulvi Quartermaster served the League as a ranking officer in the League's standing line before the Unmaker pulled rank on the chain of command they had once trusted.",
    "Mol'Garath the Unmaker now uses him to anchor a load-bearing column of the corruption."
  ]
};
