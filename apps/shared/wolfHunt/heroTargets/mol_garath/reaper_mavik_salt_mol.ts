import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_MAVIK_SALT_MOL: HeroTarget = {
  "id": "reaper_mavik_salt_mol",
  "name": "Reaper Mavik Salt",
  "classKey": "assassin",
  "corruptorLord": "mol_garath",
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
    "Strikes only on the exact breath he chose in advance."
  ],
  "lairLocation": "unmakers_court",
  "briefingHints": [
    "Reaper Mavik Salt served the League as a retrieval specialist in the League's quiet branch before the Unmaker pulled rank on the chain of command they had once trusted.",
    "Mol'Garath the Unmaker now uses him to anchor a load-bearing column of the corruption."
  ]
};
