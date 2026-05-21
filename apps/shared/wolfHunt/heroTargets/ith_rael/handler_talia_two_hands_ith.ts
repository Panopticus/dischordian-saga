import type { HeroTarget } from "../../types/HeroTarget";

export const HANDLER_TALIA_TWO_HANDS_ITH: HeroTarget = {
  "id": "handler_talia_two_hands_ith",
  "name": "Handler Talia Two-Hands",
  "classKey": "spy",
  "corruptorLord": "ith_rael",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "rumor_seed",
      "category": "spy",
      "severity": 1
    },
    {
      "id": "whisper_inheritance",
      "category": "spy",
      "severity": 3
    },
    {
      "id": "thaloria_dialect",
      "category": "spy",
      "severity": 3
    },
    {
      "id": "patient_subversion",
      "category": "spy",
      "severity": 2
    }
  ],
  "tells": [
    "Extracts agreement under reasonable framing.",
    "Repeats the last sentence the hunter spoke before he committed to it.",
    "Has been listening since before the hunter arrived."
  ],
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Handler Talia Two-Hands served the League as a long-listen officer in the League's counter-intelligence before the Whisperer turned them across a window of decades.",
    "Ith'Rael the Whisperer now uses him to drive a substantive operation against League material."
  ]
};
