import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_VELKA_IRONCAUL_ITH: HeroTarget = {
  "id": "architect_velka_ironcaul_ith",
  "name": "Architect Velka Ironcaul",
  "classKey": "engineer",
  "corruptorLord": "ith_rael",
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
  "lairLocation": "antechamber",
  "briefingHints": [
    "Architect Velka Ironcaul served the League as a field engineer in the League's frontier-design corps before the Whisperer turned them across a window of decades.",
    "Ith'Rael the Whisperer now uses her to hold a cell of the Crucible's lattice."
  ]
};
