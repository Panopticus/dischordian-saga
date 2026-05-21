import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_TALIA_LOCKERBY_MOL: HeroTarget = {
  "id": "architect_talia_lockerby_mol",
  "name": "Architect Talia Lockerby",
  "classKey": "engineer",
  "corruptorLord": "mol_vereth",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "tooling_call",
      "category": "engineer",
      "severity": 1
    },
    {
      "id": "severance_protocol_refinement",
      "category": "engineer",
      "severity": 3
    },
    {
      "id": "iterative_flay",
      "category": "engineer",
      "severity": 3
    },
    {
      "id": "field_redesign",
      "category": "engineer",
      "severity": 2
    }
  ],
  "tells": [
    "Carries tools signed by the lord and by her in the same hand."
  ],
  "lairLocation": "trustee_archive",
  "briefingHints": [
    "Architect Talia Lockerby served the League as a field engineer in the League's frontier-design corps before the Trustee signed an apprenticeship contract on their behalf, then countersigned it himself.",
    "Mol'Vereth the Trustee now uses her to drive a substantive operation against League material."
  ]
};
