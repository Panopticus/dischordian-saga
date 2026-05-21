import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_WIRA_WRENWARD_ZYR: HeroTarget = {
  "id": "architect_wira_wrenward_zyr",
  "name": "Architect Wira Wrenward",
  "classKey": "engineer",
  "corruptorLord": "zyr_koth",
  "threatTier": 1,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "telemetry_swarm",
      "category": "engineer",
      "severity": 2
    },
    {
      "id": "anniversary_recursion",
      "category": "engineer",
      "severity": 2
    },
    {
      "id": "fiduciary_lock",
      "category": "engineer",
      "severity": 2
    }
  ],
  "tells": [
    "Speaks to her hands as if they were a separate crew.",
    "Refuses to commit to a tactic she has used before."
  ],
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Architect Wira Wrenward served the League as a field engineer in the League's frontier-design corps before the Flayer revised them — third iteration is the operational one.",
    "Zyr'Koth the Flayer now uses her to scout the threshold rooms."
  ]
};
