import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_ILYA_ASH_HAND_MOL: HeroTarget = {
  "id": "reaper_ilya_ash_hand_mol",
  "name": "Reaper Ilya Ash-Hand",
  "classKey": "assassin",
  "corruptorLord": "mol_garath",
  "threatTier": 4,
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
    "Counts down souls in fives before each strike.",
    "Leaves a coin behind for every kill, weighted by market value.",
    "Hums a load-bearing frequency mid-strike."
  ],
  "lairLocation": "unmakers_court",
  "briefingHints": [
    "Reaper Ilya Ash-Hand served the League as a retrieval specialist in the League's quiet branch before the Unmaker pulled rank on the chain of command they had once trusted.",
    "Mol'Garath the Unmaker now uses him to anchor a load-bearing column of the corruption."
  ]
};
