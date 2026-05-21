import type { HeroTarget } from "../../types/HeroTarget";

export const LIEUTENANT_JEVAN_VANGUARD_RIRI: HeroTarget = {
  "id": "lieutenant_jevan_vanguard_riri",
  "name": "Lieutenant Jevan Vanguard",
  "classKey": "soldier",
  "corruptorLord": "riri_ahlia",
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
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Lieutenant Jevan Vanguard served the League as a ranking officer in the League's standing line before the Taskmaster reorganised them onto a curriculum they had not been told existed.",
    "Riri'Ahlia the Taskmaster now uses him to scout the threshold rooms."
  ]
};
