import type { HeroTarget } from "../../types/HeroTarget";

export const PRAXIS_ULVI_MENDSMITH_MOL: HeroTarget = {
  "id": "praxis_ulvi_mendsmith_mol",
  "name": "Praxis-Ulvi Mendsmith",
  "classKey": "engineer",
  "corruptorLord": "mol_vereth",
  "threatTier": 4,
  "isBossLieutenant": false,
  "powerSet": [
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
    },
    {
      "id": "telemetry_swarm",
      "category": "engineer",
      "severity": 2
    },
    {
      "id": "trustee_clause_authoring",
      "category": "engineer",
      "severity": 3
    }
  ],
  "tells": [
    "Counts her revisions out loud — the second is the operational one.",
    "Reads the room's ambient telemetry before the first move."
  ],
  "lairLocation": "trustee_archive",
  "briefingHints": [
    "Praxis-Ulvi Mendsmith served the League as a field engineer in the League's frontier-design corps before the Trustee signed an apprenticeship contract on their behalf, then countersigned it himself.",
    "Mol'Vereth the Trustee now uses her to anchor a load-bearing column of the corruption."
  ]
};
