import type { HeroTarget } from "../../types/HeroTarget";

export const PRAXIS_DREV_VOSS_ZYR: HeroTarget = {
  "id": "praxis_drev_voss_zyr",
  "name": "Praxis-Drev Voss",
  "classKey": "engineer",
  "corruptorLord": "zyr_koth",
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
    "Revises the engagement's geometry as he fights — favourable cover becomes hostile.",
    "Speaks to her hands as if they were a separate crew.",
    "Refuses to commit to a tactic she has used before."
  ],
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Praxis-Drev Voss served the League as a field engineer in the League's frontier-design corps before the Flayer revised them — third iteration is the operational one.",
    "Zyr'Koth the Flayer now uses her to anchor a load-bearing column of the corruption."
  ]
};
