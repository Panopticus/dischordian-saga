import type { HeroTarget } from "../../types/HeroTarget";

export const PRAXIS_ZAYD_MENDSMITH_ZYR: HeroTarget = {
  "id": "praxis_zayd_mendsmith_zyr",
  "name": "Praxis-Zayd Mendsmith",
  "classKey": "engineer",
  "corruptorLord": "zyr_koth",
  "threatTier": 4,
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
    },
    {
      "id": "severance_protocol_refinement",
      "category": "engineer",
      "severity": 3
    }
  ],
  "tells": [
    "Counts her revisions out loud — the second is the operational one.",
    "Reads the room's ambient telemetry before the first move."
  ],
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Praxis-Zayd Mendsmith served the League as a field engineer in the League's frontier-design corps before the Flayer revised them — third iteration is the operational one.",
    "Zyr'Koth the Flayer now uses her to anchor a load-bearing column of the corruption."
  ]
};
