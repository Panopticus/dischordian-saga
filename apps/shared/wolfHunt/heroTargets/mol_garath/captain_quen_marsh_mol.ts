import type { HeroTarget } from "../../types/HeroTarget";

export const CAPTAIN_QUEN_MARSH_MOL: HeroTarget = {
  "id": "captain_quen_marsh_mol",
  "name": "Captain Quen Marsh",
  "classKey": "soldier",
  "corruptorLord": "mol_garath",
  "threatTier": 4,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "attritional_will",
      "category": "soldier",
      "severity": 2
    },
    {
      "id": "flag_authority",
      "category": "soldier",
      "severity": 2
    },
    {
      "id": "uniform_disregard",
      "category": "soldier",
      "severity": 1
    },
    {
      "id": "garrison_recall",
      "category": "soldier",
      "severity": 1
    },
    {
      "id": "unmaking_command",
      "category": "soldier",
      "severity": 3
    }
  ],
  "tells": [
    "Salutes an empty seat to her right before every order.",
    "Reorders his guard formation mid-fight — the formation is the attack."
  ],
  "lairLocation": "unmakers_court",
  "briefingHints": [
    "Captain Quen Marsh served the League as a ranking officer in the League's standing line before the Unmaker pulled rank on the chain of command they had once trusted.",
    "Mol'Garath the Unmaker now uses him to anchor a load-bearing column of the corruption."
  ]
};
