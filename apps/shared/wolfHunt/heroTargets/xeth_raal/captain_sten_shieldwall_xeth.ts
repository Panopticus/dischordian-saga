import type { HeroTarget } from "../../types/HeroTarget";

export const CAPTAIN_STEN_SHIELDWALL_XETH: HeroTarget = {
  "id": "captain_sten_shieldwall_xeth",
  "name": "Captain Sten Shieldwall",
  "classKey": "soldier",
  "corruptorLord": "xeth_raal",
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
    "Bleeds chairman-black when struck.",
    "Issues orders in a register only the corrupted obey.",
    "Maintains attritional pressure beyond reasonable endurance."
  ],
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Captain Sten Shieldwall served the League as a ranking officer in the League's standing line before the Ledger Keeper opened a contract clause they did not read aloud.",
    "Xeth'Raal the Ledger Keeper now uses him to anchor a load-bearing column of the corruption."
  ]
};
