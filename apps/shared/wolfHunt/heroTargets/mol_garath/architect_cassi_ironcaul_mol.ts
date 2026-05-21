import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_CASSI_IRONCAUL_MOL: HeroTarget = {
  "id": "architect_cassi_ironcaul_mol",
  "name": "Architect Cassi Ironcaul",
  "classKey": "engineer",
  "corruptorLord": "mol_garath",
  "threatTier": 2,
  "isBossLieutenant": false,
  "powerSet": [
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
    },
    {
      "id": "tooling_call",
      "category": "engineer",
      "severity": 1
    }
  ],
  "tells": [
    "Refuses to commit to a tactic she has used before.",
    "Carries tools signed by the lord and by her in the same hand.",
    "Counts her revisions out loud — the second is the operational one."
  ],
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Architect Cassi Ironcaul served the League as a field engineer in the League's frontier-design corps before the Unmaker pulled rank on the chain of command they had once trusted.",
    "Mol'Garath the Unmaker now uses her to hold a cell of the Crucible's lattice."
  ]
};
