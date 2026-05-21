import type { HeroTarget } from "../../types/HeroTarget";

export const HANDLER_PELL_HALF_TONGUE_ITH: HeroTarget = {
  "id": "handler_pell_half_tongue_ith",
  "name": "Handler Pell Half-Tongue",
  "classKey": "spy",
  "corruptorLord": "ith_rael",
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
    "Argues the hunter into his opposite without raising the voice.",
    "Knows the hunter's name in a register he has not used since boyhood."
  ],
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Handler Pell Half-Tongue served the League as a long-listen officer in the League's counter-intelligence before the Whisperer turned them across a window of decades.",
    "Ith'Rael the Whisperer now uses him to drive a substantive operation against League material."
  ]
};
