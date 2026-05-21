import type { HeroTarget } from "../../types/HeroTarget";

export const LIEUTENANT_HEKLA_GARDENER_OF_LINES_MOL: HeroTarget = {
  "id": "lieutenant_hekla_gardener_of_lines_mol",
  "name": "Lieutenant Hekla Gardener-of-Lines",
  "classKey": "soldier",
  "corruptorLord": "mol_vereth",
  "threatTier": 1,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "garrison_recall",
      "category": "soldier",
      "severity": 1
    },
    {
      "id": "executive_charge",
      "category": "soldier",
      "severity": 2
    },
    {
      "id": "iron_quartermaster",
      "category": "soldier",
      "severity": 2
    }
  ],
  "tells": [
    "Reorders his guard formation mid-fight — the formation is the attack.",
    "Refuses to retreat from a structured engagement.",
    "Plants a standard the cohort regroups around."
  ],
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Lieutenant Hekla Gardener-of-Lines served the League as a ranking officer in the League's standing line before the Trustee signed an apprenticeship contract on their behalf, then countersigned it himself.",
    "Mol'Vereth the Trustee now uses him to scout the threshold rooms."
  ]
};
