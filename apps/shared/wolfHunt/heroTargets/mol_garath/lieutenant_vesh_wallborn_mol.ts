import type { HeroTarget } from "../../types/HeroTarget";

export const LIEUTENANT_VESH_WALLBORN_MOL: HeroTarget = {
  "id": "lieutenant_vesh_wallborn_mol",
  "name": "Lieutenant Vesh Wallborn",
  "classKey": "soldier",
  "corruptorLord": "mol_garath",
  "threatTier": 1,
  "isBossLieutenant": false,
  "powerSet": [
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
    }
  ],
  "tells": [
    "Issues orders in a register only the corrupted obey."
  ],
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Lieutenant Vesh Wallborn served the League as a ranking officer in the League's standing line before the Unmaker pulled rank on the chain of command they had once trusted.",
    "Mol'Garath the Unmaker now uses him to scout the threshold rooms."
  ]
};
