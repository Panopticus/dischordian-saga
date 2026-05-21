import type { HeroTarget } from "../../types/HeroTarget";

export const HANDLER_QUEN_SOFT_TREAD_ITH: HeroTarget = {
  "id": "handler_quen_soft_tread_ith",
  "name": "Handler Quen Soft-Tread",
  "classKey": "spy",
  "corruptorLord": "ith_rael",
  "threatTier": 4,
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
    },
    {
      "id": "whisper_inheritance",
      "category": "spy",
      "severity": 3
    }
  ],
  "tells": [
    "Knows the hunter's name in a register he has not used since boyhood.",
    "Plants a false rumour that returns as accepted truth.",
    "Carries a cobalt thread visible only when she laughs."
  ],
  "lairLocation": "rylloh_galleries",
  "briefingHints": [
    "Handler Quen Soft-Tread served the League as a long-listen officer in the League's counter-intelligence before the Whisperer turned them across a window of decades.",
    "Ith'Rael the Whisperer now uses him to anchor a load-bearing column of the corruption."
  ]
};
