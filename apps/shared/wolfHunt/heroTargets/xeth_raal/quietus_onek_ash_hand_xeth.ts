import type { HeroTarget } from "../../types/HeroTarget";

export const QUIETUS_ONEK_ASH_HAND_XETH: HeroTarget = {
  "id": "quietus_onek_ash_hand_xeth",
  "name": "Quietus Onek Ash-Hand",
  "classKey": "assassin",
  "corruptorLord": "xeth_raal",
  "threatTier": 4,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "soul_taxis",
      "category": "assassin",
      "severity": 3
    },
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
    "Counts down souls in fives before each strike.",
    "Leaves a coin behind for every kill, weighted by market value."
  ],
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Quietus Onek Ash-Hand served the League as a retrieval specialist in the League's quiet branch before the Ledger Keeper opened a contract clause they did not read aloud.",
    "Xeth'Raal the Ledger Keeper now uses him to anchor a load-bearing column of the corruption."
  ]
};
