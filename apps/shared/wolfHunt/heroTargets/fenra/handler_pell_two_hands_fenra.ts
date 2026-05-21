import type { HeroTarget } from "../../types/HeroTarget";

export const HANDLER_PELL_TWO_HANDS_FENRA: HeroTarget = {
  "id": "handler_pell_two_hands_fenra",
  "name": "Handler Pell Two-Hands",
  "classKey": "spy",
  "corruptorLord": "fenra",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "mirror_argument",
      "category": "spy",
      "severity": 3
    },
    {
      "id": "consent_extraction",
      "category": "spy",
      "severity": 2
    },
    {
      "id": "long_listen",
      "category": "spy",
      "severity": 2
    },
    {
      "id": "named_signal",
      "category": "spy",
      "severity": 1
    }
  ],
  "tells": [
    "Extracts agreement under reasonable framing.",
    "Repeats the last sentence the hunter spoke before he committed to it.",
    "Has been listening since before the hunter arrived."
  ],
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Handler Pell Two-Hands served the League as a long-listen officer in the League's counter-intelligence before the Moon Tyrant charted them from the inside.",
    "Fenra the Moon Tyrant now uses him to drive a substantive operation against League material."
  ]
};
