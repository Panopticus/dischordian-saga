import type { HeroTarget } from "../../types/HeroTarget";

export const LIEUTENANT_RHIAN_STANDARDBEARER_MOL: HeroTarget = {
  "id": "lieutenant_rhian_standardbearer_mol",
  "name": "Lieutenant Rhian Standardbearer",
  "classKey": "soldier",
  "corruptorLord": "mol_garath",
  "threatTier": 1,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "garrison_recall",
      "category": "soldier",
      "severity": 1
    },
    {
      "id": "executive_charge",
      "category": "soldier",
      "severity": 2
    },
    {
      "id": "iron_quartermaster",
      "category": "soldier",
      "severity": 2
    }
  ],
  "tells": [
    "Reorders his guard formation mid-fight — the formation is the attack.",
    "Refuses to retreat from a structured engagement.",
    "Plants a standard the cohort regroups around."
  ],
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Lieutenant Rhian Standardbearer served the League as a ranking officer in the League's standing line before the Unmaker pulled rank on the chain of command they had once trusted.",
    "Mol'Garath the Unmaker now uses him to scout the threshold rooms."
  ]
};
