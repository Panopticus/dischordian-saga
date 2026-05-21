import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_NESSA_HOLLOWAY_XETH: HeroTarget = {
  "id": "reaper_nessa_holloway_xeth",
  "name": "Reaper Nessa Holloway",
  "classKey": "assassin",
  "corruptorLord": "xeth_raal",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "ritual_grace",
      "category": "assassin",
      "severity": 1
    },
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
    }
  ],
  "tells": [
    "Takes the dead's last memory along with the life."
  ],
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Reaper Nessa Holloway served the League as a retrieval specialist in the League's quiet branch before the Ledger Keeper opened a contract clause they did not read aloud.",
    "Xeth'Raal the Ledger Keeper now uses him to drive a substantive operation against League material."
  ]
};
