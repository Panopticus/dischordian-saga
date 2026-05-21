import type { HeroTarget } from "../../types/HeroTarget";

export const SERGEANT_SOREN_BASTION_MOL: HeroTarget = {
  "id": "sergeant_soren_bastion_mol",
  "name": "Sergeant Soren Bastion",
  "classKey": "soldier",
  "corruptorLord": "mol_garath",
  "threatTier": 2,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "executive_charge",
      "category": "soldier",
      "severity": 2
    },
    {
      "id": "iron_quartermaster",
      "category": "soldier",
      "severity": 2
    },
    {
      "id": "attritional_will",
      "category": "soldier",
      "severity": 2
    },
    {
      "id": "flag_authority",
      "category": "soldier",
      "severity": 2
    }
  ],
  "tells": [
    "Refuses to retreat from a structured engagement."
  ],
  "lairLocation": "antechamber",
  "briefingHints": [
    "Sergeant Soren Bastion served the League as a ranking officer in the League's standing line before the Unmaker pulled rank on the chain of command they had once trusted.",
    "Mol'Garath the Unmaker now uses him to hold a cell of the Crucible's lattice."
  ]
};
