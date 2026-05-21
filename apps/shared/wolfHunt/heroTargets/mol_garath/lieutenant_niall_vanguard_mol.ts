import type { HeroTarget } from "../../types/HeroTarget";

export const LIEUTENANT_NIALL_VANGUARD_MOL: HeroTarget = {
  "id": "lieutenant_niall_vanguard_mol",
  "name": "Lieutenant Niall Vanguard",
  "classKey": "soldier",
  "corruptorLord": "mol_garath",
  "threatTier": 1,
  "isBossLieutenant": false,
  "powerSet": [
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
    "Issues orders in a register only the corrupted obey.",
    "Maintains attritional pressure beyond reasonable endurance."
  ],
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Lieutenant Niall Vanguard served the League as a ranking officer in the League's standing line before the Unmaker pulled rank on the chain of command they had once trusted.",
    "Mol'Garath the Unmaker now uses him to scout the threshold rooms."
  ]
};
