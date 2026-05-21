import type { HeroTarget } from "../../types/HeroTarget";

export const PRAXIS_ADROS_SPINDLER_RIRI: HeroTarget = {
  "id": "praxis_adros_spindler_riri",
  "name": "Praxis-Adros Spindler",
  "classKey": "engineer",
  "corruptorLord": "riri_ahlia",
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
  "lairLocation": "tasking_yards",
  "briefingHints": [
    "Praxis-Adros Spindler served the League as a field engineer in the League's frontier-design corps before the Taskmaster reorganised them onto a curriculum they had not been told existed.",
    "Riri'Ahlia the Taskmaster now uses her to anchor a load-bearing column of the corruption."
  ]
};
