import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_JOREN_TALLY_MOL: HeroTarget = {
  "id": "reaper_joren_tally_mol",
  "name": "Reaper Joren Tally",
  "classKey": "assassin",
  "corruptorLord": "mol_garath",
  "threatTier": 1,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "exact_quietus",
      "category": "assassin",
      "severity": 2
    },
    {
      "id": "shadow_weapon",
      "category": "assassin",
      "severity": 1
    },
    {
      "id": "ritual_grace",
      "category": "assassin",
      "severity": 1
    }
  ],
  "tells": [
    "Leaves a coin behind for every kill, weighted by market value."
  ],
  "lairLocation": "antechamber",
  "briefingHints": [
    "Reaper Joren Tally served the League as a retrieval specialist in the League's quiet branch before the Unmaker pulled rank on the chain of command they had once trusted.",
    "Mol'Garath the Unmaker now uses him to scout the threshold rooms."
  ]
};
