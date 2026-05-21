import type { HeroTarget } from "../../types/HeroTarget";

export const HANDLER_REMA_BIND_SYL: HeroTarget = {
  "id": "handler_rema_bind_syl",
  "name": "Handler Rema Bind",
  "classKey": "spy",
  "corruptorLord": "syl_vex",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
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
    "Extracts agreement under reasonable framing.",
    "Repeats the last sentence the hunter spoke before he committed to it.",
    "Has been listening since before the hunter arrived."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Handler Rema Bind served the League as a long-listen officer in the League's counter-intelligence before the Corruptor wove a cobalt thread into their decision-making.",
    "Syl'Vex the Corruptor now uses him to drive a substantive operation against League material."
  ]
};
