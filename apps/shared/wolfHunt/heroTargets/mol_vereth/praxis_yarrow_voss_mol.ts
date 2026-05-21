import type { HeroTarget } from "../../types/HeroTarget";

export const PRAXIS_YARROW_VOSS_MOL: HeroTarget = {
  "id": "praxis_yarrow_voss_mol",
  "name": "Praxis-Yarrow Voss",
  "classKey": "engineer",
  "corruptorLord": "mol_vereth",
  "threatTier": 4,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "trustee_clause_authoring",
      "category": "engineer",
      "severity": 3
    },
    {
      "id": "principal_machinery",
      "category": "engineer",
      "severity": 3
    },
    {
      "id": "anniversary_recursion",
      "category": "engineer",
      "severity": 2
    },
    {
      "id": "fiduciary_lock",
      "category": "engineer",
      "severity": 2
    },
    {
      "id": "patch_propagation",
      "category": "engineer",
      "severity": 1
    }
  ],
  "tells": [
    "Revises the engagement's geometry as he fights — favourable cover becomes hostile.",
    "Speaks to her hands as if they were a separate crew.",
    "Refuses to commit to a tactic she has used before."
  ],
  "lairLocation": "trustee_archive",
  "briefingHints": [
    "Praxis-Yarrow Voss served the League as a field engineer in the League's frontier-design corps before the Trustee signed an apprenticeship contract on their behalf, then countersigned it himself.",
    "Mol'Vereth the Trustee now uses her to anchor a load-bearing column of the corruption."
  ]
};
