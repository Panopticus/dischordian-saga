import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_GARRON_QUILL_MARK_ZYR: HeroTarget = {
  "id": "architect_garron_quill_mark_zyr",
  "name": "Architect Garron Quill-Mark",
  "classKey": "engineer",
  "corruptorLord": "zyr_koth",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
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
    "Carries tools signed by the lord and by her in the same hand.",
    "Counts her revisions out loud — the second is the operational one.",
    "Reads the room's ambient telemetry before the first move."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Architect Garron Quill-Mark served the League as a field engineer in the League's frontier-design corps before the Flayer revised them — third iteration is the operational one.",
    "Zyr'Koth the Flayer now uses her to drive a substantive operation against League material."
  ]
};
