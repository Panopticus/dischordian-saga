import type { HeroTarget } from "../../types/HeroTarget";

export const LISTENER_VASK_POSTMASTER_RIRI: HeroTarget = {
  "id": "listener_vask_postmaster_riri",
  "name": "Listener Vask Postmaster",
  "classKey": "spy",
  "corruptorLord": "riri_ahlia",
  "threatTier": 4,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "patient_subversion",
      "category": "spy",
      "severity": 2
    },
    {
      "id": "shadow_tongue_handle",
      "category": "spy",
      "severity": 2
    },
    {
      "id": "cobalt_conversion",
      "category": "spy",
      "severity": 3
    },
    {
      "id": "mirror_argument",
      "category": "spy",
      "severity": 3
    },
    {
      "id": "consent_extraction",
      "category": "spy",
      "severity": 2
    }
  ],
  "tells": [
    "Repeats the last sentence the hunter spoke before he committed to it."
  ],
  "lairLocation": "tasking_yards",
  "briefingHints": [
    "Listener Vask Postmaster served the League as a long-listen officer in the League's counter-intelligence before the Taskmaster reorganised them onto a curriculum they had not been told existed.",
    "Riri'Ahlia the Taskmaster now uses him to anchor a load-bearing column of the corruption."
  ]
};
