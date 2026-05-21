import type { HeroTarget } from "../../types/HeroTarget";

export const HANDLER_UNA_TWO_HANDS_RIRI: HeroTarget = {
  "id": "handler_una_two_hands_riri",
  "name": "Handler Una Two-Hands",
  "classKey": "spy",
  "corruptorLord": "riri_ahlia",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "thaloria_dialect",
      "category": "spy",
      "severity": 3
    },
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
    }
  ],
  "tells": [
    "Extracts agreement under reasonable framing.",
    "Repeats the last sentence the hunter spoke before he committed to it.",
    "Has been listening since before the hunter arrived."
  ],
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Handler Una Two-Hands served the League as a long-listen officer in the League's counter-intelligence before the Taskmaster reorganised them onto a curriculum they had not been told existed.",
    "Riri'Ahlia the Taskmaster now uses him to drive a substantive operation against League material."
  ]
};
