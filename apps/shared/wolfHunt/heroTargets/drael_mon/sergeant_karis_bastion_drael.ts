import type { HeroTarget } from "../../types/HeroTarget";

export const SERGEANT_KARIS_BASTION_DRAEL: HeroTarget = {
  "id": "sergeant_karis_bastion_drael",
  "name": "Sergeant Karis Bastion",
  "classKey": "soldier",
  "corruptorLord": "drael_mon",
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
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Sergeant Karis Bastion served the League as a ranking officer in the League's standing line before the Harvester paid them, in advance, for the souls they had not yet brought him.",
    "Drael'Mon the Harvester now uses him to hold a cell of the Crucible's lattice."
  ]
};
