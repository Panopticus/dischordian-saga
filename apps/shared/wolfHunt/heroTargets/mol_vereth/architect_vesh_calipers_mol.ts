import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_VESH_CALIPERS_MOL: HeroTarget = {
  "id": "architect_vesh_calipers_mol",
  "name": "Architect Vesh Calipers",
  "classKey": "engineer",
  "corruptorLord": "mol_vereth",
  "threatTier": 1,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "tooling_call",
      "category": "engineer",
      "severity": 1
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
    }
  ],
  "tells": [
    "Reads the room's ambient telemetry before the first move.",
    "Holds a folded contract in his off-hand that updates itself.",
    "Reorders his own anatomy between strikes."
  ],
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Architect Vesh Calipers served the League as a field engineer in the League's frontier-design corps before the Trustee signed an apprenticeship contract on their behalf, then countersigned it himself.",
    "Mol'Vereth the Trustee now uses her to scout the threshold rooms."
  ]
};
