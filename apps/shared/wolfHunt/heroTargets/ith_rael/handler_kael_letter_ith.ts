import type { HeroTarget } from "../../types/HeroTarget";

export const HANDLER_KAEL_LETTER_ITH: HeroTarget = {
  "id": "handler_kael_letter_ith",
  "name": "Handler Kael Letter",
  "classKey": "spy",
  "corruptorLord": "ith_rael",
  "threatTier": 2,
  "isBossLieutenant": false,
  "powerSet": [
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
    },
    {
      "id": "rumor_seed",
      "category": "spy",
      "severity": 1
    }
  ],
  "tells": [
    "Carries a cobalt thread visible only when she laughs.",
    "Extracts agreement under reasonable framing.",
    "Repeats the last sentence the hunter spoke before he committed to it."
  ],
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Handler Kael Letter served the League as a long-listen officer in the League's counter-intelligence before the Whisperer turned them across a window of decades.",
    "Ith'Rael the Whisperer now uses him to hold a cell of the Crucible's lattice."
  ]
};
