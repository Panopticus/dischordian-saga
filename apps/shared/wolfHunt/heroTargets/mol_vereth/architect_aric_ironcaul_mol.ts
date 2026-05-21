import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_ARIC_IRONCAUL_MOL: HeroTarget = {
  "id": "architect_aric_ironcaul_mol",
  "name": "Architect Aric Ironcaul",
  "classKey": "engineer",
  "corruptorLord": "mol_vereth",
  "threatTier": 2,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "patch_propagation",
      "category": "engineer",
      "severity": 1
    },
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
    "Refuses to commit to a tactic she has used before.",
    "Carries tools signed by the lord and by her in the same hand."
  ],
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Architect Aric Ironcaul served the League as a field engineer in the League's frontier-design corps before the Trustee signed an apprenticeship contract on their behalf, then countersigned it himself.",
    "Mol'Vereth the Trustee now uses her to hold a cell of the Crucible's lattice."
  ]
};
