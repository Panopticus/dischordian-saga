import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_PRAVIN_TALLY_XETH: HeroTarget = {
  "id": "reaper_pravin_tally_xeth",
  "name": "Reaper Pravin Tally",
  "classKey": "assassin",
  "corruptorLord": "xeth_raal",
  "threatTier": 1,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "ritual_grace",
      "category": "assassin",
      "severity": 1
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
    }
  ],
  "tells": [
    "Leaves a coin behind for every kill, weighted by market value.",
    "Hums a load-bearing frequency mid-strike.",
    "Speaks the hunter's own blood-type back at him as a curse."
  ],
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Reaper Pravin Tally served the League as a retrieval specialist in the League's quiet branch before the Ledger Keeper opened a contract clause they did not read aloud.",
    "Xeth'Raal the Ledger Keeper now uses him to scout the threshold rooms."
  ]
};
