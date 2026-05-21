import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_ZOFIA_HALT_MOL: HeroTarget = {
  "id": "architect_zofia_halt_mol",
  "name": "Architect Zofia Halt",
  "classKey": "engineer",
  "corruptorLord": "mol_vereth",
  "threatTier": 1,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "fiduciary_lock",
      "category": "engineer",
      "severity": 2
    },
    {
      "id": "patch_propagation",
      "category": "engineer",
      "severity": 1
    },
    {
      "id": "tooling_call",
      "category": "engineer",
      "severity": 1
    }
  ],
  "tells": [
    "Speaks to her hands as if they were a separate crew."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Architect Zofia Halt served the League as a field engineer in the League's frontier-design corps before the Trustee signed an apprenticeship contract on their behalf, then countersigned it himself.",
    "Mol'Vereth the Trustee now uses her to scout the threshold rooms."
  ]
};
