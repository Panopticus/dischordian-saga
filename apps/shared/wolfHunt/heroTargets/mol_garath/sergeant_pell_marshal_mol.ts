import type { HeroTarget } from "../../types/HeroTarget";

export const SERGEANT_PELL_MARSHAL_MOL: HeroTarget = {
  "id": "sergeant_pell_marshal_mol",
  "name": "Sergeant Pell Marshal",
  "classKey": "soldier",
  "corruptorLord": "mol_garath",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "reorganization_doctrine",
      "category": "soldier",
      "severity": 3
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
    },
    {
      "id": "uniform_disregard",
      "category": "soldier",
      "severity": 1
    }
  ],
  "tells": [
    "Calls a reserve unit on a delayed cadence."
  ],
  "lairLocation": "unmakers_court",
  "briefingHints": [
    "Sergeant Pell Marshal served the League as a ranking officer in the League's standing line before the Unmaker pulled rank on the chain of command they had once trusted.",
    "Mol'Garath the Unmaker now uses him to drive a substantive operation against League material."
  ]
};
