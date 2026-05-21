import type { HeroTarget } from "../../types/HeroTarget";

export const QUIETUS_ESRA_VEIL_CUTTER_SYL: HeroTarget = {
  "id": "quietus_esra_veil_cutter_syl",
  "name": "Quietus Esra Veil-Cutter",
  "classKey": "assassin",
  "corruptorLord": "syl_vex",
  "threatTier": 2,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "shadow_weapon",
      "category": "assassin",
      "severity": 1
    },
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
    "Hums a load-bearing frequency mid-strike.",
    "Speaks the hunter's own blood-type back at him as a curse."
  ],
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Quietus Esra Veil-Cutter served the League as a retrieval specialist in the League's quiet branch before the Corruptor wove a cobalt thread into their decision-making.",
    "Syl'Vex the Corruptor now uses him to hold a cell of the Crucible's lattice."
  ]
};
