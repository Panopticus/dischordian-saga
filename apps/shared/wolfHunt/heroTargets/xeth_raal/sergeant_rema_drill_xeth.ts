import type { HeroTarget } from "../../types/HeroTarget";

export const SERGEANT_REMA_DRILL_XETH: HeroTarget = {
  "id": "sergeant_rema_drill_xeth",
  "name": "Sergeant Rema Drill",
  "classKey": "soldier",
  "corruptorLord": "xeth_raal",
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
    "Plants a standard the cohort regroups around.",
    "Bleeds chairman-black when struck."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Sergeant Rema Drill served the League as a ranking officer in the League's standing line before the Ledger Keeper opened a contract clause they did not read aloud.",
    "Xeth'Raal the Ledger Keeper now uses him to drive a substantive operation against League material."
  ]
};
