import type { HeroTarget } from "../../types/HeroTarget";

export const SERGEANT_ORLA_BASTION_RIRI: HeroTarget = {
  "id": "sergeant_orla_bastion_riri",
  "name": "Sergeant Orla Bastion",
  "classKey": "soldier",
  "corruptorLord": "riri_ahlia",
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
    "Sergeant Orla Bastion served the League as a ranking officer in the League's standing line before the Taskmaster reorganised them onto a curriculum they had not been told existed.",
    "Riri'Ahlia the Taskmaster now uses him to hold a cell of the Crucible's lattice."
  ]
};
