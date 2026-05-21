import type { HeroTarget } from "../../types/HeroTarget";

export const PRAXIS_VASK_MENDSMITH_VARKUL: HeroTarget = {
  "id": "praxis_vask_mendsmith_varkul",
  "name": "Praxis-Vask Mendsmith",
  "classKey": "engineer",
  "corruptorLord": "varkul",
  "threatTier": 4,
  "isBossLieutenant": false,
  "powerSet": [
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
    },
    {
      "id": "principal_machinery",
      "category": "engineer",
      "severity": 3
    },
    {
      "id": "anniversary_recursion",
      "category": "engineer",
      "severity": 2
    }
  ],
  "tells": [
    "Counts her revisions out loud — the second is the operational one.",
    "Reads the room's ambient telemetry before the first move."
  ],
  "lairLocation": "cathedral_undercroft",
  "briefingHints": [
    "Praxis-Vask Mendsmith served the League as a field engineer in the League's frontier-design corps before the Blood Lord invited them into the Cathedral as visitor and they stayed.",
    "Varkul the Blood Lord now uses her to anchor a load-bearing column of the corruption."
  ]
};
