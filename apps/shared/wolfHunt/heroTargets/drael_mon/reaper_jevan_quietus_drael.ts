import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_JEVAN_QUIETUS_DRAEL: HeroTarget = {
  "id": "reaper_jevan_quietus_drael",
  "name": "Reaper Jevan Quietus",
  "classKey": "assassin",
  "corruptorLord": "drael_mon",
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
    "Reaper Jevan Quietus served the League as a retrieval specialist in the League's quiet branch before the Harvester paid them, in advance, for the souls they had not yet brought him.",
    "Drael'Mon the Harvester now uses him to scout the threshold rooms."
  ]
};
