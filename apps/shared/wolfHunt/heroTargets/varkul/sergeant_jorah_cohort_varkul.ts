import type { HeroTarget } from "../../types/HeroTarget";

export const SERGEANT_JORAH_COHORT_VARKUL: HeroTarget = {
  "id": "sergeant_jorah_cohort_varkul",
  "name": "Sergeant Jorah Cohort",
  "classKey": "soldier",
  "corruptorLord": "varkul",
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
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Sergeant Jorah Cohort served the League as a ranking officer in the League's standing line before the Blood Lord invited them into the Cathedral as visitor and they stayed.",
    "Varkul the Blood Lord now uses him to hold a cell of the Crucible's lattice."
  ]
};
