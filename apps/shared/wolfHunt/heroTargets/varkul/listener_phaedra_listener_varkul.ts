import type { HeroTarget } from "../../types/HeroTarget";

export const LISTENER_PHAEDRA_LISTENER_VARKUL: HeroTarget = {
  "id": "listener_phaedra_listener_varkul",
  "name": "Listener Phaedra Listener",
  "classKey": "spy",
  "corruptorLord": "varkul",
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
  "lairLocation": "cathedral_undercroft",
  "briefingHints": [
    "Listener Phaedra Listener served the League as a long-listen officer in the League's counter-intelligence before the Blood Lord invited them into the Cathedral as visitor and they stayed.",
    "Varkul the Blood Lord now uses him to anchor a load-bearing column of the corruption."
  ]
};
