import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_GWYN_ASH_HAND_MOL: HeroTarget = {
  "id": "reaper_gwyn_ash_hand_mol",
  "name": "Reaper Gwyn Ash-Hand",
  "classKey": "assassin",
  "corruptorLord": "mol_vereth",
  "threatTier": 4,
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
      "id": "cathedral_resonance",
      "category": "assassin",
      "severity": 3
    },
    {
      "id": "blood_lexicon",
      "category": "assassin",
      "severity": 3
    },
    {
      "id": "vampiric_economy",
      "category": "assassin",
      "severity": 2
    }
  ],
  "tells": [
    "Counts down souls in fives before each strike.",
    "Leaves a coin behind for every kill, weighted by market value."
  ],
  "lairLocation": "trustee_archive",
  "briefingHints": [
    "Reaper Gwyn Ash-Hand served the League as a retrieval specialist in the League's quiet branch before the Trustee signed an apprenticeship contract on their behalf, then countersigned it himself.",
    "Mol'Vereth the Trustee now uses him to anchor a load-bearing column of the corruption."
  ]
};
