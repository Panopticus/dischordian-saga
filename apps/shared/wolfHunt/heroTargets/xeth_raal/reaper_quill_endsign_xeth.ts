import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_QUILL_ENDSIGN_XETH: HeroTarget = {
  "id": "reaper_quill_endsign_xeth",
  "name": "Reaper Quill Endsign",
  "classKey": "assassin",
  "corruptorLord": "xeth_raal",
  "threatTier": 2,
  "isBossLieutenant": false,
  "powerSet": [
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
      "id": "vampiric_economy",
      "category": "assassin",
      "severity": 2
    },
    {
      "id": "exact_quietus",
      "category": "assassin",
      "severity": 2
    }
  ],
  "tells": [
    "Hums a load-bearing frequency mid-strike."
  ],
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Reaper Quill Endsign served the League as a retrieval specialist in the League's quiet branch before the Ledger Keeper opened a contract clause they did not read aloud.",
    "Xeth'Raal the Ledger Keeper now uses him to hold a cell of the Crucible's lattice."
  ]
};
