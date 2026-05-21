import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_FENRA_IRONCAUL_ZYR: HeroTarget = {
  "id": "architect_fenra_ironcaul_zyr",
  "name": "Architect Fenra Ironcaul",
  "classKey": "engineer",
  "corruptorLord": "zyr_koth",
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
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Architect Fenra Ironcaul served the League as a field engineer in the League's frontier-design corps before the Flayer revised them — third iteration is the operational one.",
    "Zyr'Koth the Flayer now uses her to hold a cell of the Crucible's lattice."
  ]
};
