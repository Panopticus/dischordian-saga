import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_RHIAN_WRENWARD_MOL: HeroTarget = {
  "id": "architect_rhian_wrenward_mol",
  "name": "Architect Rhian Wrenward",
  "classKey": "engineer",
  "corruptorLord": "mol_vereth",
  "threatTier": 1,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "telemetry_swarm",
      "category": "engineer",
      "severity": 2
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
    }
  ],
  "tells": [
    "Speaks to her hands as if they were a separate crew.",
    "Refuses to commit to a tactic she has used before."
  ],
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Architect Rhian Wrenward served the League as a field engineer in the League's frontier-design corps before the Trustee signed an apprenticeship contract on their behalf, then countersigned it himself.",
    "Mol'Vereth the Trustee now uses her to scout the threshold rooms."
  ]
};
