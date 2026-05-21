import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_BORAN_VEIL_CUTTER_VARKUL: HeroTarget = {
  "id": "reaper_boran_veil_cutter_varkul",
  "name": "Reaper Boran Veil-Cutter",
  "classKey": "assassin",
  "corruptorLord": "varkul",
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
  "lairLocation": "antechamber",
  "briefingHints": [
    "Reaper Boran Veil-Cutter served the League as a retrieval specialist in the League's quiet branch before the Blood Lord invited them into the Cathedral as visitor and they stayed.",
    "Varkul the Blood Lord now uses him to hold a cell of the Crucible's lattice."
  ]
};
