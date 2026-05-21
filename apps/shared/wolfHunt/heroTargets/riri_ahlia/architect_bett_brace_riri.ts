import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_BETT_BRACE_RIRI: HeroTarget = {
  "id": "architect_bett_brace_riri",
  "name": "Architect Bett Brace",
  "classKey": "engineer",
  "corruptorLord": "riri_ahlia",
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
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Architect Bett Brace served the League as a field engineer in the League's frontier-design corps before the Taskmaster reorganised them onto a curriculum they had not been told existed.",
    "Riri'Ahlia the Taskmaster now uses her to scout the threshold rooms."
  ]
};
