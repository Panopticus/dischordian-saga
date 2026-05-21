import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_UNA_LOCKERBY_VARKUL: HeroTarget = {
  "id": "architect_una_lockerby_varkul",
  "name": "Architect Una Lockerby",
  "classKey": "engineer",
  "corruptorLord": "varkul",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
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
    "Carries tools signed by the lord and by her in the same hand."
  ],
  "lairLocation": "cathedral_undercroft",
  "briefingHints": [
    "Architect Una Lockerby served the League as a field engineer in the League's frontier-design corps before the Blood Lord invited them into the Cathedral as visitor and they stayed.",
    "Varkul the Blood Lord now uses her to drive a substantive operation against League material."
  ]
};
