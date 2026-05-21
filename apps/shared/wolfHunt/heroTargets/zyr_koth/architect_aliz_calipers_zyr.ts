import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_ALIZ_CALIPERS_ZYR: HeroTarget = {
  "id": "architect_aliz_calipers_zyr",
  "name": "Architect Aliz Calipers",
  "classKey": "engineer",
  "corruptorLord": "zyr_koth",
  "threatTier": 1,
  "isBossLieutenant": false,
  "powerSet": [
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
    "Reads the room's ambient telemetry before the first move.",
    "Holds a folded contract in his off-hand that updates itself.",
    "Reorders his own anatomy between strikes."
  ],
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Architect Aliz Calipers served the League as a field engineer in the League's frontier-design corps before the Flayer revised them — third iteration is the operational one.",
    "Zyr'Koth the Flayer now uses her to scout the threshold rooms."
  ]
};
