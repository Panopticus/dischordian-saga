import type { HeroTarget } from "../../types/HeroTarget";

export const SERGEANT_TALIA_RANK_MOL: HeroTarget = {
  "id": "sergeant_talia_rank_mol",
  "name": "Sergeant Talia Rank",
  "classKey": "soldier",
  "corruptorLord": "mol_garath",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "garrison_recall",
      "category": "soldier",
      "severity": 1
    },
    {
      "id": "unmaking_command",
      "category": "soldier",
      "severity": 3
    },
    {
      "id": "rank_compulsion",
      "category": "soldier",
      "severity": 3
    },
    {
      "id": "executive_charge",
      "category": "soldier",
      "severity": 2
    }
  ],
  "tells": [
    "Plants a standard the cohort regroups around.",
    "Bleeds chairman-black when struck."
  ],
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Sergeant Talia Rank served the League as a ranking officer in the League's standing line before the Unmaker pulled rank on the chain of command they had once trusted.",
    "Mol'Garath the Unmaker now uses him to drive a substantive operation against League material."
  ]
};
