import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_CLEO_TRIM_ZYR: HeroTarget = {
  "id": "architect_cleo_trim_zyr",
  "name": "Architect Cleo Trim",
  "classKey": "engineer",
  "corruptorLord": "zyr_koth",
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
    "Reorders his own anatomy between strikes.",
    "Revises the engagement's geometry as he fights — favourable cover becomes hostile."
  ],
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Architect Cleo Trim served the League as a field engineer in the League's frontier-design corps before the Flayer revised them — third iteration is the operational one.",
    "Zyr'Koth the Flayer now uses her to drive a substantive operation against League material."
  ]
};
