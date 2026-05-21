import type { HeroTarget } from "../../types/HeroTarget";

export const HANDLER_SAITH_BIND_ZYR: HeroTarget = {
  "id": "handler_saith_bind_zyr",
  "name": "Handler Saith Bind",
  "classKey": "spy",
  "corruptorLord": "zyr_koth",
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
    "Handler Saith Bind served the League as a long-listen officer in the League's counter-intelligence before the Flayer revised them — third iteration is the operational one.",
    "Zyr'Koth the Flayer now uses him to drive a substantive operation against League material."
  ]
};
