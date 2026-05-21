import type { HeroTarget } from "../../types/HeroTarget";

export const QUIETUS_KAEL_ENDSIGN_MOL: HeroTarget = {
  "id": "quietus_kael_endsign_mol",
  "name": "Quietus Kael Endsign",
  "classKey": "assassin",
  "corruptorLord": "mol_garath",
  "threatTier": 2,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "shadow_weapon",
      "category": "assassin",
      "severity": 1
    },
    {
      "id": "ritual_grace",
      "category": "assassin",
      "severity": 1
    },
    {
      "id": "veil_step",
      "category": "assassin",
      "severity": 2
    },
    {
      "id": "memorial_taking",
      "category": "assassin",
      "severity": 2
    }
  ],
  "tells": [
    "Hums a load-bearing frequency mid-strike.",
    "Speaks the hunter's own blood-type back at him as a curse."
  ],
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Quietus Kael Endsign served the League as a retrieval specialist in the League's quiet branch before the Unmaker pulled rank on the chain of command they had once trusted.",
    "Mol'Garath the Unmaker now uses him to hold a cell of the Crucible's lattice."
  ]
};
