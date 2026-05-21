import type { HeroTarget } from "../../types/HeroTarget";

export const SERGEANT_IOHN_COHORT_MOL: HeroTarget = {
  "id": "sergeant_iohn_cohort_mol",
  "name": "Sergeant Iohn Cohort",
  "classKey": "soldier",
  "corruptorLord": "mol_vereth",
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
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Sergeant Iohn Cohort served the League as a ranking officer in the League's standing line before the Trustee signed an apprenticeship contract on their behalf, then countersigned it himself.",
    "Mol'Vereth the Trustee now uses him to hold a cell of the Crucible's lattice."
  ]
};
